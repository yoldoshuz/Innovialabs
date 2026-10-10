"use client";

import * as React from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Giant section heading (YoungCon-style): letters rise from a mask when the
 * heading scrolls in, and individually hop when the cursor runs over them.
 */
export function GiantTitle({
  children,
  as: Tag = "h2",
  className,
  slant = true,
}: {
  children: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  slant?: boolean;
}) {
  const ref = React.useRef<HTMLHeadingElement>(null);

  // Fit-to-width: a single long word (e.g. Uzbek "AVTOMATLASHTIRISH") must
  // never overflow the column, so shrink the font just enough when it would.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      const ratio = el.scrollWidth / el.clientWidth;
      if (ratio > 1.005) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${(size / ratio) * 0.97}px`;
      }
    };
    fit();
    let width = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      fit();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      // Skew each line on its own baseline (a skewed multi-line block
      // would stair-step the left edge).
      const wrapper = el.querySelector<HTMLElement>(".slant");
      wrapper?.classList.remove("slant");
      const split = SplitText.create(el, {
        // Words keep chars together: lines may only break between words.
        type: "lines,words,chars",
        linesClass: cn("overflow-hidden pb-[0.06em] -mb-[0.06em] pr-[0.12em]", slant && "slant-line"),
        charsClass: "inline-block will-change-transform",
      });

      gsap.from(split.chars, {
        yPercent: 115,
        rotate: 6,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.028,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });

      // Playful hop on hover, desktop pointers only.
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const handlers = split.chars.map((char) => {
        const onEnter = () => {
          if (gsap.isTweening(char)) return;
          gsap
            .timeline()
            .to(char, { yPercent: -16, duration: 0.18, ease: "power2.out" })
            .to(char, { yPercent: 0, duration: 0.6, ease: "elastic.out(1.1, 0.35)" });
        };
        char.addEventListener("mouseenter", onEnter);
        return () => char.removeEventListener("mouseenter", onEnter);
      });

      return () => {
        handlers.forEach((off) => off());
        split.revert();
        if (slant) wrapper?.classList.add("slant");
      };
    },
    { scope: ref, dependencies: [children, slant] },
  );

  return (
    <Tag ref={ref} className={cn("type-giant", className)}>
      <span className={cn(slant && "slant")}>{children}</span>
    </Tag>
  );
}
