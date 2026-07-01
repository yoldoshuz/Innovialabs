import type { TrustDict } from "@/types";
import { Container } from "@/components/shared/container";

/** Auto-scrolling marquee of client logos (placeholder wordmarks). */
export function TrustBar({ dict }: { dict: TrustDict }) {
  const logos = [...dict.logos, ...dict.logos];

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <p className="text-center font-mono text-xs uppercase tracking-widest text-subtle">
          {dict.label}
        </p>
        <div className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused]">
            {logos.map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="text-2xl font-semibold tracking-tight text-subtle/70 transition-colors hover:text-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
