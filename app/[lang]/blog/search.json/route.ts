import { i18n, isLocale } from "@/lib/i18n/config";
import { getCards } from "@/lib/blog";

export const dynamic = "force-static";

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

/** Compact search index for the blog explorer (titles, answers, tags). */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  const rows = getCards(lang).map((c) => ({
    s: c.slug,
    t: c.title,
    d: c.summary,
    c: c.category,
    l: c.level,
    g: c.tags,
    m: c.minutes,
  }));
  return Response.json(rows, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400", "X-Robots-Tag": "noindex" },
  });
}
