import { Check, ArrowRight } from "lucide-react";
import type { PlatformDict } from "@/types";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";

export function Platform({ dict }: { dict: PlatformDict }) {
  return (
    <section id="platform" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface-2/80 to-surface/40 p-8 sm:p-12 lg:p-16">
          {/* accent glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-secondary/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="flex flex-col gap-6">
              <Badge>{dict.badge}</Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {dict.title}
              </h2>
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {dict.subtitle}
              </p>
              <a
                href="#contact"
                className={`${buttonVariants({ size: "lg" })} group mt-2 self-start`}
              >
                {dict.cta}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>

            <RevealGroup className="grid gap-4 sm:grid-cols-2">
              {dict.features.map((feature) => (
                <RevealItem
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-background/40 p-6 transition-colors hover:border-primary/40"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Check className="size-5" />
                  </span>
                  <h3 className="font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}
