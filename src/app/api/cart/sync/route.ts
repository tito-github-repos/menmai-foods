import { prisma } from "@/lib/db";
import { verifyToken, unauthorized } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return unauthorized();
  }

  const { items } = await req.json();

  if (!items || items.length === 0) {
    await prisma.cartItem.deleteMany({
      where: { customerId: user.customerId },
    });

    return NextResponse.json({ success: true });
  }

  const productIds = items.map((item: any) => item.productId);

  await prisma.$transaction(async (tx) => {
    // remove deleted items
    await tx.cartItem.deleteMany({
      where: {
        customerId: user.customerId,
        productId: { notIn: productIds },
      },
    });

    // upsert current items safely
    for (const item of items) {
      await tx.cartItem.upsert({
        where: {
          customerId_productId: {
            customerId: user.customerId,
            productId: item.productId,
          },
        },
        update: {
          quantity: item.quantity,
          updatedAt: new Date(),
        },
        create: {
          customerId: user.customerId,
          productId: item.productId,
          quantity: item.quantity,
          updatedAt: new Date(),
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}