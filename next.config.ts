import type { NextConfig } from "next";

const csp = `
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'self';
  form-action 'self';
  upgrade-insecure-requests;

  script-src
    'self'
    'unsafe-inline'
    'unsafe-eval'
    https://checkout.razorpay.com
    https://api.razorpay.com
    https://cdn.razorpay.com
    https://maps.googleapis.com
    https://maps.gstatic.com
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://www.gstatic.com
    https://www.google.com;

  style-src
    'self'
    'unsafe-inline'
    https://fonts.googleapis.com;

  font-src
    'self'
    https://fonts.gstatic.com
    data:;

  img-src
    'self'
    data:
    blob:
    https:
    https://res.cloudinary.com
    https://*.googleusercontent.com
    https://maps.gstatic.com
    https://maps.googleapis.com;

  connect-src
    'self'
    https://api.razorpay.com
    https://checkout.razorpay.com
    https://lumberjack.razorpay.com
    https://maps.googleapis.com
    https://maps.gstatic.com
    https://www.google-analytics.com
    https://analytics.google.com
    https://www.googletagmanager.com
    https://res.cloudinary.com
    https://menmaifoods.com
    https://admin.menmaifoods.com;

  frame-src
    'self'
    https://checkout.razorpay.com
    https://api.razorpay.com
    https://www.google.com
    https://maps.google.com;

  worker-src
    'self'
    blob:;

  manifest-src
    'self';

  media-src
    'self'
    blob:
    data:;
`
  .replace(/\n/g, "")
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // ==========================
          // Security Headers
          // ==========================

          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), usb=(), payment=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          // ==========================
          // CSP (Report Only)
          // ==========================

          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;