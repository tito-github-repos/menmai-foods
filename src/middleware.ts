import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/broadcast/:path*",
    "/admin/customers/:path*",
  ],
};