import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CasesDict, CaseItem } from "@/types";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Counter } from "@/components/anim/counter";

export function CaseDetail({
  lang,
  item,
  dict,
}: {
  lang: Locale;
  item: CaseItem;
  dict: CasesDict;
}) {
  const others = dict.items.filter((c) => c.slug !== item.slug);

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-16">
        {/* Results metrics */}
        <Reveal className="grid gap-5 sm:grid-cols-3">
          {item.results.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface/40 p-8 text-center"
            >
              <span className="font-display text-4xl font-bold tracking-tight text-gradient lg:text-5xl">
                <Counter value={r.value} />
              </span>
              <span className="text-sm text-muted">{r.label}</span>
            </div>
          ))}
        </Reveal>

        {/* Challenge + Solution */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
              {dict.labels.challenge}
            </h2>
            <p className="text-pretty leading-relaxed text-muted">
              {item.challenge}
            </p>
          </Reveal>
          <Reveal
            delay={0.1}
            className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-surface-2/40 p-8"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {dict.labels.solution}
            </h2>
            <p className="text-pretty leading-relaxed text-foreground/90">
              {item.solution}
            </p>
          </Reveal>
        </div>

        {/* Stack */}
        <Reveal className="flex flex-col gap-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
            {dict.labels.stack}
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border-strong bg-surface-2/60 px-4 py-2 text-sm text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Other cases */}
        <div className="flex flex-col gap-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-subtle">
            {dict.labels.other}
          </h2>
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {others.map((c) => (
              <RevealItem key={c.slug} className="h-full">
                <Link
                  href={`/${lang}/cases/${c.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">
                      {c.tag}
                    </span>
                    <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {c.summary}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
