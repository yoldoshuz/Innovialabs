"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
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

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2/60 px-3 py-2 text-sm font-medium text-muted backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Globe className="size-4" />
        <span>{localeMeta[current].short}</span>
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-border bg-elevated/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {i18n.locales.map((locale) => {
            const active = locale === current;
            return (
              <li key={locale}>
                <Link
                  href={withLocale(pathname, locale)}
                  role="option"
                  aria-selected={active}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-2",
                    active ? "text-foreground" : "text-muted",
                  )}
                >
                  <span>{localeMeta[locale].label}</span>
                  {active ? <Check className="size-4 text-primary" /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
