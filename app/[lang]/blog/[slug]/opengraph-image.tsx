import { isLocale, i18n } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPost } from "@/lib/blog";
import { renderOg, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Innovialabs blog";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : i18n.defaultLocale;
  const dict = await getDictionary(locale);
  const post = getPost(locale, slug);
  return renderOg({
    kicker: post ? `${dict.blog.meta.title} · ${dict.blog.categories[post.category]}` : dict.blog.meta.title,
    title: post?.title ?? dict.blog.meta.title,
    subtitle: post?.summary,
  });
}
