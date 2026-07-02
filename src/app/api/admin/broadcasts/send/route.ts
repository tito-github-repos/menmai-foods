import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { processBroadcast } from "@/lib/whatsapp/broadcastProcessor";

export async function POST(req: NextRequest) {
  try {
    const { message, imageUrl } = await req.json();

    if (!message?.trim() && !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Broadcast message or image is required.",
        },
        {
          status: 400,
        },
      );
    }

    // 1. Create Broadcast
    const broadcast = await prisma.broadcast.create({
      data: {
        message,
        imageUrl: imageUrl || null,
        status: "SENDING",
      },
    });

    // 2. Fetch all verified customers
    const customers = await prisma.customer.findMany({
      where: {
        isPhoneVerified: true,
      },
      select: {
        id: true,
        phone: true,
      },
    });

    // 3. Create recipient records
    if (customers.length > 0) {
      await prisma.broadcastRecipient.createMany({
        data: customers.map((customer) => ({
          broadcastId: broadcast.id,
          customerId: customer.id,
          phone: customer.phone,
        })),
      });
    }

    // 4. Update total recipient count
    await prisma.broadcast.update({
      where: {
        id: broadcast.id,
      },
      data: {
        totalCount: customers.length,
      },
    });

    await processBroadcast(broadcast.id);

    return NextResponse.json({
      success: true,
      broadcastId: broadcast.id,
      recipients: customers.length,
      message: "Broadcast created successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create broadcast.",
      },
      {
        status: 500,
      },
    );
  }
}
