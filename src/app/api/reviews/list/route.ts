import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        Customer: {
          select: { fullName: true },
        },
        Product: {
          select: { name: true },
        },
      },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      name: r.Customer.fullName,
      productName: r.Product.name,
      rating: r.rating,
      comment: r.comment ?? "",
      createdAt: r.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}