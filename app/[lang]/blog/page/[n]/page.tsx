import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { allMetas, getCards, PAGE_SIZE, pageCount } from "@/lib/blog";
import { blogListJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { BlogListing } from "@/components/blog/blog-listing";

type Props = { params: Promise<{ lang: string; n: string }> };

export const dynamicParams = false;

/** Page 1 lives at /blog; pages 2…N are static. */
export function generateStaticParams() {
  const pages = pageCount();
  return i18n.locales.flatMap((lang) =>
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ lang, n: String(i + 2) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, n } = await params;
  if (!isLocale(lang)) return {};
  const { blog } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/blog/page/${n}`,
    title: `${blog.meta.title} — ${blog.page} ${n}`,
    description: blog.meta.description,
  });
}

export default async function BlogPageN({ params }: Props) {
  const { lang, n } = await params;
  if (!isLocale(lang)) notFound();
  const page = Number(n);
  const pages = pageCount();
  if (!Number.isInteger(page) || page < 2 || page > pages) notFound();
  const dict = await getDictionary(lang);
  const cards = getCards(lang).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <JsonLd data={blogListJsonLd({ lang, name: `${dict.blog.meta.title} — ${dict.blog.page} ${page}`, description: dict.blog.meta.description, posts: cards })} />
      <BlogListing lang={lang} dict={dict} cards={cards} total={allMetas().length} page={page} pages={pages} />
    </>
  );
}
