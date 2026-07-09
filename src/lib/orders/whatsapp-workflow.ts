import { prisma } from "../prisma";
import { sendTemplateMessage } from "../whatsapp/client";
import {
  buildAdminOrderTemplate,
  buildCustomerDeliveredTemplate,
  buildCustomerOrderConfirmedTemplate,
  buildCustomerOutForDeliveryTemplate,
  buildCustomerReviewRequestTemplate,
  parseAdminOrderAction,
  type OrderMessageData,
} from "../whatsapp/messages";
import type {
  WhatsAppInboundMessage,
  WhatsAppStatusEvent,
} from "../whatsapp/types";
import crypto from "crypto";

/* ── CONFIG ── */
function getAdminPhone() {
  const adminPhone = process.env.MENMAI_ADMIN_PHONE;
  if (!adminPhone) throw new Error("Missing MENMAI_ADMIN_PHONE");
  return adminPhone;
}

/* ── FETCH ORDER ── */
async function getOrderMessageData(orderId: number): Promise<OrderMessageData> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { Customer: true, CustomerAddress: true, OrderItem: true },
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

/* ── LOGGING ── */
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

/* ── 1. ORDER CONFIRMED ── */
export async function sendOrderConfirmedWorkflow(orderId: number) {
  const existing = await prisma.whatsAppLog.findFirst({
    where: { orderId, eventType: "CUSTOMER_ORDER_CONFIRMED", status: "SENT_TO_META" },
  });
  if (existing) return { skipped: true, reason: "WhatsApp already sent" };

  const order = await getOrderMessageData(orderId);

  await prisma.order
    .update({ where: { id: order.id }, data: { orderStatus: "CONFIRMED" } })
    .catch(() => {});

  try {
    const tpl = buildCustomerOrderConfirmedTemplate(order);
    const customerResponse = await sendTemplateMessage(
      order.customerPhone,
      tpl.name,
      tpl.language,
      tpl.components,
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
    await logWhatsAppEvent({
      orderId: order.id,
      phone: order.customerPhone,
      direction: "OUTBOUND",
      eventType: "CUSTOMER_ORDER_CONFIRMED",
      status: "FAILED",
      payload: { error: String(err) },
    });
  }

  const adminTpl = buildAdminOrderTemplate(order);
  sendTemplateMessage(
    getAdminPhone(),
    adminTpl.name,
    adminTpl.language,
    adminTpl.components,
  )
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

  return { orderId: order.id, status: "TRIGGERED" };
}

/* ── 2. INBOUND HANDLER ── */
export async function handleInboundWhatsAppMessage(message: WhatsAppInboundMessage) {
  const buttonId =
    message.interactive?.button_reply?.id ??
    message.button?.payload ??
    undefined;

  await logWhatsAppEvent({
    messageId: message.id,
    phone: message.from,
    direction: "INBOUND",
    eventType: buttonId ? "BUTTON_CLICK" : `MESSAGE_${message.type.toUpperCase()}`,
    status: "RECEIVED",
    payload: message,
  });

  if (!buttonId) return { handled: false, reason: "Not a button click" };

  const parsed = parseAdminOrderAction(buttonId);
  if (!parsed) return { handled: false, reason: "Unknown button action" };

  if (parsed.action === "out_for_delivery") {
    return markOrderOutForDelivery(parsed.orderId, message.from, message.id);
  }
  return markOrderDelivered(parsed.orderId, message.from, message.id);
}

/* ── 3. STATUS WEBHOOK ── */
export async function handleWhatsAppStatusEvent(status: WhatsAppStatusEvent) {
  await logWhatsAppEvent({
    messageId: status.id,
    phone: status.recipient_id,
    direction: "STATUS",
    eventType: "MESSAGE_STATUS",
    status: status.status,
    payload: status,
  });
  return { handled: true };
}

/* ── 4. OUT FOR DELIVERY ── */
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
  const tpl = buildCustomerOutForDeliveryTemplate(order);
  const response = await sendTemplateMessage(
    order.customerPhone,
    tpl.name,
    tpl.language,
    tpl.components,
  );

  await logWhatsAppEvent({
    orderId, messageId: inboundMessageId, phone: adminPhone,
    direction: "INBOUND", eventType: "ADMIN_MARKED_OUT_FOR_DELIVERY", status: "PROCESSED",
  });
  await logWhatsAppEvent({
    orderId, messageId: response.messages?.[0]?.id, phone: order.customerPhone,
    direction: "OUTBOUND", eventType: "CUSTOMER_OUT_FOR_DELIVERY", status: "SENT_TO_META",
    payload: response,
  });

  return { handled: true, orderId, orderStatus: "SHIPPED" };
}

