import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Where ideas become products.`,
    short_name: siteConfig.name,
    description:
      "IT development studio: websites, mobile apps, CRM, integrations and AI automation.",
    start_url: `/${i18n.defaultLocale}`,
    display: "standalone",
    background_color: "#120B24",
    theme_color: "#7C3AED",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      {
        src: "/Innovialabs-logo/png/innovialabs-app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/Innovialabs-logo/png/innovialabs-app-icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
