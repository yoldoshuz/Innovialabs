import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { CaseItem } from "@/types";
import { caseMeta, type CaseSlug } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const tones = ["bg-violet text-white", "bg-night text-white", "bg-mist text-ink", "bg-lilac text-night", "bg-paper text-ink"];

/** Case tile: screenshot on a colored block, then name, task in one line. */
export function CaseCard({
  lang,
  item,
  index = 0,
  large = false,
  priority = false,
}: {
  lang: Locale;
  item: CaseItem;
  index?: number;
  large?: boolean;
  priority?: boolean;
}) {
  const meta = caseMeta[item.slug as CaseSlug];
  return (
    <Reveal delay={(index % 2) * 0.08} className={cn(large && "md:col-span-2")}>
      <Link href={`/${lang}/cases/${item.slug}`} className="group block">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2rem] px-5 pt-5 sm:px-10 sm:pt-10",
            tones[index % tones.length],
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="type-accent text-sm font-medium opacity-80">
              {[meta.year, meta.host].filter(Boolean).join(" · ")}
            </p>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:scale-110">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
          <div
            className={cn(
              "relative mx-auto mt-6 overflow-hidden rounded-t-2xl shadow-[0_30px_60px_-30px_rgb(18_11_36/0.6)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2",
              large ? "aspect-[16/7]" : "aspect-[16/10]",
            )}
          >
            <Image
              src={meta.shot}
              alt={`${item.name} — ${item.tagline}`}
              fill
              priority={priority}
              sizes={large ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-1 px-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
            <span className="link-underline">{item.name}</span>
          </h3>
          <p className="text-muted">{item.industry}</p>
        </div>
        <p className="mt-2 max-w-2xl px-2 text-lg">{item.tagline}</p>
      </Link>
    </Reveal>
  );
}
