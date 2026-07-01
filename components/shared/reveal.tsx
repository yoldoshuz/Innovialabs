"use client";

import * as React from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/lib/gsap";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET = 44;

function fromVars(direction: Direction) {
  switch (direction) {
    case "up":
      return { y: OFFSET };
    case "down":
      return { y: -OFFSET };
    case "left":
      return { x: OFFSET };
    case "right":
      return { x: -OFFSET };
    default:
      return {};
  }
}

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  delay?: number;
}

/** Scroll-triggered fade/slide reveal (GSAP). */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el, {
        opacity: 0,
        ...fromVars(direction),
        duration: 0.9,
        ease: EASE,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

/** Staggered container — animates its `RevealItem` children in sequence. */
export function RevealGroup({
  children,
  stagger = 0.09,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { stagger?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0,
        y: OFFSET,
        duration: 0.85,
        ease: EASE,
        stagger,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-reveal-item {...props}>
      {children}
    </div>
  );
}
