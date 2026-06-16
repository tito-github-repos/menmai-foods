import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ✅ Disables image optimization — plain <img> behavior on all domains
    remotePatterns: [
      { protocol: "https", hostname: "admin.menmaifoods.com" },
      { protocol: "https", hostname: "menmaifoods.com" },
      { protocol: "https", hostname: "www.menmaifoods.com" },
    ],
  },
  async headers() {
    return [
      {
        // ✅ Allow static files (images, fonts) to be served across subdomains
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;