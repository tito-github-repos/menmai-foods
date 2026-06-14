// File location: src/app/api/admin/customers/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        // Get all orders to compute totalOrders, lastOrderDate, totalSpent
        Order: {
          select: {
            totalAmount: true,
            orderedAt:   true,
            orderStatus: true,
          },
          orderBy: { orderedAt: "desc" },
        },
        // Get the default address (or first address if no default)
        CustomerAddress: {
          select: {
            fullAddress: true,
            area:        true,
            city:        true,
            pincode:     true,
            isDefault:   true,
          },
          orderBy: { isDefault: "desc" }, // default address comes first
          take: 1,
        },
      },
    });

    const data = customers.map((c) => {
      // Build address string from the first (default) address
      const addr = c.CustomerAddress[0];
      const address = addr
        ? [addr.fullAddress, addr.area, addr.city, addr.pincode]
            .filter(Boolean)
            .join(", ")
        : "—";

      // Exclude cancelled/expired/abandoned from spent total
      const validOrders = c.Order.filter(
        (o) => !["CANCELLED", "EXPIRED", "ABANDONED"].includes(o.orderStatus)
      );

      const totalOrders  = c.Order.length;
      const totalSpent   = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      // Last order date = most recent orderedAt (orders are already desc sorted)
      const lastOrderDate = c.Order[0]?.orderedAt?.toISOString() ?? null;

      return {
        id:            c.id,
        name:          c.fullName,
        phone:         c.phone,
        email:         c.email ?? null,
        totalOrders,
        lastOrderDate,
        totalSpent,
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
