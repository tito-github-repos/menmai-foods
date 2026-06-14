// app/api/admin/dashboard/retail-orders/route.ts
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

    const where = { orderedAt: { gte: todayStart, lte: todayEnd } };

    const [rawOrders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderedAt: "desc" },
        include: {
          Customer: { select: { fullName: true, phone: true } },
          CustomerAddress: {
            select: { fullAddress: true, area: true, city: true, pincode: true },
          },
          OrderItem: {
            select: { productName: true, quantity: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const orders = rawOrders.map((order) => {
      // Build readable items string, e.g. "Chapathi × 10, Poori × 6"
      const items = order.OrderItem.map(
        (i) => `${i.productName} × ${i.quantity}`
      ).join(", ");

      // Build readable address
      const addr = order.CustomerAddress;
      const address = [
        addr.fullAddress,
        addr.area,
        addr.city,
        addr.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          fullName: order.Customer.fullName,
          phone: order.Customer.phone,
        },
        items,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        address,
        orderedAt: order.orderedAt.toISOString(),
      };
    });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("[dashboard/retail-orders]", error);
    return NextResponse.json(
      { error: "Failed to fetch retail orders" },
      { status: 500 }
    );
  }
}
