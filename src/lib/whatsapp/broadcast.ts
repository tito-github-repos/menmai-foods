import { sendWhatsAppMessage, sendTemplateMessage, formatPhoneNumber } from "./client";
import type { WhatsAppTemplateComponent } from "./types";

// LEGACY — free-form send, only usable inside an open 24h session.
// Broadcasts to customers outside that window must use
// sendBroadcastTemplateMessage() below instead.
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

// LEGACY — free-form send, only usable inside an open 24h session.
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

/**
 * Send a broadcast using your verified `menmai_broadcast_text` /
 * `menmai_broadcast_image` MARKETING templates. Build the component
 * payload with buildBroadcastTextTemplate() / buildBroadcastImageTemplate()
 * from messages.ts, then pass it here.
 */
export async function sendBroadcastTemplateMessage(
  phone: string,
  templateName: string,
  languageCode: string,
  components?: WhatsAppTemplateComponent[],
) {
  return sendTemplateMessage(phone, templateName, languageCode, components);
}