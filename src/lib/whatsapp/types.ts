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

export type WhatsAppSendMessageRequest =
  | WhatsAppTextMessageRequest
  | WhatsAppInteractiveMessageRequest;

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
