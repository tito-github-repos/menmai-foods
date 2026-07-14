// File location: src/app/api/admin/dashboard/retail-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Order_paymentStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10));
    const skip = (page - 1) * limit;

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // Show orders that are PAID, and either placed today OR updated
    // (e.g. payment completed / retried) today. This covers the case
    // where an order was created yesterday (payment declined) and the
    // customer completed payment today.
    const where = {
      paymentStatus: Order_paymentStatus.PAID,
      OR: [
        { orderedAt: { gte: todayStart, lte: todayEnd } },
        { updatedAt: { gte: todayStart, lte: todayEnd } },
      ],
    };

    const [rawOrders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" }, // most recently paid/updated first
        include: {
          // schema relations use PascalCase: Customer, CustomerAddress, OrderItem
          Customer: {
            select: { fullName: true, phone: true },
          },
          CustomerAddress: {
            select: {
              fullAddress: true,
              area: true,
              city: true,
              pincode: true,
            },
          },
          OrderItem: {
            select: { productName: true, quantity: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const orders = rawOrders.map((order) => {
      const items =
        order.OrderItem.map((i) => `${i.productName} × ${i.quantity}`).join(
          ", ",
        ) || "—";

      const addr = order.CustomerAddress;
      const address = [addr.fullAddress, addr.area, addr.city, addr.pincode]
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
    console.error("[dashboard/retail-orders] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch retail orders", detail: String(error) },
      { status: 500 },
    );
  }
}