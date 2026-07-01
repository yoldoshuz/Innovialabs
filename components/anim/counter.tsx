"use client";

import * as React from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Animates the numeric part of a metric string (e.g. "120+", "×3.5", "−45%",
 * "10M+", "99.9%") from zero on scroll, preserving prefix/suffix and decimals.
 * Non-numeric values (e.g. "24/7") render as-is.
 */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)([\d]+(?:[.,][\d]+)?)(.*)$/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !match || prefersReducedMotion()) return;

      const [, prefix, numStr, suffix] = match;
      const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
      const target = parseFloat(numStr.replace(",", "."));
      const obj = { n: 0 };

      gsap.to(obj, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${obj.n.toFixed(decimals)}${suffix}`;
        },
      });
    },
    { scope: ref, dependencies: [value] },
  );

  // SSR / no-JS / reduced-motion: show the final value immediately.
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
