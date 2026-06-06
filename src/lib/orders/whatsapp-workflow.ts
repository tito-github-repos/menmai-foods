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
import type { WhatsAppInboundMessage, WhatsAppStatusEvent } from "../whatsapp/types";

function getAdminPhone() {
  const adminPhone = process.env.MENMAI_ADMIN_PHONE;

  if (!adminPhone) {
    throw new Error("Missing MENMAI_ADMIN_PHONE");
  }

  return adminPhone;
}

async function getOrderMessageData(orderId: number): Promise<OrderMessageData> {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      Customer: true,
      CustomerAddress: true,
      OrderItem: true,
    },
  });

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

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
      payload: args.payload === undefined ? undefined : JSON.parse(JSON.stringify(args.payload)),
    },
  });
}

export async function sendOrderConfirmedWorkflow(orderId: number) {
  const order = await getOrderMessageData(orderId);

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      orderStatus: "CONFIRMED",
    },
  });

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

  const adminResponse = await sendButtonMessage({
    to: getAdminPhone(),
    header: "Menmai Foods",
    body: buildAdminOrderMessage(order),
    footer: "Update the order status",
    buttons: adminOrderButtons(order.id),
  });

  await logWhatsAppEvent({
    orderId: order.id,
    messageId: adminResponse.messages?.[0]?.id,
    phone: getAdminPhone(),
    direction: "OUTBOUND",
    eventType: "ADMIN_NEW_ORDER",
    status: "SENT_TO_META",
    payload: adminResponse,
  });

  return {
    orderId: order.id,
    customerMessageId: customerResponse.messages?.[0]?.id,
    adminMessageId: adminResponse.messages?.[0]?.id,
  };
}

export async function handleInboundWhatsAppMessage(message: WhatsAppInboundMessage) {
  const buttonId =
    message.interactive?.button_reply?.id ?? message.button?.payload ?? undefined;

  await logWhatsAppEvent({
    messageId: message.id,
    phone: message.from,
    direction: "INBOUND",
    eventType: buttonId ? "BUTTON_CLICK" : `MESSAGE_${message.type.toUpperCase()}`,
    status: "RECEIVED",
    payload: message,
  });

  if (!buttonId) {
    return {
      handled: false,
      reason: "Inbound message was not an admin button click",
    };
  }

  const parsed = parseAdminOrderAction(buttonId);

  if (!parsed) {
    return {
      handled: false,
      reason: `Unknown button id: ${buttonId}`,
    };
  }

  if (parsed.action === "out_for_delivery") {
    return markOrderOutForDelivery(parsed.orderId, message.from, message.id);
  }

  return markOrderDelivered(parsed.orderId, message.from, message.id);
}

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
    status: status.status,
  };
}

async function markOrderOutForDelivery(
  orderId: number,
  adminPhone: string,
  inboundMessageId: string,
) {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      orderStatus: "SHIPPED",
    },
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

async function markOrderDelivered(
  orderId: number,
  adminPhone: string,
  inboundMessageId: string,
) {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      orderStatus: "DELIVERED",
    },
  });

  const order = await getOrderMessageData(orderId);

  const deliveredResponse = await sendTextMessage(
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
    messageId: deliveredResponse.messages?.[0]?.id,
    phone: order.customerPhone,
    direction: "OUTBOUND",
    eventType: "CUSTOMER_DELIVERED",
    status: "SENT_TO_META",
    payload: deliveredResponse,
  });

  await scheduleReviewRequest(order.id);

  return {
    handled: true,
    orderId,
    orderStatus: "DELIVERED",
  };
}

async function scheduleReviewRequest(orderId: number) {
  const delayMinutes = Number(process.env.REVIEW_DELAY_MINUTES ?? "30");
  const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  await prisma.reviewRequest.upsert({
    where: {
      orderId,
    },
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
    payload: {
      scheduledAt,
    },
  });
}

export async function sendDueReviewRequests() {
  const dueRequests = await prisma.reviewRequest.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: {
        lte: new Date(),
      },
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
      where: {
        id: request.id,
      },
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
