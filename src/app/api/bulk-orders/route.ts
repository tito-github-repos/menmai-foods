import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function createBulkOrderRef() {
  const datePart = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `BQ-${datePart}-${randomPart}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.phone || !body.deliveryDate || !body.deliveryTime) {
      return NextResponse.json(
        { success: false, message: "Missing required bulk order details." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please add at least one bulk order item." },
        { status: 400 }
      );
    }

    const order = await prisma.bulkOrder.create({
      data: {
        orderRef: createBulkOrderRef(),

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

        source: body.source === "ADMIN_MANUAL" ? "ADMIN_MANUAL" : "CUSTOMER_FORM",
        status: body.status || "NEW",

        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.name,
            quantity: Number(item.quantity || 0),
            unitPrice: Number(item.unitPrice || 0),
            totalPrice: Number(item.total || 0),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    try {
      await resend.emails.send({
        from: "Menmai Foods <onboarding@menmaifoods.com>",
        to: process.env.ADMIN_NOTIFICATION_EMAIL!,
        subject: `New Bulk Order — ${order.orderRef}`,
        html: `
          <h2>New Bulk Order Received</h2>
          <p><strong>Order Ref:</strong> ${order.orderRef}</p>
          <p><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
          <p><strong>Email:</strong> ${order.email || "-"}</p>
          <p><strong>Delivery:</strong> ${new Date(order.deliveryDate).toLocaleDateString("en-IN")} — ${order.deliveryTime}</p>
          <p><strong>Occasion:</strong> ${order.occasion}</p>
          <p><strong>Address:</strong> ${order.deliveryAddress}, ${order.pincode}</p>
          <p><strong>Estimated Total:</strong> ₹${order.estimatedTotal}</p>
          <h3>Items</h3>
          <ul>
            ${order.items.map((i) => `<li>${i.productName} — ${i.quantity} pcs — ₹${i.totalPrice}</li>`).join("")}
          </ul>
        `,
      });
    } catch (emailError) {
      console.error("Admin notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Bulk order submitted successfully.",
      order,
    });
  } catch (error) {
    console.error("Bulk order submit error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to submit bulk order." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.bulkOrder.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Bulk order list error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch bulk orders." },
      { status: 500 }
    );
  }
}