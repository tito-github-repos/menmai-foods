import { unauthorized, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth) return unauthorized();

  const { addressId, items } = await req.json();

  const customerId = auth.customerId;

  if (!customerId || !addressId || !items?.length) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  // 🧾 Cart snapshot (used to detect same cart vs changed cart)
  const cartSnapshot = items
    .map((i: any) => `${i.productId}:${i.quantity}`)
    .sort()
    .join("|");

  // 🧮 STEP 1: FETCH PRODUCTS
  const productIds = items.map((i: any) => i.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { message: "One or more products not found" },
      { status: 400 },
    );
  }

  // ✅ STOCK VALIDATION
  for (const product of products) {
    const item = items.find((i: any) => i.productId === product.id);

    if (!item) continue;

    if (product.stockQuantity < item.quantity) {
      return NextResponse.json(
        {
          message: `${product.name} has only ${product.stockQuantity} items available`,
        },
        { status: 400 },
      );
    }
  }

  // 💰 CALCULATE TOTAL
  let subtotal = 0;

  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId)!;

    const totalPrice = product.price * item.quantity;
    subtotal += totalPrice;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice,
    };
  });

  const totalAmount = subtotal;

  // ⚙️ MAIN TRANSACTION
  const order = await prisma.$transaction(async (tx) => {
    const now = new Date();

    // 🔍 FIND EXISTING ACTIVE ORDER
    const existingOrder = await tx.order.findFirst({
      where: {
        customerId,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        orderExpiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    // 🔁 REUSE ORDER (same cart)
    if (existingOrder && existingOrder.cartSnapshot === cartSnapshot) {
      return tx.order.update({
        where: { id: existingOrder.id },
        data: {
          addressId,
          subtotal,
          totalAmount,
          cartSnapshot,
          updatedAt: now,
          orderExpiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          OrderItem: {
            deleteMany: {},
            create: orderItems,
          },
        },
      });
    }

    // ⚠️ MARK OLD ORDERS AS ABANDONED (ONLY if cart changed)
    if (existingOrder && existingOrder.cartSnapshot !== cartSnapshot) {
      await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          orderStatus: "ABANDONED",
        },
      });
    }

    // 🆕 CREATE NEW ORDER
    const newOrder = await tx.order.create({
      data: {
        orderNumber: "TEMP",
        customerId,
        addressId,
        subtotal,
        totalAmount,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        orderExpiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        cartSnapshot,
        updatedAt: now,
        OrderItem: {
          create: orderItems,
        },
      },
    });

    // 🧾 GENERATE ORDER NUMBER (safe + readable)
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

    const orderNumber = `MM-ORD-${dateStr}-${String(newOrder.id).padStart(
      6,
      "0",
    )}`;

    // 🔄 UPDATE ORDER WITH FINAL NUMBER
    return tx.order.update({
      where: { id: newOrder.id },
      data: {
        orderNumber,
      },
    });
  });

  // 📦 RESPONSE
  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
  });
}
