import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Why } from "@/components/home/why";
import { Process } from "@/components/home/process";
import { Formats } from "@/components/home/stack-formats";
import { TechWall } from "@/components/tech/tech-wall";
import { LogoVideo } from "@/components/brand/logo-video";
import { CtaBand } from "@/components/contact/cta-band";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { company } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/company",
    title: company.meta.title,
    description: company.meta.description,
  });
}

/** About + how we work. Copy comes from the brand book and approved texts. */
export default async function CompanyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { company } = dict;

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({ lang, path: "/company", type: "AboutPage", name: company.meta.title, description: company.meta.description })}
      />
      <PageHeader
        title={company.title}
        lead={company.lead}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: company.meta.title, href: `/${lang}/company` },
        ]}
      />

      {/* The animated mark, then slogan + signature (brand book p.03). */}
      <section data-tone="dark" className="px-2 sm:px-3">
        <div className="stage overflow-hidden">
          <LogoVideo
            label={`${siteConfig.name}: ${dict.meta.slogan}`}
            className="aspect-[9/16] w-full max-h-[85svh] min-[701px]:aspect-video"
          />
          <div className="shell grid gap-6 pb-12 pt-4 sm:pb-16 md:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold text-lilac">{company.sloganLabel}</p>
              <p className="mt-3 font-display text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                {dict.meta.slogan}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="md:text-right">
              <p className="slant font-display text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-lilac md:mt-8">
                {siteConfig.signature}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Why dict={dict.why} />
      <Process dict={dict.process} />
      <TechWall title={dict.stack.title} lead={dict.stack.lead} labels={dict.stack.categories} />
      <Formats dict={dict.formats} />
      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
