import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendTextMessage } from "@/lib/whatsapp/client";

const OTP_LIMIT = 5;
const COOLDOWN = 60 * 1000; // 60 sec
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const OTP_EXPIRY_TIME = 1 * 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();
    const cleanMobile = (mobile || "").replace(/\s/g, "");

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

    const count = otpRecord?.resendCount ?? 0;

    const lastSentAt = otpRecord?.lastSentAt
      ? new Date(otpRecord.lastSentAt)
      : null;

    const windowStart = otpRecord?.otpWindowStart
      ? new Date(otpRecord.otpWindowStart)
      : now;

    // 4. Check window expiry (24h reset)
    const isWindowExpired =
      otpRecord?.otpWindowStart &&
      now.getTime() - windowStart.getTime() >= WINDOW;

    const effectiveCount = isWindowExpired ? 0 : count;
    const effectiveWindowStart = isWindowExpired ? now : windowStart;

    // 5. Limit check
    if (effectiveCount >= OTP_LIMIT) {
      const nextAvailableAt = new Date(effectiveWindowStart.getTime() + WINDOW);

      return NextResponse.json(
        {
          message: "Maximum OTP limit reached. Try after 24 hours.",
          nextAvailableAt,
        },
        { status: 429 },
      );
    }

    // 6. Cooldown check (60 sec)
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

    // 8. Send WhatsApp OTP
    try {
      await sendTextMessage(
        `91${cleanMobile}`,
        `Menmai Foods Verification\n\nYour OTP is: ${otp}\n\nThis OTP is valid for 1 minute.\nDo not share this OTP with anyone.`,
      );
    } catch (err) {
      console.error("WhatsApp API Error:", err);

      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 500 },
      );
    }

    // 9. FIXED COUNT LOGIC (IMPORTANT FIX)
    const resetCount = isWindowExpired ? 1 : count + 1;

    await prisma.oTPVerification.upsert({
      where: { phone: cleanMobile },
      update: {
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: resetCount,
        otpWindowStart: effectiveWindowStart,
        verified: false,
        customerId: customer?.id,
      },
      create: {
        phone: cleanMobile,
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: 1,
        otpWindowStart: now,
        verified: false,
        customerId: customer?.id,
      },
    });

    // 10. Response
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      resendCount: resetCount,
      remainingAttempts: OTP_LIMIT - resetCount,
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
