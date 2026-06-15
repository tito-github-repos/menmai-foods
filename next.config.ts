import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // First: handle root → /admin login page
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.menmaifoods.com",
          },
        ],
        destination: "/admin",
      },
      {
        // Second: handle all other paths → /admin/...
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.menmaifoods.com",
          },
        ],
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;