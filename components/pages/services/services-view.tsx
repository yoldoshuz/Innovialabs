import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ServicesDict } from "@/types";
import { Container } from "@/components/shared/container";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

/** Services overview grid — each card links to its detail page. */
export function ServicesView({
  lang,
  dict,
}: {
  lang: Locale;
  dict: ServicesDict;
}) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {dict.items.map((item) => (
            <RevealItem key={item.slug}>
              <Link
                href={`/${lang}/services/${item.slug}`}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface/40 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-2/60"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl border border-border-strong bg-elevated text-primary transition-colors group-hover:border-primary/50">
                    <Icon name={item.icon} className="size-6" />
                  </span>
                  <ArrowRight className="size-5 text-subtle transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                    {item.tagline}
                  </p>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
