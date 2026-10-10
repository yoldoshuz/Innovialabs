import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CaseItem } from "@/types";
import { caseMeta, type CaseSlug } from "@/lib/content";
import { tones } from "@/lib/tone";
import { Reveal } from "@/components/motion/reveal";
import { CaseMotif } from "@/components/cases/motif";
import { cn } from "@/lib/utils";

/**
 * Case tile — one template for every case: tone block, animated motif,
 * giant name, one-line tagline and the headline number. No screenshots.
 */
export function CaseCard({
  lang,
  item,
  index = 0,
  large = false,
  as = "h3",
}: {
  lang: Locale;
  item: CaseItem;
  index?: number;
  large?: boolean;
  as?: "h2" | "h3";
}) {
  const slug = item.slug as CaseSlug;
  const meta = caseMeta[slug];
  const tone = tones[meta.tone];
  const fact = item.facts[0];
  const Heading = as;

  return (
    <Reveal delay={(index % 2) * 0.08} className={cn("min-w-0", large && "md:col-span-2")}>
      <Link
        href={`/${lang}/cases/${item.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 sm:p-9",
          large ? "min-h-[26rem] md:aspect-[21/9] md:min-h-0" : "min-h-[26rem] sm:aspect-[5/4] sm:min-h-0",
          tone.bg,
        )}
      >
        <div className="relative z-10 flex items-start justify-between gap-4">
          <p className={cn("max-w-[70%] font-medium leading-snug", tone.muted)}>{item.industry}</p>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:scale-110">
            <ArrowUpRight className="size-5" />
          </span>
        </div>

        <CaseMotif
          slug={slug}
          className={cn(
            "pointer-events-none absolute transition-transform duration-1000 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110",
            large
              ? "right-[5%] top-1/2 size-[min(56%,30rem)] -translate-y-1/2"
              : "right-[4%] top-[12%] size-[44%] sm:right-[6%]",
          )}
        />

        <div className="relative z-10 mt-auto pt-40 sm:pt-0">
          <Heading
            className={cn(
              "slant font-display font-extrabold uppercase leading-[0.88] tracking-[-0.045em]",
              large
                ? "text-[clamp(2.75rem,8vw,9rem)]"
                : item.name.length > 12
                  ? "text-[clamp(2rem,3.4vw,3.25rem)]"
                  : "text-[clamp(2.25rem,4.4vw,4.25rem)]",
            )}
          >
            {item.name}
          </Heading>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <p className="max-w-sm text-lg font-medium leading-snug">{item.tagline}</p>
            {fact ? (
              <p className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0 sm:text-right">
                <span className={cn("type-accent text-4xl font-bold leading-none", tone.accent)}>{fact.value}</span>
                <span className={cn("text-sm", tone.muted)}>{fact.label}</span>
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
