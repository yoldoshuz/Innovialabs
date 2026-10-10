"use client";

import * as React from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Spark } from "@/components/brand/spark";
import { cn } from "@/lib/utils";

/**
 * A vertical route: the rail fills with scroll, a spark rides its head and
 * every stop lights up as the spark passes it.
 */
export function Route({
  items,
  dark = false,
  className,
}: {
  items: { title?: string; text: string }[];
  dark?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));
  const head = useTransform(progress, (v) => `${v * 100}%`);
  const [reached, setReached] = React.useState(reduce ? items.length : 0);

  useMotionValueEvent(progress, "change", (v) => {
    setReached(Math.min(items.length, Math.floor(v * items.length + 0.35)));
  });

  return (
    <ol ref={ref} className={cn("relative flex flex-col gap-3 pl-12 sm:pl-16", className)}>
      <span aria-hidden className={cn("absolute bottom-6 left-[0.9rem] top-6 w-1 rounded-full sm:left-[1.4rem]", dark ? "bg-white/10" : "bg-mist")} />
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute bottom-6 left-[0.9rem] top-6 w-1 origin-top rounded-full bg-violet sm:left-[1.4rem]"
      />
      <span aria-hidden className="pointer-events-none absolute bottom-6 left-[0.9rem] top-6 w-1 sm:left-[1.4rem]">
        <motion.span style={{ top: head }} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spark className={cn("size-7", dark ? "text-lilac" : "text-violet")} />
        </motion.span>
      </span>

      {items.map((item, i) => {
        const on = i < reached;
        return (
          <li key={item.text} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[2.35rem] top-7 size-4 rounded-full border-4 transition-[background-color,transform] duration-500 ease-[var(--ease-spring)] sm:-left-[2.85rem]",
                dark ? "border-night" : "border-white",
                on ? "scale-125 bg-violet" : dark ? "bg-ink-2" : "bg-mist",
              )}
            />
            <div
              className={cn(
                "rounded-3xl p-6 transition-[background-color,color,transform] duration-700 ease-[var(--ease-out-expo)] sm:p-7",
                dark ? (on ? "bg-ink-2 text-white" : "bg-ink-2/50 text-white/60") : on ? "bg-mist" : "bg-paper text-ink/60",
                on && "translate-x-1",
              )}
            >
              {item.title ? (
                <p className="font-display text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">{item.title}</p>
              ) : null}
              <p className={cn("leading-snug", item.title ? "mt-1.5 text-[1.02rem]" : "text-lg font-medium")}>{item.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
