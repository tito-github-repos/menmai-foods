import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendOrderConfirmedWorkflow } from "@/lib/orders/whatsapp-workflow";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    // ✅ CHANGE 1: timing-safe comparison instead of !==
    const isValidSignature =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature),
      );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 },
      );
    }

    const event = JSON.parse(body);
    const eventId = event.id;

    try {
      await prisma.webhookLog.create({ data: { eventId } });
    } catch (e: any) {
      if (e.code === "P2002") {
        return NextResponse.json({
          success: true,
          message: "Duplicate webhook ignored",
        });
      }
      throw e;
    }

    // ✅ CHANGE 2: handle payment.captured
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
          { status: 404 },
        );
      }

      if (dbPayment.paymentStatus === "PAID") {
        return NextResponse.json({
          success: true,
          message: "Already updated",
        });
      }

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
          where: { customerId: dbPayment.Order.customerId },
        });
      });

      // ✅ CHANGE 3: send WhatsApp confirmation, same dedup pattern as verify route
      const confirmedOrder = await prisma.order.findUnique({
        where: { id: dbPayment.orderId },
        include: { Customer: true },
      });

      if (confirmedOrder) {
        const existingWhatsApp = await prisma.whatsAppLog.findFirst({
          where: {
            orderId: dbPayment.orderId,
            eventType: "ORDER_CONFIRMED",
            status: "SENT",
          },
        });

        if (!existingWhatsApp) {
          await sendOrderConfirmedWorkflow(dbPayment.orderId);

          await prisma.whatsAppLog.create({
            data: {
              orderId: dbPayment.orderId,
              phone: confirmedOrder.Customer.phone,
              direction: "OUTBOUND",
              eventType: "ORDER_CONFIRMED",
              status: "SENT",
              payload: {
                orderNumber: confirmedOrder.orderNumber,
                totalAmount: confirmedOrder.totalAmount,
              },
            },
          });
        }
      }
    }

    // ✅ CHANGE 4: handle payment.failed
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id || payment.orderId;

      const dbPayment = await prisma.payment.findFirst({
        where: { razorpayOrderId },
      });

      // Don't overwrite an already-PAID record with a stale/late failure event
      if (dbPayment && dbPayment.paymentStatus !== "PAID") {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: dbPayment.id },
            data: { paymentStatus: "FAILED" },
          });

          await tx.order.update({
            where: { id: dbPayment.orderId },
            data: { paymentStatus: "FAILED" },
          });
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { success: false, message: "Webhook failed" },
      { status: 500 },
    );
  }
}