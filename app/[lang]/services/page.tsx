import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { ServicesView } from "@/components/pages/services/services-view";

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
  const { services } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/services",
    title: services.meta.title,
    description: services.meta.description,
  });
}

export default async function ServicesPage({
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
        badge={dict.services.hero.badge}
        title={dict.services.hero.title}
        subtitle={dict.services.hero.subtitle}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.services.meta.title },
        ]}
      />
      <ServicesView lang={lang} dict={dict.services} />
      <CtaBand lang={lang} dict={dict.ctaBand} />
    </main>
  );
}
