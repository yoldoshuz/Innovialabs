import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** Deep-purple brand accent. */
const ACCENT = "#5E0ED7";

/**
 * Brand mark — a purple-ringed dot. `markOnly` renders just the glyph (nav);
 * otherwise the uppercase wordmark follows (footer).
 */
export function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="grid size-8 place-items-center rounded-full border-2"
        style={{ borderColor: ACCENT }}
        aria-hidden
      >
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: ACCENT }}
        />
      </span>
      {!markOnly ? (
        <span className="text-lg font-semibold uppercase tracking-widest text-foreground">
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
