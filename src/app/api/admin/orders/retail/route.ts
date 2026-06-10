// src/app/api/admin/orders/retail/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCutoff } from "@/lib/date-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range"); // 24h | 7d | 30d | 3m | all

  const cutoff = getCutoff(range);

  const orders = await prisma.order.findMany({
    where: cutoff ? { orderedAt: { gte: cutoff } } : undefined,
    orderBy: { orderedAt: "desc" },
    include: {
      Customer: {
        select: { fullName: true, phone: true },
      },
      OrderItem: {
        select: { productName: true, quantity: true },
      },
    },
  });

  const data = orders.map((o) => ({
    id:       `#${o.orderNumber}`,
    customer: o.Customer.fullName,
    phone:    o.Customer.phone,
    items:    o.OrderItem.map((i) => `${i.productName} × ${i.quantity}`).join(", "),
    amount:   `₹${o.totalAmount.toLocaleString("en-IN")}`,
    status:   o.orderStatus,   // PENDING | CONFIRMED | PREPARING | SHIPPED | DELIVERED | CANCELLED
    date:     o.orderedAt,
  }));

  return NextResponse.json(data);
}