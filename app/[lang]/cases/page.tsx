import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { CaseCard } from "@/components/cases/case-card";
import { ContactSection } from "@/components/contact/contact-section";

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

  return (
    <main>
      <PageHeader
        title={cases.title}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: cases.meta.title, href: `/${lang}/cases` },
        ]}
        titleClassName="max-w-6xl text-[clamp(2.75rem,8vw,8.5rem)]"
      />

      <section className="shell grid gap-x-3 gap-y-14 md:grid-cols-2">
        {cases.items.map((item, i) => (
          <CaseCard key={item.slug} lang={lang} item={item} index={i} large={i === 0} priority={i === 0} />
        ))}
      </section>

      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
