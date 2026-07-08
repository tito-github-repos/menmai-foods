import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const customerId = Number(id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer id" },
        { status: 400 },
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        customerId,
      },
      include: {
        Product: {
          select: {
            name: true,
          },
        },
        Order: {
          select: {
            orderNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const groupedReviews = new Map();

    reviews.forEach((review) => {
      const key = review.orderId;

      if (!groupedReviews.has(key)) {
        groupedReviews.set(key, {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          productNames: [review.Product.name],
          orderNumber: review.Order.orderNumber,
          createdAt: review.createdAt,
        });
      } else {
        groupedReviews.get(key).productNames.push(review.Product.name);
      }
    });

    const data = Array.from(groupedReviews.values()).map((review) => ({
      ...review,
      productName: review.productNames.join(", "),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/admin/customers/[id]/reviews] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch customer reviews",
        detail: String(error),
      },
      {
        status: 500,
      },
    );
  }
}
