import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { id: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const response = products.map((p: ProductWithImages) => ({
    ...p,
    // read-only — just display, admin cannot change this
    imageUrl: p.images[0]?.imageUrl ?? p.imageUrl,
    // not in schema yet — safe defaults
    bulkStockQuantity: 0,
    bulkIsActive: true,
    minBulkQty: 200,
  }));

  return NextResponse.json(response);
}