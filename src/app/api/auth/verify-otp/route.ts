import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { mobile, otp } = await req.json();

  // 1. Validate input
  if (!mobile || !otp) {
    return NextResponse.json(
      { message: "Mobile and OTP are required" },
      { status: 400 },
    );
  }

  // 2. Fetch OTP record (NEW: use findUnique because phone is unique)
  const record = await prisma.oTPVerification.findUnique({
    where: { phone: mobile },
  });

  if (!record) {
    return NextResponse.json(
      { message: "OTP not found. Please resend." },
      { status: 400 },
    );
  }

  // 3. Check if already verified
  if (record.verified) {
    return NextResponse.json(
      { message: "OTP already verified" },
      { status: 400 },
    );
  }

  // 4. Check expiry
  if (new Date() > record.expiresAt) {
    return NextResponse.json(
      { message: "OTP expired. Please resend." },
      { status: 400 },
    );
  }

  // 5. Check OTP match
  if (record.otpCode !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP. Try again." },
      { status: 400 },
    );
  }

  // 6. Find or create customer
  let customer = await prisma.customer.findUnique({
    where: { phone: mobile },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        phone: mobile,
        fullName: "",
        isPhoneVerified: true,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.customer.update({
      where: { phone: mobile },
      data: {
        isPhoneVerified: true,
      },
    });
  }

  // 7. Mark OTP as verified
  await prisma.oTPVerification.update({
    where: { phone: mobile },
    data: {
      verified: true,
    },
  });

  // 8. Fetch default / latest address
  const existingAddress = await prisma.customerAddress.findFirst({
    where: { customerId: customer.id },
    orderBy: { isDefault: "desc" },
  });

  // 9. Generate JWT
  const token = jwt.sign(
    {
      customerId: customer.id,
      phone: mobile,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  // 10. Response
  return NextResponse.json({
    success: true,
    token,
    customerId: customer.id,
    existingAddress: existingAddress
      ? {
          fullAddress: existingAddress.fullAddress,
          city: existingAddress.city,
          pincode: existingAddress.pincode,
          fullName: customer.fullName || "",
          email: customer.email || "",
        }
      : null,
  });
}
