"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DIR = "/Innovialabs-logo-animated";

/**
 * The official animated logo (6 s, no sound). Horizontal on desktop,
 * vertical on phones; plays once when it scrolls into view (or right away
 * with `autoPlay`). Reduced motion gets the final frame as a poster.
 */
export function LogoVideo({
  label,
  className,
  autoPlay = false,
  vertical = "auto",
  onEnded,
}: {
  label: string;
  className?: string;
  autoPlay?: boolean;
  /** "auto": vertical cut on screens ≤700px. */
  vertical?: "auto" | "never";
  onEnded?: () => void;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const v = ref.current;
    if (!v || reduce || !(autoPlay || inView)) return;
    v.play().catch(() => onEnded?.());
  }, [autoPlay, inView, reduce, onEnded]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload={autoPlay ? "auto" : "metadata"}
      poster={`${DIR}/innovialabs-logo-1920x1080-poster.jpg`}
      aria-label={label}
      onEnded={onEnded}
      className={cn("block bg-night object-cover", className)}
    >
      {vertical === "auto" ? (
        <>
          <source src={`${DIR}/innovialabs-logo-1080x1920.webm`} type="video/webm" media="(max-width: 700px)" />
          <source src={`${DIR}/innovialabs-logo-1080x1920.mp4`} type="video/mp4" media="(max-width: 700px)" />
        </>
      ) : null}
      <source src={`${DIR}/innovialabs-logo-1920x1080.webm`} type="video/webm" />
      <source src={`${DIR}/innovialabs-logo-1920x1080.mp4`} type="video/mp4" />
    </video>
  );
}
