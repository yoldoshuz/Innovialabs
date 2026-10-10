import type { FormatsDict } from "@/types";
import { Reveal } from "@/components/motion/reveal";

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
