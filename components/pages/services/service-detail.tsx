import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ServicesDict, ServiceItem } from "@/types";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

export function ServiceDetail({
  lang,
  service,
  dict,
}: {
  lang: Locale;
  service: ServiceItem;
  dict: ServicesDict;
}) {
  const others = dict.items.filter((s) => s.slug !== service.slug);

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Overview + lists */}
          <Reveal className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {dict.labels.overview}
              </span>
              {service.overview.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {dict.labels.features}
                </h2>
                <ul className="flex flex-col gap-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {dict.labels.deliverables}
                </h2>
                <ul className="flex flex-col gap-3">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Sidebar: icon card + other services */}
          <Reveal delay={0.1} className="flex flex-col gap-4 lg:sticky lg:top-28">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-7">
              <span className="grid size-14 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                <Icon name={service.icon} className="size-7" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">
                {service.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {service.tagline}
              </p>
              <Link
                href={`/${lang}/contacts`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {dict.labels.cta}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 p-7">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
                {dict.labels.other}
              </h2>
              <RevealGroup className="flex flex-col divide-y divide-border">
                {others.map((s) => (
                  <RevealItem key={s.slug}>
                    <Link
                      href={`/${lang}/services/${s.slug}`}
                      className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                    >
                      <span>{s.title}</span>
                      <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-primary" />
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
