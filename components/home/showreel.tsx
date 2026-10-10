"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/**
 * The studio ad (1920×1080, 20 s) as a giant rounded block. Loads only
 * when it nears the viewport, plays muted while visible, pauses otherwise;
 * one round button toggles sound.
 */
export function Showreel({ labels }: { labels: { video: string; soundOn: string; soundOff: string } }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });
  const visible = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [muted, setMuted] = React.useState(true);

  React.useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible, reduce]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <section data-tone="dark" className="px-2 sm:px-3">
      <Reveal y={60} className="stage relative overflow-hidden">
        <video
          ref={ref}
          src={near ? "/innovialabs-ad.mp4" : undefined}
          muted
          loop
          playsInline
          preload="none"
          poster="/Innovialabs-logo-animated/innovialabs-logo-1920x1080-poster.jpg"
          aria-label={labels.video}
          className="block aspect-video w-full bg-night object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? labels.soundOn : labels.soundOff}
          aria-pressed={!muted}
          className="absolute bottom-4 right-4 grid size-14 place-items-center rounded-full bg-white text-ink shadow-[0_20px_40px_-16px_rgb(18_11_36/0.6)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-110 sm:bottom-8 sm:right-8 sm:size-16"
        >
          {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6 text-violet" />}
        </button>
      </Reveal>
    </section>
  );
}
