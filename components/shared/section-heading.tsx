import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/anim/split-reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow + gigantism title + subtitle, revealed line-by-line on scroll. */
export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {badge ? (
        <Reveal>
          <Badge>{badge}</Badge>
        </Reveal>
      ) : null}
      <SplitReveal
        as="h2"
        className="font-display text-balance text-[clamp(2.1rem,5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight"
      >
        {title}
      </SplitReveal>
      {subtitle ? (
        <Reveal delay={0.1}>
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
