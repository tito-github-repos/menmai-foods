import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let customerId: number | null = null;

    // Extract customerId from token if present
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { customerId: number };
        customerId = decoded.customerId;
      } catch {
        // Token invalid — proceed without customerId
      }
    }

    const body = await req.json();

    const {
      fullName,
      phone,
      email,
      deliveryDate,
      deliveryTime,
      occasionDetails,
      deliveryAddress,
      pincode,
      items, // [{ productId, quantity }]
    } = body;

    // Validate required fields
    if (
      !fullName ||
      !phone ||
      !deliveryDate ||
      !deliveryTime ||
      !occasionDetails ||
      !deliveryAddress ||
      !pincode ||
      !items?.length
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch product prices from DB — never trust client-sent prices
    const productIds: number[] = items.map((i: { productId: number }) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, name: true, bulkPricePerPiece: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { message: "One or more products not found or inactive" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Build order items with server-side pricing
    const orderItems = items.map((item: { productId: number; quantity: number }) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.bulkPricePerPiece ?? 0;
      const totalPrice = unitPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, r: { totalPrice: number }) => sum + r.totalPrice,
      0
    );

    // Bulk discount — mirrors frontend logic
    const getDiscount = (subtotal: number): number => {
      if (subtotal >= 5000) return 0.1;
      if (subtotal >= 2000) return 0.05;
      return 0;
    };

    const discountRate = getDiscount(subtotal);
    const totalAmount = subtotal - subtotal * discountRate;

    // Create BulkOrder + BulkOrderItems in a transaction
    const bulkOrder = await prisma.bulkOrder.create({
      data: {
        customerId: customerId ?? undefined,
        fullName,
        phone,
        email: email || null,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        occasionDetails,
        deliveryAddress,
        pincode,
        totalAmount,
        status: "PENDING",
        BulkOrderItem: {
          create: orderItems,
        },
      },
      include: {
        BulkOrderItem: {
          include: {
            Product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      bulkOrderId: bulkOrder.id,
      totalAmount: bulkOrder.totalAmount,
      status: bulkOrder.status,
      createdAt: bulkOrder.createdAt,
      items: bulkOrder.BulkOrderItem.map((item) => ({
        productId: item.productId,
        productName: item.Product.name,
        productImage: item.Product.imageUrl,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    });
  } catch (error) {
    console.error("[bulk-orders/create]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}