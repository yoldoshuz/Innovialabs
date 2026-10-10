import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { caseJsonLd, JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { caseMeta, caseSlugs, type CaseSlug } from "@/lib/content";
import { tones } from "@/lib/tone";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Route } from "@/components/motion/route";
import { FlowArrow } from "@/components/motion/flow-arrow";
import { Button } from "@/components/ui/button";
import { CaseMotif } from "@/components/cases/motif";
import { CtaBand } from "@/components/contact/cta-band";
import { cn } from "@/lib/utils";

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

/** One template for every case: cover → task → what we did → route of features. */
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
  const nextMeta = caseMeta[next.slug as CaseSlug];
  const tone = tones[meta.tone];

  const metaRows = [
    { label: l.client, value: item.client },
    { label: l.industry, value: item.industry },
    ...(meta.year ? [{ label: l.year, value: String(meta.year) }] : []),
    { label: l.platforms, value: item.platforms },
    ...(meta.stack.length ? [{ label: l.stack, value: meta.stack.join(" · ") }] : []),
  ];

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({
          lang,
          path: `/cases/${slug}`,
          type: "ItemPage",
          name: `${item.name}: ${item.tagline}`,
          description: item.task,
        })}
      />
      <JsonLd
        data={caseJsonLd({
          lang,
          slug,
          name: item.name,
          headline: `${item.name}: ${item.tagline}`,
          description: `${item.task} ${item.did}`,
          about: item.industry,
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
        {meta.url ? (
          <Reveal delay={0.3} className="mt-10">
            <Button asChild size="xl" variant="night">
              <a href={meta.url} target="_blank" rel="noopener noreferrer">
                {l.openSite}
                <span className="type-accent font-medium text-lilac">{meta.host}</span>
                <ArrowUpRight />
              </a>
            </Button>
          </Reveal>
        ) : null}
      </PageHeader>

      {/* Cover: the numbers and the motif, in the case's tone. */}
      <section data-tone={tone.dark ? "dark" : undefined} className="px-2 sm:px-3">
        <div className={cn("relative overflow-hidden rounded-[clamp(2rem,4vw,3.5rem)]", tone.bg)}>
          <div className="shell grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12">
            <dl className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1">
              {item.facts.map((fact, i) => (
                <Reveal key={fact.label} delay={i * 0.1}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="type-accent block text-[clamp(4.5rem,11vw,10rem)] font-bold leading-[0.85] tracking-[-0.04em]">
                      {fact.value}
                    </span>
                    <span className={cn("mt-3 block font-display text-xl font-bold sm:text-2xl", tone.muted)}>
                      {fact.label}
                    </span>
                  </dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.15} className="lg:col-span-5">
              <CaseMotif slug={slug as CaseSlug} className="mx-auto w-full max-w-[26rem]" />
            </Reveal>
          </div>
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

      {/* Task → what we did, joined by a drawn arrow. */}
      <section className="section shell grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        <Reveal>
          <h2 className="type-title slant">{l.task}</h2>
          <p className="type-lead mt-6 text-muted">{item.task}</p>
        </Reveal>
        <FlowArrow className="mx-auto h-20 w-auto lg:hidden" vertical />
        <FlowArrow className="hidden w-32 lg:mt-24 lg:block xl:w-40" />
        <Reveal delay={0.1}>
          <h2 className="type-title slant text-violet">{l.did}</h2>
          <p className="type-lead mt-6">{item.did}</p>
        </Reveal>
      </section>

      {/* What's inside, as a route. */}
      <section className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="type-title slant lg:sticky lg:top-32">{l.inside}</h2>
        </div>
        <Route className="lg:col-span-7" items={item.features.map((text) => ({ text }))} />
      </section>

      {/* Next case: its own tone and motif. */}
      <section className="shell pt-[clamp(4.5rem,10vw,9rem)]">
        <Link
          href={`/${lang}/cases/${next.slug}`}
          className={cn(
            "group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-[2rem] p-7 sm:p-12",
            tones[nextMeta.tone].bg,
          )}
        >
          <CaseMotif
            slug={next.slug as CaseSlug}
            className="pointer-events-none absolute -right-6 -top-6 size-56 opacity-90 transition-transform duration-1000 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110 sm:right-10 sm:top-1/2 sm:size-72 sm:-translate-y-1/2"
          />
          <span className={cn("relative block", tones[nextMeta.tone].muted)}>{l.nextCase}</span>
          <span className="relative mt-2 flex items-end justify-between gap-6">
            <span className="slant block font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">
              {next.name}
            </span>
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-2">
              <ArrowRight className="size-7" />
            </span>
          </span>
        </Link>
      </section>

      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
