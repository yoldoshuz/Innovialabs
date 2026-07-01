/**
 * i18n configuration — route-based localization (/ru, /en, /uz).
 * Russian is the base/default locale.
 */
export const i18n = {
  defaultLocale: "ru",
  locales: ["ru", "en", "uz"],
} as const;

export type Locale = (typeof i18n.locales)[number];

/** Human-readable metadata for each locale (used by the locale switcher). */
export const localeMeta: Record<
  Locale,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  ru: { label: "Русский", short: "RU", hreflang: "ru-RU", ogLocale: "ru_RU" },
  en: { label: "English", short: "EN", hreflang: "en-US", ogLocale: "en_US" },
  uz: { label: "O‘zbekcha", short: "UZ", hreflang: "uz-UZ", ogLocale: "uz_UZ" },
};

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}
