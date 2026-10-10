import { techGroups, type Tech, type TechGroup } from "@/lib/tech";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** One technology: its logo (ink, brand color on hover) and name. */
export function TechTile({ tech, className }: { tech: Tech; className?: string }) {
  return (
    <span
      className={cn("tech-tile", className)}
      style={tech.hex ? ({ "--brand": tech.hex } as React.CSSProperties) : undefined}
    >
      {tech.path ? (
        <svg viewBox="0 0 24 24" aria-hidden className="size-7 shrink-0">
          <path d={tech.path} />
        </svg>
      ) : (
        <span aria-hidden className="type-accent grid size-7 shrink-0 place-items-center rounded-md bg-ink text-[0.65rem] font-bold text-white">
          {tech.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
        </span>
      )}
      <span className="whitespace-nowrap">{tech.name}</span>
    </span>
  );
}

/**
 * Every technology we work with, by area — logos, not a text list.
 * Group labels come from the dictionary (`stack.categories`).
 */
export function TechWall({
  title,
  lead,
  labels,
}: {
  title: string;
  lead: string;
  labels: Record<TechGroup, string>;
}) {
  const total = Object.values(techGroups).flat().length;
  return (
    <section id="stack" className="section shell scroll-mt-24">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <GiantTitle className="text-[clamp(2.75rem,7vw,7rem)] lg:col-span-9">{title}</GiantTitle>
        <Reveal className="lg:col-span-3 lg:pb-3">
          <p className="type-accent text-[clamp(4rem,8vw,7rem)] font-bold leading-none text-violet">{total}</p>
          <p className="type-lead mt-2 text-muted">{lead}</p>
        </Reveal>
      </div>

      <dl className="mt-12 border-t-2 border-ink lg:mt-16">
        {(Object.keys(techGroups) as TechGroup[]).map((group, i) => (
          <Reveal
            key={group}
            delay={(i % 4) * 0.04}
            className="grid gap-4 border-b border-line py-7 sm:grid-cols-12 sm:gap-6 sm:py-8"
          >
            <dt className="font-display text-xl font-extrabold tracking-[-0.02em] text-violet sm:col-span-3 sm:pt-3">
              {labels[group]}
            </dt>
            <dd className="flex flex-wrap gap-2 sm:col-span-9">
              {techGroups[group].map((t) => (
                <TechTile key={t.name} tech={t} />
              ))}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
