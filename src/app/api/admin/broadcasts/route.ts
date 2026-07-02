import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "5");

    const skip = (page - 1) * limit;

    const [broadcasts, total] = await Promise.all([
      prisma.broadcast.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.broadcast.count(),
    ]);

    return NextResponse.json({
      success: true,
      broadcasts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch broadcasts.",
      },
      {
        status: 500,
      },
    );
  }
}
