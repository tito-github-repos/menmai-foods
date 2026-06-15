import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
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