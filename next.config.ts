import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ✅ fixes local /logo.jpeg on subdomain
    remotePatterns: [
      { protocol: "https", hostname: "admin.menmaifoods.com" },
      { protocol: "https", hostname: "menmaifoods.com" },
      { protocol: "https", hostname: "www.menmaifoods.com" },
    ],
  },
};

export default nextConfig;