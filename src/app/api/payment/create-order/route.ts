import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { unauthorized, verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  try {
    const auth = verifyToken(req);

    if (!auth) {
      return unauthorized();
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 },
      );
    }

    // Fetch order from DB
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    // Amount in paise
    const amountInPaise = Math.round(order.totalAmount * 100);

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: String(order.id),
        customerId: String(order.customerId),
      },
    });

    // Create or Update Payment record
    await prisma.payment.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
      },
      create: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment order",
      },
      {
        status: 500,
      },
    );
  }
}
