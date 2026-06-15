import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const isAdminSubdomain = host.startsWith("admin.");

  // Rewrite admin.menmaifoods.com → /admin page (URL stays clean)
  if (isAdminSubdomain && req.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", req.url));
  }

  // Block menmaifoods.com/admin direct access → redirect to home
  if (!isAdminSubdomain && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/bulk-orders/:path*",
    "/admin/products/:path*",
    "/admin/broadcast/:path*",
    "/admin/customers/:path*",
  ],
};