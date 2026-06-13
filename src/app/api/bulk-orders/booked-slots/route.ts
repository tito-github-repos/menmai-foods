import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ success: true, bookedSlots: [] });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await prisma.bulkOrder.findMany({
      where: {
        deliveryDate: {
          gte: start,
          lte: end,
        },
        status: {
          in: ["NEW", "ACCEPTED", "IN_DISCUSSION"],
        },
      },
      select: {
        deliveryTime: true,
      },
    });

    return NextResponse.json({
      success: true,
      bookedSlots: orders.map((order) => order.deliveryTime),
    });
  } catch (error) {
    console.error("Booked slots fetch error:", error);

    return NextResponse.json(
      { success: false, bookedSlots: [] },
      { status: 500 }
    );
  }
}