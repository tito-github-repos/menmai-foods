import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // admin.menmaifoods.com/ → shows /admin login page
        source: "/",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin",
      },
      {
        // admin.menmaifoods.com/dashboard → /admin/dashboard
        source: "/dashboard/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/dashboard/:path*",
      },
      {
        // admin.menmaifoods.com/orders → /admin/orders
        source: "/orders/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/orders/:path*",
      },
      {
        source: "/bulk-orders/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/bulk-orders/:path*",
      },
      {
        source: "/products/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/products/:path*",
      },
      {
        source: "/broadcast/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/broadcast/:path*",
      },
      {
        source: "/customers/:path*",
        has: [{ type: "host", value: "admin.menmaifoods.com" }],
        destination: "/admin/customers/:path*",
      },
    ];
  },
};

export default nextConfig;