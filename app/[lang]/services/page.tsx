import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, servicesJsonLd } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { ServicesGrid } from "@/components/home/services-grid";
import { Formats } from "@/components/home/stack-formats";
import { ContactSection } from "@/components/contact/contact-section";

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

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { services } = dict;

  return (
    <main>
      <JsonLd data={servicesJsonLd(lang, services.items)} />
      <PageHeader
        title={services.title}
        lead={services.lead}
        titleClassName="max-w-6xl text-[clamp(2.5rem,7.4vw,7.5rem)]"
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: services.meta.title, href: `/${lang}/services` },
        ]}
      />
      <ServicesGrid lang={lang} dict={services} heading={false} />
      <Formats dict={dict.formats} />
      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
