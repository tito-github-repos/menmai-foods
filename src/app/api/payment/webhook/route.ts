import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const eventId = event.id;

    // ✅ FIX 1: safe deduplication
    try {
      await prisma.webhookLog.create({
        data: { eventId },
      });
    } catch (e: any) {
      // duplicate webhook → already processed
      if (e.code === "P2002") {
        return NextResponse.json({
          success: true,
          message: "Duplicate webhook ignored",
        });
      }

      throw e;
    }

    // 🎯 ONLY PAYMENT SUCCESS
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const razorpayOrderId = payment.order_id || payment.orderId;
      const razorpayPaymentId = payment.id;

      const dbPayment = await prisma.payment.findFirst({
        where: { razorpayOrderId },
        include: { Order: true },
      });

      if (!dbPayment) {
        return NextResponse.json(
          { message: "Payment not found" },
          { status: 404 }
        );
      }

      if (dbPayment.paymentStatus === "PAID") {
        return NextResponse.json({
          success: true,
          message: "Already updated",
        });
      }

      // ✅ FIX 2: single transaction (important)
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: dbPayment.id },
          data: {
            razorpayPaymentId,
            paymentStatus: "PAID",
          },
        });

        await tx.order.update({
          where: { id: dbPayment.orderId },
          data: {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
        });

        await tx.cartItem.deleteMany({
          where: {
            customerId: dbPayment.Order.customerId,
          },
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Webhook failed" },
      { status: 500 }
    );
  }
}