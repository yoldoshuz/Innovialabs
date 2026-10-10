"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, Send } from "lucide-react";
import type { TelegramDict } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { briefHref } from "@/lib/links";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";
import { Prompt } from "@/components/brand/spark";
import { Button } from "@/components/ui/button";

export function TelegramBlock({ lang, dict }: { lang: Locale; dict: TelegramDict }) {
  return (
    <section id="telegram" className="section shell scroll-mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <GiantTitle className="text-[clamp(2.75rem,7vw,7rem)]">{dict.title}</GiantTitle>
          <Reveal delay={0.1}>
            <p className="type-lead mt-6 max-w-2xl text-muted">{dict.text}</p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[dict.bots, dict.apps].map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.08} className="rounded-[1.75rem] bg-paper p-6 sm:p-7">
                <h3 className="font-display text-xl font-extrabold tracking-[-0.02em]">{group.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 leading-snug">
                      <Prompt className="mt-[0.4em] h-2.5 shrink-0 text-violet" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-6 rounded-[1.75rem] bg-mist p-6 sm:p-7">
            <p className="text-lg leading-relaxed">{dict.why}</p>
          </Reveal>

          <div className="mt-8">
            <Button asChild size="xl">
              <Link href={briefHref(lang, "telegram")}>
                {dict.cta}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PhoneMock dict={dict.mock} />
        </div>
      </div>
    </section>
  );
}

/** Telegram chat with a bot; the Mini App sheet slides up on its own. */
function PhoneMock({ dict }: { dict: TelegramDict["mock"] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [stage, setStage] = React.useState(0);

  // 0: empty → 1: greeting → 2: mini app open. 7s loop while visible.
  React.useEffect(() => {
    if (!inView) return;
    let tick = 0;
    const id = setInterval(() => {
      tick = (tick + 1) % 14;
      setStage(tick < 1 ? 0 : tick < 4 ? 1 : 2);
    }, 500);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} aria-hidden className="mx-auto w-full max-w-[20rem]">
      <div className="rounded-[2.75rem] bg-night p-2.5 shadow-[0_50px_100px_-40px_rgb(18_11_36/0.6)]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.2rem] bg-[#e9e5f5]">
          <span className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-night" />

          {/* Chat header */}
          <div className="relative z-10 flex items-center gap-3 bg-white/90 px-4 pb-3 pt-11">
            <span className="grid size-9 place-items-center rounded-full bg-violet text-white">
              <Send className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight text-ink">{dict.bot}</span>
              <span className="block text-xs text-muted">{dict.online}</span>
            </span>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2 p-4">
            <AnimatePresence>
              {stage >= 1 ? (
                <motion.div
                  key="greet"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="max-w-[85%] rounded-2xl rounded-bl-md bg-white p-3 text-[0.8rem] leading-snug text-ink shadow-sm"
                >
                  {dict.greeting}
                  <span className="mt-2 block rounded-xl bg-violet py-2 text-center text-xs font-bold text-white">
                    {dict.open}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Mini App sheet */}
          <AnimatePresence>
            {stage >= 2 ? (
              <motion.div
                key="app"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="absolute inset-x-0 bottom-0 top-[38%] rounded-t-3xl bg-white p-4 shadow-[0_-20px_40px_-20px_rgb(18_11_36/0.4)]"
              >
                <span className="mx-auto block h-1 w-10 rounded-full bg-line" />
                <p className="mt-3 font-display text-base font-extrabold text-ink">{dict.catalog}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[dict.item1, dict.item2].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.1 }}
                      className="rounded-2xl bg-paper p-2"
                    >
                      <span className={i ? "block aspect-square rounded-xl bg-lilac" : "block aspect-square rounded-xl bg-mist"} />
                      <span className="mt-2 block text-xs font-semibold text-ink">{item}</span>
                      <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-line" />
                    </motion.div>
                  ))}
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-x-4 bottom-4 block rounded-2xl bg-violet py-3 text-center text-sm font-bold text-white"
                >
                  {dict.pay}
                </motion.span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
