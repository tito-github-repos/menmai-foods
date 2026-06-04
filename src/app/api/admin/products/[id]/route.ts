import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await db.product.update({
    where: { id: Number(params.id) },
    data: {
      price:             body.price,
      mrp:               body.mrp,
      netWeight:         body.netWeight,
      pieces:            body.pieces,
      stockQuantity:     body.stockQuantity,
      isActive:          body.isActive,
      bulkPricePerPiece: body.bulkPricePerPiece,
    },
  });

  return NextResponse.json(updated);
}