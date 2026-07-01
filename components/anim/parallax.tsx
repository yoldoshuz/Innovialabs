"use client";

import * as React from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Positive drifts up as you scroll; negative drifts down. */
  speed?: number;
}

/** Scroll-scrubbed vertical parallax layer. */
export function Parallax({
  speed = 0.15,
  children,
  ...props
}: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.to(el, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [speed] },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
