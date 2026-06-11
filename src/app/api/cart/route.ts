import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return unauthorized();
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      customerId: user.customerId,
    },
    include: {
      Product: {
        include: {
          images: true,
        },
      },
    },
  });

  const items = cartItems.map((item) => ({
    productId: item.Product.id,
    slug: item.Product.slug,
    name: item.Product.name,
    packLabel: item.Product.netWeight || "",
    pieces: item.Product.pieces || 0,
    mrp: item.Product.mrp || 0,
    price: item.Product.price,
    quantity: item.quantity,
    img: item.Product.images?.[0]?.imageUrl || item.Product.imageUrl || "",
  }));

  return NextResponse.json({
    success: true,
    items,
  });
}
