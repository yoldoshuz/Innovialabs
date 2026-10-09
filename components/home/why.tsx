import type { WhyDict } from "@/types";
import { Reveal } from "@/components/motion/reveal";
import { Spark } from "@/components/brand/spark";

/**
 * Promises (brand book p.03). Mobile: compact rows (icon left, text right)
 * separated by hairlines. Desktop: four columns.
 */
export function Why({ dict }: { dict: WhyDict }) {
  return (
    <section id="why" className="px-2 sm:px-3">
      <div className="rounded-[clamp(2rem,4vw,3.5rem)] bg-mist">
        <div className="shell py-14 sm:py-20">
          <h2 className="type-title slant">{dict.title}</h2>

          <ul className="mt-8 divide-y divide-violet/10 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 sm:divide-y-0 lg:grid-cols-4">
            {dict.items.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 0.06}
                className="group flex gap-4 py-5 first:pt-0 last:pb-0 sm:block sm:py-0"
              >
                <Spark className="mt-1 size-6 shrink-0 text-violet transition-transform duration-700 ease-[var(--ease-spring)] group-hover:rotate-90 group-hover:scale-125 sm:mt-0 sm:size-7" />
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] sm:mt-5 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-muted sm:mt-2">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl font-display text-lg font-bold leading-snug sm:mt-14 sm:text-xl">
            {dict.fullCycle}
          </p>
        </div>
      </div>
    </section>
  );
}
