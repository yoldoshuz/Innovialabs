import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { i18n, isLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";
import { alternates, organizationJsonLd, JsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { YandexMetrika } from "@/components/analytics/yandex-metrika";
import { Intro, introScript } from "@/components/brand/intro";

// Guideline p.09: Manrope — headings, Inter — text/UI, Space Grotesk — latin
// accents only (no Cyrillic in that face, so it never carries body copy).
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

/** Pre-render every locale at build time. */
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = await getDictionary(lang);

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: meta.title, template: meta.titleTemplate },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    alternates: alternates(lang, ""),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: meta.ogTitle,
      description: meta.description,
      url: `/${lang}`,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: i18n.locales
        .filter((l) => l !== lang)
        .map((l) => localeMeta[l].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
    appleWebApp: { title: siteConfig.name, statusBarStyle: "default" },
    other: {
      "geo.region": "UZ-TK",
      "geo.placename": "Tashkent",
      "msapplication-TileColor": "#7C3AED",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang as Locale}
      className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        {/* Must run before first paint: decides whether the intro shows. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <Intro label={`${siteConfig.name}: ${dict.meta.slogan}`} skip={dict.media.skip} />
        <JsonLd
          data={organizationJsonLd({
            lang,
            description: dict.meta.description,
            slogan: dict.meta.slogan,
            services: dict.services.items.map((s) => s.title),
          })}
        />
        <SmoothScroll>
          <Header lang={lang} dict={dict.nav} />
          <div id="main" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer lang={lang} dict={dict.footer} nav={dict.nav} />
        </SmoothScroll>
        <YandexMetrika />
      </body>
    </html>
  );
}
