import { NextResponse } from "next/server";
import {
  handleInboundWhatsAppMessage,
  handleWhatsAppStatusEvent,
} from "@/lib/orders/whatsapp-workflow";

import { prisma } from "@/lib/prisma";
import type { WhatsAppWebhookPayload } from "@/lib/whatsapp/types";

/* ---------------------------------------
   VERIFY WEBHOOK (META)
---------------------------------------- */

export async function GET(request: Request) {
  const url = new URL(request.url);

  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

/* ---------------------------------------
   MAIN WEBHOOK HANDLER
---------------------------------------- */

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WhatsAppWebhookPayload;

    const results: unknown[] = [];

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== "messages") continue;

        /* ------------------------------
           INBOUND MESSAGES
        ------------------------------ */
        for (const message of change.value.messages ?? []) {
          const messageId = message.id;

          // 🚨 IDENTITY CHECK (IDEMPOTENCY)
          const exists = await prisma.whatsAppLog.findFirst({
            where: { messageId },
          });

          if (exists) {
            results.push({
              skipped: true,
              reason: "Duplicate message",
              messageId,
            });
            continue;
          }

          try {
            const result = await handleInboundWhatsAppMessage(message);
            results.push(result);
          } catch (err) {
            results.push({
              error: true,
              messageId,
              err,
            });
          }
        }

        /* ------------------------------
           STATUS EVENTS
        ------------------------------ */
        for (const status of change.value.statuses ?? []) {
          const statusId = status.id;

          const exists = await prisma.whatsAppLog.findFirst({
            where: { messageId: statusId },
          });

          if (exists) {
            results.push({
              skipped: true,
              reason: "Duplicate status",
              statusId,
            });
            continue;
          }

          try {
            const result = await handleWhatsAppStatusEvent(status);
            results.push(result);
          } catch (err) {
            results.push({
              error: true,
              statusId,
              err,
            });
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook processing failed",
      },
      { status: 500 },
    );
  }
}