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
  "numa-family",
  "numa-nutrition",
  "numa-kids",
  "nabaviy-tabobat",
] as const;
export type CaseSlug = (typeof caseSlugs)[number];

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
 * Per-service icon and which form option a card preselects. Services with
 * no own option preselect "other" and prefill the message with their title.
 */
export const serviceMeta: Record<
  ServiceSlug,
  { icon: IconName; form: FormService; cases?: CaseSlug[] }
> = {
  ai: { icon: "chip", form: "ai" },
  telegram: { icon: "send", form: "telegram" },
  web: { icon: "code", form: "web", cases: ["numa-family", "numa-nutrition", "numa-kids", "nabaviy-tabobat"] },
  mobile: { icon: "mobile", form: "mobile", cases: ["loadme", "yoldosh"] },
  crm: { icon: "chart", form: "crm" },
  integrations: { icon: "cloud", form: "other" },
  design: { icon: "pen", form: "other", cases: ["numa-kids", "numa-family"] },
  devops: { icon: "shield", form: "other" },
  marketing: { icon: "search", form: "other" },
  support: { icon: "settings", form: "other" },
  consulting: { icon: "rocket", form: "other" },
};

export type CaseMeta = {
  url: string;
  host: string;
  /** Launch year; omitted when unknown. */
  year?: number;
  /** 1440×900 desktop first screen. */
  shot: string;
  /** 390×844 mobile first screen. */
  shotMobile: string;
  stack: string[];
};

export const caseMeta: Record<CaseSlug, CaseMeta> = {
  loadme: {
    url: "https://www.loadme.uz/yuklar",
    host: "loadme.uz",
    shot: "/cases/loadme.png",
    shotMobile: "/cases/loadme-m.png",
    stack: ["iOS", "Android", "Web", "Vercel"],
  },
  yoldosh: {
    url: "https://yoldosh.uz/ru",
    host: "yoldosh.uz",
    year: 2025,
    shot: "/cases/yoldosh.png",
    shotMobile: "/cases/yoldosh-m.png",
    stack: ["Next.js", "React", "iOS", "Android", "Vercel"],
  },
  "numa-family": {
    url: "https://numa-family.vercel.app/ru",
    host: "numa-family.vercel.app",
    year: 2026,
    shot: "/cases/numa-family.png",
    shotMobile: "/cases/numa-family-m.png",
    stack: ["Next.js", "React", "Vercel"],
  },
  "numa-nutrition": {
    url: "https://numa-nutritition.vercel.app/",
    host: "numa-nutritition.vercel.app",
    year: 2026,
    shot: "/cases/numa-nutrition.png",
    shotMobile: "/cases/numa-nutrition-m.png",
    stack: ["Next.js", "React", "Vercel"],
  },
  "numa-kids": {
    url: "https://numa-kids-olive.vercel.app/ru",
    host: "numa-kids-olive.vercel.app",
    year: 2026,
    shot: "/cases/numa-kids.png",
    shotMobile: "/cases/numa-kids-m.png",
    stack: ["Next.js", "React", "Vercel"],
  },
  "nabaviy-tabobat": {
    url: "https://nabaviy-tabobat.vercel.app/ru",
    host: "nabaviy-tabobat.vercel.app",
    year: 2026,
    shot: "/cases/nabaviy-tabobat.png",
    shotMobile: "/cases/nabaviy-tabobat-m.png",
    stack: ["Next.js", "React", "Vercel"],
  },
};
