import { NextResponse } from "next/server";
import {
  handleInboundWhatsAppMessage,
  handleWhatsAppStatusEvent,
} from "@/lib/orders/whatsapp-workflow";
import type { WhatsAppWebhookPayload } from "@/lib/whatsapp/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", {
      status: 200,
    });
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as WhatsAppWebhookPayload;
  const results: unknown[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") {
        continue;
      }

      for (const message of change.value.messages ?? []) {
        results.push(await handleInboundWhatsAppMessage(message));
      }

      for (const status of change.value.statuses ?? []) {
        results.push(await handleWhatsAppStatusEvent(status));
      }
    }
  }

  return NextResponse.json({
    ok: true,
    results,
  });
}
