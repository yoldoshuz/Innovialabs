import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { FormService } from "@/lib/content";
import { briefHref } from "@/lib/links";
import { GiantTitle } from "@/components/motion/giant-title";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";

/**
 * Page closer: one giant question and one big round button to the brief.
 * Replaces the repeated form at the bottom of every page.
 */
export function CtaBand({
  lang,
  title,
  lead,
  cta,
  service,
}: {
  lang: Locale;
  title: string;
  lead: string;
  cta: string;
  service?: FormService;
}) {
  const href = briefHref(lang, service);
  return (
    <section id="contact" data-tone="dark" className="scroll-mt-24 px-2 pb-2 pt-[clamp(2rem,5vw,4rem)] sm:px-3 sm:pb-3">
      <div className="stage relative overflow-hidden bg-violet">
        <div aria-hidden className="pattern-prompt pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="shell relative grid items-end gap-4 py-12 sm:gap-10 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <GiantTitle className="text-[clamp(2.75rem,7.4vw,7.75rem)] text-white">{title}</GiantTitle>
            <Reveal delay={0.1}>
              <p className="type-lead mt-6 max-w-2xl text-white/85">{lead}</p>
            </Reveal>
          </div>
          <div className="flex justify-end lg:col-span-3">
            <Magnetic strength={0.35}>
              <Link
                href={href}
                className="group grid size-28 place-items-center rounded-full bg-white p-3 text-center text-ink transition-[transform,background-color,color] duration-500 ease-[var(--ease-spring)] hover:scale-105 hover:bg-night hover:text-white sm:size-52 sm:p-6"
              >
                <span className="flex flex-col items-center gap-1 font-display text-sm font-extrabold leading-tight tracking-[-0.02em] sm:gap-2 sm:text-xl">
                  <ArrowUpRight className="size-6 text-violet transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:text-lilac sm:size-10" />
                  {cta}
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
