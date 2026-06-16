import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.menmaifoods.com",
      },
      {
        protocol: "https",
        hostname: "menmaifoods.com",
      },
      {
        protocol: "https",
        hostname: "www.menmaifoods.com",
      },
    ],
  },
};

export default nextConfig;