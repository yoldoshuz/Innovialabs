import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { allMetas, getCards, PAGE_SIZE, pageCount } from "@/lib/blog";
import { blogListJsonLd, JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { BlogListing } from "@/components/blog/blog-listing";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { blog } = await getDictionary(lang);
  return pageMetadata({ lang, path: "/blog", title: blog.meta.title, description: blog.meta.description });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const cards = getCards(lang).slice(0, PAGE_SIZE);

  return (
    <>
      <JsonLd data={webPageJsonLd({ lang, path: "/blog", type: "CollectionPage", name: dict.blog.meta.title, description: dict.blog.meta.description })} />
      <JsonLd data={blogListJsonLd({ lang, name: dict.blog.meta.title, description: dict.blog.meta.description, posts: cards })} />
      <BlogListing lang={lang} dict={dict} cards={cards} total={allMetas().length} pages={pageCount()} />
    </>
  );
}

