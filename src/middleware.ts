import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const host = req.headers.get("host") || "";
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();

    const isAdminSubdomain = host.startsWith("admin.");
    const isLocalhost =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1");

    // ─────────────────────────────────────────────
    // Admin subdomain rewrite
    // admin.menmaifoods.com/dashboard
    // => /admin/dashboard
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // Local development
    // localhost:3000/admin/*
    // ─────────────────────────────────────────────
    if (isLocalhost) {
      return NextResponse.next();
    }

    // ─────────────────────────────────────────────
    // Prevent public access to /admin/*
    // from main production domain
    // ─────────────────────────────────────────────
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

        // ─────────────────────────────────────────
        // PUBLIC PAGES ON ADMIN SUBDOMAIN
        // ─────────────────────────────────────────

        if (isAdminSubdomain) {
          const publicRoutes = [
            "/",
            "/forgot-password",
            "/reset-password",
          ];

          if (publicRoutes.some((route) => pathname.startsWith(route))) {
            return true;
          }

          // Everything else requires admin login
          return !!token && token.role === "admin";
        }

        // ─────────────────────────────────────────
        // LOCALHOST PUBLIC ROUTES
        // ─────────────────────────────────────────

        if (
          pathname === "/admin" ||
          pathname === "/admin/forgot-password" ||
          pathname.startsWith("/admin/reset-password")
        ) {
          return true;
        }

        // ─────────────────────────────────────────
        // PROTECT ALL OTHER ADMIN ROUTES
        // ─────────────────────────────────────────

        if (pathname.startsWith("/admin/")) {
          return !!token && token.role === "admin";
        }

        // Customer website routes
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