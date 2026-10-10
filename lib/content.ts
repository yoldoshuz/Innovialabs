/**
 * Language-agnostic content data. Slugs, URLs, assets and stack live here;
 * localized copy lives in the dictionaries under the same slug. Keeping them
 * apart means `generateStaticParams`, the sitemap and lookups stay in sync
 * across locales.
 */
export const serviceSlugs = [
  "ai",
  "telegram",
  "web",
  "mobile",
  "crm",
  "integrations",
  "design",
  "devops",
  "marketing",
  "support",
  "consulting",
] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const caseSlugs = [
  "loadme",
  "yoldosh",
  "incrm",
  "medsc",
  "leaderaudit",
  "global-school",
  "numa-family",
  "numa-nutrition",
  "numa-kids",
  "nabaviy-tabobat",
] as const;
export type CaseSlug = (typeof caseSlugs)[number];

/** Brand fills used for big colored blocks (covers, stages). */
export type Tone = "violet" | "night" | "mist" | "lilac" | "deep";

export type IconName =
  | "code"
  | "mobile"
  | "chip"
  | "rocket"
  | "shield"
  | "chart"
  | "cloud"
  | "terminal"
  | "settings"
  | "team"
  | "lock"
  | "search"
  | "send"
  | "pen";

/** Contact-form option values (must match `SERVICE_VALUES`). */
export type FormService = "web" | "mobile" | "telegram" | "ai" | "crm" | "other";

/**
 * Per-service icon, block tone, which form option its CTA preselects, and
 * related cases (shown instead of the "what you get" block).
 */
export const serviceMeta: Record<
  ServiceSlug,
  { icon: IconName; form: FormService; tone: Tone; cases?: CaseSlug[] }
> = {
  ai: { icon: "chip", form: "ai", tone: "night" },
  telegram: { icon: "send", form: "telegram", tone: "violet" },
  web: {
    icon: "code",
    form: "web",
    tone: "mist",
    cases: ["medsc", "leaderaudit", "global-school", "numa-family", "numa-kids", "nabaviy-tabobat"],
  },
  mobile: { icon: "mobile", form: "mobile", tone: "night", cases: ["loadme", "yoldosh"] },
  crm: { icon: "chart", form: "crm", tone: "lilac", cases: ["incrm"] },
  integrations: { icon: "cloud", form: "other", tone: "deep", cases: ["incrm"] },
  design: { icon: "pen", form: "other", tone: "mist", cases: ["numa-kids", "incrm", "numa-family"] },
  devops: { icon: "shield", form: "other", tone: "night" },
  marketing: { icon: "search", form: "other", tone: "violet", cases: ["leaderaudit", "medsc", "global-school"] },
  support: { icon: "settings", form: "other", tone: "lilac" },
  consulting: { icon: "rocket", form: "other", tone: "deep" },
};

/**
 * Cases share one template; what makes each one recognizable is its tone
 * and its motif (a small animated schematic of the product, see
 * components/cases/motif.tsx). No screenshots.
 */
export type CaseMeta = {
  /** Public URL; omitted for closed products. */
  url?: string;
  host?: string;
  /** Launch year; omitted when unknown. */
  year?: number;
  tone: Tone;
  stack: string[];
};

export const caseMeta: Record<CaseSlug, CaseMeta> = {
  loadme: { url: "https://www.loadme.uz/yuklar", host: "loadme.uz", tone: "violet", stack: ["iOS", "Android", "Web", "Vercel"] },
  yoldosh: {
    url: "https://yoldosh.uz/ru",
    host: "yoldosh.uz",
    year: 2025,
    tone: "night",
    stack: ["Next.js", "React", "iOS", "Android", "Vercel"],
  },
  incrm: { tone: "lilac", stack: [] },
  medsc: { url: "https://medsc.uz", host: "medsc.uz", tone: "mist", stack: ["Next.js", "React"] },
  leaderaudit: { url: "https://leaderaudit.uz", host: "leaderaudit.uz", tone: "deep", stack: ["Next.js", "React"] },
  "global-school": { url: "https://global-school.uz", host: "global-school.uz", tone: "violet", stack: ["Next.js", "React"] },
  "numa-family": {
    url: "https://numa-family.vercel.app/ru",
    host: "numa-family.vercel.app",
    year: 2026,
    tone: "night",
    stack: ["Next.js", "React", "Vercel"],
  },
  "numa-nutrition": {
    url: "https://numa-nutritition.vercel.app/",
    host: "numa-nutritition.vercel.app",
    year: 2026,
    tone: "mist",
    stack: ["Next.js", "React", "Vercel"],
  },
  "numa-kids": {
    url: "https://numa-kids-olive.vercel.app/ru",
    host: "numa-kids-olive.vercel.app",
    year: 2026,
    tone: "lilac",
    stack: ["Next.js", "React", "Vercel"],
  },
  "nabaviy-tabobat": {
    url: "https://nabaviy-tabobat.vercel.app/ru",
    host: "nabaviy-tabobat.vercel.app",
    year: 2026,
    tone: "deep",
    stack: ["Next.js", "React", "Vercel"],
  },
};
