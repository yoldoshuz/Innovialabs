import type { ProcessDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export function Process({ dict }: { dict: ProcessDict }) {
  return (
    <section id="process" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <SectionHeading
          badge={dict.badge}
          title={dict.title}
          subtitle={dict.subtitle}
        />

        <RevealGroup className="relative mt-16 grid gap-5 lg:grid-cols-4">
          {/* connecting line (desktop) */}
          <div className="divider-gradient pointer-events-none absolute left-0 right-0 top-9 hidden h-px lg:block" />

          {dict.steps.map((step, index) => (
            <RevealItem
              key={step.title}
              className="relative flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-7"
            >
              <span className="relative z-10 grid size-12 place-items-center rounded-full border border-primary/40 bg-elevated font-mono text-lg font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
