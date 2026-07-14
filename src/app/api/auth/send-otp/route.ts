import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendTemplateMessage } from "@/lib/whatsapp/client";
import { buildOtpTemplate } from "@/lib/whatsapp/messages";

const RESEND_LIMIT = 3; // max "Resend OTP" clicks allowed (initial send is NOT one of these)
const COOLDOWN = 60 * 1000; // 60 sec between any send/resend
const RESET_WINDOW = 60 * 60 * 1000; // 1 hour — resendCount resets if lastSentAt is older than this
const OTP_EXPIRY_TIME = 1 * 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  try {
    const { mobile, isResend } = await req.json();
    const cleanMobile = (mobile || "").replace(/\s/g, "");

    // Default to `true` (i.e. "treat as a resend") when the flag is missing,
    // so any client that hasn't been updated yet falls on the stricter side
    // instead of silently getting unlimited free sends.
    const isResendRequest = isResend !== false;

    // 1. Validate mobile
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { message: "Invalid mobile number" },
        { status: 400 },
      );
    }

    const now = new Date();

    // 2. Get customer
    const customer = await prisma.customer.findUnique({
      where: { phone: cleanMobile },
    });

    // 3. Get OTP record
    const otpRecord = await prisma.oTPVerification.findUnique({
      where: { phone: cleanMobile },
    });

    let resendCount = otpRecord?.resendCount ?? 0;

    const lastSentAt = otpRecord?.lastSentAt
      ? new Date(otpRecord.lastSentAt)
      : null;

    // 4. Reset resendCount if it's been 1+ hour since the last send,
    // regardless of whether the limit was ever hit. This fixes the case
    // where a customer used 1-2 resends on day 1 and comes back later
    // to find their count still reduced — now ANY gap of 1hr+ clears it.
    const isStale =
      lastSentAt && now.getTime() - lastSentAt.getTime() >= RESET_WINDOW;

    if (isStale) {
      resendCount = 0;
    }

    // 5. Block check — only relevant if NOT stale (i.e. within the last hour)
    // and count has hit the limit.
    const isBlockActive = !isStale && resendCount >= RESEND_LIMIT;

    if (isBlockActive) {
      const blockedUntil = new Date(lastSentAt!.getTime() + RESET_WINDOW);
      return NextResponse.json(
        {
          message:
            "You've reached the maximum OTP limit. Please try again after 1 hour.",
          blockedUntil,
          remainingAttempts: 0,
        },
        { status: 429 },
      );
    }

    // 6. Cooldown check (60 sec) — applies to every send, initial or resend
    if (lastSentAt && now.getTime() - lastSentAt.getTime() < COOLDOWN) {
      const remainingSeconds = Math.ceil(
        (COOLDOWN - (now.getTime() - lastSentAt.getTime())) / 1000,
      );

      return NextResponse.json(
        {
          message: `Please wait ${remainingSeconds} seconds before retrying.`,
        },
        { status: 429 },
      );
    }

    // 7. Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

    // 8. Send WhatsApp OTP via the approved Authentication template
    try {
      const tpl = buildOtpTemplate(otp);
      await sendTemplateMessage(
        `91${cleanMobile}`,
        tpl.name,
        tpl.language,
        tpl.components,
      );
    } catch (err) {
      console.error("WhatsApp API Error:", err);

      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 500 },
      );
    }

    // 9. Only resends increment the counter. Initial sends leave it untouched.
    const updatedResendCount = isResendRequest ? resendCount + 1 : resendCount;

    await prisma.oTPVerification.upsert({
      where: { phone: cleanMobile },
      update: {
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: updatedResendCount,
        verified: false,
        customerId: customer?.id,
      },
      create: {
        phone: cleanMobile,
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: isResendRequest ? 1 : 0,
        verified: false,
        customerId: customer?.id,
      },
    });

    // 10. Response
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      isResend: isResendRequest,
      resendCount: updatedResendCount,
      remainingAttempts: Math.max(RESEND_LIMIT - updatedResendCount, 0),
      resendCooldown: 60,
    });
  } catch (error) {
    console.error("OTP API Error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
