import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmedWorkflow } from "@/lib/orders/whatsapp-workflow";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customerPhone?: string;
  };

  if (!body.customerPhone) {
    return NextResponse.json(
      {
        error: "Missing `customerPhone`",
      },
      {
        status: 400,
      },
    );
  }

  const customer = await prisma.customer.upsert({
    where: {
      phone: body.customerPhone,
    },
    update: {
      fullName: "Sandbox Customer",
      isPhoneVerified: true,
    },
    create: {
      fullName: "Sandbox Customer",
      phone: body.customerPhone,
      isPhoneVerified: true,
      updatedAt: new Date(),
    },
  });

  const address = await prisma.customerAddress.create({
    data: {
      customerId: customer.id,
      fullAddress: "Sandbox Address, Menmai Foods Test Area",
      city: "Chennai",
      pincode: "600001",
      isDefault: true,
      updatedAt: new Date(),
    },
  });

  const product = await prisma.product.upsert({
    where: {
      slug: "sandbox-menmai-meal",
    },
    update: {
      stockQuantity: 100,
      isActive: true,
    },
    create: {
      name: "Sandbox Menmai Meal",
      slug: "sandbox-menmai-meal",
      price: 299,
      stockQuantity: 100,
      isActive: true,
    },
  });

  const orderNumber = `MENMAI-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: customer.id,
      addressId: address.id,
      subtotal: 299,
      deliveryCharge: 0,
      totalAmount: 299,
      paymentStatus: "PAID",
      orderStatus: "PENDING",
      updatedAt: new Date(),
      OrderItem: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: 299,
            totalPrice: 299,
          },
        ],
      },
    },
  });

  const workflow = await sendOrderConfirmedWorkflow(order.id);

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    workflow,
  });
}
