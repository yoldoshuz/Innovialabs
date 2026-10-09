import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ServicesDict } from "@/types";
import { serviceMeta, type ServiceSlug } from "@/lib/content";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/brand/icon";
import { Prompt } from "@/components/brand/spark";
import { cn } from "@/lib/utils";

type Look = { span: string; tone: string; muted: string; accent: string };

/** Highlighted cards first (AI, Telegram), a wide closer, the rest plain. */
const layout: Partial<Record<ServiceSlug, Look>> = {
  ai: { span: "md:col-span-2", tone: "bg-violet text-white", muted: "text-white/80", accent: "text-white" },
  telegram: { span: "md:col-span-2", tone: "bg-night text-white", muted: "text-dim", accent: "text-lilac" },
  consulting: {
    span: "md:col-span-2 lg:col-span-4",
    tone: "bg-mist text-ink",
    muted: "text-muted",
    accent: "text-violet",
  },
};
const plain: Look = { span: "", tone: "bg-paper text-ink hover:bg-mist", muted: "text-muted", accent: "text-violet" };

/** Service cards → each opens its own service page. */
export function ServicesGrid({
  lang,
  dict,
  heading = true,
}: {
  lang: Locale;
  dict: ServicesDict;
  /** Off on /services, where the page header already carries the title. */
  heading?: boolean;
}) {
  return (
    <section id="services" className={cn("shell scroll-mt-24", heading ? "section" : "pb-16 sm:pb-24")}>
      {heading ? (
        <div className="mb-12 grid items-end gap-6 lg:mb-16 lg:grid-cols-12">
          <GiantTitle className="text-[clamp(2.5rem,7.4vw,7.5rem)] lg:col-span-9">{dict.title}</GiantTitle>
          <Reveal className="lg:col-span-3 lg:pb-3">
            <p className="type-lead text-muted">{dict.lead}</p>
          </Reveal>
        </div>
      ) : null}

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {dict.items.map((item, i) => {
          const slug = item.slug as ServiceSlug;
          const look = layout[slug] ?? plain;
          const big = slug === "ai" || slug === "telegram";
          return (
            <Reveal as="li" key={slug} delay={(i % 4) * 0.05} className={look.span}>
              <Link
                href={`/${lang}/services/${slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-[1.75rem] p-6 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-7",
                  big && "sm:p-9 lg:min-h-[25rem]",
                  look.tone,
                )}
              >
                <Icon
                  name={serviceMeta[slug].icon}
                  className={cn(
                    "transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110",
                    big ? "size-10 sm:size-11" : "size-8",
                    look.accent,
                  )}
                />
                <h3
                  className={cn(
                    "mt-6 font-display font-extrabold tracking-[-0.03em] sm:mt-8",
                    big ? "text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.05]" : "text-xl leading-tight",
                  )}
                >
                  {item.title}
                </h3>
                <p className={cn("mt-2 font-medium", big ? "text-lg" : "text-[0.95rem]", look.muted)}>
                  {item.subtitle}
                </p>
                <ul
                  className={cn(
                    "mt-5 flex flex-col gap-2",
                    big ? "text-[1.02rem]" : "text-[0.93rem]",
                    slug === "consulting" && "lg:flex-row lg:flex-wrap lg:gap-x-8",
                  )}
                >
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 leading-snug">
                      <Prompt className={cn("mt-[0.4em] h-2.5 shrink-0", look.accent)} />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto flex items-center gap-2 pt-7 font-display font-bold">
                  {dict.more}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
