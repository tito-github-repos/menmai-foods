import type {
  WhatsAppInteractiveButton,
  WhatsAppSendMessageRequest,
  WhatsAppSendMessageResponse,
} from "./types";

const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v24.0";

function getWhatsAppUrl() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!phoneNumberId) {
    throw new Error("Missing WHATSAPP_PHONE_NUMBER_ID");
  }

  return `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
}

function getAccessToken() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing WHATSAPP_ACCESS_TOKEN");
  }

  return accessToken;
}

export async function sendWhatsAppMessage(
  payload: WhatsAppSendMessageRequest,
): Promise<WhatsAppSendMessageResponse> {
  const response = await fetch(getWhatsAppUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as WhatsAppSendMessageResponse;

  if (!response.ok) {
    throw new Error(
      `WhatsApp API failed: ${data.error?.message ?? response.statusText}`,
    );
  }

  return data;
}

export async function sendTextMessage(to: string, body: string) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: {
      preview_url: false,
      body,
    },
  });
}

export async function sendButtonMessage(args: {
  to: string;
  header?: string;
  body: string;
  footer?: string;
  buttons: WhatsAppInteractiveButton[];
}) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to: args.to,
    type: "interactive",
    interactive: {
      type: "button",
      ...(args.header
        ? {
            header: {
              type: "text",
              text: args.header,
            },
          }
        : {}),
      body: {
        text: args.body,
      },
      ...(args.footer ? { footer: { text: args.footer } } : {}),
      action: {
        buttons: args.buttons,
      },
    },
  });
}
