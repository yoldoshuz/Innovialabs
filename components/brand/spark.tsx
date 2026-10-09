import { cn } from "@/lib/utils";

/**
 * Star-spark (guideline p.10): marks the main thing, the new, the result.
 * No more than two per layout. Geometry matches the star in the logo mark.
 */
export function Spark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 34 34"
      className={cn("size-6 fill-current", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d="M17 0Q19.89 14.11 34 17 19.89 19.89 17 34 14.11 19.89 0 17 14.11 14.11 17 0Z" />
    </svg>
  );
}

/** Command chevron «>» from the mark, used as a list/arrow glyph. */
export function Prompt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 32"
      aria-hidden
      className={cn("h-4 w-auto", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l13 13L3 29" />
    </svg>
  );
}
