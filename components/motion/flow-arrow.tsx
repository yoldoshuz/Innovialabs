"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** A hand-drawn arrow that draws itself when it scrolls into view. */
export function FlowArrow({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  const reduce = useReducedMotion();
  const d = vertical ? "M30 6 C 6 40, 54 64, 30 104" : "M6 40 C 40 4, 80 76, 124 30";
  const head = vertical ? "M16 92 L30 106 L44 92" : "M108 22 L126 29 L116 46";
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "0px 0px -20% 0px" },
      };
  return (
    <svg
      viewBox={vertical ? "0 0 60 112" : "0 0 132 80"}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-violet", className)}
    >
      <motion.path d={d} {...draw} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
      <motion.path d={head} {...draw} transition={{ duration: 0.3, delay: 0.85 }} />
    </svg>
  );
}
