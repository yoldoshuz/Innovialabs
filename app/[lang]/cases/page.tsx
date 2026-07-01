import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { CasesView } from "@/components/pages/cases/cases-view";

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { cases } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/cases",
    title: cases.meta.title,
    description: cases.meta.description,
  });
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main>
      <PageHero
        badge={dict.cases.hero.badge}
        title={dict.cases.hero.title}
        subtitle={dict.cases.hero.subtitle}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.cases.meta.title },
        ]}
      />
      <CasesView lang={lang} dict={dict.cases} />
      <CtaBand lang={lang} dict={dict.ctaBand} />
    </main>
  );
}
