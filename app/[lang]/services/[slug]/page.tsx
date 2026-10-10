import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { i18n, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, serviceJsonLd, webPageJsonLd } from "@/lib/seo";
import { serviceMeta, serviceSlugs, type ServiceSlug } from "@/lib/content";
import { tones } from "@/lib/tone";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { GiantTitle } from "@/components/motion/giant-title";
import { Icon } from "@/components/brand/icon";
import { Prompt, Spark } from "@/components/brand/spark";
import { ContactCta } from "@/components/contact/contact-cta";
import { CtaBand } from "@/components/contact/cta-band";
import { CaseCard } from "@/components/cases/case-card";
import { ServiceStory } from "@/components/services/service-story";
import { Calculator } from "@/components/home/ai-block";
import { Formats } from "@/components/home/stack-formats";
import { cn } from "@/lib/utils";

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

/**
 * Service page. Shared frame (header, story, closer), but every service
 * brings its own scene, tone and extra block: the AI calculator, Telegram's
 * bots vs Mini Apps, formats for consulting, cases where we have them and
 * "what you get" where we don't.
 */
export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { services, cases } = dict;
  const index = services.items.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const item = services.items[index];
  const meta = serviceMeta[slug as ServiceSlug];
  const tone = tones[meta.tone];
  const related = (meta.cases ?? [])
    .map((c) => cases.items.find((x) => x.slug === c))
    .filter((x) => x !== undefined);
  const others = services.items.filter((s) => s.slug !== slug);
  const sceneLabels =
    slug === "telegram"
      ? [
          ...item.scene,
          dict.telegram.mock.bot,
          dict.telegram.mock.online,
          dict.telegram.mock.greeting,
          dict.telegram.mock.open,
          dict.telegram.mock.catalog,
          dict.telegram.mock.item1,
          dict.telegram.mock.item2,
          dict.telegram.mock.pay,
        ]
      : item.scene;

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({ lang, path: `/services/${slug}`, name: item.title, description: item.subtitle })}
      />
      <JsonLd data={serviceJsonLd({ lang, item, steps: item.steps })} />
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
        <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-5">
          <ContactCta lang={lang} label={dict.nav.cta} service={meta.form} />
          <p className="max-w-xs text-muted">{dict.hero.note}</p>
        </Reveal>
      </PageHeader>

      {/* What we do: the approved points, big, next to the service mark. */}
      <section className="shell">
        <div className="grid gap-10 border-t-2 border-ink pt-10 lg:grid-cols-12 lg:pt-14">
          <div className="flex items-start justify-between gap-6 lg:col-span-4 lg:flex-col">
            <h2 className="type-title slant">{services.includesTitle}</h2>
            <span
              className={cn(
                "grid size-24 shrink-0 place-items-center rounded-[2rem] transition-transform duration-700 ease-[var(--ease-spring)] hover:-rotate-12 sm:size-32 lg:size-40",
                tone.bg,
              )}
            >
              <Icon name={meta.icon} className="size-10 sm:size-14 lg:size-16" />
            </span>
          </div>
          <ul className="lg:col-span-8">
            {item.points.map((point, i) => (
              <Reveal
                as="li"
                key={point}
                delay={i * 0.05}
                className="flex items-start gap-4 border-b border-line py-5 first:pt-0 sm:gap-6 sm:py-6"
              >
                <Prompt className="mt-[0.45em] h-4 shrink-0 text-violet sm:h-5" />
                <span className="font-display text-[clamp(1.25rem,2.4vw,2rem)] font-bold leading-snug tracking-[-0.02em]">
                  {point}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ServiceStory slug={slug as ServiceSlug} title={services.howTitle} steps={item.steps} labels={sceneLabels} tone={meta.tone} />

      {/* Service-specific block. */}
      {slug === "ai" ? (
        <section data-tone="dark" className="px-2 sm:px-3">
          <div className="stage relative overflow-hidden">
            <div aria-hidden className="pattern-prompt absolute inset-0 opacity-[0.06]" />
            <div className="shell relative grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                  {dict.ai.title}
                </h2>
                <p className="type-lead mt-6 max-w-2xl text-dim">{dict.ai.text}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {dict.ai.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-violet">
                        <Check className="size-4" strokeWidth={3} />
                      </span>
                      <span className="font-medium leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Reveal delay={0.1} className="lg:col-span-5">
                <Calculator dict={dict.ai.calc} />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {slug === "telegram" ? (
        <section className="shell">
          <Reveal className="rounded-[clamp(2rem,4vw,3.5rem)] bg-violet p-7 text-white sm:p-12 lg:p-16">
            <p className="slant font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
              {dict.telegram.why}
            </p>
          </Reveal>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {[dict.telegram.bots, dict.telegram.apps].map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.08} className="rounded-[2rem] bg-paper p-7 sm:p-10">
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold tracking-[-0.03em]">{group.title}</h3>
                <ul className="mt-6 flex flex-col gap-3">
                  {group.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-lg leading-snug">
                      <Prompt className="mt-[0.45em] h-3 shrink-0 text-violet" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {slug === "consulting" ? <Formats dict={dict.formats} /> : null}

      {/* Cases where we have them; otherwise what the client walks away with. */}
      {related.length ? (
        <section className="section shell">
          <GiantTitle className="text-[clamp(2.5rem,6.4vw,6.5rem)]">{services.casesTitle}</GiantTitle>
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {related.slice(0, 4).map((c, i) => (
              <CaseCard key={c.slug} lang={lang} item={c} index={i} large={related.length === 1 || (related.length === 3 && i === 0)} />
            ))}
          </div>
        </section>
      ) : item.get ? (
        <section data-tone={tone.dark ? "dark" : undefined} className={cn("px-2 sm:px-3", slug === "consulting" ? "" : "mt-[clamp(1rem,4vw,3rem)]")}>
          <div className={cn("relative overflow-hidden rounded-[clamp(2rem,4vw,3.5rem)]", tone.bg)}>
            <div className="shell py-16 sm:py-24">
              <GiantTitle className="text-[clamp(2.5rem,6.4vw,6.5rem)]">{services.getTitle}</GiantTitle>
              <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {item.get.map((g, i) => (
                  <Reveal as="li" key={g} delay={i * 0.06} className="group flex items-start gap-4">
                    <Spark className={cn("mt-1 size-7 shrink-0 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:rotate-90 group-hover:scale-125", tone.accent)} />
                    <span className="font-display text-[clamp(1.35rem,2.4vw,2rem)] font-extrabold leading-tight tracking-[-0.025em]">
                      {g}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* Other services as one line of giant links. */}
      <section className="shell pt-[clamp(4.5rem,10vw,9rem)]">
        <h2 className="type-subtitle text-muted">{services.otherTitle}</h2>
        <ul className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {others.map((s, i) => (
            <li key={s.slug} className="flex items-baseline gap-3">
              <Link
                href={`/${lang}/services/${s.slug}`}
                className="link-underline font-display text-[clamp(1.5rem,3.4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em] transition-colors duration-300 hover:text-violet"
              >
                {s.title}
              </Link>
              {i < others.length - 1 ? (
                <Spark className="size-4 shrink-0 text-lilac sm:size-5" />
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} service={meta.form} />
    </main>
  );
}
