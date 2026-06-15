import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Only for admin subdomain
  if (host === "admin.menmaifoods.com") {
    if (!url.pathname.startsWith("/admin")) {
      url.pathname =
        url.pathname === "/"
          ? "/admin"
          : `/admin${url.pathname}`;

      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};