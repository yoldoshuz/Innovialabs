"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import type { HeroDict } from "@/types";

/** Deep-purple accent used for the stat "+" glyphs and the CTA. */
const ACCENT = "#5E0ED7";

/** Background hero loop (autoplay / muted / cover). */
const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-up + stagger for stats and bottom content (custom = stagger index). */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: EASE },
  }),
};

/**
 * Full-screen hero: autoplaying video background, right-aligned stat row and a
 * gigantism headline that clip-reveals on load. The site nav lives in the
 * fixed global <Header/>, which overlays this section.
 */
export function Hero({ dict, lang }: { dict: HeroDict; lang: Locale }) {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden font-sans text-black">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
      {/* Legibility scrim — keeps black text readable over any frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/10 to-white/45" />

      {/* Spacer for the fixed global header/nav */}
      <div className="relative z-10 h-20 shrink-0 md:h-24" />

      {/* Stats row (vertically centered, right-aligned) */}
      <div className="relative z-10 flex flex-1 items-center justify-end px-5 py-8 sm:px-8 md:px-12 md:py-0">
        <div className="flex gap-5 sm:gap-8 md:gap-10">
          {dict.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-right"
            >
              <div
                className="font-semibold leading-none tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}
              >
                <span style={{ color: ACCENT, fontSize: "0.5em" }}>+</span>
                <span>{stat.value}</span>
              </div>
              <div className="mt-1.5 whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-widest sm:text-xs md:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 flex flex-col gap-6 px-5 pb-8 sm:px-8 md:gap-12 md:px-12 md:pb-12">
        {/* Row A — tagline + CTA */}
        <div className="flex items-center justify-between gap-4">
          <motion.p
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-[130px] text-[10px] font-semibold uppercase tracking-widest sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm"
          >
            {dict.taglineA.map((line, i) => (
              <React.Fragment key={line}>
                {line}
                {i < dict.taglineA.length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.p>

          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
            <Link
              href={`/${lang}/contacts`}
              className="group inline-flex items-center gap-1.5 whitespace-nowrap text-base font-semibold uppercase tracking-wide sm:text-xl md:text-2xl"
              style={{ color: ACCENT }}
            >
              {dict.cta}
              <ArrowUpRight
                strokeWidth={2.25}
                className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-[22px]"
              />
            </Link>
          </motion.div>
        </div>

        {/* Row B — description + gigantism headline */}
        <div className="flex items-end justify-between gap-3 sm:gap-4">
          <motion.p
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="w-[120px] shrink-0 text-left text-[9px] font-semibold uppercase tracking-widest sm:w-[180px] sm:text-xs md:w-[280px] md:text-right md:text-sm"
          >
            {dict.descriptionB}
          </motion.p>

          <h1
            className="text-right font-semibold uppercase"
            style={{ fontSize: "clamp(2rem, 9vw, 9rem)", lineHeight: 0.88 }}
          >
            {dict.heading.map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4 + i * 0.14, duration: 0.7, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
