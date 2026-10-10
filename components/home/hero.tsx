"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { HeroDict, TrustDict } from "@/types";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Terminal } from "@/components/home/terminal";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Home hero — layout follows the guideline website mockup (p.15). */
export function Hero({
  lang,
  dict,
  trust,
}: {
  lang: Locale;
  dict: HeroDict;
  trust: TrustDict;
}) {
  const reduce = useReducedMotion();
  const rise = (delay: number, y = 40) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  return (
    <section className="shell pb-8 pt-32 sm:pt-40 lg:pt-44">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="type-display text-[clamp(2.6rem,5.1vw,5.5rem)]">
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <motion.span className="block" {...rise(0.1, 90)}>
                {dict.titleTop}
              </motion.span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-[0.12em]">
              <motion.span className="slant block text-violet" {...rise(0.22, 90)}>
                {dict.titleBottom}
              </motion.span>
            </span>
          </h1>

          <motion.p className="type-lead mt-7 max-w-xl text-muted" {...rise(0.38)}>
            {dict.lead}
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...rise(0.5)}>
            <Magnetic strength={0.25}>
              <Button asChild size="xl">
                <Link href={`/${lang}/brief`}>
                  {dict.primary}
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="xl" variant="soft">
              <Link href={`/${lang}/services`}>{dict.secondary}</Link>
            </Button>
          </motion.div>
          <motion.p className="mt-4 text-sm text-muted" {...rise(0.6, 10)}>
            {dict.note}
          </motion.p>
        </div>

        <motion.div
          className="lg:col-span-5"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 60, rotate: 2 },
                animate: { opacity: 1, y: 0, rotate: 0 },
                transition: { duration: 1.1, delay: 0.3, ease: EASE },
              })}
        >
          <Terminal dict={dict.terminal} />
        </motion.div>
      </div>

      {/* Trust strip — only facts we can stand behind (no invented numbers). */}
      <motion.ul
        className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4"
        {...rise(0.7, 20)}
      >
        {trust.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-4 rounded-3xl bg-paper px-5 py-5 font-display text-base font-bold leading-snug sm:px-6 sm:text-lg"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-violet">
              <Check className="size-5" strokeWidth={2.5} />
            </span>
            {item}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
