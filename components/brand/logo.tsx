import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Official logo files from /public/Innovialabs-logo — never redrawn, recolored
 * or outlined (guideline p.07). Minimum sizes (p.06): horizontal 120px wide,
 * mark 24px.
 */
export function Logo({
  variant = "horizontal",
  className,
  priority = false,
}: {
  variant?: "horizontal" | "white" | "mark";
  className?: string;
  priority?: boolean;
}) {
  if (variant === "mark") {
    return (
      <Image
        src={siteConfig.logo.mark}
        alt={siteConfig.name}
        width={120}
        height={120}
        unoptimized
        priority={priority}
        className={cn("h-10 w-auto", className)}
      />
    );
  }

  return (
    <Image
      src={
        variant === "white"
          ? siteConfig.logo.horizontalWhite
          : siteConfig.logo.horizontal
      }
      alt={siteConfig.name}
      width={468}
      height={120}
      unoptimized
      priority={priority}
      className={cn("h-9 w-auto", className)}
    />
  );
}
