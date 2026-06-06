import { NextResponse } from "next/server";
import { sendTextMessage } from "@/lib/whatsapp/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      to?: string;
      message?: string;
    };

    if (!body.to) {
      return NextResponse.json(
        { error: "Missing `to` phone number" },
        { status: 400 },
      );
    }

    console.log("Sending WhatsApp test message to:", body.to);

    const response = await sendTextMessage(
      body.to,
      body.message ?? "Menmai Foods WhatsApp Cloud API test message.",
    );

    console.log("WhatsApp API response:", response);

    return NextResponse.json({
      ok: true,
      response,
    });
  } catch (error) {
    console.error("WhatsApp send-test error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}