import Image from "next/image";
import { cn } from "@/lib/utils";

/** Product screenshot in a minimal browser window (1440×900 source). */
export function BrowserShot({
  src,
  host,
  alt,
  priority = false,
  className,
}: {
  src: string;
  host: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("window", className)}>
      <div className="window-bar">
        <span className="window-dot bg-[#ff5f57]" />
        <span className="window-dot bg-[#febc2e]" />
        <span className="window-dot bg-[#28c840]" />
        <span className="mx-auto max-w-[60%] truncate rounded-full bg-white/10 px-4 py-0.5 text-xs text-white/70">
          {host}
        </span>
      </div>
      <div className="relative aspect-[16/10] bg-paper">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 860px, (min-width: 1024px) 62vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </figure>
  );
}

/** Mobile screenshot in a phone frame (390×844 source). */
export function PhoneShot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-[1.6rem] bg-night p-1.5 shadow-[0_30px_60px_-20px_rgb(18_11_36/0.7)]",
        className,
      )}
    >
      <div className="relative aspect-[390/844] overflow-hidden rounded-[1.2rem] bg-paper">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 180px, 30vw"
          className="object-cover object-top"
        />
        <span className="absolute left-1/2 top-1.5 h-3 w-1/3 -translate-x-1/2 rounded-full bg-night" />
      </div>
    </figure>
  );
}
