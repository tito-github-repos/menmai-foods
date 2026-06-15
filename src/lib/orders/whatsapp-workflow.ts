import { prisma } from "../prisma";
import { sendButtonMessage, sendTextMessage } from "../whatsapp/client";

import {
  adminOrderButtons,
  buildAdminOrderMessage,
  buildCustomerDeliveredMessage,
  buildCustomerOrderConfirmedMessage,
  buildCustomerOutForDeliveryMessage,
  buildCustomerReviewRequestMessage,
  parseAdminOrderAction,
  type OrderMessageData,
} from "../whatsapp/messages";

import type {
  WhatsAppInboundMessage,
  WhatsAppStatusEvent,
} from "../whatsapp/types";

/* -----------------------------
   CONFIG
------------------------------ */

function getAdminPhone() {
  const adminPhone = process.env.MENMAI_ADMIN_PHONE;

  if (!adminPhone) {
    throw new Error("Missing MENMAI_ADMIN_PHONE");
  }

  return adminPhone;
}

/* -----------------------------
   FETCH ORDER (single source)
------------------------------ */

async function getOrderMessageData(orderId: number): Promise<OrderMessageData> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      Customer: true,
      CustomerAddress: true,
      OrderItem: true,
    },
  });

  if (!order) throw new Error(`Order not found: ${orderId}`);

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.Customer.fullName,
    customerPhone: order.Customer.phone,
    deliveryAddress: order.CustomerAddress.fullAddress,
    totalAmount: order.totalAmount,
    items: order.OrderItem.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })),
  };
}

/* -----------------------------
   WHATSAPP LOGGING
------------------------------ */

async function logWhatsAppEvent(args: {
  orderId?: number;
  messageId?: string;
  phone?: string;
  direction: "INBOUND" | "OUTBOUND" | "STATUS";
  eventType: string;
  status: string;
  payload?: unknown;
}) {
  await prisma.whatsAppLog.create({
    data: {
      orderId: args.orderId,
      messageId: args.messageId,
      phone: args.phone,
      direction: args.direction,
      eventType: args.eventType,
      status: args.status,
      payload:
        args.payload === undefined
          ? undefined
          : JSON.parse(JSON.stringify(args.payload)),
    },
  });
}

/* =====================================================
   1. ORDER CONFIRMED WORKFLOW (MAIN FLOW)
===================================================== */

export async function sendOrderConfirmedWorkflow(orderId: number) {
  // 🔥 idempotency check (prevents duplicate sends)
  const existing = await prisma.whatsAppLog.findFirst({
    where: {
      orderId,
      eventType: "CUSTOMER_ORDER_CONFIRMED",
      status: "SENT_TO_META",
    },
  });

  if (existing) {
    return {
      skipped: true,
      reason: "WhatsApp already sent",
    };
  }

  const order = await getOrderMessageData(orderId);

  // ⚠️ DO NOT block workflow if order status update fails
  await prisma.order
    .update({
      where: { id: order.id },
      data: {
        orderStatus: "CONFIRMED",
      },
    })
    .catch(() => {});

  /* ---------------- CUSTOMER MESSAGE ---------------- */

  console.log("📲 CUSTOMER WHATSAPP DEBUG:", {
    phone: order.customerPhone,
    orderId: order.id,
  });

  try {
    const customerResponse = await sendTextMessage(
      order.customerPhone,
      buildCustomerOrderConfirmedMessage(order),
    );

    await logWhatsAppEvent({
      orderId: order.id,
      messageId: customerResponse.messages?.[0]?.id,
      phone: order.customerPhone,
      direction: "OUTBOUND",
      eventType: "CUSTOMER_ORDER_CONFIRMED",
      status: "SENT_TO_META",
      payload: customerResponse,
    });
  } catch (err) {
    console.log("❌ CUSTOMER WHATSAPP ERROR:", err);
    await logWhatsAppEvent({
      orderId: order.id,
      phone: order.customerPhone,
      direction: "OUTBOUND",
      eventType: "CUSTOMER_ORDER_CONFIRMED",
      status: "FAILED",
      payload: {
        error: String(err),
        phone: order.customerPhone,
        orderId: order.id,
      },
    });
  }

  /* ---------------- ADMIN MESSAGE (NON-BLOCKING) ---------------- */

  sendButtonMessage({
    to: getAdminPhone(),
    header: "Menmai Foods",
    body: buildAdminOrderMessage(order),
    footer: "Update the order status",
    buttons: adminOrderButtons(order.id),
  })
    .then(async (adminResponse) => {
      await logWhatsAppEvent({
        orderId: order.id,
        messageId: adminResponse.messages?.[0]?.id,
        phone: getAdminPhone(),
        direction: "OUTBOUND",
        eventType: "ADMIN_NEW_ORDER",
        status: "SENT_TO_META",
        payload: adminResponse,
      });
    })
    .catch(async (err) => {
      await logWhatsAppEvent({
        orderId: order.id,
        phone: getAdminPhone(),
        direction: "OUTBOUND",
        eventType: "ADMIN_NEW_ORDER",
        status: "FAILED",
        payload: err,
      });
    });

  return {
    orderId: order.id,
    status: "TRIGGERED",
  };
}

/* =====================================================
   2. INBOUND WHATSAPP HANDLER
===================================================== */

