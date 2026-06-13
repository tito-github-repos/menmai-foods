import { unauthorized, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Generate order number: ORD-20260527-0001
async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20260527

  // Count orders created today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(todayCount + 1).padStart(4, "0"); // 0001
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `ORD-${dateStr}-${sequence}-${random}`;
}

export async function POST(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth) return unauthorized();

  const { addressId, items } = await req.json();

  const cartSnapshot = items
    .map(
      (i: { productId: number; quantity: number }) =>
        `${i.productId}:${i.quantity}`,
    )
    .sort()
    .join("|");

  const customerId = auth.customerId;

  if (!customerId || !addressId || !items?.length) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  // 🧹 STEP 1: EXPIRE OLD ORDERS (24h RULE)
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  await prisma.order.updateMany({
    where: {
      customerId,
      orderStatus: "PENDING",
      paymentStatus: "PENDING",
      createdAt: {
        lt: cutoff,
      },
    },
    data: {
      orderStatus: "EXPIRED", //use Expired
    },
  });

  await prisma.order.updateMany({
    where: {
      customerId,
      orderStatus: "PENDING",
      paymentStatus: "PENDING",
    },
    data: {
      orderStatus: "ABANDONED",
    },
  });

  // 🔍 STEP 2: CHECK EXISTING ACTIVE ORDER
  const existingOrder = await prisma.order.findFirst({
    where: {
      customerId,
      orderStatus: "PENDING",
      paymentStatus: "PENDING",
      orderExpiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      cartSnapshot: true,
      paymentStatus: true,
      orderExpiresAt: true,
    },
    // include: {
    //   OrderItem: true,
    // },
  });

  // const isExpired =
  //   existingOrder?.orderExpiresAt &&
  //   new Date(existingOrder.orderExpiresAt) < new Date();

  // 🧮 STEP 3: FETCH PRODUCTS
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

  // ✅ Stock validation
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

  // 💰 STEP 4: CALCULATE ORDER ITEMS
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

  // 🧠 STEP 5: CREATE OR REUSE ORDER LOGIC
  const order = await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findFirst({
      where: {
        customerId,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        orderExpiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        cartSnapshot: true,
        paymentStatus: true,
        orderExpiresAt: true,
      },
    });

    if (
      existingOrder &&
      existingOrder.cartSnapshot === cartSnapshot &&
      existingOrder.paymentStatus === "PENDING"
    ) {
      return tx.order.update({
        where: { id: existingOrder.id },
        data: {
          addressId,
          subtotal,
          totalAmount,
          cartSnapshot,
          updatedAt: new Date(),
          orderExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          OrderItem: {
            deleteMany: {},
            create: orderItems,
          },
        },
      });
    }

    const orderNumber = await generateOrderNumber();

    return tx.order.create({
      data: {
        orderNumber,
        customerId,
        addressId,
        subtotal,
        totalAmount,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        orderExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        cartSnapshot,
        updatedAt: new Date(),
        OrderItem: {
          create: orderItems,
        },
      },
    });
  });

  // 📦 RESPONSE
  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
    reused: !!(
      existingOrder &&
      existingOrder.cartSnapshot === cartSnapshot &&
      existingOrder.paymentStatus === "PENDING"
    ),
  });
}
