import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, reason: "no_token" });
  }

  try {
    const reviewRequest = await prisma.reviewRequest.findUnique({
      where: { token },
      include: {
        Order: {
          include: {
            Customer: true,
            OrderItem: {
              include: {
                Product: {
                  select: { imageUrl: true, slug: true },
                },
              },
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    // Token not found
    if (!reviewRequest) {
      return NextResponse.json({ valid: false, reason: "not_found" });
    }

    // Order must be DELIVERED
    if (reviewRequest.Order.orderStatus !== "DELIVERED") {
      return NextResponse.json({ valid: false, reason: "not_delivered" });
    }

    // Already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { orderId: reviewRequest.orderId },
    });

    if (existingReview) {
      return NextResponse.json({ valid: false, reason: "already_reviewed" });
    }

    const order = reviewRequest.Order;

    // Build items list for the UI
    const items = order.OrderItem.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      imageUrl: item.Product.imageUrl ?? null,
    }));

    return NextResponse.json({
      valid: true,
      orderId: order.id,
      customerName: order.Customer.fullName,
      items,
    });
  } catch (error) {
    console.error("Review validate error:", error);
    return NextResponse.json(
      { valid: false, reason: "server_error" },
      { status: 500 }
    );
  }
}