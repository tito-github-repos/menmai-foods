// File location: src/app/api/admin/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      todayBulkOrders,
      todayRetailOrders,
      bulkRevResult,
      retailRevResult,
      totalCustomers,
    ] = await Promise.all([
      // BulkOrder uses createdAt
      prisma.bulkOrder.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      // Order uses orderedAt
      prisma.order.count({
        where: { orderedAt: { gte: todayStart, lte: todayEnd } },
      }),
      // BulkOrder revenue: sum estimatedTotal (schema has no totalAmount)
      prisma.bulkOrder.aggregate({
        _sum: { estimatedTotal: true },
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
          status: { notIn: ["REJECTED"] },
        },
      }),
      // Order revenue: sum totalAmount, exclude cancelled/expired/abandoned
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          orderedAt: { gte: todayStart, lte: todayEnd },
          orderStatus: { notIn: ["CANCELLED", "EXPIRED", "ABANDONED"] },
        },
      }),
      prisma.customer.count(),
    ]);

    const todayRevenue =
      (bulkRevResult._sum.estimatedTotal ?? 0) +
      (retailRevResult._sum.totalAmount  ?? 0);

    return NextResponse.json({
      todayBulkOrders,
      todayRetailOrders,
      todayRevenue,
      totalCustomers,
    });
  } catch (error) {
    console.error("[dashboard/stats] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", detail: String(error) },
      { status: 500 }
    );
  }
}
