import { Quote } from "lucide-react";
import type { SocialDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export function SocialProof({ dict }: { dict: SocialDict }) {
  return (
    <section className="py-20 lg:py-32">
      <Container>
        <SectionHeading
          badge={dict.badge}
          title={dict.title}
          subtitle={dict.subtitle}
        />

        <RevealGroup className="mt-16 grid gap-5 lg:grid-cols-3">
          {dict.testimonials.map((t) => (
            <RevealItem
              key={t.company}
              className="flex flex-col gap-6 rounded-2xl border border-border bg-surface/40 p-8 transition-colors hover:border-primary/40"
            >
              <Quote className="size-8 text-primary/50" />
              <p className="flex-1 text-pretty leading-relaxed text-foreground">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3 border-t border-border pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 font-semibold text-foreground">
                  {t.company.charAt(0)}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {t.author}
                  </span>
                  <span className="text-xs text-muted">
                    {t.role} · {t.company}
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
