import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const host = req.headers.get("host") || "";
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();

    const isAdminSubdomain = host.startsWith("admin.");
    // ✅ Also treat localhost as admin when accessing /admin routes
    const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

    // ── Admin subdomain rewriting ─────────────────────────────────────────
    if (isAdminSubdomain) {
      if (pathname === "/") {
        url.pathname = "/admin";
        return NextResponse.rewrite(url);
      }

      if (!pathname.startsWith("/admin")) {
        url.pathname = `/admin${pathname}`;
        return NextResponse.rewrite(url);
      }

      return NextResponse.next();
    }

    // ── Localhost: allow /admin/* directly (for development) ──────────────
    if (isLocalhost) {
      return NextResponse.next();
    }

    // ── Main domain (production): block direct access to /admin/* ─────────
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
        const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

        // Allow subdomain root "/" — always public
        if (isAdminSubdomain && pathname === "/") return true;

        // Allow the login page itself — always public
        if (pathname === "/admin") return true;

        // Protect all /admin/* routes — require admin role
        if (isAdminSubdomain || isLocalhost || pathname.startsWith("/admin/")) {
          if (pathname.startsWith("/admin/")) {
            return !!token && token.role === "admin";
          }
          return true;
        }

        // All customer routes are public
        return true;
      },
    },
    pages: {
      signIn: "/admin",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};