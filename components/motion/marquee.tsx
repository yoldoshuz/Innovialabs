import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee (Magic UI pattern). Content is duplicated once and the
 * track slides by -50%; pauses on hover. Pure CSS, no JS.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = "40s",
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: `${number}s`;
}) {
  return (
    <div
      className={cn("group flex overflow-hidden", className)}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div
        className={cn(
          "flex w-max shrink-0 animate-marquee items-center",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
        <div aria-hidden className="flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
