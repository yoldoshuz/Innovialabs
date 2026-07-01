import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Picks the best locale from the `Accept-Language` header, falling back to the
 * default. Lightweight parser — avoids pulling in a negotiation dependency.
 */
function resolveLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return i18n.defaultLocale;

  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bail early if the path already carries a supported locale prefix.
  const hasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Redirect locale-less paths to the resolved locale, preserving the path.
  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and files with an extension (e.g. SEO
  // metadata files, images, fonts) so they are served without a locale prefix.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
