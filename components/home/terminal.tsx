"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { Spark } from "@/components/brand/spark";
import type { HeroDict } from "@/types";

// WebGL only on the client, after hydration; the static star is the fallback.
const SparkScene = dynamic(
  () => import("@/components/three/spark-scene").then((m) => m.SparkScene),
  {
    ssr: false,
    loading: () => <Spark className="size-24 text-violet" />,
  },
);

const TYPE_MS = 55;
const STEP_MS = 480;

/**
 * Hero terminal (guideline p.15): types `npm create product`, ticks off the
 * pipeline steps; the cursor then turns into the 3D star. Click "replay" to
 * run it again.
 */
export function Terminal({ dict }: { dict: HeroDict["terminal"] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  const total = dict.command.length;
  const [typedRaw, setTyped] = React.useState(0);
  const [stepsRaw, setSteps] = React.useState(0);
  const [run, setRun] = React.useState(0);

  // Reduced motion: show the final state right away.
  const typed = reduce ? total : typedRaw;
  const steps = reduce ? dict.steps.length + 1 : stepsRaw;
  const finished = steps > dict.steps.length;

  const replay = () => {
    setTyped(0);
    setSteps(0);
    setRun((r) => r + 1);
  };

  React.useEffect(() => {
    if (!inView || reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(setTimeout(() => setTyped(i), 400 + i * TYPE_MS));
    }
    const typedAt = 400 + total * TYPE_MS + 350;
    for (let s = 1; s <= dict.steps.length + 1; s++) {
      timers.push(setTimeout(() => setSteps(s), typedAt + s * STEP_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, run, total, dict.steps.length]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl bg-night text-white shadow-[0_40px_90px_-40px_rgb(18_11_36/0.8)]"
    >
      <div className="flex items-center gap-2 bg-ink px-5 py-4">
        <span className="window-dot bg-[#ff5f57]" />
        <span className="window-dot bg-[#febc2e]" />
        <span className="window-dot bg-[#28c840]" />
        <button
          type="button"
          onClick={replay}
          aria-label={dict.replay}
          title={dict.replay}
          className="ml-auto grid size-8 place-items-center rounded-full text-dim transition-[color,background-color,transform] duration-300 hover:rotate-[-120deg] hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div className="relative min-h-[19rem] px-6 pb-8 pt-7 font-mono text-[0.95rem] leading-[2.1] sm:min-h-[21rem] sm:px-8 sm:text-base">
        <p className="text-white">
          <span className="text-lilac">&gt;</span> {dict.command.slice(0, typed)}
          {typed < total ? <Cursor /> : null}
        </p>

        <ul>
          <AnimatePresence initial={false}>
            {dict.steps.slice(0, steps).map((step, i) => (
              <motion.li
                key={`${run}-${step}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 text-lilac"
              >
                <Check className="size-4" strokeWidth={2.5} />
                {step}
                {finished && i === dict.steps.length - 1 ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="text-white"
                  >
                    ✦
                  </motion.span>
                ) : null}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* The "_" cursor from the mark turns into the star when done. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-7 flex items-end justify-between sm:inset-x-8">
          {!finished ? (
            <motion.span
              layoutId={`cursor-star-${run}`}
              aria-hidden
              className="mb-1 block h-1.5 w-7 animate-blink rounded-full bg-lilac"
            />
          ) : (
            <span />
          )}
          {finished ? (
            <motion.div
              layoutId={`cursor-star-${run}`}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="pointer-events-auto -mb-12 -mr-12 size-52 sm:size-60"
            >
              <SparkScene className="size-full" />
            </motion.div>
          ) : null}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {finished ? `${dict.command}: ${dict.steps.join(", ")} ✦` : ""}
      </span>
    </div>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1.1em] w-2 translate-y-[0.2em] animate-blink bg-lilac"
    />
  );
}
