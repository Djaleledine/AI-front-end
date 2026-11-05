const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.NEXT_EXPORT === "true" ? "export" : "standalone",
  images: {
    unoptimized: true
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=86400; includeSubDomains"
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin-allow-popups"
        },
        {
          key: "Cross-Origin-Resource-Policy",
          value: "same-origin"
        },
        {
          key: "Permissions-Policy",
          value:
            "camera=(self), geolocation=(), microphone=(), accelerometer=(), payment=(), usb=(), focus-without-user-activation=()"
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            isProd
              ? "script-src 'self' 'unsafe-inline' 'report-sample'"
              : "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            "connect-src 'self' https://generativelanguage.googleapis.com",
            "object-src 'none'",
            "base-uri 'none'",
            "frame-ancestors 'none'",
            "form-action 'self'"
          ].join("; ")
        }
      ]
    },
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, proxy-revalidate"
        },
        { key: "Pragma", value: "no-cache" },
        { key: "Expires", value: "0" },
        {
          key: "Vary",
          value: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site"
        }
      ]
    }
  ]
};

export default nextConfig;
