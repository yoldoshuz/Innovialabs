import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { i18n, isLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// All three ship a Cyrillic subset (required for the RU base locale).
// Bound to the token names consumed in globals.css `@theme`.
const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

// Heavy geometric grotesque for gigantism display headings.
const display = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono-code",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05070f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

type LayoutParams = { params: Promise<{ lang: string }> };

/** Pre-render every locale at build time. */
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const { meta } = dict;

  // hreflang alternates for every locale + x-default.
  const languages = Object.fromEntries(
    i18n.locales.map((l) => [localeMeta[l].hreflang, `/${l}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: meta.title, template: meta.titleTemplate },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...languages, "x-default": `/${i18n.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: i18n.locales
        .filter((l) => l !== lang)
        .map((l) => localeMeta[l].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang as Locale}
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <AmbientBackground />
        <SmoothScroll>
          <Header lang={lang} dict={dict.nav} />
          {children}
          <Footer lang={lang} dict={dict.footer} />
        </SmoothScroll>
      </body>
    </html>
  );
}
