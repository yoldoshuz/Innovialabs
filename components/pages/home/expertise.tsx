import type { ExpertiseDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

export function Expertise({ dict }: { dict: ExpertiseDict }) {
  return (
    <section id="expertise" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <SectionHeading
          badge={dict.badge}
          title={dict.title}
          subtitle={dict.subtitle}
        />

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.items.map((item) => (
            <RevealItem
              key={item.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-2/60"
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="grid size-12 place-items-center rounded-xl border border-border-strong bg-elevated text-primary transition-colors group-hover:border-primary/50">
                <Icon name={item.icon} className="size-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
