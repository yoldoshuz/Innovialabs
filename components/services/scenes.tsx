"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  Bug,
  Check,
  Database,
  FileText,
  Lightbulb,
  Lock,
  MousePointer2,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Server,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ServiceSlug } from "@/lib/content";
import { Spark } from "@/components/brand/spark";
import { At, Chip, EASE, Pop, SPRING, Wire, Wires, type SceneProps } from "@/components/services/scene-kit";
import { cn } from "@/lib/utils";

/**
 * One animated scene per service. Each reacts to `step` (0–3), which the
 * story section advances as the visitor scrolls through "how we'll do it".
 */
export const scenes: Record<ServiceSlug, (p: SceneProps) => React.ReactNode> = {
  ai: AiScene,
  telegram: TelegramScene,
  web: WebScene,
  mobile: MobileScene,
  crm: CrmScene,
  integrations: IntegrationsScene,
  design: DesignScene,
  devops: DevopsScene,
  marketing: MarketingScene,
  support: SupportScene,
  consulting: ConsultingScene,
};

/* Moves an absolutely positioned element between percent coordinates. */
function Mover({
  x,
  y,
  scale = 1,
  opacity = 1,
  className,
  children,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, scale, opacity }}
      transition={SPRING}
      className={cn("absolute -translate-x-1/2 -translate-y-1/2", className)}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* AI: requests flow into the model, results flow out, a human checks. */

