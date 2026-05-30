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
  return `ORD-${dateStr}-${sequence}`;
}

export async function POST(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth) return unauthorized();

  const { addressId, items } = await req.json();
  const customerId = auth.customerId;

  // items = [{ productId, quantity }] — NO prices from frontend

  if (!customerId || !addressId || !items || items.length === 0) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  // 1. Fetch real prices from DB
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

  // 2. Compute real total from DB prices
  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);

    const unitPrice = product.price;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    };
  });

  const deliveryCharge = 0; // free delivery
  const totalAmount = subtotal + deliveryCharge;

  // 3. Generate order number
  const orderNumber = await generateOrderNumber();

  // 4. Save order in DB
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId,
      addressId,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      updatedAt: new Date(),
      OrderItem: {
        create: orderItems,
      },
    },
    include: {
      OrderItem: true,
      CustomerAddress: true,
    },
  });

  // Clear cart from DB after order created
  await prisma.cartItem.deleteMany({
    where: { customerId },
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
  });
}
