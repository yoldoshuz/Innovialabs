import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** AI crawlers that cite sources — explicitly welcome (see /llms.txt). */
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "YandexAdditional",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "Yandex", allow: "/", disallow },
      { userAgent: AI_BOTS, allow: "/", disallow },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