function AiScene({ step, labels, dark }: SceneProps) {
  const reduce = useReducedMotion();
  const ins = [18, 38, 62, 82];
  const outs = [24, 50, 76];
  return (
    <>
      <Wires>
        {ins.map((y, i) => (
          <Wire key={y} d={`M31 ${y} C 40 ${y}, 36 50, 43 50`} on={step >= 1} dark={dark} dashed={step < 1} delay={i * 0.2} />
        ))}
        {outs.map((y, i) => (
          <Wire key={y} d={`M57 50 C 64 50, 60 ${y}, 69 ${y}`} on={step >= 2} dark={dark} delay={i * 0.25} />
        ))}
        <Wire d="M50 64 L 50 80" on={step >= 3} show={step >= 3} dark={dark} dur={1} />
      </Wires>
      {ins.map((y, i) => (
        <At key={y} x={17} y={y}>
          <Chip dark={dark} on={step === 0 || step >= 1}>
            {labels[i]}
          </Chip>
        </At>
      ))}
      <At x={50} y={50}>
        <motion.div
          initial={false}
          animate={{ scale: step >= 1 ? 1 : 0.8 }}
          transition={SPRING}
          className={cn(
            "grid size-[min(26vw,7.5rem)] place-items-center rounded-full transition-colors duration-500",
            step >= 1 ? "bg-violet text-white" : dark ? "bg-white/10 text-white/60" : "bg-white/70 text-ink/50",
          )}
        >
          <motion.span
            animate={step >= 1 && !reduce ? { rotate: 360 } : { rotate: 0 }}
            transition={step >= 1 ? { duration: 8, repeat: Infinity, ease: "linear" } : SPRING}
            className="absolute"
          >
            <Spark className="size-[min(13vw,3.5rem)] opacity-30" />
          </motion.span>
          <span className="type-accent relative text-xl font-bold sm:text-2xl">{labels[4]}</span>
        </motion.div>
      </At>
      {outs.map((y, i) => (
        <At key={y} x={83} y={y}>
          <Chip dark={dark} on={step >= 2}>
            {labels[5 + i]}
          </Chip>
        </At>
      ))}
      <At x={50} y={88}>
        <Pop show={step >= 3}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <Users className="size-4" />
            {labels[8]}
          </Chip>
        </Pop>
      </At>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Telegram: chat → Mini App → payment → order lands in the CRM.        */

function TelegramScene({ step, labels, dark }: SceneProps) {
  const [paid, newOrder, bot, online, greeting, open, catalog, item1, item2, pay] = labels;
  return (
    <>
      <Wires>
        <Wire d="M62 40 C 70 40, 70 20, 76 20" on={step >= 3} show={step >= 3} dark={dark} />
        {[48, 60, 72].map((y, i) => (
          <Wire key={y} d={`M64 ${y} L 72 ${y}`} on={step === 2} show={step === 2} dark={dark} dur={0.9} delay={i * 0.15} />
        ))}
      </Wires>
      <At x={42} y={52} className="w-[44%]">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.6rem] border-[5px] border-night bg-[#e9e5f5] text-ink shadow-[0_30px_60px_-30px_rgb(18_11_36/0.8)]">
          <div className="flex items-center gap-2 bg-white px-3 py-2">
            <span className="grid size-6 place-items-center rounded-full bg-violet text-white">
              <Send className="size-3" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.62rem] font-bold sm:text-xs">{bot}</span>
              <span className="block text-[0.55rem] text-muted sm:text-[0.65rem]">{online}</span>
            </span>
          </div>
          <div className="p-2">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl rounded-bl-sm bg-white p-2 text-[0.55rem] leading-snug sm:text-[0.7rem]"
            >
              {greeting}
              <span className="mt-1.5 block rounded-lg bg-violet py-1 text-center font-bold text-white">{open}</span>
            </motion.div>
          </div>
          <motion.div
            initial={false}
            animate={{ y: step >= 1 ? "0%" : "105%" }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="absolute inset-x-0 bottom-0 top-[34%] rounded-t-2xl bg-white p-2.5"
          >
            <span className="mx-auto block h-1 w-8 rounded-full bg-line" />
            <p className="mt-1.5 font-display text-[0.7rem] font-extrabold sm:text-sm">{catalog}</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {[item1, item2].map((it, i) => (
                <div key={it} className="rounded-lg bg-paper p-1">
                  <span className={cn("block aspect-square rounded-md", i ? "bg-lilac" : "bg-mist")} />
                  <span className="mt-1 block truncate text-[0.55rem] font-semibold sm:text-[0.65rem]">{it}</span>
                </div>
              ))}
            </div>
            <motion.span
              initial={false}
              animate={{ backgroundColor: step >= 2 ? "#5B21B6" : "#7C3AED" }}
              className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[0.62rem] font-bold text-white sm:text-xs"
            >
              {step >= 2 ? (
                <>
                  <Check className="size-3" strokeWidth={3} />
                  {paid}
                </>
              ) : (
                pay
              )}
            </motion.span>
          </motion.div>
        </div>
      </At>
      {["Payme", "Click", "Telegram Stars"].map((p, i) => (
        <At key={p} x={83} y={48 + i * 12}>
          <Pop show={step === 2} delay={i * 0.08}>
            <Chip dark={dark}>{p}</Chip>
          </Pop>
        </At>
      ))}
      <At x={80} y={16}>
        <Pop show={step >= 3}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <Bell className="size-3.5" />
            {newOrder}
          </Chip>
        </Pop>
      </At>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Web: wireframe → design → code (+ mobile view) → live.              */

function WebScene({ step, labels, dark }: SceneProps) {
  const [host, button, live] = labels;
  const filled = step >= 1;
  const block = (on: string) =>
    cn("rounded-lg transition-[background-color,border-color] duration-700", filled ? on : "border-2 border-dashed border-ink/20 bg-transparent");
  return (
    <>
      <At x={46} y={52} className="w-[80%]">
        <div className="overflow-hidden rounded-2xl bg-white text-ink shadow-[0_30px_60px_-30px_rgb(18_11_36/0.7)]">
          <div className="flex items-center gap-1.5 bg-ink px-3 py-2">
            <span className="window-dot bg-[#ff5f57]" />
            <span className="window-dot bg-[#febc2e]" />
            <span className="window-dot bg-[#28c840]" />
            <span className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-full bg-white/10 px-3 py-0.5 text-[0.6rem] text-white/80 sm:text-xs">
              {step >= 3 ? <Lock className="size-3 text-lilac" /> : null}
              {host}
            </span>
          </div>
          <div className="grid gap-2 p-3 sm:gap-2.5 sm:p-4">
            <div className={cn(block("bg-paper"), "h-4")} />
            <div className={cn(block("bg-violet"), "relative h-24 sm:h-32")}>
              <motion.div initial={false} animate={{ opacity: filled ? 1 : 0 }} className="absolute inset-3 flex flex-col gap-1.5">
                <span className="h-2.5 w-3/4 rounded-full bg-white/90" />
                <span className="h-2.5 w-1/2 rounded-full bg-white/60" />
                <motion.span
                  animate={step >= 3 ? { scale: [1, 0.92, 1] } : { scale: 1 }}
                  transition={step >= 3 ? { duration: 1.6, repeat: Infinity, repeatDelay: 0.6 } : {}}
                  className="mt-auto self-start rounded-full bg-white px-2.5 py-1 text-[0.55rem] font-bold text-violet sm:text-[0.7rem]"
                >
                  {button}
                </motion.span>
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["bg-mist", "bg-lilac", "bg-mist"].map((c, i) => (
                <div key={i} className={cn(block(c), "h-12 sm:h-16")} />
              ))}
            </div>
          </div>
        </div>
      </At>
      <At x={84} y={66} className="w-[22%]">
        <Pop show={step >= 2}>
          <div className="overflow-hidden rounded-[0.9rem] border-4 border-night bg-white p-1.5 shadow-xl">
            <span className="block h-1.5 rounded-full bg-paper" />
            <span className="mt-1 block h-10 rounded bg-violet sm:h-14" />
            <span className="mt-1 block h-4 rounded bg-mist sm:h-6" />
            <span className="mt-1 block h-4 rounded bg-lilac sm:h-6" />
          </div>
        </Pop>
      </At>
      <At x={14} y={16}>
        <Pop show={step === 2}>
          <Chip dark={dark} className="type-accent">{"</>"}</Chip>
        </Pop>
      </At>
      <At x={82} y={14}>
        <Pop show={step >= 3}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            {live}
          </Chip>
        </Pop>
      </At>
      <Mover x={step >= 3 ? 30 : 60} y={step >= 3 ? 64 : 88} opacity={step >= 3 ? 1 : 0}>
        <MousePointer2 className={cn("size-6 fill-current", dark ? "text-white" : "text-ink")} />
      </Mover>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: screen flow → designed app → backend → both stores.         */

function MobileScene({ step, labels, dark }: SceneProps) {
  const [home, catalogLabel, profile, api, appStore, googlePlay] = labels;
  const screens = [home, catalogLabel, profile];
  const pos = (i: number) => {
    if (step === 0) return { x: 20 + i * 30, y: 46, scale: 0.8, opacity: 1 };
    if (i === 1) return { x: 50, y: step >= 2 ? 54 : 48, scale: 1.25, opacity: 1 };
    return { x: i === 0 ? 24 : 76, y: 52, scale: 0.7, opacity: step === 1 ? 0.35 : 0 };
  };
  return (
    <>
      <Wires>
        <Wire d="M30 46 L 40 46" on={step === 0} show={step === 0} dark={dark} dur={1} />
        <Wire d="M60 46 L 70 46" on={step === 0} show={step === 0} dark={dark} dur={1} delay={0.4} />
        <Wire d="M50 30 L 50 17" on={step === 2} show={step === 2} dark={dark} dur={0.9} />
        <Wire d="M44 76 C 40 84, 30 84, 24 86" on={step >= 3} show={step >= 3} dark={dark} />
        <Wire d="M56 76 C 60 84, 70 84, 76 86" on={step >= 3} show={step >= 3} dark={dark} delay={0.3} />
      </Wires>
      {screens.map((label, i) => {
        const p = pos(i);
        const designed = step >= 1 && i === 1;
        return (
          <Mover key={label} {...p} className="w-[20%]">
            <div
              className={cn(
                "aspect-[9/18] overflow-hidden rounded-[0.9rem] border-[3px] p-1 transition-colors duration-500",
                designed ? "border-night bg-white" : dark ? "border-white/40 bg-white/5" : "border-ink/25 bg-white/50",
              )}
            >
              <span className={cn("block h-[22%] rounded-md transition-colors duration-500", designed ? "bg-violet" : dark ? "bg-white/15" : "bg-ink/10")} />
              <span className={cn("mt-1 block h-[18%] rounded-md transition-colors duration-500", designed ? "bg-mist" : dark ? "bg-white/10" : "bg-ink/5")} />
              <span className={cn("mt-1 block h-[18%] rounded-md transition-colors duration-500", designed ? "bg-lilac" : dark ? "bg-white/10" : "bg-ink/5")} />
              <span className={cn("mx-auto mt-[18%] block h-1 w-1/3 rounded-full", designed ? "bg-ink/30" : "bg-current opacity-20")} />
            </div>
            <motion.p
              initial={false}
              animate={{ opacity: step === 0 ? 1 : 0 }}
              className="mt-2 text-center text-[0.62rem] font-bold sm:text-xs"
            >
              {label}
            </motion.p>
          </Mover>
        );
      })}
      <At x={50} y={11}>
        <Pop show={step === 2}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <Server className="size-3.5" />
            {api}
          </Chip>
        </Pop>
      </At>
      {[appStore, googlePlay].map((s, i) => (
        <At key={s} x={i ? 78 : 22} y={88}>
          <Pop show={step >= 3} delay={i * 0.12}>
            <Chip dark={dark} className="flex items-center gap-1.5">
              <Check className="size-3.5" strokeWidth={3} />
              {s}
            </Chip>
          </Pop>
        </At>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CRM: requests move across the pipeline; systems connect; team runs. */

function CrmScene({ step, labels, dark }: SceneProps) {
  const cols = [labels[0], labels[1], labels[2]];
  const cards = [labels[3], labels[4], labels[5], labels[6]];
  // Column per card for each step.
  const plan = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 1, 1, 0],
    [2, 2, 1, 1],
  ][Math.min(step, 3)];
  const xs = [19, 50, 81];
  const ys = (col: number, idx: number) => 32 + plan.slice(0, idx).filter((c) => c === col).length * 11;
  return (
    <>
      {xs.map((x, i) => (
        <At key={x} x={x} y={52} className="h-[78%] w-[29%]">
          <motion.div
            initial={false}
            animate={{ opacity: step >= 1 ? 1 : 0.45 }}
            className={cn("h-full rounded-2xl border-2 transition-colors duration-500", dark ? "border-white/15 bg-white/5" : "border-ink/10 bg-white/40")}
          >
            <p className="truncate px-2 pt-2 text-center text-[0.62rem] font-bold sm:text-xs">{cols[i]}</p>
          </motion.div>
        </At>
      ))}
      {cards.map((c, i) => (
        <Mover key={c} x={xs[plan[i]]} y={ys(plan[i], i)} className="w-[26%]">
          <div
            className={cn(
              "truncate rounded-xl px-2 py-2 text-[0.58rem] font-bold shadow-md transition-colors duration-500 sm:text-[0.75rem]",
              plan[i] === 2 ? "bg-violet text-white" : dark ? "bg-white text-ink" : "bg-ink text-white",
            )}
          >
            {c}
          </div>
        </Mover>
      ))}
      <div className="absolute inset-x-0 bottom-[3%] flex justify-center gap-2">
        {(step >= 3 ? [] : ["1С", "AmoCRM", "Bitrix24"]).map((s, i) => (
          <Pop key={s} show={step === 2} delay={i * 0.08}>
            <Chip dark={dark} strong>
              {s}
            </Chip>
          </Pop>
        ))}
        <Pop show={step >= 3}>
          <div className="flex -space-x-2">
            {["bg-violet", "bg-lilac", "bg-deep", "bg-mist"].map((c) => (
              <span key={c} className={cn("grid size-8 place-items-center rounded-full border-2", c, dark ? "border-night" : "border-white")}>
                <Users className="size-3.5 text-white" />
              </span>
            ))}
          </div>
        </Pop>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Integrations: islands → hub plan → live exchange → checked.         */

function IntegrationsScene({ step, labels, dark }: SceneProps) {
  const nodes = labels.slice(0, 6).map((label, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    // Rounded: trig output differs in the last digits between server and client.
    return { label, x: Math.round((50 + Math.cos(a) * 36) * 100) / 100, y: Math.round((50 + Math.sin(a) * 36) * 100) / 100 };
  });
  return (
    <>
      <Wires>
        {step === 0 ? (
          <>
            <Wire d={`M${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y}`} on={false} dark={dark} dashed />
            <Wire d={`M${nodes[3].x} ${nodes[3].y} L ${nodes[4].x} ${nodes[4].y}`} on={false} dark={dark} dashed />
          </>
        ) : null}
        {nodes.map((n, i) => (
          <Wire key={n.label} d={`M50 50 L ${n.x} ${n.y}`} on={step >= 2} show={step >= 1} dark={dark} dashed={step < 2} dur={1.4} delay={i * 0.18} />
        ))}
      </Wires>
      {nodes.map((n, i) => (
        <At key={n.label} x={n.x} y={n.y}>
          <Chip dark={dark} on className="relative">
            {n.label}
            <Pop show={step >= 3} delay={i * 0.06} className="absolute -right-2 -top-2">
              <span className="grid size-5 place-items-center rounded-full bg-violet text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
            </Pop>
          </Chip>
        </At>
      ))}
      <At x={50} y={50}>
        <Pop show={step >= 1}>
          <motion.div
            animate={step >= 3 ? { boxShadow: ["0 0 0 0 rgb(167 139 250 / 0.6)", "0 0 0 22px rgb(167 139 250 / 0)"] } : {}}
            transition={step >= 3 ? { duration: 1.6, repeat: Infinity } : {}}
            className="type-accent grid size-[min(20vw,5.5rem)] place-items-center rounded-full bg-violet text-lg font-bold text-white"
          >
            {labels[6]}
          </motion.div>
        </Pop>
      </At>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Design: research notes → wireframe → interface → brand kit.         */

function DesignScene({ step, labels, dark }: SceneProps) {
  const reduce = useReducedMotion();
  const notes = [
    { x: 28, y: 30, r: -6, c: "bg-white" },
    { x: 70, y: 26, r: 5, c: "bg-mist" },
    { x: 46, y: 66, r: -3, c: "bg-lilac" },
  ];
  const ui = step >= 2;
  return (
    <>
      {notes.map((n, i) => (
        <Mover key={i} x={n.x} y={n.y} scale={step === 0 ? 1 : 0.4} opacity={step === 0 ? 1 : 0}>
          <div className={cn("w-28 rounded-md p-3 text-[0.68rem] font-bold text-ink shadow-lg sm:w-36 sm:text-sm", n.c)} style={{ rotate: `${n.r}deg` }}>
            {labels[i]}
            <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-ink/20" />
            <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-ink/20" />
          </div>
        </Mover>
      ))}
      <Mover x={50} y={50} scale={step === 1 || step === 2 ? 1 : 0.6} opacity={step === 1 || step === 2 ? 1 : 0} className="w-[66%]">
        <div className={cn("rounded-2xl p-3 transition-colors duration-700", ui ? "bg-white" : dark ? "bg-white/5" : "bg-white/40")}>
          <div className={cn("h-24 rounded-xl transition-colors duration-700 sm:h-32", ui ? "bg-violet" : "border-2 border-dashed border-current opacity-40")} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className={cn("h-10 rounded-lg transition-colors duration-700", ui ? "bg-mist" : "border-2 border-dashed border-current opacity-40")} />
            <div className={cn("h-10 rounded-lg transition-colors duration-700", ui ? "bg-lilac" : "border-2 border-dashed border-current opacity-40")} />
          </div>
          <motion.span
            initial={false}
            animate={{ opacity: ui ? 1 : 0 }}
            className="mt-2 block rounded-full bg-ink py-1.5 text-center text-[0.65rem] font-bold text-white sm:text-xs"
          >
            {labels[3]}
          </motion.span>
        </div>
      </Mover>
      {/* Pen stroke across the canvas while drawing the interface. */}
      <svg viewBox="0 0 100 100" aria-hidden fill="none" className="pointer-events-none absolute inset-0 size-full">
        <motion.path
          d="M8 86 C 30 60, 50 98, 70 70 S 94 40, 92 18"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className={dark ? "text-lilac" : "text-violet"}
          initial={false}
          animate={{ pathLength: step === 2 ? 1 : 0, opacity: step === 2 ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
        />
      </svg>
      <Mover x={32} y={42} scale={step >= 3 ? 1 : 0.4} opacity={step >= 3 ? 1 : 0}>
        <motion.span animate={step >= 3 && !reduce ? { rotate: [0, 90] } : { rotate: 0 }} transition={{ duration: 1.2, ease: EASE }} className="block">
          <Spark className="size-[min(30vw,8rem)] text-violet" />
        </motion.span>
      </Mover>
      <Mover x={70} y={42} scale={step >= 3 ? 1 : 0.4} opacity={step >= 3 ? 1 : 0}>
        <span className="font-display text-[min(18vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em]">Aa</span>
      </Mover>
      <div className="absolute inset-x-0 bottom-[14%] flex justify-center gap-2">
        {["bg-violet", "bg-deep", "bg-lilac", "bg-mist", "bg-ink"].map((c, i) => (
          <Pop key={c} show={step >= 3} delay={0.1 + i * 0.06}>
            <span className={cn("block size-9 rounded-full border-2 sm:size-11", c, dark ? "border-white/30" : "border-white")} />
          </Pop>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* DevOps: weak spot → pipeline → backups → heartbeat & alerts.        */

function DevopsScene({ step, labels, dark }: SceneProps) {
  const reduce = useReducedMotion();
  const [build, tests, deploy, backup, allGood, alert] = labels;
  return (
    <>
      <Wires>
        <Wire d="M29 14 L 41 14" on={step >= 1} dark={dark} dur={0.9} />
        <Wire d="M59 14 L 71 14" on={step >= 1} dark={dark} dur={0.9} delay={0.3} />
        <Wire d="M50 26 L 50 32" on={step >= 1} show={step >= 1} dark={dark} dur={0.7} />
        <Wire d="M36 56 C 30 62, 26 64, 24 66" on={step >= 2} show={step >= 2} dark={dark} />
      </Wires>
      {[build, tests, deploy].map((s, i) => (
        <At key={s} x={20 + i * 30} y={14}>
          <Chip dark={dark} on={step >= 1} className="flex items-center gap-1">
            {step >= 1 ? <Check className="size-3" strokeWidth={3} /> : null}
            {s}
          </Chip>
        </At>
      ))}
      {[30, 50, 70].map((x, i) => (
        <At key={x} x={x} y={44} className="w-[16%]">
          <div className={cn("flex aspect-[3/4] flex-col justify-center gap-1.5 rounded-xl p-2", dark ? "bg-white/10" : "bg-white/70")}>
            {[0, 1, 2].map((r) => {
              const broken = step === 0 && i === 1 && r === 1;
              return (
                <span key={r} className={cn("flex items-center gap-1 rounded-md px-1 py-1", dark ? "bg-white/10" : "bg-ink/5")}>
                  <motion.span
                    animate={broken && !reduce ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                    transition={broken ? { duration: 0.8, repeat: Infinity } : {}}
                    className={cn("size-1.5 rounded-full", broken ? "bg-danger" : "bg-success")}
                  />
                  <span className="h-1 flex-1 rounded-full bg-current opacity-20" />
                </span>
              );
            })}
          </div>
        </At>
      ))}
      <At x={22} y={70}>
        <Pop show={step >= 2}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <Database className="size-3.5" />
            {backup}
          </Chip>
        </Pop>
      </At>
      <At x={74} y={70}>
        <Pop show={step >= 3}>
          <Chip dark={dark} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" />
            {allGood}
          </Chip>
        </Pop>
      </At>
      <svg viewBox="0 0 100 100" aria-hidden fill="none" className="pointer-events-none absolute inset-0 size-full">
        <motion.path
          d="M6 88 H 34 L 38 80 L 43 95 L 48 76 L 52 88 H 94"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={dark ? "text-lilac" : "text-violet"}
          initial={false}
          animate={step >= 3 ? { pathLength: [0, 1], opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={step >= 3 && !reduce ? { duration: 2.2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        />
      </svg>
      <At x={80} y={92}>
        <Pop show={step >= 3} delay={0.4}>
          <Chip dark={dark} strong className="flex items-center gap-1.5">
            <Send className="size-3" />
            {alert}
          </Chip>
        </Pop>
      </At>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Marketing: your site climbs the results, ads on top, then a funnel.  */

function MarketingScene({ step, labels, dark }: SceneProps) {
  const [query, yours, competitor, ad, impressions, clicks, requests] = labels;
  const order =
    step === 0
      ? ["c1", "c2", "c3", "you"]
      : step === 1
        ? ["you", "c1", "c2", "c3"]
        : ["ad", "you", "c1", "c2"];
  const rowLabel = (k: string) => (k === "you" ? yours : k === "ad" ? `${ad} · ${yours}` : competitor);
  return (
    <>
      <At x={50} y={13} className="w-[84%]">
        <div className={cn("flex items-center gap-2 rounded-full px-4 py-2.5", dark ? "bg-white text-ink" : "bg-ink text-white")}>
          <Search className="size-4 shrink-0" />
          <span className="truncate text-[0.7rem] font-semibold sm:text-sm">{query}</span>
        </div>
      </At>
      <motion.div
        initial={false}
        animate={{ opacity: step >= 3 ? 0 : 1, y: step >= 3 ? -20 : 0 }}
        className="absolute inset-x-[8%] top-[27%] flex flex-col gap-2.5"
      >
        {order.map((k) => (
          <motion.div
            layout
            key={k}
            transition={SPRING}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-3 sm:py-4",
              k === "you" || k === "ad"
                ? dark
                  ? "bg-white text-violet"
                  : "bg-violet text-white"
                : dark
                  ? "bg-white/10 text-white/70"
                  : "bg-white/70 text-ink/60",
            )}
          >
            <span className="h-2 w-10 shrink-0 rounded-full bg-current opacity-40" />
            <span className="truncate text-[0.68rem] font-bold sm:text-sm">{rowLabel(k)}</span>
            {k === "you" && step >= 1 ? <TrendingUp className="ml-auto size-4 shrink-0" /> : null}
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-x-[8%] top-[34%] flex flex-col items-center gap-3">
        {[
          { label: impressions, w: "100%" },
          { label: clicks, w: "64%" },
          { label: requests, w: "34%" },
        ].map((b, i) => (
          <motion.div
            key={b.label}
            initial={false}
            animate={{ width: step >= 3 ? b.w : "0%", opacity: step >= 3 ? 1 : 0 }}
            transition={{ ...SPRING, delay: step >= 3 ? 0.2 + i * 0.12 : 0 }}
            className={cn(
              "flex h-14 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl text-[0.7rem] font-bold sm:h-16 sm:text-sm",
              dark
                ? ["bg-white/25 text-white", "bg-white/55 text-ink", "bg-white text-violet"][i]
                : ["bg-ink/15 text-ink", "bg-ink/45 text-white", "bg-violet text-white"][i],
            )}
          >
            {b.label}
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Support: bugs get fixed, features ship, updates keep rolling.       */

function SupportScene({ step, labels, dark }: SceneProps) {
  const reduce = useReducedMotion();
  const stops = [14, 38, 62, 86];
  return (
    <>
      <At x={50} y={34} className="w-[62%]">
        <div className={cn("rounded-2xl p-3", dark ? "bg-white/10" : "bg-white/70")}>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cn("relative h-14 rounded-lg sm:h-20", i === 1 ? "bg-violet" : dark ? "bg-white/15" : "bg-ink/10")}>
                {i !== 1 ? (
                  <span className="absolute -right-2 -top-2">
                    {step === 0 ? (
                      <span className="grid size-6 place-items-center rounded-full bg-danger text-white">
                        <Bug className="size-3.5" />
                      </span>
                    ) : (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING} className="grid size-6 place-items-center rounded-full bg-success text-white">
                        <Check className="size-3.5" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <motion.div
            initial={false}
            animate={{ height: step >= 2 ? "auto" : 0, opacity: step >= 2 ? 1 : 0, marginTop: step >= 2 ? 8 : 0 }}
            className="overflow-hidden"
          >
            <div className="h-10 rounded-lg bg-lilac sm:h-12" />
          </motion.div>
        </div>
        <Pop show={step >= 3} className="absolute -left-4 -top-4">
          <motion.span
            animate={step >= 3 && !reduce ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="grid size-10 place-items-center rounded-full bg-violet text-white"
          >
            <RefreshCw className="size-5" />
          </motion.span>
        </Pop>
      </At>
      <Wires>
        <path d="M14 76 H 86" stroke="currentColor" strokeWidth={3} vectorEffect="non-scaling-stroke" strokeLinecap="round" className="opacity-20" />
        <motion.path
          d="M14 76 H 86"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className={dark ? "text-lilac" : "text-violet"}
          initial={false}
          animate={{ pathLength: step / 3 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </Wires>
      {stops.map((x, i) => (
        <At key={x} x={x} y={76}>
          <motion.span
            initial={false}
            animate={{ scale: step >= i ? 1 : 0.6 }}
            transition={SPRING}
            className={cn("block size-4 rounded-full border-4", step >= i ? "bg-violet" : dark ? "bg-ink-2" : "bg-white", dark ? "border-white/20" : "border-white")}
          />
        </At>
      ))}
      {stops.map((x, i) => (
        <At key={`l${x}`} x={x} y={88}>
          <Chip dark={dark} on={step >= i} className="text-[0.6rem] sm:text-[0.75rem]">
            {labels[i]}
          </Chip>
        </At>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Consulting: a winding road from idea to growth; the spark hops.     */

function ConsultingScene({ step, labels, dark }: SceneProps) {
  const stations = [
    { x: 16, y: 80, Icon: Lightbulb },
    { x: 40, y: 58, Icon: FileText },
    { x: 64, y: 40, Icon: Rocket },
    { x: 86, y: 18, Icon: TrendingUp },
  ];
  const at = stations[Math.min(step, 3)];
  return (
    <>
      <Wires>
        <path
          d="M16 80 C 28 80, 28 58, 40 58 S 54 40, 64 40 S 80 18, 86 18"
          stroke="currentColor"
          strokeWidth={3}
          strokeDasharray="2 8"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className="opacity-30"
        />
        <motion.path
          d="M16 80 C 28 80, 28 58, 40 58 S 54 40, 64 40 S 80 18, 86 18"
          stroke="currentColor"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className={dark ? "text-lilac" : "text-violet"}
          initial={false}
          animate={{ pathLength: [0.02, 0.36, 0.68, 1][Math.min(step, 3)] }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </Wires>
      {stations.map(({ x, y, Icon }, i) => (
        <At key={i} x={x} y={y}>
          <motion.div
            initial={false}
            animate={{ scale: step === i ? 1.15 : step > i ? 1 : 0.85 }}
            transition={SPRING}
            className={cn(
              "grid size-14 place-items-center rounded-2xl transition-colors duration-500 sm:size-16",
              step >= i ? (dark ? "bg-white text-violet" : "bg-violet text-white") : dark ? "bg-white/10 text-white/50" : "bg-white/70 text-ink/40",
            )}
          >
            <Icon className="size-6 sm:size-7" />
          </motion.div>
          <p className={cn("absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-display text-sm font-extrabold transition-opacity duration-500 sm:text-base", step >= i ? "opacity-100" : "opacity-40")}>
            {labels[i]}
          </p>
        </At>
      ))}
      <Mover x={at.x + 6} y={at.y - 9}>
        <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="block">
          <Spark className={cn("size-7", dark ? "text-lilac" : "text-violet")} />
        </motion.span>
      </Mover>
    </>
  );
}
