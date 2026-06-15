import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/admin",
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/bulk-orders/:path*",
    "/admin/products/:path*",
    "/admin/broadcast/:path*",
    "/admin/customers/:path*",
  ],
};