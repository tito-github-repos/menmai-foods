import { sendWhatsAppMessage, formatPhoneNumber } from "./client";

export async function sendBroadcastImageMessage(
  phone: string,
  message: string,
  imageUrl: string,
) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to: formatPhoneNumber(phone),
    type: "image",
    image: {
      link: imageUrl,
      caption: message,
    },
  });
}

export async function sendBroadcastTextMessage(
  phone: string,
  message: string,
) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to: formatPhoneNumber(phone),
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  });
}