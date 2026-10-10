import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { faqJsonLd, JsonLd, servicesJsonLd, webPageJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { MarqueeBand } from "@/components/home/marquee-band";
import { Showreel } from "@/components/home/showreel";
import { TechMarquee } from "@/components/tech/tech-marquee";
import { ServicesGrid } from "@/components/home/services-grid";
import { AiBlock } from "@/components/home/ai-block";
import { TelegramBlock } from "@/components/home/telegram-block";
import { Why } from "@/components/home/why";
import { Process } from "@/components/home/process";
import { CasesShowcase } from "@/components/home/cases-showcase";
import { Faq } from "@/components/home/faq";
import { BlogTeaser } from "@/components/blog/blog-teaser";
import { CtaBand } from "@/components/contact/cta-band";

/** Home: block order follows the approved copy; stack and formats live on /company and /services. */
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main>
      <JsonLd data={faqJsonLd(dict.faq.items)} />
      <JsonLd data={webPageJsonLd({ lang, path: "", name: dict.meta.title, description: dict.meta.description })} />
      <JsonLd data={servicesJsonLd(lang, dict.services.meta.title, dict.services.items)} />
      <Hero lang={lang} dict={dict.hero} trust={dict.trust} />
      <MarqueeBand slogan={dict.meta.slogan} />
      <Showreel labels={dict.media} />
      <ServicesGrid lang={lang} dict={dict.services} />
      <TechMarquee title={dict.stack.title} href={`/${lang}/company#stack`} more={dict.services.more} />
      <AiBlock lang={lang} dict={dict.ai} />
      <TelegramBlock lang={lang} dict={dict.telegram} />
      <Why dict={dict.why} />
      <Process dict={dict.process} />
      <CasesShowcase lang={lang} dict={dict.cases} />
      <BlogTeaser lang={lang} dict={dict.blog} />
      <Faq dict={dict.faq} />
      <CtaBand lang={lang} title={dict.contact.title} lead={dict.contact.lead} cta={dict.nav.cta} />
    </main>
  );
}
