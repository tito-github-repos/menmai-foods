import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, rating, comment } = await req.json();

    // Basic validation
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Find the review request
    const reviewRequest = await prisma.reviewRequest.findUnique({
      where: { token },
      include: {
        Order: {
          include: {
            OrderItem: {
              orderBy: { id: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!reviewRequest) {
      return NextResponse.json(
        { message: "Invalid or expired token", reason: "not_found" },
        { status: 400 }
      );
    }

    const order = reviewRequest.Order;

    // Must be delivered
    if (order.orderStatus !== "DELIVERED") {
      return NextResponse.json(
        { message: "Order is not delivered yet", reason: "not_delivered" },
        { status: 400 }
      );
    }

    // Guard: already reviewed
    const existing = await prisma.review.findFirst({
      where: { orderId: order.id },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Review already submitted", reason: "already_reviewed" },
        { status: 409 }
      );
    }

    const firstItem = order.OrderItem[0];

    if (!firstItem) {
      return NextResponse.json(
        { message: "No order items found" },
        { status: 400 }
      );
    }

    // Save the review
    await prisma.review.create({
      data: {
        orderId: order.id,
        productId: firstItem.productId,
        customerId: order.customerId,
        rating,
        comment: comment?.trim() || null,
        isApproved: true,
      },
    });

    // Mark ReviewRequest as SENT (used)
    await prisma.reviewRequest.update({
      where: { token },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}