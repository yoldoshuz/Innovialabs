import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { serviceMeta, serviceSlugs, type ServiceSlug } from "@/lib/content";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { Prompt } from "@/components/brand/spark";
import { ContactCta } from "@/components/contact/contact-cta";
import { CaseCard } from "@/components/cases/case-card";
import { AiBlock } from "@/components/home/ai-block";
import { TelegramBlock } from "@/components/home/telegram-block";
import { Process } from "@/components/home/process";
import { ContactSection } from "@/components/contact/contact-section";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) => serviceSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { services } = await getDictionary(lang);
  const item = services.items.find((s) => s.slug === slug);
  if (!item) return {};
  return pageMetadata({
    lang,
    path: `/services/${slug}`,
    title: item.title,
    description: `${item.subtitle}. ${item.points.join(". ")}.`.slice(0, 300),
  });
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { services, cases } = dict;
  const item = services.items.find((s) => s.slug === slug);
  if (!item) notFound();
  const meta = serviceMeta[slug as ServiceSlug];
  const related = (meta.cases ?? [])
    .map((c) => cases.items.find((x) => x.slug === c))
    .filter((x) => x !== undefined);
  const others = services.items.filter((s) => s.slug !== slug);
  const intent = { service: meta.form, note: meta.form === "other" ? item.title : undefined };

  return (
    <main>
      <JsonLd
        data={serviceJsonLd({
          lang,
          slug,
          name: item.title,
          description: `${item.subtitle}. ${item.points.join("; ")}`,
        })}
      />
      <PageHeader
        title={item.title}
        lead={item.subtitle}
        titleClassName="max-w-6xl text-[clamp(2.5rem,7.6vw,7.5rem)]"
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: services.meta.title, href: `/${lang}/services` },
          { label: item.title, href: `/${lang}/services/${slug}` },
        ]}
      >
        <Reveal delay={0.3} className="mt-10">
          <ContactCta label={dict.nav.cta} intent={intent} />
        </Reveal>
      </PageHeader>

      {/* What we do (approved points) */}
      <section className="shell">
        <Reveal className="grid gap-3 lg:grid-cols-12">
          <div className="rounded-[2rem] bg-night p-7 text-white sm:p-10 lg:col-span-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="type-subtitle">{services.includesTitle}</h2>
              <Icon name={meta.icon} className="size-10 text-lilac" />
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {item.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-lg leading-snug">
                  <Prompt className="mt-2 h-3 shrink-0 text-lilac" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-[2rem] bg-violet p-7 text-white sm:p-10 lg:col-span-4">
            <p className="font-display text-2xl font-extrabold leading-tight tracking-[-0.02em]">
              {dict.hero.note}
            </p>
            <ContactCta label={dict.nav.cta} intent={intent} variant="white" size="lg" className="self-start" />
          </div>
        </Reveal>
      </section>

      {slug === "ai" ? (
        <div className="mt-16 sm:mt-24">
          <AiBlock dict={dict.ai} />
        </div>
      ) : null}
      {slug === "telegram" ? <TelegramBlock dict={dict.telegram} /> : null}

      {related.length ? (
        <section className="section shell">
          <h2 className="type-title slant">{cases.title}</h2>
          <div className="mt-10 grid gap-x-3 gap-y-12 md:grid-cols-2">
            {related.slice(0, 2).map((c, i) => (
              <CaseCard key={c.slug} lang={lang} item={c} index={i} />
            ))}
          </div>
        </section>
      ) : (
        <div className="h-8 sm:h-12" />
      )}

      <Process dict={dict.process} />

      <section className="shell">
        <h2 className="type-title slant">{services.otherTitle}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${lang}/services/${s.slug}`}
                className="group flex h-full items-center justify-between gap-4 rounded-3xl bg-paper p-5 font-display font-extrabold leading-tight transition-colors duration-300 hover:bg-violet hover:text-white"
              >
                {s.title}
                <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
