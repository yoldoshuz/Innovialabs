"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the service scenes. A scene is a square stage with a
 * 100×100 coordinate system: `At` places HTML by percent, `Wire` draws an
 * SVG path in the same units with packets running along it.
 */

export type SceneProps = { step: number; labels: string[]; dark: boolean };

export const EASE = [0.16, 1, 0.3, 1] as const;
export const SPRING = { type: "spring", stiffness: 260, damping: 22 } as const;

export function At({
  x,
  y,
  className,
  children,
}: {
  x: number;
  y: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute -translate-x-1/2 -translate-y-1/2", className)} style={{ left: `${x}%`, top: `${y}%` }}>
      {children}
    </div>
  );
}

/** Label bubble; `on` lights it up. */
export function Chip({
  on = true,
  dark,
  strong = false,
  className,
  children,
}: {
  on?: boolean;
  dark: boolean;
  strong?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: on ? 1 : 0.94, opacity: on ? 1 : 0.55 }}
      transition={SPRING}
      className={cn(
        "whitespace-nowrap rounded-2xl px-2.5 py-1.5 text-[0.68rem] font-bold leading-tight shadow-[0_10px_24px_-14px_rgb(18_11_36/0.6)] transition-colors duration-500 sm:px-3.5 sm:py-2 sm:text-[0.85rem]",
        on
          ? strong
            ? dark
              ? "bg-lilac text-night"
              : "bg-violet text-white"
            : dark
              ? "bg-white text-ink"
              : "bg-ink text-white"
          : dark
            ? "bg-white/10 text-white"
            : "bg-white/70 text-ink",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/** SVG layer in scene units (0–100). */
export function Wires({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden fill="none" className={cn("pointer-events-none absolute inset-0 size-full", className)}>
      {children}
    </svg>
  );
}

/** A connection: dim when idle, bright with travelling packets when `on`. */
export function Wire({
  d,
  on,
  dark,
  dur = 1.6,
  delay = 0,
  dashed = false,
  show = true,
}: {
  d: string;
  on: boolean;
  /** Off = not drawn at all (for links to things that haven't appeared yet). */
  show?: boolean;
  dark: boolean;
  dur?: number;
  delay?: number;
  dashed?: boolean;
}) {
  const reduce = useReducedMotion();
  const id = React.useId().replace(/:/g, "");
  return (
    <g>
      <path
        id={id}
        d={d}
        stroke="currentColor"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeDasharray={dashed ? "2 7" : undefined}
        className={cn("transition-opacity duration-700", !show ? "opacity-0" : on ? "opacity-70" : "opacity-20")}
      />
      {on && show && !reduce ? (
        <circle r={1.1} className={dark ? "fill-lilac" : "fill-violet"}>
          <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </g>
  );
}

/** Pops in when `show` turns true (and out when it turns false). */
export function Pop({
  show,
  delay = 0,
  className,
  children,
}: {
  show: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 12 }}
      transition={{ ...SPRING, delay: show ? delay : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
