import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** Brand mark — abstract geometric glyph + wordmark. Placeholder identity. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-background">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M12 2 2 7v10l10 5 10-5V7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </span>
  );
}
