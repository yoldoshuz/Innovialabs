"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { i18n, localeMeta, isLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Swaps the locale segment of the current path, preserving the rest. */
function withLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (segments[1] && isLocale(segments[1])) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }
  const next = segments.join("/");
  return next === "" ? `/${locale}` : next;
}

/**
 * RU / EN / UZ in a glass bubble, same height as the CTA. The active pill is
 * Deep — calmer than Ink next to the Violet button.
 */
export function LocaleSwitcher({
  current,
  label,
  tone = "light",
  id = "locale",
  className,
}: {
  current: Locale;
  label: string;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label={label}
      className={cn("glass flex h-12 items-center p-1 sm:h-14 sm:p-1.5", className)}
    >
      {i18n.locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={withLocale(pathname, locale)}
            hrefLang={localeMeta[locale].hreflang}
            lang={locale}
            aria-current={active ? "true" : undefined}
            title={localeMeta[locale].label}
            className={cn(
              "relative z-10 grid h-full min-w-11 place-items-center rounded-full px-2.5 text-xs font-bold tracking-wide transition-colors duration-300",
              active
                ? "text-white"
                : tone === "light"
                  ? "text-ink/55 hover:text-ink"
                  : "text-white/60 hover:text-white",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`${id}-pill`}
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
                className="absolute inset-0 -z-10 rounded-full bg-deep"
              />
            ) : null}
            {localeMeta[locale].short}
          </Link>
        );
      })}
    </nav>
  );
}
