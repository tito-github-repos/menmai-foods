// File location: src/app/api/admin/orders/retail/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDateFilter(
  range: string | null,
  startDateParam: string | null,
  endDateParam: string | null
): { gte?: Date; lte?: Date } | null {
  if (range === "custom") {
    const start = startDateParam ? new Date(startDateParam) : null;
    const end   = endDateParam ? new Date(endDateParam) : null;

    const filter: { gte?: Date; lte?: Date } = {};
    if (start && !isNaN(start.getTime())) filter.gte = start;
    if (end && !isNaN(end.getTime())) filter.lte = end;

    // If both dates were missing/invalid, treat it as no filter rather than
    // silently matching everything with an empty {} object.
    return Object.keys(filter).length > 0 ? filter : null;
  }

  if (!range || range === "all") return null;

  const now = new Date();
  switch (range) {
    case "24h": return { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
    case "7d":  return { gte: new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000) };
    case "30d": return { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    case "3m":  return { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
    default:    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range      = searchParams.get("range");
    const startDate  = searchParams.get("startDate");
    const endDate    = searchParams.get("endDate");

    const dateFilter = getDateFilter(range, startDate, endDate);

    const orders = await prisma.order.findMany({
      where: dateFilter ? { orderedAt: dateFilter } : undefined,
      orderBy: { orderedAt: "desc" },
      include: {
        Customer: {
          select: { fullName: true, phone: true },
        },
        CustomerAddress: {
          select: { fullAddress: true, area: true, city: true, pincode: true },
        },
        OrderItem: {
          select: { productName: true, quantity: true },
        },
        // Payment is a one-to-one optional relation on Order
        Payment: {
          select: { razorpayPaymentId: true, paymentStatus: true },
        },
      },
    });

    const data = orders.map((o) => {
      const addr = o.CustomerAddress;
      const address = [addr.fullAddress, addr.area, addr.city, addr.pincode]
        .filter(Boolean)
        .join(", ");

      return {
        id:            `#${o.orderNumber}`,
        customer:      o.Customer.fullName,
        phone:         o.Customer.phone,
        items:         o.OrderItem.map((i) => `${i.productName} × ${i.quantity}`).join(", ") || "—",
        amount:        `₹${o.totalAmount.toLocaleString("en-IN")}`,
        paymentId:     o.Payment?.razorpayPaymentId ?? "—",
        address,
        orderStatus:   o.orderStatus,
        paymentStatus: o.Payment?.paymentStatus ?? o.paymentStatus,
        date:          o.orderedAt.toISOString(),
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/admin/orders/retail] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch retail orders", detail: String(error) },
      { status: 500 }
    );
  }
}
