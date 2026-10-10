"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

export type BriefLine = { flag: string; value: string };

/** The brief assembled as a terminal command while the visitor answers. */
export function BriefTerminal({
  title,
  command,
  lines,
  done,
  sentLabel,
}: {
  title: string;
  command: string;
  lines: BriefLine[];
  done: boolean;
  sentLabel: string;
}) {
  return (
    <div data-tone="dark" className="relative overflow-hidden rounded-[2rem] bg-night text-white">
      <div aria-hidden className="pattern-prompt pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative flex items-center gap-2 bg-ink px-5 py-4">
        <span className="window-dot bg-[#ff5f57]" />
        <span className="window-dot bg-[#febc2e]" />
        <span className="window-dot bg-[#28c840]" />
        <span className="ml-3 text-sm font-semibold text-dim">{title}</span>
      </div>
      <div className="relative min-h-[16rem] px-6 pb-8 pt-6 font-mono text-[0.95rem] leading-[1.9] sm:px-8">
        <p>
          <span className="text-lilac">&gt;</span> {command}
        </p>
        <ul className="mt-1">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.li
                key={l.flag}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="break-words pl-4"
              >
                <span className="text-lilac">{l.flag}</span>{" "}
                <span className="text-white/90">&quot;{l.value.length > 120 ? `${l.value.slice(0, 120)}…` : l.value}&quot;</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-3 h-8">
          {done ? (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-lilac">
              <Check className="size-4" strokeWidth={2.5} /> {sentLabel} <span className="text-white">✦</span>
            </motion.p>
          ) : (
            <span aria-hidden className="mt-3 block h-1.5 w-7 animate-blink rounded-full bg-lilac" />
          )}
        </div>
      </div>
    </div>
  );
}
