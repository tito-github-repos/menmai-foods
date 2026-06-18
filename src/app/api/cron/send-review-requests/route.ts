import { NextResponse } from "next/server";
import { sendDueReviewRequests } from "@/lib/orders/whatsapp-workflow";

function isAuthorized(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[send-review-requests] Missing CRON_SECRET");
    return false;
  }

  return auth === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDueReviewRequests();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}
