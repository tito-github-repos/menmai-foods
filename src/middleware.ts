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
      host.startsWith("localhost") || host.startsWith("127.0.0.1");

    // ─────────────────────────────────────────────
    // Admin subdomain rewrite
    // admin.menmaifoods.com/dashboard
    // => /admin/dashboard
    // ─────────────────────────────────────────────
    if (isAdminSubdomain) {
      // Prevent URLs like:
      // admin.menmaifoods.com/admin/dashboard
      // admin.menmaifoods.com/admin/orders
      if (pathname.startsWith("/admin")) {
        url.pathname = pathname.replace("/admin", "") || "/";
        return NextResponse.redirect(url, 308);
      }

      // Login page
      if (pathname === "/") {
        url.pathname = "/admin";
        return NextResponse.rewrite(url);
      }

      // Rewrite clean admin URLs
      // /dashboard -> /admin/dashboard
      // /orders -> /admin/orders
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
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
      return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const host = req.headers.get("host") || "";
        const { pathname } = req.nextUrl;

        // TEMP DEBUG — remove after confirming logs
        console.log("AUTH_CHECK_V2", {
          pathname,
          host,
          hasToken: !!token,
          role: (token as any)?.role,
        });

        const isAdminSubdomain = host.startsWith("admin.");

        // ─────────────────────────────────────────
        // PUBLIC PAGES ON ADMIN SUBDOMAIN
        // authorized() sees the PRE-REWRITE path here
        // e.g. admin.menmaifoods.com/dashboard -> pathname "/dashboard"
        // BUT admin.menmaifoods.com/admin/dashboard -> pathname "/admin/dashboard"
        // (typed directly, no rewrite happens, so it keeps the /admin prefix)
        // So public-route matching must check BOTH shapes.
        // ─────────────────────────────────────────
        if (isAdminSubdomain) {
          let normalizedPath = pathname;

          if (normalizedPath.startsWith("/admin")) {
            normalizedPath = normalizedPath.replace("/admin", "") || "/";
          }
          const publicRoutes = ["/", "/forgot-password", "/reset-password"];

          const isPublic = publicRoutes.some((route) => {
            if (route === "/") return normalizedPath === "/";
            return (
              normalizedPath === route || normalizedPath.startsWith(route + "/")
            );
          });
          if (isPublic) return true;

          // Everything else (both /dashboard and /admin/dashboard shapes) requires login
          return !!token && (token as any).role === "admin";
        }

        // ─────────────────────────────────────────
        // LOCALHOST PUBLIC ROUTES
        // ─────────────────────────────────────────

        let normalizedLocalPath = pathname;

        if (normalizedLocalPath.startsWith("/admin")) {
          normalizedLocalPath =
            normalizedLocalPath.replace("/admin", "") || "/";
        }

        const publicRoutes = ["/", "/forgot-password", "/reset-password"];

        const isPublic = publicRoutes.some((route) => {
          if (route === "/") return normalizedLocalPath === "/";
          return (
            normalizedLocalPath === route ||
            normalizedLocalPath.startsWith(route + "/")
          );
        });

        if (isPublic) return true;

        // ─────────────────────────────────────────
        // PROTECT ALL OTHER ADMIN ROUTES
        // ─────────────────────────────────────────

        if (pathname === "/admin" || pathname.startsWith("/admin/")) {
          return !!token && (token as any)?.role === "admin";
        }

        // Customer website routes
        return true;
      },
    },

    pages: {
      signIn: "/admin",
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
