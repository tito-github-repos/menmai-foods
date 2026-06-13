import { unauthorized, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = verifyToken(req);

  if (!auth) {
    return unauthorized();
  }

  const { fullName, email, address, city, pincode } = await req.json();

  const customerId = auth.customerId;

  // 1. Update customer details
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      fullName,
      email: email || null,
      updatedAt: new Date(),
    },
  });

  // 2. Check if default address already exists
  const existingAddress = await prisma.customerAddress.findFirst({
    where: {
      customerId,
      isDefault: true,
    },
  });

  let savedAddress;

  // 3. Update existing address
  if (existingAddress) {
    savedAddress = await prisma.customerAddress.update({
      where: {
        id: existingAddress.id,
      },
      data: {
        fullAddress: address,
        city,
        pincode,
        updatedAt: new Date(),
      },
    });
  }
  // 4. Create first address
  else {
    savedAddress = await prisma.customerAddress.create({
      data: {
        customerId,
        fullAddress: address,
        city,
        pincode,
        isDefault: true,
        updatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({
    success: true,
    addressId: savedAddress.id,
  });
}
