import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendTextMessage } from "@/lib/whatsapp/client";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    // 1. Validate mobile number
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { message: "Invalid mobile number" },
        { status: 400 },
      );
    }

    const now = new Date();

    // 2. Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { phone: mobile },
    });

    // 3. Get existing OTP record
    const existingOtp = await prisma.oTPVerification.findUnique({
      where: { phone: mobile },
    });

    let currentCount = existingOtp?.resendCount ?? 0;
    let windowStart = existingOtp?.otpWindowStart ?? now;

    // 4. Reset 24-hour window if expired
    if (
      existingOtp?.otpWindowStart &&
      now.getTime() - new Date(existingOtp.otpWindowStart).getTime() >=
        24 * 60 * 60 * 1000
    ) {
      currentCount = 0;
      windowStart = now;
    }

    // 5. Check daily OTP limit
    if (currentCount >= 5) {
      const nextAvailableTime = new Date(
        new Date(windowStart).getTime() + 24 * 60 * 60 * 1000,
      );

      return NextResponse.json(
        {
          message:
            "Maximum OTP limit reached. Please try again after 24 hours.",
          nextAvailableAt: nextAvailableTime,
        },
        { status: 429 },
      );
    }

    // 6. 30-second resend cooldown
    if (
      existingOtp?.lastSentAt &&
      now.getTime() - new Date(existingOtp.lastSentAt).getTime() < 30 * 1000
    ) {
      const remainingSeconds = Math.ceil(
        (30 * 1000 -
          (now.getTime() - new Date(existingOtp.lastSentAt).getTime())) /
          1000,
      );

      return NextResponse.json(
        {
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        },
        { status: 429 },
      );
    }

    // 7. Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // OTP valid for 5 minutes
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // 8. Save / Update OTP
    await prisma.oTPVerification.upsert({
      where: { phone: mobile },

      update: {
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: currentCount + 1,
        otpWindowStart: windowStart,
        verified: false,
        customerId: customer?.id,
      },

      create: {
        phone: mobile,
        otpCode: otp,
        expiresAt: expiry,
        lastSentAt: now,
        resendCount: 1,
        otpWindowStart: now,
        verified: false,
        customerId: customer?.id,
      },
    });

    // 9. Send OTP via WhatsApp
    try {
      await sendTextMessage(
        `91${mobile}`,
        `Menmai Foods Verification\n\nYour OTP is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nDo not share this OTP with anyone.`,
      );
    } catch (error) {
      console.error("WhatsApp OTP Send Error:", error);

      return NextResponse.json(
        {
          message: "Failed to send OTP via WhatsApp",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent via WhatsApp",
      resendCount: currentCount + 1,
      remainingAttempts: 5 - (currentCount + 1),
      resendCooldown: 30,
    });
  } catch (error) {
    console.error("OTP API Error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
