// FILE 3: app/api/admin/reset-password/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Find admin with this token
    const admin = await prisma.admin.findFirst({
      where: { resetToken: token },
    });

    if (!admin || !admin.resetTokenExpiry) {
      return NextResponse.json({ error: "This reset link is no longer valid. Please request a new password reset link." }, { status: 400 });
    }

    // Check token hasn't expired
    if (new Date() > admin.resetTokenExpiry) {
      // Clean up expired token
      await prisma.admin.update({
        where: { id: admin.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    // Hash new password and clear the token
    const hashed = await bcrypt.hash(password, 12);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password:        hashed,
        resetToken:       null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
