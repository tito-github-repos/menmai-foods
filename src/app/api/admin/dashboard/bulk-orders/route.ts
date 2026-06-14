// app/api/admin/dashboard/bulk-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client import

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10));
    const skip  = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const where = { createdAt: { gte: todayStart, lte: todayEnd } };

    const [rawOrders, total] = await Promise.all([
      prisma.bulkOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          BulkOrderItem: {
            include: { Product: { select: { name: true } } },
          },
        },
      }),
      prisma.bulkOrder.count({ where }),
    ]);

    const orders = rawOrders.map((order) => {
      // Build readable items string, e.g. "Chapathi × 20"
      const items = order.BulkOrderItem.map(
        (i) => `${i.Product.name} × ${i.quantity}`
      ).join(", ") || "Custom bulk order";

      // Combine address fields
      const address = [order.deliveryAddress, order.pincode]
        .filter(Boolean)
        .join(", ");

      return {
        id: order.id,
        fullName: order.fullName,
        phone: order.phone,
        email: order.email ?? null,
        items,
        totalAmount: order.totalAmount,
        status: order.status,
        address,
        deliveryDate: order.deliveryDate.toISOString(),
        createdAt: order.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("[dashboard/bulk-orders]", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk orders" },
      { status: 500 }
    );
  }
}
