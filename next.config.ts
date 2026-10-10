import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Crawl helpers stay fresh and out of the index themselves.
        source: "/(robots.txt|sitemap.xml|llms.txt)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
