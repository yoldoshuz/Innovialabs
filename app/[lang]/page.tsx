import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";

import { Hero } from "@/components/pages/home/hero";
import { TrustBar } from "@/components/pages/home/trust-bar";
import { Expertise } from "@/components/pages/home/expertise";
import { Platform } from "@/components/pages/home/platform";
import { Results } from "@/components/pages/home/results";
import { Process } from "@/components/pages/home/process";
import { SocialProof } from "@/components/pages/home/social-proof";
import { Faq } from "@/components/pages/home/faq";
import { Cta } from "@/components/pages/home/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  // Structured data — Organization + FAQ (Schema.org) for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: `${siteConfig.url}/${lang}`,
        description: dict.meta.description,
        email: siteConfig.email,
        sameAs: Object.values(siteConfig.social),
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero dict={dict.hero} />
        <TrustBar dict={dict.trust} />
        <Expertise dict={dict.expertise} />
        <Platform dict={dict.platform} />
        <Results dict={dict.results} />
        <Process dict={dict.process} />
        <SocialProof dict={dict.social} />
        <Faq dict={dict.faq} />
        <Cta dict={dict.cta} />
      </main>
    </>
  );
}
