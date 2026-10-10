import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { casesListJsonLd, JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { CaseCard } from "@/components/cases/case-card";
import { CtaBand } from "@/components/contact/cta-band";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function CasesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { cases } = dict;
  const n = cases.items.length;

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({ lang, path: "/cases", type: "CollectionPage", name: cases.meta.title, description: cases.meta.description })}
      />
      <JsonLd data={casesListJsonLd(lang, cases.items)} />
      <PageHeader
        title={cases.title}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: cases.meta.title, href: `/${lang}/cases` },
        ]}
        titleClassName="max-w-6xl text-[clamp(2.75rem,8vw,8.5rem)]"
      />

      <section className="shell grid gap-3 md:grid-cols-2">
        {cases.items.map((item, i) => (
          <CaseCard
            key={item.slug}
            lang={lang}
            item={item}
            index={i}
            as="h2"
            // First tile is wide; so is the last when it would sit alone.
            large={i === 0 || (i === n - 1 && (n - 1) % 2 === 1)}
          />
        ))}
      </section>

      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
