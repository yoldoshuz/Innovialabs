import { cn } from "@/lib/utils";

/**
 * Full-bleed gigantism band: huge uppercase words scrolling horizontally,
 * alternating filled and outlined for an editorial feel.
 */
export function GiantMarquee({
  items,
  className,
  reverse = false,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
}) {
  const row = [...items, ...items];

  return (
    <div
      aria-hidden
      className={cn("relative w-full overflow-hidden py-4 select-none", className)}
    >
      <div
        className={cn(
          "flex w-max items-center gap-10 animate-marquee",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {row.map((word, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={cn(
                "text-giant text-[10vw] leading-none lg:text-[7.5vw]",
                i % 2 === 0 ? "text-foreground/90" : "text-stroke",
              )}
            >
              {word}
            </span>
            <span className="text-[4vw] leading-none text-primary lg:text-[3vw]">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
