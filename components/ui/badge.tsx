import * as React from "react";
import { cn } from "@/lib/utils";

/** Small pill used for section eyebrows / labels. */
export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-2/60 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur",
        className,
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
      {children}
    </span>
  );
}
