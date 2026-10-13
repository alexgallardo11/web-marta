import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones and tablets on the same Wi-Fi load Next's development assets.
  // Without the LAN hostname, the page renders but Client Components never
  // hydrate, leaving every game control disabled.
  allowedDevOrigins: ["127.0.0.1", "192.168.1.30"],
  images: {
    // Every `quality` used by <Image> must be listed (Next 16.4+), otherwise
    // the reviews illustration and book viewer fall back to 75.
    qualities: [75, 88, 92, 95],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
      {
        source: "/recursos/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/crea-personajes-locos",
        destination: "/juegos/personajes-locos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
