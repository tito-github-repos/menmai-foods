import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/db";
import { verifyToken, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = verifyToken(req);

    if (!auth) {
      return unauthorized();
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { Order: true },
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found" },
        { status: 404 },
      );
    }

    if (payment.Order.customerId !== auth.customerId) {
      return NextResponse.json(
        { message: "Unauthorized access to payment" },
        { status: 403 },
      );
    }

    // 🔴 BLOCK INVALID ORDER STATES (IMPORTANT FIX)
    if (
      payment.Order.orderStatus === "EXPIRED" ||
      payment.Order.orderStatus === "ABANDONED"
    ) {
      return NextResponse.json(
        {
          message: "This order is no longer valid. Please create a new order.",
        },
        { status: 400 },
      );
    }

    // 🔴 BLOCK EXPIRED TIME WINDOW
    if (!payment.Order.orderExpiresAt || payment.Order.orderExpiresAt < new Date()) {
      return NextResponse.json(
        { message: "Order expired. Please create a new order." },
        { status: 400 },
      );
    }

    // 🔥 prevent double success update
    if (payment.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Already verified",
      });
    }

    // ✅ FIX 3: use transaction (IMPORTANT)
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "PAID",
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          customerId: payment.Order.customerId,
        },
      });
    });

    // // Update payment table
    // await prisma.payment.update({
    //   where: {
    //     orderId,
    //   },
    //   data: {
    //     razorpayPaymentId: razorpay_payment_id,
    //     razorpaySignature: razorpay_signature,
    //     paymentStatus: "PAID",
    //   },
    // });

    // // Update order table
    // await prisma.order.update({
    //   where: {
    //     id: orderId,
    //   },
    //   data: {
    //     paymentStatus: "PAID",
    //     orderStatus: "CONFIRMED",
    //   },
    // });

    // // Clear customer cart
    // const order = await prisma.order.findUnique({
    //   where: { id: orderId },
    //   select: {
    //     customerId: true,
    //   },
    // });

    // if (!order) return;

    // await prisma.cartItem.deleteMany({
    //   where: {
    //     customerId: order.customerId,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 500 },
    );
  }
}
