export type WhatsAppTextMessageRequest = {
  messaging_product: "whatsapp";
  to: string;
  type: "text";
  text: {
    preview_url?: boolean;
    body: string;
  };
};

export type WhatsAppInteractiveButton = {
  type: "reply";
  reply: {
    id: string;
    title: string;
  };
};

export type WhatsAppInteractiveMessageRequest = {
  messaging_product: "whatsapp";
  to: string;
  type: "interactive";
  interactive: {
    type: "button";
    header?: {
      type: "text";
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      buttons: WhatsAppInteractiveButton[];
    };
  };
};

export type WhatsAppImageMessageRequest = {
  messaging_product: "whatsapp";
  to: string;
  type: "image";
  image: {
    link: string;
    caption?: string;
  };
};

/* ── TEMPLATE MESSAGES (Meta-approved) ── */

export type WhatsAppTemplateParameter =
  | { type: "text"; text: string }
  | {
      type: "currency";
      currency: { fallback_value: string; code: string; amount_1000: number };
    }
  | { type: "date_time"; date_time: { fallback_value: string } }
  | { type: "image"; image: { link: string } }
  | { type: "payload"; payload: string };

export type WhatsAppTemplateComponent = {
  type: "header" | "body" | "button";
  sub_type?: "quick_reply" | "url";
  index?: string; // required when type is "button"
  parameters: WhatsAppTemplateParameter[];
};

export type WhatsAppTemplateMessageRequest = {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: {
    name: string;
    language: { code: string }; // must exactly match the language on the approved template
    components?: WhatsAppTemplateComponent[];
  };
};

export type WhatsAppSendMessageRequest =
  | WhatsAppTextMessageRequest
  | WhatsAppInteractiveMessageRequest
  | WhatsAppImageMessageRequest
  | WhatsAppTemplateMessageRequest;

export type WhatsAppSendMessageResponse = {
  messaging_product: "whatsapp";
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  messages?: Array<{
    id: string;
  }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
};

export type WhatsAppWebhookPayload = {
  object: "whatsapp_business_account";
  entry: Array<{
    id: string;
    changes: Array<{
      field: "messages";
      value: {
        messaging_product: "whatsapp";
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppInboundMessage[];
        statuses?: WhatsAppStatusEvent[];
      };
    }>;
  }>;
};

export type WhatsAppInboundMessage = {
  from: string;
  id: string;
  timestamp: string;
  type: "text" | "interactive" | "button" | string;
  text?: {
    body: string;
  };
  interactive?: {
    type: "button_reply";
    button_reply?: {
      id: string;
      title: string;
    };
  };
  button?: {
    payload: string;
    text: string;
  };
};

export type WhatsAppStatusEvent = {
  id: string;
  status: "sent" | "delivered" | "read" | "failed" | string;
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message?: string;
    error_data?: {
      details: string;
    };
  }>;
};
