import type { Locale } from "@/lib/i18n/config";
import type { FormService } from "@/lib/content";

/** "Discuss a project" page; `service` preselects the first answer. */
export function briefHref(lang: Locale, service?: FormService) {
  return `/${lang}/brief${service ? `?service=${service}` : ""}`;
}
