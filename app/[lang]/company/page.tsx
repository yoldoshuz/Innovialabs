import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Why } from "@/components/home/why";
import { Process } from "@/components/home/process";
import { Stack, Formats } from "@/components/home/stack-formats";
import { ContactSection } from "@/components/contact/contact-section";

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
      <PageHeader
        title={company.title}
        lead={company.lead}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: company.meta.title, href: `/${lang}/company` },
        ]}
      />

      {/* Slogan + signature (brand book p.03) */}
      <section className="shell grid gap-3 md:grid-cols-2">
        <Reveal className="rounded-[2rem] bg-mist p-7 sm:p-10">
          <p className="text-sm font-semibold text-violet">{company.sloganLabel}</p>
          <p className="mt-4 font-display text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            {siteConfig.slogan}
          </p>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col justify-between gap-8 rounded-[2rem] bg-night p-7 text-white sm:p-10">
          <Image
            src={siteConfig.logo.horizontalWhite}
            alt={siteConfig.name}
            width={468}
            height={120}
            unoptimized
            className="h-10 w-auto self-start sm:h-12"
          />
          <p className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            {siteConfig.signature}
          </p>
        </Reveal>
      </section>

      {/* Logo idea (brand book p.04) */}
      <section className="section shell grid items-center gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="grid aspect-[4/3] place-items-center rounded-[2rem] bg-paper">
            <Image
              src={siteConfig.logo.mark}
              alt={siteConfig.name}
              width={320}
              height={320}
              unoptimized
              className="w-1/2 transition-transform duration-700 ease-[var(--ease-spring)] hover:scale-110"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <h2 className="type-title slant">{company.logoTitle}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {company.logoParts.map((part, i) => (
              <Reveal as="li" key={part.title} delay={i * 0.06} className="rounded-3xl bg-paper p-6">
                <span className="type-accent grid size-12 place-items-center rounded-2xl bg-white text-2xl font-bold text-violet">
                  {part.symbol}
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold">{part.title}</h3>
                <p className="mt-1.5 text-muted">{part.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Why dict={dict.why} />
      <Process dict={dict.process} />
      <Stack dict={dict.stack} />
      <Formats dict={dict.formats} />
      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
