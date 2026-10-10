"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoVideo } from "@/components/brand/logo-video";

const KEY = "innovialabs:intro";
/** Hard stop in case the video stalls (the cut itself is 6 s). */
const MAX_MS = 7000;

/**
 * Decides before first paint whether to show the intro: first visit only,
 * not for crawlers or reduced motion. Sets `html[data-intro]`, which the CSS
 * uses to show the overlay and lock scrolling.
 */
export const introScript = `try{if(!localStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!/bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent)){document.documentElement.dataset.intro="1"}}catch(e){}`;

/** First-visit intro: the animated logo full screen, then the site. */
export function Intro({ label, skip }: { label: string; skip: string }) {
  const [active, setActive] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") return;
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // "leaving" drops the overlay's own backdrop so the fade reveals the page.
  const finish = React.useCallback(() => {
    document.documentElement.dataset.intro = "leaving";
    setLeaving(true);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const t = setTimeout(finish, MAX_MS);
    return () => clearTimeout(t);
  }, [active, finish]);

  const done = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private mode: show again next time, no harm */
    }
    delete document.documentElement.dataset.intro;
    setActive(false);
  };

  return (
    <div className="intro" aria-hidden={!active}>
      <AnimatePresence onExitComplete={done}>
        {active && !leaving ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 grid place-items-center bg-night"
            onClick={finish}
          >
            <LogoVideo label={label} autoPlay onEnded={finish} className="size-full" />
            <button
              type="button"
              onClick={finish}
              className="absolute bottom-6 right-6 rounded-full px-5 py-2.5 font-display text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {skip}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
