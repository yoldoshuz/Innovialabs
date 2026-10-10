import type { Tone } from "@/lib/content";

/**
 * Class sets for the brand fills. `accent` is exposed as `--accent` so SVG
 * motifs can pick it up (`fill="var(--accent)"`).
 */
export const tones: Record<Tone, { bg: string; muted: string; accent: string; dark: boolean }> = {
  violet: { bg: "bg-violet text-white [--accent:var(--color-mist)]", muted: "text-white/75", accent: "text-mist", dark: true },
  night: { bg: "bg-night text-white [--accent:var(--color-lilac)]", muted: "text-dim", accent: "text-lilac", dark: true },
  deep: { bg: "bg-deep text-white [--accent:var(--color-lilac)]", muted: "text-white/70", accent: "text-lilac", dark: true },
  mist: { bg: "bg-mist text-ink [--accent:var(--color-violet)]", muted: "text-muted", accent: "text-violet", dark: false },
  lilac: { bg: "bg-lilac text-night [--accent:var(--color-violet)]", muted: "text-night/70", accent: "text-deep", dark: false },
};
