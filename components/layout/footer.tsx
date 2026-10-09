import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { FooterDict, NavDict } from "@/types";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { BackToTop } from "@/components/layout/back-to-top";

export function Footer({
  lang,
  dict,
  nav,
}: {
  lang: Locale;
  dict: FooterDict;
  nav: NavDict;
}) {
  const year = new Date().getFullYear();
  const href = (h: string) => `/${lang}${h}`;

  return (
    <footer data-tone="dark" className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="stage">
        <div className="shell pb-8 pt-14 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Link href={`/${lang}`} aria-label={nav.home} className="inline-block">
                <Logo variant="white" className="h-10 sm:h-12" />
              </Link>
              <p className="mt-6 font-display text-2xl font-extrabold tracking-[-0.02em]">
                {dict.signature}
              </p>
              <p className="mt-2 max-w-sm text-dim">{dict.about}</p>
            </div>

            <FooterCol title={dict.servicesTitle} className="lg:col-span-3">
              {dict.services.map((l) => (
                <FooterLink key={l.label} href={href(l.href)}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title={dict.companyTitle} className="lg:col-span-2">
              {dict.company.map((l) => (
                <FooterLink key={l.label} href={href(l.href)}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title={dict.contactsTitle} className="lg:col-span-2">
              {siteConfig.phone ? (
                <FooterLink href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}>
                  {siteConfig.phone}
                </FooterLink>
              ) : null}
              <FooterLink href={`mailto:${siteConfig.email}`}>{siteConfig.email}</FooterLink>
              <FooterLink href={siteConfig.telegram.bot} external>
                Telegram
              </FooterLink>
              <li className="text-dim">{dict.city}</li>
            </FooterCol>
          </div>

          <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-dim sm:mt-20 sm:flex-row sm:items-center">
            <p>
              © {year} {siteConfig.legalName}. {dict.rights}
            </p>
            <BackToTop label={dict.toTop} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="font-display font-bold text-lilac">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls = "link-underline text-white/85 transition-colors hover:text-white";
  const plain = external || href.startsWith("mailto:") || href.startsWith("tel:");
  return (
    <li>
      {plain ? (
        <a
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
