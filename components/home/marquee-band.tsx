import { Marquee } from "@/components/motion/marquee";
import { Prompt } from "@/components/brand/spark";
import { siteConfig } from "@/lib/site";

const ITEMS = [siteConfig.slogan, siteConfig.signature, siteConfig.slogan, siteConfig.signature];

/** Giant slanted ticker with the brand lines. Decorative → hidden from AT. */
export function MarqueeBand() {
  return (
    <div aria-hidden className="overflow-hidden py-6 sm:py-10">
      <div className="-rotate-2 bg-violet py-4 text-white sm:py-6">
        <Marquee duration="55s" className="mask-x">
          {ITEMS.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="slant whitespace-nowrap px-6 font-display text-[clamp(2.25rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.04em] sm:px-10">
                {item}
              </span>
              <Prompt className="h-[clamp(1.5rem,3.5vw,3rem)] text-lilac" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
