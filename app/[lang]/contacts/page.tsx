import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";

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
      <PageHeader
        title={contacts.title}
        lead={contact.lead}
        crumbs={[
          { label: dict.common.home, href: `/${lang}` },
          { label: contacts.meta.title, href: `/${lang}/contacts` },
        ]}
      />

      <section
        id="contact"
        className="shell grid scroll-mt-24 grid-cols-1 gap-3 pb-20 lg:grid-cols-12 [&>*]:min-w-0"
      >
        <div className="flex flex-col gap-3 lg:col-span-4">
          {channels.map(({ icon: IconCmp, label, value, href, external }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-3xl bg-paper p-5 transition-colors duration-300 hover:bg-mist"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-violet">
                  <IconCmp className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block truncate font-display text-lg font-extrabold">{value}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-violet transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.18} className="flex items-center gap-4 rounded-3xl bg-paper p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-violet">
              <MapPin className="size-5" />
            </span>
            <span>
              <span className="block text-sm text-muted">{contacts.cityLabel}</span>
              <span className="block font-display text-lg font-extrabold">{contacts.city}</span>
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <h2 className="type-subtitle mb-5">{contact.title}</h2>
          <ContactForm lang={lang} dict={dict.contactForm} telegramLabel={contact.telegram} />
        </Reveal>
      </section>
    </main>
  );
}
