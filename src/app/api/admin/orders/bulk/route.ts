// src/app/api/admin/orders/bulk/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCutoff } from "@/lib/date-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range");

  const cutoff = getCutoff(range);

  const orders = await prisma.bulkOrder.findMany({
    where: cutoff ? { createdAt: { gte: cutoff } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          Product: { select: { name: true } },
        },
      },
    },
  });

  const data = orders.map((o) => {
    const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      id:       `#BLK-${String(o.id).padStart(4, "0")}`,
      customer: o.customerName,
      phone:    o.phone,
      items:    o.items.map((i) => `${i.Product.name} × ${i.quantity}`).join(", ") || "—",
      quantity: `${totalQty} pcs`,
      amount: `₹${o.estimatedTotal.toLocaleString("en-IN")}`,
      status:   o.status,   // PENDING | QUOTED | CONFIRMED | DELIVERED | CANCELLED
      date:     o.createdAt,
    };
  });

  return NextResponse.json(data);
}