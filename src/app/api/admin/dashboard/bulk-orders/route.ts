// File location: src/app/api/admin/dashboard/bulk-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10));
    const skip  = (page - 1) * limit;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const where = { createdAt: { gte: todayStart, lte: todayEnd } };

    const [rawOrders, total] = await Promise.all([
      prisma.bulkOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          // schema relation is `items`, not `BulkOrderItem`
          items: {
            select: {
              productName: true, // productName is directly on BulkOrderItem now
              quantity:    true,
            },
          },
        },
      }),
      prisma.bulkOrder.count({ where }),
    ]);

    const orders = rawOrders.map((order) => {
      // BulkOrderItem now has productName directly (no need to join Product)
      const items =
        order.items.map((i) => `${i.productName} × ${i.quantity}`).join(", ") ||
        "Custom bulk order";

      // schema fields: customerName, phone, deliveryAddress, pincode, estimatedTotal
      const address = [order.deliveryAddress, order.pincode]
        .filter(Boolean)
        .join(", ");

      return {
        id:            order.id,
        orderRef:      order.orderRef,
        fullName:      order.customerName,   // schema: customerName (not fullName)
        phone:         order.phone,
        email:         order.email ?? null,
        items,
        totalAmount:   order.estimatedTotal, // schema: estimatedTotal (not totalAmount)
        status:        order.status,
        address,
        deliveryDate:  order.deliveryDate.toISOString(),
        createdAt:     order.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("[dashboard/bulk-orders] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk orders", detail: String(error) },
      { status: 500 }
    );
  }
}
