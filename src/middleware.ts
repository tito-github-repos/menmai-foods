import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const host = req.headers.get("host") || "";
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();
    const token = req.nextauth.token;

    const isAdminSubdomain = host.startsWith("admin.");

    // ── Admin subdomain rewriting ─────────────────────────────────────────
    if (isAdminSubdomain) {
      // Rewrite root "/" → "/admin" (login page)
      if (pathname === "/") {
        url.pathname = "/admin";
        return NextResponse.rewrite(url);
      }

      // Rewrite everything else: "/dashboard" → "/admin/dashboard"
      if (!pathname.startsWith("/admin")) {
        url.pathname = `/admin${pathname}`;
        return NextResponse.rewrite(url);
      }

      return NextResponse.next();
    }

    // ── Main domain: block direct access to /admin/* ──────────────────────
    if (pathname.startsWith("/admin")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const host = req.headers.get("host") || "";
        const { pathname } = req.nextUrl;

        const isAdminSubdomain = host.startsWith("admin.");

        // The login page itself (/admin exactly) is always public
        if (pathname === "/admin") return true;

        // Protect all other /admin/* routes — require admin role
        if (isAdminSubdomain || pathname.startsWith("/admin/")) {
          return !!token && token.role === "admin";
        }

        // All customer routes are public
        return true;
      },
    },
    pages: {
      signIn: "/admin", // unauthenticated users → login page
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};