import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const host = req.headers.get("host") || "";
    const url = req.nextUrl.clone();

    // Admin subdomain routing
    if (host.startsWith("admin.")) {
      if (!url.pathname.startsWith("/admin")) {
        url.pathname =
          url.pathname === "/"
            ? "/admin"
            : `/admin${url.pathname}`;
      }

      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin",
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/dashboard/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/broadcast/:path*",
    "/bulk-orders/:path*",
  ],
};