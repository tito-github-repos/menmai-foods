import { unauthorized, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth) return unauthorized();

  const { fullName, email, address, city, pincode } = await req.json();

  const customerId = auth.customerId;

  // 1. Update customer name and email
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      fullName,
      email: email || null,
      updatedAt: new Date(),
    },
  });

  // 2. Save address
  const savedAddress = await prisma.customerAddress.create({
    data: {
      customerId,
      fullAddress: address,
      city,
      pincode,
      isDefault: true,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    addressId: savedAddress.id,
  });
}
