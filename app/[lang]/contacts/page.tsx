import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { ContactOnboarding } from "@/components/contact/contact-onboarding";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { contacts } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contacts",
    title: contacts.meta.title,
    description: contacts.meta.description,
  });
}

export default async function ContactsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { contacts, contact } = dict;

  const channels = [
    { icon: Mail, label: contacts.emailLabel, value: siteConfig.email, href: `mailto:${siteConfig.email}`, external: false },
    { icon: Send, label: contacts.telegramLabel, value: siteConfig.telegram.handle, href: siteConfig.telegram.bot, external: true },
    ...(siteConfig.phone
      ? [
          {
            icon: Phone,
            label: contacts.phoneLabel,
            value: siteConfig.phone,
            href: `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`,
            external: false,
          },
        ]
      : []),
  ];

  return (
    <main>
      <JsonLd
        data={webPageJsonLd({ lang, path: "/contacts", type: "ContactPage", name: contacts.meta.title, description: contacts.meta.description })}
      />
      <PageHeader
        title={contacts.title}
        lead={contact.lead}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: contacts.meta.title, href: `/${lang}/contacts` },
        ]}
      />

      <section id="contact" className="shell scroll-mt-24 pb-20">
        <ContactOnboarding
          lang={lang}
          dict={dict.onboarding}
          form={dict.contactForm}
          brief={dict.brief}
          terminal={dict.hero.terminal}
          aside={
            <ul className="mt-6 flex flex-col gap-2">
              {channels.map(({ icon: IconCmp, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-3xl bg-paper p-4 transition-colors duration-300 hover:bg-mist"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-violet transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12">
                      <IconCmp className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="block truncate font-display font-extrabold">{value}</span>
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 text-violet transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 rounded-3xl bg-paper p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-violet">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{contacts.cityLabel}</span>
                  <span className="block font-display font-extrabold">{contacts.city}</span>
                </span>
              </li>
            </ul>
          }
        />
      </section>
    </main>
  );
}
