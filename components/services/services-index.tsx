"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ServicesDict } from "@/types";
import { serviceMeta, type ServiceSlug } from "@/lib/content";
import { tones } from "@/lib/tone";
import { Icon } from "@/components/brand/icon";
import { Prompt } from "@/components/brand/spark";
import { cn } from "@/lib/utils";

/**
 * /services: the services as a giant numbered index (a conference
 * programme, not a card grid). Hovering a row floods it violet, unfolds its
 * points and a tone bubble with the service icon follows the cursor.
 */
export function ServicesIndex({ lang, dict }: { lang: Locale; dict: ServicesDict }) {
  const reduce = useReducedMotion();
  const listRef = React.useRef<HTMLOListElement>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const current = active !== null ? dict.items[active] : null;
  const currentMeta = current ? serviceMeta[current.slug as ServiceSlug] : null;

  return (
    <section className="shell pb-[clamp(4.5rem,10vw,9rem)]">
      <ol
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
        className="relative border-t-2 border-ink"
      >
        {dict.items.map((item, i) => {
          const on = active === i;
          return (
            <li key={item.slug} className="border-b-2 border-ink">
              <Link
                href={`/${lang}/services/${item.slug}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group relative isolate grid grid-cols-[3rem_1fr_auto] items-start gap-x-3 overflow-hidden py-6 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-6 sm:py-8 lg:grid-cols-[7rem_1.1fr_1fr_auto] lg:items-center"
              >
                {/* Violet flood from the left */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 -z-10 origin-left bg-violet transition-transform duration-700 ease-[var(--ease-out-expo)]",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <span
                  className={cn(
                    "type-accent pt-1 text-xl font-bold transition-colors duration-500 sm:pl-2 sm:text-3xl lg:pt-0",
                    on ? "text-white" : "text-violet",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-display text-[clamp(1.6rem,3.6vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)]",
                    on ? "translate-x-2 text-white" : "text-ink",
                  )}
                >
                  {item.title}
                </span>
                <span
                  className={cn(
                    "col-start-2 mt-2 text-[1.02rem] leading-snug transition-colors duration-500 lg:col-start-3 lg:mt-0",
                    on ? "text-white/85" : "text-muted",
                  )}
                >
                  {item.subtitle}
                  {/* Points unfold under the subtitle on hover. */}
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]",
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="flex flex-col gap-1.5 pt-3">
                        {item.points.map((p) => (
                          <span key={p} className="flex items-start gap-2 text-[0.95rem] text-white">
                            <Prompt className="mt-[0.4em] h-2.5 shrink-0 text-lilac" />
                            {p}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    "col-start-3 row-start-1 grid size-11 place-items-center rounded-full transition-[background-color,color,transform] duration-500 ease-[var(--ease-spring)] sm:size-14 lg:col-start-4",
                    on ? "rotate-45 bg-white text-violet" : "bg-paper text-ink",
                  )}
                >
                  <ArrowUpRight className="size-5 sm:size-6" />
                </span>
              </Link>
            </li>
          );
        })}

        {/* Cursor bubble (desktop pointers only). */}
        {!reduce ? (
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block"
          >
            <AnimatePresence>
              {current && currentMeta ? (
                <motion.span
                  key="bubble"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 30 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={cn(
                    "ml-6 -mt-16 grid size-32 place-items-center rounded-full shadow-[0_30px_60px_-20px_rgb(18_11_36/0.5)] transition-colors duration-300",
                    tones[currentMeta.tone === "violet" ? "night" : currentMeta.tone].bg,
                  )}
                >
                  <motion.span key={current.slug} initial={{ scale: 0.4, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
                    <Icon name={currentMeta.icon} className="size-12" />
                  </motion.span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.span>
        ) : null}
      </ol>
    </section>
  );
}
