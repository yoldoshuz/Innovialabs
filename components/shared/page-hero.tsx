import * as React from "react";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/anim/split-reveal";
import { Parallax } from "@/components/anim/parallax";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";

interface PageHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

/** Gigantism hero band for inner pages (breadcrumbs + eyebrow + big title). */
export function PageHero({
  badge,
  title,
  subtitle,
  crumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-36 lg:pt-48">
      {/* Oversized ghost index digit */}
      <Parallax
        speed={0.3}
        aria-hidden
        className="pointer-events-none absolute -right-6 top-24 hidden select-none lg:block"
      >
        <span className="text-stroke font-display text-[16rem] leading-none opacity-40">
          ✳
        </span>
      </Parallax>

      <Container className="relative">
        {crumbs ? (
          <Reveal className="mb-10">
            <Breadcrumbs items={crumbs} />
          </Reveal>
        ) : null}
        <div className="flex max-w-5xl flex-col gap-6">
          {badge ? (
            <Reveal>
              <Badge>{badge}</Badge>
            </Reveal>
          ) : null}
          <SplitReveal
            as="h1"
            className="font-display text-balance text-[clamp(2.6rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-tight"
          >
            {title}
          </SplitReveal>
          {subtitle ? (
            <Reveal delay={0.1}>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {subtitle}
              </p>
            </Reveal>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
