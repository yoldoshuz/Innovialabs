"use client";

import { useReducedMotion } from "motion/react";
import type { CaseSlug } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * One small animated schematic per case — the only thing that differs
 * between case covers besides copy and tone. Drawn in brand line style
 * (round caps, currentColor) with `--accent` for the highlight. SMIL keeps
 * it dependency-free; under reduced motion the static frame is rendered.
 */
export function CaseMotif({ slug, className }: { slug: CaseSlug; className?: string }) {
  const still = useReducedMotion() ?? false;
  const Cmp = motifs[slug];
  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("block", className)}
    >
      <Cmp still={still} />
    </svg>
  );
}

type P = { still: boolean };
/** Trig output differs in the last digits between server and client. */
const round = (n: number) => Math.round(n * 100) / 100;
const ACCENT = "var(--accent)";

/** `<animate>` that disappears under reduced motion. */
function A({ still, ...props }: P & React.SVGProps<SVGAnimateElement>) {
  return still ? null : <animate repeatCount="indefinite" {...props} />;
}

const motifs: Record<CaseSlug, (p: P) => React.ReactNode> = {
  /* Cargo board: a truck runs the route, the magnet catches loads on it. */
  loadme: ({ still }) => (
    <>
      <path id="m-loadme" d="M40 190 C 70 120, 120 200, 150 130 S 190 60, 200 50" strokeDasharray="2 14" opacity={0.6} />
      <circle cx={40} cy={190} r={12} />
      <path d="M200 26 a18 18 0 0 1 18 18 c0 16 -18 34 -18 34 s-18 -18 -18 -34 a18 18 0 0 1 18 -18z" fill={ACCENT} stroke="none" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={70 + i * 42} y={i === 1 ? 92 : 150 - i * 10} width={16} height={16} rx={4} fill={ACCENT} stroke="none" opacity={0.35}>
          <A still={still} attributeName="opacity" values="0.35;1;0.35" dur="3s" begin={`${i * 0.6}s`} />
        </rect>
      ))}
      <g transform={still ? "translate(150 130)" : undefined}>
        <rect x={-15} y={-11} width={30} height={22} rx={6} fill="currentColor" stroke="none" />
        {still ? null : (
          <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
            <mpath href="#m-loadme" />
          </animateMotion>
        )}
      </g>
    </>
  ),

  /* Two cities, a car shuttling between them, seats filling up. */
  yoldosh: ({ still }) => (
    <>
      <path id="m-yoldosh" d="M50 150 Q 120 40 190 150" />
      <circle cx={50} cy={150} r={16} fill="currentColor" />
      <circle cx={190} cy={150} r={16} fill={ACCENT} stroke="none" />
      <circle r={9} fill={ACCENT} stroke="none" cx={still ? 120 : 0} cy={still ? 95 : 0}>
        {still ? null : (
          <animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.6 0 0.4 1;0.6 0 0.4 1">
            <mpath href="#m-yoldosh" />
          </animateMotion>
        )}
      </circle>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={66 + i * 30} y={186} width={18} height={18} rx={5} fill="currentColor" stroke="none" opacity={0.25}>
          <A still={still} attributeName="opacity" values="0.25;0.25;1;1;0.25" keyTimes="0;0.2;0.35;0.9;1" dur="3.2s" begin={`${i * 0.25}s`} />
        </rect>
      ))}
    </>
  ),

  /* Page builder: blocks drop into the page frame one by one. */
  incrm: ({ still }) => (
    <>
      <rect x={52} y={30} width={136} height={180} rx={18} />
      <path d="M70 52h40" opacity={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={68}
          y={70 + i * 34}
          width={104}
          height={24}
          rx={7}
          fill={i === 1 ? ACCENT : "currentColor"}
          stroke="none"
          opacity={still ? (i === 1 ? 1 : 0.35) : 0}
        >
          <A still={still} attributeName="opacity" values={`0;0;${i === 1 ? 1 : 0.35};${i === 1 ? 1 : 0.35};0`} keyTimes={`0;${0.08 + i * 0.12};${0.18 + i * 0.12};0.9;1`} dur="4s" />
          {still ? null : (
            <animateTransform attributeName="transform" type="translate" values="0 -26;0 -26;0 0;0 0" keyTimes={`0;${0.08 + i * 0.12};${0.18 + i * 0.12};1`} dur="4s" repeatCount="indefinite" />
          )}
        </rect>
      ))}
      <path d="M196 168 l18 8 -8 4 -4 8z" fill="currentColor" strokeWidth={3} />
    </>
  ),

  /* Catalog: fourteen category tiles light up in a wave. */
  medsc: ({ still }) => (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <rect key={i} x={36 + col * 44} y={36 + row * 44} width={36} height={36} rx={9} strokeWidth={4} fill={ACCENT} fillOpacity={0}>
            <A still={still} attributeName="fill-opacity" values="0;1;0" dur="2.8s" begin={`${(col + row) * 0.18}s`} />
          </rect>
        );
      })}
      <path d="M156 186v28M142 200h28" stroke={ACCENT} strokeWidth={7} />
    </>
  ),

  /* Audit: a lens passes over the report, a check lands. */
  leaderaudit: ({ still }) => (
    <>
      <rect x={46} y={28} width={128} height={172} rx={16} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M68 ${64 + i * 26}h${i % 2 ? 60 : 84}`} opacity={0.45} />
      ))}
      <g transform={still ? "translate(150 130)" : undefined}>
        <circle cx={0} cy={0} r={24} fill="none" stroke={ACCENT} strokeWidth={7} />
        <path d="M17 17l22 22" stroke={ACCENT} strokeWidth={8} />
        {still ? null : (
          <animateTransform attributeName="transform" type="translate" values="110 70;150 130;100 160;110 70" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" />
        )}
      </g>
      <path d="M150 196l14 14 30 -34" stroke={ACCENT} strokeWidth={9} pathLength={1} strokeDasharray="1" strokeDashoffset={still ? 0 : 1}>
        <A still={still} attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes="0;0.6;0.75;1" dur="5s" />
      </path>
    </>
  ),

  /* Learning center: nine courses, a spark hops from tile to tile. */
  "global-school": ({ still }) => (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={60 + (i % 3) * 60} cy={60 + Math.floor(i / 3) * 60} r={20} strokeWidth={5} fill={ACCENT} fillOpacity={0}>
          <A still={still} attributeName="fill-opacity" values="0;0;1;0;0" keyTimes={`0;${i / 9};${(i + 0.5) / 9};${(i + 1) / 9};1`} dur="4.5s" />
        </circle>
      ))}
      <path d="M120 96 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill="currentColor" stroke="none" opacity={0.9}>
        <A still={still} attributeName="opacity" values="0.9;0.2;0.9" dur="1.5s" />
      </path>
    </>
  ),

  /* Ecosystem: six directions orbit one brand. */
  "numa-family": ({ still }) => (
    <>
      <circle cx={120} cy={120} r={26} fill={ACCENT} stroke="none" />
      <circle cx={120} cy={120} r={78} strokeDasharray="3 12" opacity={0.5} />
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <circle key={i} cx={round(120 + Math.cos(a) * 78)} cy={round(120 + Math.sin(a) * 78)} r={13} fill="currentColor" stroke="none" />;
        })}
        {still ? null : (
          <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="18s" repeatCount="indefinite" />
        )}
      </g>
    </>
  ),

  /* Supplements: six capsules, each bobbing on its own beat. */
  "numa-nutrition": ({ still }) =>
    Array.from({ length: 6 }, (_, i) => (
      <g key={i} transform={`translate(${52 + (i % 3) * 68} ${82 + Math.floor(i / 3) * 76}) rotate(${i % 2 ? 35 : -35})`}>
        <rect x={-14} y={-30} width={28} height={60} rx={14} fill={i === 2 ? ACCENT : "none"} stroke={i === 2 ? "none" : "currentColor"} />
        <path d="M-14 0h28" opacity={i === 2 ? 0 : 0.6} />
        {still ? null : (
          <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -10;0 0" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
        )}
      </g>
    )),

  /* Five characters jumping in turn. */
  "numa-kids": ({ still }) =>
    Array.from({ length: 5 }, (_, i) => (
      <g key={i} transform={`translate(${32 + i * 44} 150)`}>
        <circle r={19} fill={i === 2 ? ACCENT : "currentColor"} stroke="none" />
        <circle cx={-6} cy={-4} r={3.5} className="fill-white" stroke="none" />
        <circle cx={6} cy={-4} r={3.5} className="fill-white" stroke="none" />
        {still ? null : (
          <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -44;0 0;0 0" keyTimes="0;0.15;0.3;1" dur="2.5s" begin={`${i * 0.22}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.2 0.7 0.4 1;0.6 0 0.8 0.3;0 0 1 1" />
        )}
      </g>
    )),

  /* Three key products, each slowly filling up. */
  "nabaviy-tabobat": ({ still }) =>
    [0, 1, 2].map((i) => {
      const x = 56 + i * 64;
      return (
        <g key={i}>
          <clipPath id={`m-drop-${i}`}>
            <path d={`M${x} 70 C ${x + 28} 110, ${x + 30} 128, ${x + 30} 146 a30 30 0 0 1 -60 0 c0 -18 2 -36 30 -76z`} />
          </clipPath>
          <rect x={x - 32} y={still ? 120 : 180} width={64} height={120} fill={i === 1 ? ACCENT : "currentColor"} stroke="none" opacity={i === 1 ? 1 : 0.4} clipPath={`url(#m-drop-${i})`}>
            <A still={still} attributeName="y" values="180;100;180" dur="4s" begin={`${i * 0.7}s`} calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
          </rect>
          <path d={`M${x} 70 C ${x + 28} 110, ${x + 30} 128, ${x + 30} 146 a30 30 0 0 1 -60 0 c0 -18 2 -36 30 -76z`} />
        </g>
      );
    }),
};
