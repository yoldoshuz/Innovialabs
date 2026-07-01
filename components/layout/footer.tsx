import type { SVGProps } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { FooterDict } from "@/types";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/layout/logo";
import { GiantMarquee } from "@/components/shared/giant-marquee";
import { siteConfig } from "@/lib/site";

export function Footer({ lang, dict }: { lang: Locale; dict: FooterDict }) {
  const year = 2026;
  const socials = [
    { href: siteConfig.social.telegram, icon: TelegramIcon, label: "Telegram" },
    { href: siteConfig.social.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: siteConfig.social.github, icon: GitHubIcon, label: "GitHub" },
  ];

  return (
    <footer className="relative border-t border-border">
      <GiantMarquee
        items={[siteConfig.name.toUpperCase(), "WEB · AI", "PRODUCTS", "2026"]}
        reverse
        className="border-b border-border py-3 opacity-90"
      />
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted">
              {dict.tagline}
            </p>
            <div className="flex gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border-strong text-muted transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {dict.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${lang}${link.href}`}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
              {dict.social}
            </h3>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-subtle sm:flex-row">
          <p>
            © {year} {siteConfig.name}. {dict.rights}
          </p>
          <p className="font-mono text-xs">Built with Next.js · Tailwind · Motion</p>
        </div>
      </Container>
    </footer>
  );
}

/* Brand glyphs — lucide-react no longer ships trademarked brand icons. */
function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.94 4.62 18.9 19.05c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73L18.64 5.9c.37-.33-.08-.51-.58-.18L5.42 13.62l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.66 3.2c.83-.31 1.55.2 1.28 1.42Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}
