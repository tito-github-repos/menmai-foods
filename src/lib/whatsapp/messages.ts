type OrderMessageItem = {
  productName: string;
  quantity: number;
  totalPrice: number;
};

export type OrderMessageData = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  items: OrderMessageItem[];
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ══════════════════════════════════════════════════════════
   TEMPLATE BUILDERS — wired to your VERIFIED Meta templates
   ══════════════════════════════════════════════════════════ */

export const WHATSAPP_TEMPLATES = {
  ORDER_CONFIRMED: { name: "menmai_order_confirmed", language: "en" },
  OUT_FOR_DELIVERY: { name: "menmai_out_for_delivery", language: "en" },
  DELIVERED: { name: "menmai_order_delivered", language: "en" },
  REVIEW_REQUEST: { name: "menmai_review_request", language: "en" },
  ADMIN_NEW_ORDER: { name: "menmai_admin_new_order", language: "en" },
  OTP: { name: "menmai_login_otp", language: "en" }, // AUTHENTICATION category
  BROADCAST_TEXT: { name: "menmai_broadcast_text", language: "en" },
  BROADCAST_IMAGE: { name: "menmai_broadcast_image", language: "en" },
} as const;

function firstName(fullName: string) {
  return fullName.split(" ")[0] || "there";
}

// menmai_order_confirmed — "Hi {{1}}, ... order {{2}} has been confirmed ...
// Order Total: {{3}} ..."
export function buildCustomerOrderConfirmedTemplate(order: OrderMessageData) {
  return {
    ...WHATSAPP_TEMPLATES.ORDER_CONFIRMED,
    components: [
      {
        type: "body" as const,
        parameters: [
          { type: "text" as const, text: firstName(order.customerName) },
          { type: "text" as const, text: order.orderNumber },
          { type: "text" as const, text: formatCurrency(order.totalAmount) },
        ],
      },
    ],
  };
}

// menmai_out_for_delivery — "Hi {{1}}, ... Order number: {{2}} ..."
export function buildCustomerOutForDeliveryTemplate(order: OrderMessageData) {
  return {
    ...WHATSAPP_TEMPLATES.OUT_FOR_DELIVERY,
    components: [
      {
        type: "body" as const,
        parameters: [
          { type: "text" as const, text: firstName(order.customerName) },
          { type: "text" as const, text: order.orderNumber },
        ],
      },
    ],
  };
}

// menmai_order_delivered — "Hi {{1}}, ... marked as delivered ...
// Order number: {{2}} ..."
export function buildCustomerDeliveredTemplate(order: OrderMessageData) {
  return {
    ...WHATSAPP_TEMPLATES.DELIVERED,
    components: [
      {
        type: "body" as const,
        parameters: [
          { type: "text" as const, text: firstName(order.customerName) },
          { type: "text" as const, text: order.orderNumber },
        ],
      },
    ],
  };
}

// menmai_review_request — "Hi {{1}}, ... order {{2}} ...
// share your review using the link below: {{3}}"
// No button component on this template — the link is plain body text.
export function buildCustomerReviewRequestTemplate(
  order: OrderMessageData,
  reviewToken: string,
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.MENMAI_PUBLIC_BASE_URL ??
    "http://localhost:3000";
  const reviewUrl = `${baseUrl}/review/${reviewToken}`;

  return {
    ...WHATSAPP_TEMPLATES.REVIEW_REQUEST,
    components: [
      {
        type: "body" as const,
        parameters: [
          { type: "text" as const, text: firstName(order.customerName) },
          { type: "text" as const, text: order.orderNumber },
          { type: "text" as const, text: reviewUrl },
        ],
      },
    ],
  };
}

// menmai_admin_new_order — "Order ID: {{1}} Customer Name: {{2}}
// Customer Phone: {{3}} Order Total: {{4}} Ordered Items: {{5}}
// Delivery Address: {{6}}" + 2 quick-reply buttons: "Out for delivery", "Delivered"
// Button labels are fixed by the template, but the tap-back payload is
// dynamic per message — this is what keeps parseAdminOrderAction() working.
export function buildAdminOrderTemplate(order: OrderMessageData) {
  const itemsSummary = order.items
    .map((item) => `${item.productName} x${item.quantity}`)
    .join(", ");

  return {
    ...WHATSAPP_TEMPLATES.ADMIN_NEW_ORDER,
    components: [
      {
        type: "body" as const,
        parameters: [
          { type: "text" as const, text: order.orderNumber },
          { type: "text" as const, text: order.customerName },
          { type: "text" as const, text: order.customerPhone },
          { type: "text" as const, text: formatCurrency(order.totalAmount) },
          { type: "text" as const, text: itemsSummary },
          { type: "text" as const, text: order.deliveryAddress },
        ],
      },
      {
        type: "button" as const,
        sub_type: "quick_reply" as const,
        index: "0",
        parameters: [
          { type: "payload" as const, payload: `order:${order.id}:out_for_delivery` },
        ],
      },
      {
        type: "button" as const,
        sub_type: "quick_reply" as const,
        index: "1",
        parameters: [
          { type: "payload" as const, payload: `order:${order.id}:delivered` },
        ],
      },
    ],
  };
}

