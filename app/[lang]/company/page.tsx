import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { CompanyView } from "@/components/pages/company/company-view";

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
  const { company } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/company",
    title: company.meta.title,
    description: company.meta.description,
  });
}

export default async function CompanyPage({
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
        badge={dict.company.hero.badge}
        title={dict.company.hero.title}
        subtitle={dict.company.hero.subtitle}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.company.meta.title },
        ]}
      />
      <CompanyView dict={dict.company} />
      <CtaBand lang={lang} dict={dict.ctaBand} />
    </main>
  );
}
