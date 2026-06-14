// app/api/admin/dashboard/stats/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's bulk order count
    const todayBulkOrders = await prisma.bulkOrder.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    });

    // Today's retail order count
    const todayRetailOrders = await prisma.order.count({
      where: { orderedAt: { gte: todayStart, lte: todayEnd } },
    });

    // Today's revenue = sum of bulk + retail totalAmount
    const [bulkRevResult, retailRevResult] = await Promise.all([
      prisma.bulkOrder.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { orderedAt: { gte: todayStart, lte: todayEnd } },
      }),
    ]);

    const todayRevenue =
      (bulkRevResult._sum.totalAmount ?? 0) +
      (retailRevResult._sum.totalAmount ?? 0);

    // Total unique customers (count of Customer records)
    const totalCustomers = await prisma.customer.count();

    return NextResponse.json({
      todayBulkOrders,
      todayRetailOrders,
      todayRevenue,
      totalCustomers,
    });
  } catch (error) {
    console.error("[dashboard/stats]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
