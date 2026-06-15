import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendTextMessage } from "@/lib/whatsapp/client";

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();

  // 1. Validate mobile number
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json(
      { message: "Invalid mobile number" },
      { status: 400 },
    );
  }

  // 2. Check if customer exists
  const customer = await prisma.customer.findUnique({
    where: { phone: mobile },
  });

  // 3. Get existing OTP record
  const existingOtp = await prisma.oTPVerification.findUnique({
    where: { phone: mobile },
  });

  let currentCount = existingOtp?.resendCount ?? 0;

  // 4. Reset resend count
  if (currentCount >= 5 && existingOtp?.lastSentAt) {
    const blockUntil = new Date(
      new Date(existingOtp.lastSentAt).getTime() + 60 * 60 * 1000,
    );

    if (blockUntil > new Date()) {
      return NextResponse.json(
        {
          message: "Maximum OTP limit reached. Please try again after 1 hour.",
        },
        { status: 429 },
      );
    }

    currentCount = 0;
  }

  // 5. Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // OTP valid for 5 minutes
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  // For local testing
  console.log(`OTP for ${mobile}: ${otp}`);

  // 6. Save / Update OTP
  await prisma.oTPVerification.upsert({
    where: { phone: mobile },

    update: {
      otpCode: otp,
      expiresAt: expiry,
      lastSentAt: new Date(),
      resendCount: {
        increment: 1,
      },
      verified: false,
      customerId: customer?.id,
    },

    create: {
      phone: mobile,
      otpCode: otp,
      expiresAt: expiry,
      lastSentAt: new Date(),
      resendCount: 1,
      verified: false,
      customerId: customer?.id,
    },
  });

  // 7. Send OTP via WhatsApp only
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
}
