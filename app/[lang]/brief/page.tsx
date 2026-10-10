import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Mail, Send } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { ContactOnboarding } from "@/components/contact/contact-onboarding";
import { BriefFromQuery } from "@/components/contact/brief-from-query";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { brief } = await getDictionary(lang);
  return pageMetadata({ lang, path: "/brief", title: brief.meta.title, description: brief.meta.description });
}

/** "Discuss a project": the same six-step brief as /contacts, full screen. */
export default async function BriefPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const channels = [
    { icon: Send, value: siteConfig.telegram.handle, href: siteConfig.telegram.bot, external: true },
    { icon: Mail, value: siteConfig.email, href: `mailto:${siteConfig.email}`, external: false },
  ];
  const props = {
    lang,
    dict: dict.onboarding,
    form: dict.contactForm,
    brief: dict.brief,
    terminal: dict.hero.terminal,
    aside: (
      <>
        <p className="mt-8 font-display font-bold text-muted">{dict.brief.or}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {channels.map(({ icon: IconCmp, value, href, external }) => (
            <a
              key={value}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-3 rounded-3xl bg-paper p-4 transition-colors duration-300 hover:bg-mist"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-violet transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12">
                <IconCmp className="size-5" />
              </span>
              <span className="min-w-0 truncate font-display font-extrabold">{value}</span>
            </a>
          ))}
        </div>
      </>
    ),
  };

  return (
    <main className="shell min-h-dvh pb-24 pt-32 sm:pt-40">
      <JsonLd
        data={webPageJsonLd({ lang, path: "/brief", type: "ContactPage", name: dict.brief.meta.title, description: dict.brief.meta.description })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: `/${lang}` },
          { name: dict.brief.meta.title, path: `/${lang}/brief` },
        ])}
      />
      <h1 className="sr-only">{dict.brief.meta.title}</h1>
      {/* ?service=… preselects "what needs to be done"; static render has none. */}
      <Suspense fallback={<ContactOnboarding {...props} />}>
        <BriefFromQuery {...props} />
      </Suspense>
    </main>
  );
}
