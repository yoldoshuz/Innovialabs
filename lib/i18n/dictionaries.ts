import "server-only";
import type { Locale } from "./config";

/**
 * Lazily-loaded translation dictionaries. Only the requested locale's JSON is
 * imported, and it runs on the server only — translation payloads never reach
 * the client bundle.
 */
const dictionaries = {
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  uz: () => import("./dictionaries/uz.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]() as Promise<Dictionary>;

/** The canonical dictionary shape is derived from the Russian (base) file. */
export type Dictionary = typeof import("./dictionaries/ru.json");
