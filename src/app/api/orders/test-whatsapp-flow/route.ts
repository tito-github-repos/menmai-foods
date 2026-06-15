import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmedWorkflow } from "@/lib/orders/whatsapp-workflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // 🔎 Fetch REAL order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        Customer: true,
        OrderItem: true,
        CustomerAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🚫 Prevent duplicate WhatsApp sends
    const existingWhatsApp = await prisma.whatsAppLog.findFirst({
      where: {
        orderId,
        eventType: "ORDER_CONFIRMED",
        status: "SENT",
      },
    });

    if (existingWhatsApp) {
      return NextResponse.json({
        ok: true,
        message: "WhatsApp already sent for this order",
      });
    }

    // 📲 Trigger workflow (REAL DATA ONLY)
    await sendOrderConfirmedWorkflow(orderId);

    // 📝 Log WhatsApp event
    await prisma.whatsAppLog.create({
      data: {
        orderId,
        phone: order.Customer.phone,
        direction: "OUTBOUND",
        eventType: "ORDER_CONFIRMED",
        status: "SENT",
        payload: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "WhatsApp workflow triggered successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("WhatsApp test error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to trigger WhatsApp workflow",
      },
      { status: 500 },
    );
  }
}
