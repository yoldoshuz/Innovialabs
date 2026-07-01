import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Web & AI`,
    short_name: siteConfig.name,
    description: "Enterprise-grade web platforms and AI products.",
    start_url: `/${i18n.defaultLocale}`,
    display: "standalone",
    background_color: "#05070f",
    theme_color: "#05070f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
