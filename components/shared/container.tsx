import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered max-width wrapper with responsive horizontal padding. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
