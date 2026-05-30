import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type JwtPayload = {
  customerId: number;
  phone: string;
};

export function verifyToken(req: NextRequest): JwtPayload | null {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing");
      return null;
    }

    const decoded = jwt.verify(token, secret!) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized. Please login again." },
    { status: 401 },
  );
}
