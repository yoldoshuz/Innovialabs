"use client";

import * as React from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { AiDict } from "@/types";
import { requestContact } from "@/lib/contact-intent";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/** Share of routine assumed automatable — stated next to the result. */
const AUTOMATABLE = 0.5;
const WEEKS_PER_MONTH = 4.33;

export function AiBlock({ dict }: { dict: AiDict }) {
  return (
    <section id="ai" data-tone="dark" className="scroll-mt-24 px-2 sm:px-3">
      <div className="stage relative overflow-hidden">
        <div aria-hidden className="pattern-prompt absolute inset-0 opacity-[0.06]" />
        <div className="shell relative py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                  {dict.title}
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="type-lead mt-6 max-w-2xl text-dim">{dict.text}</p>
              </Reveal>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {dict.benefits.map((b, i) => (
                  <Reveal as="li" key={b} delay={0.1 + i * 0.05} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-violet">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    <span className="font-medium leading-snug">{b}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal delay={0.15} className="lg:col-span-5">
              <Calculator dict={dict.calc} />
            </Reveal>
          </div>

          <h3 className="type-subtitle mt-16 sm:mt-20">{dict.nowTitle}</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dict.now.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.06} className="card-night p-6">
                <p className="font-display text-xl font-extrabold text-lilac">{item.title}</p>
                <p className="mt-2 leading-snug text-white/85">{item.text}</p>
              </Reveal>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button asChild size="xl">
              <Link href="#contact" onClick={() => requestContact({ service: "ai" })}>
                {dict.cta}
                <ArrowRight />
              </Link>
            </Button>
            <p className="max-w-sm text-dim">{dict.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator({ dict }: { dict: AiDict["calc"] }) {
  const [people, setPeople] = React.useState(5);
  const [hours, setHours] = React.useState(8);
  const target = Math.round(people * hours * WEEKS_PER_MONTH * AUTOMATABLE);

  // Animated counter that springs to the new value.
  const value = useMotionValue(target);
  const shown = useTransform(value, (v) => Math.round(v).toLocaleString("ru-RU"));
  React.useEffect(() => {
    const controls = animate(value, target, { type: "spring", stiffness: 120, damping: 20 });
    return () => controls.stop();
  }, [target, value]);

  return (
    <div className="rounded-[2rem] bg-ink-2 p-6 sm:p-8">
      <Range label={dict.people} value={people} min={1} max={50} onChange={setPeople} />
      <Range label={dict.hours} value={hours} min={1} max={40} onChange={setHours} className="mt-7" />
      <div className="mt-8 rounded-3xl bg-violet p-6">
        <motion.output
          aria-live="polite"
          className="type-accent block text-[clamp(3.5rem,7vw,5rem)] font-bold leading-none"
        >
          {shown}
        </motion.output>
        <p className="mt-2 font-display text-lg font-bold leading-snug">{dict.result}</p>
      </div>
      <p className="mt-4 text-sm text-dim">{dict.assumption}</p>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const id = React.useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-medium text-white/85">
          {label}
        </label>
        <span className="type-accent text-2xl font-bold text-white">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </div>
  );
}
