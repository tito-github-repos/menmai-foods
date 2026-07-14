// File location: src/app/api/admin/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Order_paymentStatus } from "@/generated/prisma";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Retail orders count as "today's" when PAID and either placed today
    // OR updated today (covers retry-payment-next-day scenarios).
    const retailTodayWhere = {
      paymentStatus: Order_paymentStatus.PAID,
      OR: [
        { orderedAt: { gte: todayStart, lte: todayEnd } },
        { updatedAt: { gte: todayStart, lte: todayEnd } },
      ],
    };

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
      // Order: same condition as retail-orders table (PAID + ordered/updated today)
      prisma.order.count({
        where: retailTodayWhere,
      }),
      // BulkOrder revenue: sum estimatedTotal (schema has no totalAmount)
      prisma.bulkOrder.aggregate({
        _sum: { estimatedTotal: true },
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
          status: { notIn: ["REJECTED"] },
        },
      }),
      // Order revenue: sum totalAmount for the same PAID + today set
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: retailTodayWhere,
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