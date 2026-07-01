import { ArrowUpRight } from "lucide-react";
import type { ResultsDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Counter } from "@/components/anim/counter";

export function Results({ dict }: { dict: ResultsDict }) {
  return (
    <section id="results" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <SectionHeading
          badge={dict.badge}
          title={dict.title}
          subtitle={dict.subtitle}
        />

        {/* Metrics */}
        <Reveal className="mt-16 grid gap-5 sm:grid-cols-3">
          {dict.metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface/40 p-8 text-center"
            >
              <span className="font-display text-5xl font-bold tracking-tight text-gradient lg:text-6xl">
                <Counter value={metric.value} />
              </span>
              <span className="text-base font-medium text-foreground">
                {metric.label}
              </span>
              <span className="text-sm text-muted">{metric.detail}</span>
            </div>
          ))}
        </Reveal>

        {/* Case studies */}
        <RevealGroup className="mt-6 grid gap-5 lg:grid-cols-3">
          {dict.cases.map((item) => (
            <RevealItem
              key={item.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
                  {item.tag}
                </span>
                <ArrowUpRight className="size-5 text-subtle transition-colors group-hover:text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="flex-1 text-pretty text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <p className="border-t border-border pt-4 text-2xl font-semibold tracking-tight text-gradient">
                {item.metric}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
