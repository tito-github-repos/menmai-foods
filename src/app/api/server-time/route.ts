// src/app/api/server-time/route.ts

import { getISTDateTime, isAfterCutoff } from "@/lib/retailDeliveryTime";
import { NextResponse } from "next/server";

export async function GET() {
  const ist = getISTDateTime();

  return NextResponse.json({
    hour: ist.getHours(),
    minute: ist.getMinutes(),
    isAfterCutoff: isAfterCutoff(),
  });
}