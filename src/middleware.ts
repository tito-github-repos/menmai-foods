import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const host = req.headers.get("host") || "";
    const url = req.nextUrl.clone();

    // admin.menmaifoods.com
    if (host.startsWith("admin.")) {
      if (!url.pathname.startsWith("/admin")) {
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
      }
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};