// menmai_login_otp — AUTHENTICATION template.
// Body: "*{{1}}* is your verification code..."
// Button: type URL (not copy_code) whose target URL embeds {{1}} — at send
// time you pass just the raw code as a "text" parameter on a "url" button.
export function buildOtpTemplate(otp: string) {
  return {
    ...WHATSAPP_TEMPLATES.OTP,
    components: [
      {
        type: "body" as const,
        parameters: [{ type: "text" as const, text: otp }],
      },
      {
        type: "button" as const,
        sub_type: "url" as const,
        index: "0",
        parameters: [{ type: "text" as const, text: otp }],
      },
    ],
  };
}

// menmai_broadcast_text — "Dear Customer, {{1}} Warmest Regards, Menmai Foods"
// + a static "Visit website" URL button (no {{}} in the URL, so no button
// parameters needed at send time).
export function buildBroadcastTextTemplate(message: string) {
  return {
    ...WHATSAPP_TEMPLATES.BROADCAST_TEXT,
    components: [
      {
        type: "body" as const,
        parameters: [{ type: "text" as const, text: message }],
      },
    ],
  };
}

// menmai_broadcast_image — same body as above, plus an IMAGE header that
// must be supplied at send time, and the same static "Visit website" button.
export function buildBroadcastImageTemplate(message: string, imageUrl: string) {
  return {
    ...WHATSAPP_TEMPLATES.BROADCAST_IMAGE,
    components: [
      {
        type: "header" as const,
        parameters: [{ type: "image" as const, image: { link: imageUrl } }],
      },
      {
        type: "body" as const,
        parameters: [{ type: "text" as const, text: message }],
      },
    ],
  };
}

/* ══════════════════════════════════════════════════════════
   LEGACY FREE-TEXT BUILDERS
   Keep these only for messages sent inside an open 24h session
   (e.g. replying to an inbound customer message). Do not use
   them to initiate contact in production.
   ══════════════════════════════════════════════════════════ */

export function buildCustomerOrderConfirmedMessage(order: OrderMessageData) {
  return [
    `Menmai Foods: Order confirmed`,
    ``,
    `Order: ${order.orderNumber}`,
    `Total: ${formatCurrency(order.totalAmount)}`,
    ``,
    `We have received your order and will keep you updated here.`,
  ].join("\n");
}

export function buildCustomerOutForDeliveryMessage(order: OrderMessageData) {
  return [
    `Menmai Foods: Out for delivery`,
    ``,
    `Order: ${order.orderNumber}`,
    `Your food is on the way.`,
  ].join("\n");
}

export function buildCustomerDeliveredMessage(order: OrderMessageData) {
  return [
    `Menmai Foods: Delivered`,
    ``,
    `Order: ${order.orderNumber}`,
    `Enjoy your food. Thank you for ordering from Menmai Foods.`,
  ].join("\n");
}

// export function buildCustomerReviewRequestMessage(order: OrderMessageData) {
//   return [
//     `How was your Menmai Foods order?`,
//     ``,
//     `Order: ${order.orderNumber}`,
//     `Please reply with your feedback. Your review helps us improve.`,
//   ].join("\n");
// }
export function buildCustomerReviewRequestMessage(
  order: OrderMessageData,
  reviewToken: string,
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.MENMAI_PUBLIC_BASE_URL ??
    "http://localhost:3000";

  const reviewUrl = `${baseUrl}/review/${reviewToken}`;

  return [
    `Menmai Foods ⭐ Share Your Feedback`,
    ``,
    `Hi ${order.customerName.split(" ")[0]}, thank you for your order!`,
    ``,
    `Tap the link below to leave your review (takes 30 seconds):`,
    ``,
    reviewUrl,
    ``,
    `— Team Menmai Foods 🙏`,
  ].join("\n");
}

export function buildAdminOrderMessage(order: OrderMessageData) {
  const items = order.items
    .map(
      (item) =>
        `- ${item.productName} x ${item.quantity} (${formatCurrency(item.totalPrice)})`,
    )
    .join("\n");

  return [
    `New Menmai Foods order`,
    ``,
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Total: ${formatCurrency(order.totalAmount)}`,
    ``,
    `Items:`,
    items,
    ``,
    `Address:`,
    order.deliveryAddress,
  ].join("\n");
}

export function adminOrderButtons(orderId: number) {
  return [
    {
      type: "reply" as const,
      reply: {
        id: `order:${orderId}:out_for_delivery`,
        title: "Out For Delivery",
      },
    },
    {
      type: "reply" as const,
      reply: {
        id: `order:${orderId}:delivered`,
        title: "Delivered",
      },
    },
  ];
}

export function parseAdminOrderAction(buttonId: string) {
  const match = /^order:(\d+):(out_for_delivery|delivered)$/.exec(buttonId);

  if (!match) {
    return null;
  }

  return {
    orderId: Number(match[1]),
    action: match[2] as "out_for_delivery" | "delivered",
  };
}
