import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const order = await prisma.bulkOrder.update({
      where: { id: Number(id) },
      data: {
        customerName: body.customerName,
        phone: body.phone,
        email: body.email || null,
        deliveryDate: new Date(body.deliveryDate),
        deliveryTime: body.deliveryTime,
        occasion: body.occasion,
        deliveryAddress: body.deliveryAddress,
        pincode: body.pincode,
        subtotal: Number(body.subtotal || 0),
        deliveryCharge: Number(body.deliveryCharge || 0),
        estimatedTotal: Number(body.estimatedTotal || 0),
        status: body.status,
        notes: body.notes || null,
        items: {
          deleteMany: {},
          create: body.items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.name,
            quantity: Number(item.quantity || 0),
            unitPrice: Number(item.unitPrice || 0),
            totalPrice: Number(item.total || 0),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Bulk order update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bulk order." },
      { status: 500 }
    );
  }
}