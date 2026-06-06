import { NextResponse } from "next/server";
import { sendDueReviewRequests } from "@/lib/orders/whatsapp-workflow";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const result = await sendDueReviewRequests();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
