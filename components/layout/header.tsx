"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { NavDict } from "@/types";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 420, damping: 30, mass: 0.9 } as const;

/**
 * Each bubble springs away/back with a tiny stagger. Only `y` moves: any
 * opacity < 1 on an ancestor turns it into a backdrop root, and the glass
 * would flash see-through until the fade finished.
 */
const bubble: Variants = {
  shown: (i: number = 0) => ({
    y: 0,
    transition: { ...SPRING, delay: i * 0.035 },
  }),
  hidden: (i: number = 0) => ({
    y: -112,
    transition: { ...SPRING, stiffness: 320, delay: i * 0.03 },
  }),
};

/** Above this scroll offset the glass melts into the page (no fill, no shadow). */
const TOP_ZONE = 12;

/** Scroll distance in one direction before the header reacts (px). */
const HIDE_AFTER = 28;
const SHOW_AFTER = 6;

/**
 * Floating liquid-glass header split into bubbles (logo · nav · language ·
 * CTA). Scrolling down hides it, the first scroll up brings it back. Over
 * dark sections (`data-tone="dark"`) the glass and logo switch to dark tone.
 * The current page keeps a highlight pill in the nav.
 */
export function Header({ lang, dict }: { lang: Locale; dict: NavDict }) {
  const pathname = usePathname() || "";
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const [atTop, setAtTop] = React.useState(true);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const travel = React.useRef(0);
  const { scrollY } = useScroll();

  const detectTone = React.useCallback(() => {
    const el = document
      .elementsFromPoint(window.innerWidth / 2, 44)
      .find((n) => !(n as HTMLElement).closest("[data-header]"));
    setDark(el?.closest("[data-tone]")?.getAttribute("data-tone") === "dark");
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? y);
    // Reset the accumulator when direction flips — no up/down flicker.
    if (Math.sign(delta) !== Math.sign(travel.current)) travel.current = 0;
    travel.current += delta;

    setAtTop(y < TOP_ZONE);
    if (y < 120) setHidden(false);
    else if (travel.current > HIDE_AFTER) setHidden(true);
    else if (travel.current < -SHOW_AFTER) setHidden(false);

    detectTone();
  });

  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      detectTone();
      setAtTop(window.scrollY < TOP_ZONE);
    });
    return () => cancelAnimationFrame(id);
  }, [detectTone, pathname]);

  // Close the menu on navigation (state reset during render, no effect).
  const [prevPath, setPrevPath] = React.useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tone = dark || open ? "dark" : "light";
  const href = (h: string) => `/${lang}${h}`;
  // Active page = the longest nav href that prefixes the current path.
  const section =
    dict.links
      .filter((l) => pathname === href(l.href) || pathname.startsWith(`${href(l.href)}/`))
      .sort((x, y) => y.href.length - x.href.length)[0]?.href ?? null;
  const highlighted = hovered ?? section;
  const state = hidden && !open ? "hidden" : "shown";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-violet focus:px-5 focus:py-3 focus:text-white"
      >
        {dict.skip}
      </a>

      <header
        data-header
        data-state={state}
        data-tone={tone}
        data-top={atTop && !open ? "true" : undefined}
        className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 max-[359px]:px-2 sm:top-4 sm:px-4"
      >
        <motion.div
          initial="hidden"
          animate={state}
          className="mx-auto flex max-w-[92rem] items-center justify-between gap-2"
        >
          {/* Logo bubble */}
          <motion.div variants={bubble} custom={0} className="pointer-events-auto">
            <Link
              href={`/${lang}`}
              aria-label={dict.home}
              className="glass grid size-12 shrink-0 place-items-center sm:h-14 sm:w-auto sm:px-6"
            >
              {/* Phones: the mark alone (allowed by the guideline, p.05). */}
              <Logo variant="mark" priority className="h-7 w-auto sm:hidden" />
              <span className="relative hidden h-8 w-[7.8rem] sm:block">
                <Logo
                  className={cn(
                    "absolute inset-0 h-full w-full transition-opacity duration-500",
                    tone === "dark" && "opacity-0",
                  )}
                />
                <Logo
                  variant="white"
                  className={cn(
                    "absolute inset-0 h-full w-full transition-opacity duration-500",
                    tone === "light" && "opacity-0",
                  )}
                />
              </span>
            </Link>
          </motion.div>

          {/* Nav bubble */}
          <motion.nav
            variants={bubble}
            custom={1}
            aria-label="Main"
            onMouseLeave={() => setHovered(null)}
            className="glass pointer-events-auto hidden h-14 items-center px-1.5 xl:flex"
          >
            {dict.links.map((link) => (
              <Link
                key={link.href}
                href={href(link.href)}
                onMouseEnter={() => setHovered(link.href)}
                aria-current={section === link.href ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-4 py-2.5 text-[0.93rem] font-semibold transition-colors duration-300",
                  tone === "dark" ? "text-white" : "text-ink",
                )}
              >
                {highlighted === link.href ? (
                  <motion.span
                    layoutId="nav-highlight"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      tone === "dark" ? "bg-white/12" : "bg-violet/10",
                    )}
                  />
                ) : null}
                {link.label}
              </Link>
            ))}
          </motion.nav>

          {/* Actions */}
          <div className="flex items-center gap-2 max-[359px]:gap-1.5">
            <motion.div variants={bubble} custom={2} className="pointer-events-auto hidden md:block">
              <LocaleSwitcher current={lang} label={dict.language} tone={tone} id="locale-desktop" />
            </motion.div>
            <motion.div variants={bubble} custom={3} className="pointer-events-auto">
              <Link
                href={href("/brief")}
                className="group/cta inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-violet px-4 font-display text-[0.85rem] font-bold max-[359px]:px-3 max-[359px]:text-[0.76rem] sm:px-7 sm:text-[0.93rem] text-white shadow-[0_12px_30px_-12px_var(--color-violet)] transition-[background-color,transform] duration-300 hover:bg-deep active:scale-[0.97] sm:h-14"
              >
                {dict.cta}
              </Link>
            </motion.div>
            <motion.div variants={bubble} custom={4} className="pointer-events-auto xl:hidden">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? dict.close : dict.menu}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={cn(
                  "glass grid size-12 place-items-center sm:size-14",
                  tone === "dark" ? "text-white" : "text-ink",
                )}
              >
                <span
                  className={cn(
                    "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-spring)]",
                    open ? "rotate-45" : "-translate-y-[4px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-spring)]",
                    open ? "-rotate-45" : "translate-y-[4px]",
                  )}
                />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            data-tone="dark"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night px-5 pb-8 pt-28 text-white xl:hidden"
          >
            <div aria-hidden className="pattern-prompt pointer-events-none absolute inset-0 opacity-[0.07]" />
            <nav aria-label="Mobile" className="relative flex flex-col gap-1">
              {dict.links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href={href(link.href)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "slant whitespace-nowrap font-display text-[clamp(1.375rem,6.6vw,4.5rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.04em] transition-colors",
                      section === link.href ? "text-lilac" : "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              className="relative mt-auto flex flex-col gap-4 pt-10"
            >
              <LocaleSwitcher current={lang} label={dict.language} tone="dark" id="locale-mobile" className="self-start" />
              <Link
                href={href("/brief")}
                onClick={() => setOpen(false)}
                className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-full bg-violet font-display text-lg font-bold text-white transition-colors hover:bg-deep"
              >
                {dict.cta}
                <ArrowUpRight className="size-5" />
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
