import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { caseSlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { CaseDetail } from "@/components/pages/cases/case-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) =>
    caseSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { cases } = await getDictionary(lang);
  const item = cases.items.find((c) => c.slug === slug);
  if (!item) return {};
  return pageMetadata({
    lang,
    path: `/cases/${slug}`,
    title: item.title,
    description: item.summary,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const item = dict.cases.items.find((c) => c.slug === slug);
  if (!item) notFound();

  return (
    <main>
      <PageHero
        badge={item.tag}
        title={item.title}
        subtitle={item.summary}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.cases.meta.title, href: `/${lang}/cases` },
          { label: item.title },
        ]}
      />
      <CaseDetail lang={lang} item={item} dict={dict.cases} />
      <CtaBand lang={lang} dict={dict.ctaBand} />
    </main>
  );
}