/* ── 5. DELIVERED ── */
async function markOrderDelivered(
  orderId: number,
  adminPhone: string,
  inboundMessageId: string,
) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "DELIVERED" },
    });
  } catch (err) {
    console.error(`[markOrderDelivered] Order update failed for ${orderId}:`, err);
  }

  const order = await getOrderMessageData(orderId);

  const tpl = buildCustomerDeliveredTemplate(order);
  const response = await sendTemplateMessage(
    order.customerPhone,
    tpl.name,
    tpl.language,
    tpl.components,
  );

  await logWhatsAppEvent({
    orderId, messageId: inboundMessageId, phone: adminPhone,
    direction: "INBOUND", eventType: "ADMIN_MARKED_DELIVERED", status: "PROCESSED",
  });
  await logWhatsAppEvent({
    orderId, messageId: response.messages?.[0]?.id, phone: order.customerPhone,
    direction: "OUTBOUND", eventType: "CUSTOMER_DELIVERED", status: "SENT_TO_META",
    payload: response,
  });

  // Schedule review — non-blocking, failure must not affect delivery flow
  scheduleReviewRequest(order.id).catch((err) => {
    console.error(`[scheduleReviewRequest] Failed for orderId ${orderId}:`, err);
  });

  return { handled: true, orderId, orderStatus: "DELIVERED" };
}

/* ── 6. SCHEDULE REVIEW REQUEST ── */
async function scheduleReviewRequest(orderId: number) {
  const delayMinutes = Number(process.env.REVIEW_DELAY_MINUTES ?? "30");
  const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  const existing = await prisma.reviewRequest.findUnique({
    where: { orderId },
  });

  const token = existing?.token ?? crypto.randomUUID();

  await prisma.reviewRequest.upsert({
    where: { orderId },
    create: { orderId, token, scheduledAt, status: "SCHEDULED" },
    update: { token, scheduledAt, status: "SCHEDULED", sentAt: null },
  });

  await logWhatsAppEvent({
    orderId,
    direction: "OUTBOUND",
    eventType: "REVIEW_REQUEST_SCHEDULED",
    status: "SCHEDULED",
    payload: { scheduledAt, token },
  });
}

/* ── 7. REVIEW CRON ── */
export async function sendDueReviewRequests() {
  const dueRequests = await prisma.reviewRequest.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: new Date() },
    },
    include: {
      Order: {
        include: { Customer: true, CustomerAddress: true, OrderItem: true },
      },
    },
    take: 25,
  });

  let sent = 0;
  let failed = 0;

  for (const request of dueRequests) {
    if (!request.token) {
      console.error(`[sendDueReviewRequests] Missing token for ReviewRequest ${request.id}`);
      await prisma.reviewRequest.update({
        where: { id: request.id },
        data: { status: "FAILED" },
      });
      failed++;
      continue;
    }

    try {
      const order = await getOrderMessageData(request.orderId);

      const tpl = buildCustomerReviewRequestTemplate(order, request.token);
      const response = await sendTemplateMessage(
        order.customerPhone,
        tpl.name,
        tpl.language,
        tpl.components,
      );

      await prisma.reviewRequest.update({
        where: { id: request.id },
        data: { status: "SENT", sentAt: new Date() },
      });

      await logWhatsAppEvent({
        orderId: order.id,
        messageId: response.messages?.[0]?.id,
        phone: order.customerPhone,
        direction: "OUTBOUND",
        eventType: "CUSTOMER_REVIEW_REQUEST",
        status: "SENT_TO_META",
        payload: { response, reviewToken: request.token },
      });

      sent++;
    } catch (err) {
      console.error(`[sendDueReviewRequests] Failed for order ${request.orderId}:`, err);

      await prisma.reviewRequest.update({
        where: { id: request.id },
        data: { status: "FAILED" },
      });

      await logWhatsAppEvent({
        orderId: request.orderId,
        direction: "OUTBOUND",
        eventType: "CUSTOMER_REVIEW_REQUEST",
        status: "FAILED",
        payload: { error: String(err) },
      });

      failed++;
    }
  }

  return { sent, failed, processed: dueRequests.length };
}