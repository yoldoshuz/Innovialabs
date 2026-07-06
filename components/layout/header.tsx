"use client";

import * as React from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import type { NavDict } from "@/types";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

const ACCENT = "#5E0ED7";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Nav entrance: fade + drop, staggered by custom index. */
const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE },
  }),
};

export function Header({ lang, dict }: { lang: Locale; dict: NavDict }) {
  const scrolled = useScrolled(16);
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 md:px-12 md:py-6">
        {/* Left — brand mark */}
        <motion.div custom={0} variants={fadeDown} initial="hidden" animate="show">
          <Link href={`/${lang}`} aria-label={`${lang} — home`}>
            <Logo markOnly />
          </Link>
        </motion.div>

        {/* Center — primary nav (md+) */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {dict.links.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i + 1}
              variants={fadeDown}
              initial="hidden"
              animate="show"
            >
              <Link
                href={`/${lang}${link.href}`}
                className="text-sm font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right — locale switcher + menu trigger */}
        <motion.div
          custom={5}
          variants={fadeDown}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3"
        >
          <LocaleSwitcher current={lang} />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.menu}
            className="flex size-9 flex-col items-center justify-center gap-1 rounded-full bg-black"
          >
            <span className="h-0.5 w-4 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
          </button>
        </motion.div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
          >
            {/* Top row — logo + close */}
            <div className="flex items-center justify-between px-5 py-5 sm:px-8">
              <Logo markOnly />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={dict.close}
                className="grid size-9 place-items-center rounded-full bg-black text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="mt-16 flex flex-col gap-8 px-5 sm:px-8">
              {dict.links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, ease: EASE }}
                >
                  <Link
                    href={`/${lang}${link.href}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-semibold uppercase tracking-widest text-black"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom — CTA */}
            <div className="mt-auto px-5 pb-10 sm:px-8">
              <Link
                href={`/${lang}/contacts`}
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 text-xl font-semibold uppercase tracking-wide"
                style={{ color: ACCENT }}
              >
                {dict.cta}
                <ArrowUpRight strokeWidth={2.25} className="size-5" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
