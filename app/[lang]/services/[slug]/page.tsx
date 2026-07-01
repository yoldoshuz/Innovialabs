import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { serviceSlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBand } from "@/components/shared/cta-band";
import { ServiceDetail } from "@/components/pages/services/service-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) =>
    serviceSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { services } = await getDictionary(lang);
  const service = services.items.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata({
    lang,
    path: `/services/${slug}`,
    title: service.title,
    description: service.summary,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const service = dict.services.items.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <main>
      <PageHero
        badge={dict.services.hero.badge}
        title={service.title}
        subtitle={service.summary}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.services.meta.title, href: `/${lang}/services` },
          { label: service.title },
        ]}
      />
      <ServiceDetail lang={lang} service={service} dict={dict.services} />
      <CtaBand lang={lang} dict={dict.ctaBand} />
    </main>
  );
}
