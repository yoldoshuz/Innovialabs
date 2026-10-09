"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CasesDict } from "@/types";
import { caseMeta, type CaseSlug } from "@/lib/content";
import { GiantTitle } from "@/components/motion/giant-title";
import { BrowserShot, PhoneShot } from "@/components/cases/shots";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const row = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/**
 * Cases stage (YoungCon "broadcast" layout): giant title, big tabs, product
 * preview on the left and the case card (task · what we did · numbers) on
 * the right.
 */
export function CasesShowcase({ lang, dict }: { lang: Locale; dict: CasesDict }) {
  const [index, setIndex] = React.useState(0);
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const item = dict.items[index];
  const meta = caseMeta[item.slug as CaseSlug];
  const l = dict.labels;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = dict.items.length - 1;
    let next = index;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  };

  // Keep the active tab centered in the strip (scrolls the strip, not the page).
  React.useEffect(() => {
    const strip = stripRef.current;
    const tab = tabsRef.current[index];
    if (!strip || !tab) return;
    strip.scrollTo({
      left: tab.offsetLeft - (strip.clientWidth - tab.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <section id="cases" data-tone="dark" className="scroll-mt-24 px-2 sm:px-3">
      <div className="stage section overflow-hidden">
        <div className="shell">
          <GiantTitle className="max-w-6xl text-[clamp(2.75rem,8vw,8.5rem)] text-white">
            {dict.title}
          </GiantTitle>

          <div
            ref={stripRef}
            role="tablist"
            aria-label={dict.title}
            onKeyDown={onKeyDown}
            className="no-scrollbar relative -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:mt-16"
          >
            {dict.items.map((c, i) => {
              const active = i === index;
              return (
                <button
                  key={c.slug}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  role="tab"
                  id={`case-tab-${c.slug}`}
                  aria-selected={active}
                  aria-controls="case-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative shrink-0 rounded-3xl px-6 py-5 text-left transition-colors duration-300 sm:px-7 sm:py-6",
                    active ? "text-white" : "bg-ink-2 text-white/75 hover:bg-[#2c2057] hover:text-white",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="case-tab"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="absolute inset-0 rounded-3xl bg-violet"
                    />
                  ) : null}
                  <span className="relative block font-display text-lg font-extrabold uppercase leading-[0.95] tracking-[-0.02em] sm:text-xl">
                    {c.name}
                  </span>
                  <span
                    className={cn(
                      "type-accent relative mt-2 block text-sm font-medium",
                      active ? "text-white/80" : "text-lilac",
                    )}
                  >
                    {[caseMeta[c.slug as CaseSlug].year, c.platforms].filter(Boolean).join(" · ")}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="case-panel"
            role="tabpanel"
            aria-labelledby={`case-tab-${item.slug}`}
            className="mt-4 grid gap-4 lg:grid-cols-12"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="lg:col-span-7"
              >
                <Link
                  href={`/${lang}/cases/${item.slug}`}
                  aria-label={`${l.openCase}: ${item.name}`}
                  className="group relative block h-full overflow-hidden rounded-[2rem] bg-violet p-4 sm:p-8"
                >
                  <p className="relative max-w-lg font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                    {item.tagline}
                  </p>
                  <div className="relative mt-6 sm:mt-8 sm:pr-20">
                    <div className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:scale-[1.01]">
                      <BrowserShot src={meta.shot} host={meta.host} alt={item.name} />
                    </div>
                    <div className="absolute -bottom-4 right-0 hidden w-[24%] max-w-36 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-4 group-hover:rotate-[-3deg] sm:block">
                      <PhoneShot src={meta.shotMobile} alt={item.name} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={item.slug}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="flex flex-col gap-3 lg:col-span-5"
              >
                <motion.li variants={row} className="card-night p-5 sm:p-6">
                  <p className="text-sm font-semibold text-lilac">{l.task}</p>
                  <p className="mt-1.5 leading-snug">{item.task}</p>
                </motion.li>
                <motion.li variants={row} className="card-night p-5 sm:p-6">
                  <p className="text-sm font-semibold text-lilac">{l.did}</p>
                  <p className="mt-1.5 leading-snug">{item.did}</p>
                </motion.li>
                <motion.li variants={row} className="grid grid-cols-2 gap-3">
                  {item.facts.map((fact) => (
                    <div key={fact.label} className="card-night p-5">
                      <p className="type-accent text-4xl font-bold leading-none text-lilac">{fact.value}</p>
                      <p className="mt-2 text-sm leading-snug text-white/80">{fact.label}</p>
                    </div>
                  ))}
                </motion.li>
                <motion.li variants={row} className="mt-auto flex flex-wrap gap-2 pt-1">
                  <Button asChild variant="white" size="lg">
                    <Link href={`/${lang}/cases/${item.slug}`}>
                      {l.openCase}
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost-dark" size="lg">
                    <a href={meta.url} target="_blank" rel="noopener noreferrer">
                      {l.openSite}
                      <ArrowUpRight />
                    </a>
                  </Button>
                </motion.li>
              </motion.ul>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href={`/${lang}/cases`} className="link-underline font-display text-lg font-bold text-white">
              {l.allCases} →
            </Link>
            <Button asChild size="xl">
              <Link href={`/${lang}#contact`}>
                {dict.cta}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
