"use client";

import * as React from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { ProcessDict } from "@/types";
import { GiantTitle } from "@/components/motion/giant-title";
import { cn } from "@/lib/utils";

/**
 * Process: six steps on a route. The violet rail fills as you scroll and each
 * step lights up when the fill reaches it.
 */
export function Process({ dict }: { dict: ProcessDict }) {
  const root = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(-1);

  useGSAP(
    () => {
      const list = root.current?.querySelector<HTMLElement>("[data-rail]");
      const fill = root.current?.querySelector<HTMLElement>("[data-fill]");
      if (!list || !fill) return;

      if (prefersReducedMotion()) {
        gsap.set(fill, { scaleX: 1, scaleY: 1 });
        setActive(dict.steps.length - 1);
        return;
      }

      const mm = gsap.matchMedia();
      const track = (vertical: boolean) => {
        gsap.fromTo(
          fill,
          vertical ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 },
          {
            [vertical ? "scaleY" : "scaleX"]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 75%",
              end: vertical ? "bottom 60%" : "bottom 45%",
              scrub: 0.6,
              onUpdate: (self) =>
                setActive(Math.min(dict.steps.length - 1, Math.floor(self.progress * dict.steps.length + 0.15))),
            },
          },
        );
      };
      mm.add("(min-width: 1024px)", () => track(false));
      mm.add("(max-width: 1023px)", () => track(true));
      return () => mm.revert();
    },
    { scope: root, dependencies: [dict.steps.length] },
  );

  return (
    <section ref={root} id="process" className="section shell scroll-mt-24">
      <GiantTitle className="max-w-6xl text-[clamp(2.75rem,7vw,7rem)]">{dict.title}</GiantTitle>

      <ol data-rail className="relative mt-14 grid gap-4 pl-8 lg:mt-20 lg:grid-cols-6 lg:gap-3 lg:pl-0 lg:pt-10">
        {/* Rail */}
        <span aria-hidden className="absolute bottom-0 left-2.5 top-0 w-1 rounded-full bg-mist lg:inset-x-0 lg:top-0 lg:h-1 lg:w-auto" />
        <span
          aria-hidden
          data-fill
          className="absolute bottom-0 left-2.5 top-0 w-1 origin-top rounded-full bg-violet lg:inset-x-0 lg:top-0 lg:h-1 lg:w-auto lg:origin-left"
        />

        {dict.steps.map((step, i) => {
          const on = i <= active;
          return (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[1.75rem] top-7 size-4 rounded-full border-4 border-white transition-colors duration-500 lg:-top-[2.875rem] lg:left-0",
                  on ? "bg-violet" : "bg-mist",
                )}
              />
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl p-6 transition-[background-color,color,transform] duration-700 ease-[var(--ease-out-expo)]",
                  on ? "bg-mist" : "bg-paper",
                  i === active && "lg:-translate-y-2",
                )}
              >
                <span
                  className={cn(
                    "type-accent text-4xl font-bold leading-none transition-colors duration-500",
                    on ? "text-violet" : "text-lilac/60",
                  )}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-6 font-display text-xl font-extrabold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
