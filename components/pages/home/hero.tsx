"use client";

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { HeroDict } from "@/types";
import {
  gsap,
  SplitText,
  useGSAP,
  EASE,
  prefersReducedMotion,
} from "@/lib/gsap";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Magnetic } from "@/components/anim/magnetic";
import { Parallax } from "@/components/anim/parallax";
import { Counter } from "@/components/anim/counter";
import { GiantMarquee } from "@/components/shared/giant-marquee";
import { cn } from "@/lib/utils";

const MARQUEE = ["WEB", "AI", "ML", "CLOUD", "DATA", "DESIGN"];

export function Hero({ dict }: { dict: HeroDict }) {
  const scope = React.useRef<HTMLElement>(null);
  const headline = React.useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create(headline.current, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });

      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(".hero-top", { y: -20, opacity: 0, duration: 0.7 })
        .from(
          split.lines,
          { yPercent: 118, duration: 1.15, stagger: 0.12 },
          "-=0.3",
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.65")
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 },
          "-=0.5",
        )
        .from(".hero-tag", { opacity: 0, stagger: 0.05, duration: 0.4 }, "-=0.4")
        .from(
          ".hero-visual",
          { scale: 0.9, opacity: 0, duration: 1.3 },
          "-=1.1",
        )
        .from(
          ".hero-stat",
          { y: 28, opacity: 0, stagger: 0.08, duration: 0.6 },
          "-=0.7",
        );

      return () => split.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden pt-32 lg:pt-40">
      <Container className="relative">
        {/* Top row */}
        <div className="hero-top flex items-center justify-between gap-4">
          <Badge>{dict.badge}</Badge>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-subtle sm:inline">
            [ 2018 — 2026 ]
          </span>
        </div>

        {/* Gigantism headline */}
        <h1
          ref={headline}
          className="mt-8 font-display text-[clamp(2.75rem,10.5vw,11rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.03em]"
        >
          {dict.title}{" "}
          <span className="text-gradient">{dict.titleAccent}</span>
        </h1>

        {/* Sub + CTA + visual */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="flex flex-col gap-8">
            <p className="hero-sub max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {dict.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic className="hero-cta">
                <a
                  href="#contact"
                  className={cn(buttonVariants({ size: "lg" }), "group")}
                >
                  {dict.ctaPrimary}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <a
                href="#results"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "hero-cta",
                )}
              >
                <Sparkles />
                {dict.ctaSecondary}
              </a>
            </div>

            {/* Editorial tag row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-subtle">
              <span className="hero-tag">WEB</span>
              <span className="hero-tag text-primary">✳</span>
              <span className="hero-tag">AI / ML</span>
              <span className="hero-tag text-primary">{"{ }"}</span>
              <span className="hero-tag">DESIGN</span>
              <span className="hero-tag text-primary">●</span>
              <span className="hero-tag">CLOUD</span>
            </div>
          </div>

          {/* Animated visual */}
          <Parallax speed={0.12} className="hero-visual">
            <HeroVisual />
          </Parallax>
        </div>

        {/* Stats */}
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {dict.stats.map((stat) => (
            <div
              key={stat.label}
              className="hero-stat flex flex-col gap-1 bg-surface/60 px-6 py-8"
            >
              <dd className="font-display text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
                <Counter value={stat.value} />
              </dd>
              <dt className="text-sm text-muted">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>

      {/* Gigantism marquee band */}
      <GiantMarquee
        items={MARQUEE}
        className="mt-20 border-y border-border py-3"
      />
    </section>
  );
}

/** Abstract orbital visual — dashed rotating ring + drifting nodes. */
function HeroVisual() {
  return (
    <div className="relative aspect-square w-full max-w-md justify-self-end">
      <div className="absolute inset-0 rounded-3xl border border-border bg-surface/30 backdrop-blur-sm" />
      {/* corner ticks */}
      <div className="absolute left-4 top-4 size-6 border-l border-t border-primary/50" />
      <div className="absolute right-4 top-4 size-6 border-r border-t border-primary/50" />
      <div className="absolute bottom-4 left-4 size-6 border-b border-l border-primary/50" />
      <div className="absolute bottom-4 right-4 size-6 border-b border-r border-primary/50" />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative size-56 sm:size-64">
          <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-border-strong" />
          <div className="absolute inset-8 animate-float rounded-full border border-primary/40" />
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/25 to-secondary/20 blur-xl" />
          <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_20px_var(--color-primary)]" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <div
              key={deg}
              className="absolute left-1/2 top-1/2 size-2 rounded-full bg-secondary"
              style={{ transform: `rotate(${deg}deg) translateX(7rem)` }}
            />
          ))}
        </div>
      </div>

      <span className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-widest text-subtle">
        osmi://core
      </span>
      <span className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-widest text-primary">
        online
      </span>
    </div>
  );
}
