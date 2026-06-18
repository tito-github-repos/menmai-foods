// FILE 2: app/api/admin/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://admin.menmaifoods.com";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });

    // Always return success — never reveal if username exists
    if (!admin || !admin.email) {
      return NextResponse.json({ success: true });
    }

    // Generate secure token, valid for 1 hour
    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetToken:       token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `${BASE_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from:    "Menmai Foods <noreply@menmaifoods.com>",
      to:      admin.email,
      subject: "Reset your Menmai Admin password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#5A1F00;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:1.4rem;">Menmai Foods</h1>
            <p style="color:#ffcba4;margin:6px 0 0;font-size:0.9rem;">Admin Panel</p>
          </div>
          <div style="background:#fff;border:1px solid #ececec;border-top:none;padding:32px;border-radius:0 0 12px 12px;">
            <h2 style="color:#1a1a1a;margin-top:0;">Password Reset Request</h2>
            <p style="color:#6b7280;line-height:1.7;">
              Hi <strong>${admin.username}</strong>,<br/><br/>
              We received a request to reset your Menmai Foods admin password.
              Click the button below — this link expires in <strong>1 hour</strong>.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetLink}"
                style="display:inline-block;background:#5A1F00;color:#fff;padding:14px 36px;
                border-radius:10px;text-decoration:none;font-weight:700;font-size:1rem;">
                Reset Password
              </a>
            </div>
            <p style="color:#9ca3af;font-size:0.85rem;line-height:1.6;">
              If you didn't request this, ignore this email — your password will not change.
            </p>
            <hr style="border:none;border-top:1px solid #ececec;margin:24px 0;" />
            <p style="color:#9ca3af;font-size:0.78rem;text-align:center;margin:0;">
              Or paste this link in your browser:<br/>
              <span style="color:#5A1F00;word-break:break-all;">${resetLink}</span>
            </p>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:0.78rem;margin-top:16px;">
            © 2026 Menmai Foods. All rights reserved.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
