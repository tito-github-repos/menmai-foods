import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mrp: p.mrp,
      netWeight: p.netWeight,
      pieces: p.pieces,
      imageUrl: p.imageUrl ?? "",
      bulkPricePerPiece: p.bulkPricePerPiece ?? null,
      isActive: p.isActive,
      stockQuantity: p.stockQuantity,
    })),
  );
}