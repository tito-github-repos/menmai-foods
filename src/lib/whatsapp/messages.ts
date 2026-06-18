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
