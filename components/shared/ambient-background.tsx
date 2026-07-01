import { cn } from "@/lib/utils";

/**
 * Fixed, non-interactive ambient layer: gradient aurora blobs + a subtle
 * grid + grain. Sits behind all content. Purely decorative.
 */
export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {/* Aurora blobs — restrained, editorial (not neon) */}
      <div className="absolute -top-48 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-primary/8 blur-[150px] animate-float-slow" />
      <div className="absolute top-1/2 -left-52 size-[32rem] rounded-full bg-secondary/8 blur-[150px] animate-float" />
      <div className="absolute bottom-0 right-0 size-[34rem] rounded-full bg-violet/6 blur-[160px] animate-float-slow" />
      {/* Grain */}
      <div className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
