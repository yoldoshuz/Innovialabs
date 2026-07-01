"use client";

import * as React from "react";
import { gsap, SplitText, useGSAP, EASE, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface SplitRevealProps {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  /** Split granularity. "lines" for headings, "words" for paragraphs. */
  type?: "lines" | "words";
  stagger?: number;
  delay?: number;
  start?: string;
}

/**
 * Masked line/word reveal powered by GSAP SplitText + ScrollTrigger.
 * Falls back to plain text under prefers-reduced-motion.
 */
export function SplitReveal({
  as = "h2",
  children,
  className,
  type = "lines",
  stagger = 0.1,
  delay = 0,
  start = "top 85%",
}: SplitRevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = SplitText.create(el, {
        type,
        mask: type,
        linesClass: "split-line",
        wordsClass: "split-line",
      });
      const targets = type === "lines" ? split.lines : split.words;

      gsap.from(targets, {
        yPercent: 115,
        duration: 1,
        ease: EASE,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
