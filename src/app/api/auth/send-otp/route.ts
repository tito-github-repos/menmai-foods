import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();

  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json(
      { message: "Invalid mobile number" },
      { status: 400 }
    );
  }

  // 1. Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  // 2. Delete existing OTP for this phone
  await prisma.oTPVerification.deleteMany({
    where: { phone: mobile },
  });

  // 3. Save new OTP in DB
  await prisma.oTPVerification.create({
    data: {
      phone: mobile,
      otpCode: otp,
      expiresAt: expiry,
      verified: false,
    },
  });

  // 4. Send SMS
  console.log(`OTP for ${mobile}: ${otp}`); // keep this for dev testing

  const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variables_values: otp,
      route: "otp",
      numbers: mobile,
    }),
  });

  const smsData = await smsRes.json();
  console.log("Fast2SMS response:", smsData);

  return NextResponse.json({ success: true });
}