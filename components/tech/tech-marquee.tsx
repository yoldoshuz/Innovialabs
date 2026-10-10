import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { techGroups, type Tech } from "@/lib/tech";
import { Marquee } from "@/components/motion/marquee";
import { GiantTitle } from "@/components/motion/giant-title";
import { TechTile } from "@/components/tech/tech-wall";

/** Home: two rows of technology logos drifting in opposite directions. */
export function TechMarquee({ title, href, more }: { title: string; href: string; more: string }) {
  const all = Object.values(techGroups).flat().filter((t: Tech) => t.path);
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)];
  return (
    <section className="section overflow-hidden">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <GiantTitle className="max-w-5xl text-[clamp(2.5rem,6.4vw,6.5rem)]">{title}</GiantTitle>
        <Link href={href} className="group flex shrink-0 items-center gap-2 font-display text-lg font-bold text-violet sm:pb-3">
          <span className="link-underline">{more}</span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-12 flex flex-col gap-3 lg:mt-16">
        {rows.map((row, i) => (
          <Marquee key={i} reverse={i === 1} duration="360s" className="mask-x">
            {row.map((t) => (
              <TechTile key={t.name} tech={t} className="mr-3 h-16 px-5 text-base" />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