export async function handleInboundWhatsAppMessage(
  message: WhatsAppInboundMessage,
) {
  const buttonId =
    message.interactive?.button_reply?.id ??
    message.button?.payload ??
    undefined;

  await logWhatsAppEvent({
    messageId: message.id,
    phone: message.from,
    direction: "INBOUND",
    eventType: buttonId
      ? "BUTTON_CLICK"
      : `MESSAGE_${message.type.toUpperCase()}`,
    status: "RECEIVED",
    payload: message,
  });

  if (!buttonId) {
    return {
      handled: false,
      reason: "Not a button click",
    };
  }

  const parsed = parseAdminOrderAction(buttonId);

  if (!parsed) {
    return {
      handled: false,
      reason: "Unknown button action",
    };
  }

  if (parsed.action === "out_for_delivery") {
    return markOrderOutForDelivery(parsed.orderId, message.from, message.id);
  }

  return markOrderDelivered(parsed.orderId, message.from, message.id);
}

/* =====================================================
   3. STATUS WEBHOOK
===================================================== */

export async function handleWhatsAppStatusEvent(status: WhatsAppStatusEvent) {
  await logWhatsAppEvent({
    messageId: status.id,
    phone: status.recipient_id,
    direction: "STATUS",
    eventType: "MESSAGE_STATUS",
    status: status.status,
    payload: status,
  });

  return {
    handled: true,
  };
}

/* =====================================================
   4. OUT FOR DELIVERY
===================================================== */

async function markOrderOutForDelivery(
  orderId: number,
  adminPhone: string,
  inboundMessageId: string,
) {
  await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: "SHIPPED" },
  });

  const order = await getOrderMessageData(orderId);

  const response = await sendTextMessage(
    order.customerPhone,
    buildCustomerOutForDeliveryMessage(order),
  );

  await logWhatsAppEvent({
    orderId,
    messageId: inboundMessageId,
    phone: adminPhone,
    direction: "INBOUND",
    eventType: "ADMIN_MARKED_OUT_FOR_DELIVERY",
    status: "PROCESSED",
  });

  await logWhatsAppEvent({
    orderId,
    messageId: response.messages?.[0]?.id,
    phone: order.customerPhone,
    direction: "OUTBOUND",
    eventType: "CUSTOMER_OUT_FOR_DELIVERY",
    status: "SENT_TO_META",
    payload: response,
  });

  return {
    handled: true,
    orderId,
    orderStatus: "SHIPPED",
  };
}

/* =====================================================
   5. DELIVERED + REVIEW FLOW
===================================================== */

async function markOrderDelivered(
  orderId: number,
  adminPhone: string,
  inboundMessageId: string,
) {
  await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: "DELIVERED" },
  });

  const order = await getOrderMessageData(orderId);

  const response = await sendTextMessage(
    order.customerPhone,
    buildCustomerDeliveredMessage(order),
  );

  await logWhatsAppEvent({
    orderId,
    messageId: inboundMessageId,
    phone: adminPhone,
    direction: "INBOUND",
    eventType: "ADMIN_MARKED_DELIVERED",
    status: "PROCESSED",
  });

  await logWhatsAppEvent({
    orderId,
    messageId: response.messages?.[0]?.id,
    phone: order.customerPhone,
    direction: "OUTBOUND",
    eventType: "CUSTOMER_DELIVERED",
    status: "SENT_TO_META",
    payload: response,
  });

  await scheduleReviewRequest(order.id);

  return {
    handled: true,
    orderId,
    orderStatus: "DELIVERED",
  };
}

/* =====================================================
   6. REVIEW SYSTEM
===================================================== */

async function scheduleReviewRequest(orderId: number) {
  const delayMinutes = Number(process.env.REVIEW_DELAY_MINUTES ?? "30");

  const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  await prisma.reviewRequest.upsert({
    where: { orderId },
    create: {
      orderId,
      scheduledAt,
      status: "SCHEDULED",
    },
    update: {
      scheduledAt,
      status: "SCHEDULED",
      sentAt: null,
    },
  });

  await logWhatsAppEvent({
    orderId,
    direction: "OUTBOUND",
    eventType: "REVIEW_REQUEST_SCHEDULED",
    status: "SCHEDULED",
    payload: { scheduledAt },
  });
}

/* =====================================================
   7. REVIEW CRON
===================================================== */

export async function sendDueReviewRequests() {
  const dueRequests = await prisma.reviewRequest.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: new Date() },
    },
    include: {
      Order: {
        include: {
          Customer: true,
          CustomerAddress: true,
          OrderItem: true,
        },
      },
    },
    take: 25,
  });

  for (const request of dueRequests) {
    const order = await getOrderMessageData(request.orderId);

    const response = await sendTextMessage(
      order.customerPhone,
      buildCustomerReviewRequestMessage(order),
    );

    await prisma.reviewRequest.update({
      where: { id: request.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    await logWhatsAppEvent({
      orderId: order.id,
      messageId: response.messages?.[0]?.id,
      phone: order.customerPhone,
      direction: "OUTBOUND",
      eventType: "CUSTOMER_REVIEW_REQUEST",
      status: "SENT_TO_META",
      payload: response,
    });
  }

  return {
    sent: dueRequests.length,
  };
}
