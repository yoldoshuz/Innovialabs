import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CasesDict } from "@/types";
import { Container } from "@/components/shared/container";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

/** Cases overview grid — each card links to its detail page. */
export function CasesView({ lang, dict }: { lang: Locale; dict: CasesDict }) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <RevealGroup className="grid gap-5 lg:grid-cols-3">
          {dict.items.map((item) => (
            <RevealItem key={item.slug} className="h-full">
              <Link
                href={`/${lang}/cases/${item.slug}`}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-surface/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
                    {item.tag}
                  </span>
                  <ArrowUpRight className="size-5 text-subtle transition-colors group-hover:text-primary" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="flex-1 text-pretty text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
                <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                  {item.results.map((r) => (
                    <span
                      key={r.label}
                      className="rounded-lg bg-surface-2/60 px-2.5 py-1 font-mono text-xs text-primary"
                    >
                      {r.value}
                    </span>
                  ))}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
