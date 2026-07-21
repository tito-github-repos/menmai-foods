// File location: src/app/api/admin/customers/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        Order: {
          select: {
            totalAmount:   true,
            orderedAt:     true,
            updatedAt:     true,
            paymentStatus: true,
          },
          orderBy: { updatedAt: "desc" }, // most recently updated order first
        },
        CustomerAddress: {
          select: {
            fullAddress: true,
            area:        true,
            city:        true,
            pincode:     true,
            isDefault:   true,
          },
          orderBy: { isDefault: "desc" },
          take: 1,
        },
      },
    });

    const data = customers.map((c) => {
      const addr = c.CustomerAddress[0];
      const address = addr
        ? [addr.fullAddress, addr.area, addr.city, addr.pincode]
            .filter(Boolean)
            .join(", ")
        : "—";

      // Only orders that were actually PAID — pending/failed/refunded never count
      const paidOrders = c.Order.filter((o) => o.paymentStatus === "PAID");

      const totalOrders = paidOrders.length;
      const totalSpent  = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // paidOrders[0] is the PAID order with the most recent updatedAt
      // (c.Order was pre-sorted desc by updatedAt), so this reflects
      // whichever paid order last had any change — including a payment
      // confirmation that landed after the original orderedAt.
      const lastOrderDate = paidOrders[0]?.updatedAt?.toISOString() ?? null;

      return {
        id: c.id,
        name: c.fullName,
        phone: c.phone,
        email: c.email ?? null,
        totalOrders,   // 0 if the customer has never completed a paid order
        lastOrderDate, // null if never paid — frontend shows "—"
        totalSpent,    // 0 if never paid — frontend shows "—"
        address,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/admin/customers] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", detail: String(error) },
      { status: 500 }
    );
  }
}