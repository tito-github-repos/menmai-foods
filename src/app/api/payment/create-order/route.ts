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
    // ✅ Verify authentication
    const auth = verifyToken(req);

    if (!auth) {
      return unauthorized();
    }

    // ✅ Get orderId from request
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 },
      );
    }

    // ✅ Fetch order from database
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

    // ✅ CHECK 1: Order exists in EXPIRED state
    if (order.orderStatus === "EXPIRED") {
      return NextResponse.json(
        {
          success: false,
          message: "Order expired. Please create a new order.",
        },
        { status: 400 },
      );
    }

    // ✅ CHECK 2: Time-based expiry validation (24 hour limit)
    if (order.orderExpiresAt && new Date() > order.orderExpiresAt) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "EXPIRED",
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Order expired (24h limit reached).",
        },
        { status: 400 },
      );
    }

    // ✅ CHECK 3: If already paid, return error
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (existingPayment?.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment already completed for this order",
        },
        { status: 400 },
      );
    }

    // ✅ ALWAYS CREATE NEW RAZORPAY ORDER (no reuse)
    const amountInPaise = Math.round(order.totalAmount * 100);

    // Validate amount
    if (!amountInPaise || amountInPaise <= 0 || isNaN(amountInPaise)) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount" },
        { status: 400 },
      );
    }

    // Create NEW Razorpay Order (fresh every time, never reuse)
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: String(order.id),
        customerId: String(order.customerId),
      },
    });

    // ✅ Create or Update Payment record with NEW razorpayOrderId
    await prisma.payment.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        razorpayOrderId: razorpayOrder.id, // ← NEW order ID (not reused)
        amount: order.totalAmount,
        paymentStatus: "PENDING",
      },
      create: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id, // ← NEW order ID
        amount: order.totalAmount,
        paymentStatus: "PENDING",
      },
    });

    // ✅ Return response with new Razorpay order
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
