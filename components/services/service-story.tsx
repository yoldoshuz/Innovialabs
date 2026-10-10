"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import type { ServiceSlug, Tone } from "@/lib/content";
import { tones } from "@/lib/tone";
import { scenes } from "@/components/services/scenes";
import { cn } from "@/lib/utils";

/**
 * "How we'll do it": steps scroll on one side, the service's own scene
 * stays pinned on the other and plays the step that is in focus. Clicking
 * a step jumps the scene to it too.
 */
export function ServiceStory({
  slug,
  title,
  steps,
  labels,
  tone,
}: {
  slug: ServiceSlug;
  title: string;
  steps: { title: string; text: string }[];
  labels: string[];
  tone: Tone;
}) {
  const [step, setStep] = React.useState(0);
  const t = tones[tone];
  const Scene = scenes[slug];

  return (
    <section className="section shell">
      <h2 className="type-giant max-w-5xl text-[clamp(2.5rem,6.4vw,6.5rem)]">
        <span className="slant">{title}</span>
      </h2>

      <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        {/* Scene: pinned while the steps scroll past. */}
        <div className="sticky top-[4.75rem] z-10 lg:order-2 lg:col-span-6 lg:top-28 lg:self-start">
          <div
            data-tone={t.dark ? "dark" : undefined}
            className={cn(
              "relative mx-auto aspect-square w-full max-w-[min(100%,36rem)] overflow-hidden rounded-[clamp(1.75rem,3vw,2.75rem)] max-lg:max-h-[46svh] max-lg:max-w-[46svh]",
              t.bg,
            )}
          >
            <div aria-hidden className="pattern-prompt pointer-events-none absolute inset-0 opacity-[0.07]" />
            <Scene step={step} labels={labels} dark={t.dark} />
            <span className="type-accent absolute bottom-4 left-5 text-sm font-bold opacity-60">
              {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <ol className="relative flex flex-col lg:order-1 lg:col-span-6">
          {steps.map((s, i) => (
            <Step key={s.title} index={i} active={step === i} onActive={setStep} {...s} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  text,
  active,
  onActive,
}: {
  index: number;
  title: string;
  text: string;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  // "In focus" = crossing a band just below the middle (clear of the pinned
  // scene on phones, where it sits on top).
  const inView = useInView(ref, { margin: "-58% 0px -30% 0px" });
  React.useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="flex min-h-[38svh] items-center lg:min-h-[62svh]">
      <button
        type="button"
        onClick={() => onActive(index)}
        aria-current={active ? "step" : undefined}
        className="group w-full text-left"
      >
        <motion.span
          initial={false}
          animate={{ opacity: active ? 1 : 0.32, x: active ? 0 : -6 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="block"
        >
          <span className="type-accent block text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none text-violet">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-3 block font-display text-[clamp(1.75rem,3.2vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {title}
          </span>
          <span className="type-lead mt-3 block max-w-lg text-muted">{text}</span>
        </motion.span>
      </button>
    </li>
  );
}
