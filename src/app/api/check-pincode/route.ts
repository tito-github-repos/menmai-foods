// src/app/api/check-pincode/route.ts
// Used in: Home page, Product detail page, Delivery page
// Purpose: Quick check — do we deliver to this pincode?

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { pincode } = await req.json();

    if (!pincode || pincode.length !== 6) {
      return NextResponse.json(
        {
          serviceable: false,
          message: "Please enter a valid 6-digit pincode.",
        },
        { status: 400 },
      );
    }

    const deliveryPincode = await prisma.deliveryPincode.findUnique({
      where: { pincode },
    });

    if (!deliveryPincode || !deliveryPincode.isActive) {
      return NextResponse.json({
        serviceable: false,
        message:
          "We're expanding soon and will be delivering to your area shortly.",
      });
    }

    return NextResponse.json({
      serviceable: true,
      message: "Great! We deliver to your area.",
    });
  } catch (error) {
    console.error("Check pincode error:", error);
    return NextResponse.json(
      {
        serviceable: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
