import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise added
) {
  const { id } = await params;  // ← await params
  const body = await req.json();

  const updated = await db.product.update({
    where: { id: Number(id) },  // ← use id directly
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