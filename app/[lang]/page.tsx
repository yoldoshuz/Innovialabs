import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { faqJsonLd, JsonLd, servicesJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { MarqueeBand } from "@/components/home/marquee-band";
import { ServicesGrid } from "@/components/home/services-grid";
import { AiBlock } from "@/components/home/ai-block";
import { TelegramBlock } from "@/components/home/telegram-block";
import { Why } from "@/components/home/why";
import { Process } from "@/components/home/process";
import { CasesShowcase } from "@/components/home/cases-showcase";
import { Faq } from "@/components/home/faq";
import { ContactSection } from "@/components/contact/contact-section";

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
      <JsonLd data={servicesJsonLd(lang, dict.services.items)} />
      <Hero lang={lang} dict={dict.hero} trust={dict.trust} />
      <MarqueeBand />
      <ServicesGrid lang={lang} dict={dict.services} />
      <AiBlock dict={dict.ai} />
      <TelegramBlock dict={dict.telegram} />
      <Why dict={dict.why} />
      <Process dict={dict.process} />
      <CasesShowcase lang={lang} dict={dict.cases} />
      <Faq dict={dict.faq} />
      <ContactSection lang={lang} dict={dict.contact} form={dict.contactForm} />
    </main>
  );
}
