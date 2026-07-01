/**
 * Content slugs for dynamic detail routes. Kept in one place so
 * `generateStaticParams` and lookups stay in sync across locales — slugs are
 * language-agnostic; only the copy differs per locale.
 */
export const serviceSlugs = ["web", "ai", "design", "infrastructure"] as const;
export const caseSlugs = [
  "fintech-payments",
  "retail-assistant",
  "industry-twin",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
export type CaseSlug = (typeof caseSlugs)[number];
