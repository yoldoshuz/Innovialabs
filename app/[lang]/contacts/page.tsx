import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/shared/contact-form";
import { ContactsInfo } from "@/components/pages/contacts/contacts-info";

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
  const { contacts } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contacts",
    title: contacts.meta.title,
    description: contacts.meta.description,
  });
}

export default async function ContactsPage({
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
        badge={dict.contacts.hero.badge}
        title={dict.contacts.hero.title}
        subtitle={dict.contacts.hero.subtitle}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.contacts.meta.title },
        ]}
      />
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ContactsInfo dict={dict.contacts} />
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm dict={dict.cta.form} />
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
