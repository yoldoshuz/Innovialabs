import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, servicesJsonLd, webPageJsonLd } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { ServicesIndex } from "@/components/services/services-index";
import { Formats } from "@/components/home/stack-formats";
import { CtaBand } from "@/components/contact/cta-band";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

/** Services as a giant numbered index; the home page keeps the card grid. */
export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { services } = dict;

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({ lang, path: "/services", type: "CollectionPage", name: services.meta.title, description: services.meta.description })}
      />
      <JsonLd data={servicesJsonLd(lang, services.meta.title, services.items)} />
      <PageHeader
        title={services.title}
        lead={services.lead}
        titleClassName="max-w-6xl text-[clamp(2.5rem,7.4vw,7.5rem)]"
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: services.meta.title, href: `/${lang}/services` },
        ]}
      />
      <ServicesIndex lang={lang} dict={services} />
      <Formats dict={dict.formats} />
      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
