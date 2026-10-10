import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { blogCategories, countByCategory, getCards, type BlogCategory } from "@/lib/blog";
import { blogListJsonLd, JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { BlogListing } from "@/components/blog/blog-listing";

type Props = { params: Promise<{ lang: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const counts = countByCategory();
  return i18n.locales.flatMap((lang) =>
    blogCategories.filter((c) => counts[c] > 0).map((category) => ({ lang, category })),
  );
}

const isCategory = (c: string): c is BlogCategory => (blogCategories as readonly string[]).includes(c);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isLocale(lang) || !isCategory(category)) return {};
  const { blog } = await getDictionary(lang);
  const name = blog.categories[category];
  const titles = getCards(lang)
    .filter((c) => c.category === category)
    .slice(0, 4)
    .map((c) => c.title)
    .join(", ");
  return pageMetadata({
    lang,
    path: `/blog/category/${category}`,
    title: `${name} — ${blog.meta.title}`,
    description: `${name}: ${titles}.`.slice(0, 300),
  });
}

/** One topic: every article of the category on a single page. */
export default async function BlogCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLocale(lang) || !isCategory(category)) notFound();
  const dict = await getDictionary(lang);
  const cards = getCards(lang).filter((c) => c.category === category);
  const name = dict.blog.categories[category];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({ lang, path: `/blog/category/${category}`, type: "CollectionPage", name, description: dict.blog.meta.description })}
      />
      <JsonLd data={blogListJsonLd({ lang, name, description: dict.blog.meta.description, posts: cards })} />
      <BlogListing lang={lang} dict={dict} cards={cards} total={cards.length} category={category} />
    </>
  );
}
