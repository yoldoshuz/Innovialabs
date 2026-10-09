import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { caseJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { caseMeta, caseSlugs, type CaseSlug } from "@/lib/content";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Prompt } from "@/components/brand/spark";
import { Button } from "@/components/ui/button";
import { BrowserShot, PhoneShot } from "@/components/cases/shots";
import { ContactSection } from "@/components/contact/contact-section";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) => caseSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { cases } = await getDictionary(lang);
  const item = cases.items.find((c) => c.slug === slug);
  if (!item) return {};
  return pageMetadata({
    lang,
    path: `/cases/${slug}`,
    title: `${item.name}: ${item.tagline}`,
    description: `${item.task} ${item.did}`.slice(0, 300),
    type: "article",
  });
}

export default async function CasePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { cases } = dict;
  const l = cases.labels;
  const index = cases.items.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const item = cases.items[index];
  const next = cases.items[(index + 1) % cases.items.length];
  const meta = caseMeta[slug as CaseSlug];

  const metaRows = [
    { label: l.client, value: item.client },
    { label: l.industry, value: item.industry },
    ...(meta.year ? [{ label: l.year, value: String(meta.year) }] : []),
    { label: l.platforms, value: item.platforms },
  ];

  return (
    <main>
      <JsonLd
        data={caseJsonLd({
          lang,
          slug,
          name: item.name,
          description: `${item.task} ${item.did}`,
          image: meta.shot,
          year: meta.year,
          url: meta.url,
        })}
      />
      <PageHeader
        title={item.name}
        lead={item.tagline}
        titleClassName="text-[clamp(3.25rem,10vw,10rem)]"
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: cases.meta.title, href: `/${lang}/cases` },
          { label: item.name, href: `/${lang}/cases/${slug}` },
        ]}
      >
        <Reveal delay={0.3} className="mt-10">
          <Button asChild size="xl" variant="night">
            <a href={meta.url} target="_blank" rel="noopener noreferrer">
              {l.openSite}
              <span className="type-accent font-medium text-lilac">{meta.host}</span>
              <ArrowUpRight />
            </a>
          </Button>
        </Reveal>
      </PageHeader>

      {/* Showcase */}
      <section className="px-2 sm:px-3">
        <div className="relative overflow-hidden rounded-[clamp(2rem,4vw,3.5rem)] bg-violet px-4 pt-8 sm:px-10 sm:pt-14 lg:px-16 lg:pt-20">
          <Reveal className="relative mx-auto max-w-6xl">
            <BrowserShot
              src={meta.shot}
              host={meta.host}
              alt={`${item.name} — ${l.desktop}`}
              priority
              className="rounded-b-none"
            />
            <div className="absolute -right-2 bottom-8 hidden w-[19%] max-w-52 sm:block lg:-right-10">
              <PhoneShot src={meta.shotMobile} alt={`${item.name} — ${l.mobile}`} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell mt-3">
        <dl className="grid grid-cols-2 gap-3 md:grid-flow-col md:auto-cols-fr">
          {metaRows.map((row) => (
            <div key={row.label} className="rounded-3xl bg-paper p-5">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="mt-1 font-display font-bold leading-snug">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Task / what we did */}
      <section className="section shell grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="type-title slant">{l.task}</h2>
          <p className="type-lead mt-6 text-muted">{item.task}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="type-title slant text-violet">{l.did}</h2>
          <p className="type-lead mt-6">{item.did}</p>
        </Reveal>
      </section>

      {/* Features + numbers */}
      <section data-tone="dark" className="px-2 sm:px-3">
        <div className="stage">
          <div className="shell grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
            <ul className="flex flex-col lg:col-span-7">
              {item.features.map((f, i) => (
                <Reveal
                  as="li"
                  key={f}
                  delay={i * 0.04}
                  className="flex items-start gap-4 border-b border-white/10 py-5 text-lg first:pt-0 last:border-0"
                >
                  <Prompt className="mt-2 h-3.5 shrink-0 text-lilac" />
                  {f}
                </Reveal>
              ))}
            </ul>
            <div className="lg:col-span-5">
              <h2 className="type-subtitle">{l.facts}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {item.facts.map((fact, i) => (
                  <Reveal as="li" key={fact.label} delay={i * 0.06} className="card-night flex items-center gap-5 p-6">
                    <span className="type-accent w-24 shrink-0 text-5xl font-bold leading-none text-lilac">
                      {fact.value}
                    </span>
                    <span className="font-medium">{fact.label}</span>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-8 text-sm text-dim">{l.stack}</p>
              <p className="mt-1 font-display text-lg font-bold">{meta.stack.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next case */}
      <section className="shell pt-16 sm:pt-24">
        <Link
          href={`/${lang}/cases/${next.slug}`}
          className="group flex flex-col gap-4 rounded-[2rem] bg-mist p-7 transition-colors duration-500 hover:bg-violet hover:text-white sm:flex-row sm:items-end sm:justify-between sm:p-12"
        >
          <span>
            <span className="block text-muted transition-colors group-hover:text-white/75">{l.nextCase}</span>
            <span className="slant mt-2 block font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">
              {next.name}
            </span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-violet text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-2 group-hover:bg-white group-hover:text-violet">
            <ArrowRight className="size-7" />
          </span>
        </Link>
      </section>

      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
