import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const allowedStatuses = [
  "NEW",
  "ACCEPTED",
  "IN_DISCUSSION",
  "REJECTED",
  "DELIVERED",
];

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status." },
        { status: 400 }
      );
    }

    const order = await prisma.bulkOrder.update({
      where: { id: Number(id) },
      data: { status: body.status },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Bulk order status update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update status." },
      { status: 500 }
    );
  }
}