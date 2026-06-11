import { withAuth } from "next-auth/middleware";

export default withAuth();

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/broadcast/:path*",
    "/admin/customers/:path*",
  ],
};