import type { FormatsDict, StackDict } from "@/types";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";

/** Tech stack as plain rows — names, not logo soup. */
export function Stack({ dict }: { dict: StackDict }) {
  return (
    <section id="stack" className="section shell scroll-mt-24">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <GiantTitle className="text-[clamp(2.75rem,7vw,7rem)] lg:col-span-9">{dict.title}</GiantTitle>
        <Reveal className="lg:col-span-3 lg:pb-3">
          <p className="type-lead text-muted">{dict.lead}</p>
        </Reveal>
      </div>

      <dl className="mt-12 border-t border-line lg:mt-16">
        {dict.groups.map((group, i) => (
          <Reveal
            key={group.title}
            delay={i * 0.04}
            className="group grid gap-2 border-b border-line py-6 transition-colors duration-300 hover:bg-paper sm:grid-cols-12 sm:gap-6 sm:px-4 sm:py-7"
          >
            <dt className="font-display text-lg font-extrabold text-violet sm:col-span-3">{group.title}</dt>
            <dd className="font-display text-[clamp(1.25rem,2.3vw,2rem)] font-bold leading-snug tracking-[-0.02em] sm:col-span-9">
              {group.items.join(" · ")}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/** Three engagement formats instead of a price list. */
export function Formats({ dict }: { dict: FormatsDict }) {
  return (
    <section id="formats" className="shell pb-[clamp(4.5rem,10vw,9rem)]">
      <h2 className="type-title slant">{dict.title}</h2>
      <ul className="mt-10 grid gap-3 md:grid-cols-3">
        {dict.items.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 0.07}
            className="flex flex-col rounded-[1.75rem] bg-paper p-7 transition-colors duration-500 hover:bg-mist sm:p-8"
          >
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em]">{item.title}</h3>
            <dl className="mt-6 flex flex-col gap-5">
              <div>
                <dt className="text-sm font-semibold text-violet">{dict.headers.fit}</dt>
                <dd className="mt-1 text-lg leading-snug">{item.fit}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-violet">{dict.headers.how}</dt>
                <dd className="mt-1 text-lg leading-snug">{item.how}</dd>
              </div>
            </dl>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
