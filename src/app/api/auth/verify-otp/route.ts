import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { mobile, otp } = await req.json();

  // 1. Find OTP record
  const record = await prisma.oTPVerification.findFirst({
    where: {
      phone: mobile,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return NextResponse.json(
      { message: "OTP not found. Please resend." },
      { status: 400 },
    );
  }

  // 2. Check expiry
  if (new Date() > record.expiresAt) {
    await prisma.oTPVerification.delete({ where: { id: record.id } });
    return NextResponse.json(
      { message: "OTP expired. Please resend." },
      { status: 400 },
    );
  }

  // 3. Check OTP match
  if (record.otpCode !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP. Try again." },
      { status: 400 },
    );
  }

  // 4. Mark as verified
  await prisma.oTPVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  // 5. Create or fetch customer
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
      data: { isPhoneVerified: true },
    });
  }

  // 6. Fetch most recent default address if exists
  const existingAddress = await prisma.customerAddress.findFirst({
    where: { customerId: customer.id },
    orderBy: { isDefault: "desc" },
  });

  const token = jwt.sign(
    {
      customerId: customer.id,
      phone: mobile,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }, 
  );

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
