import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const isAdminSubdomain = host.startsWith("admin.");
  const path = req.nextUrl.pathname;

  // Block menmaifoods.com/admin → redirect to customer home
  if (!isAdminSubdomain && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};