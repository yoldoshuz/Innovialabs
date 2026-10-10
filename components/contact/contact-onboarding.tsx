"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ContactFormDict, Dictionary, HeroDict } from "@/types";
import type { ContactDetails } from "@/lib/contact-schema";
import { contactSchema, isPhone, isTelegram } from "@/lib/contact-schema";
import { readLock, sendContact, stampStart, subscribeLock, writeLock } from "@/lib/contact-client";
import { Spark } from "@/components/brand/spark";
import { BriefTerminal, type BriefLine } from "@/components/contact/brief-terminal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OnboardingDict = Dictionary["onboarding"];
type Options = OnboardingDict["options"];
type Single = "industry" | "stage" | "deadline";
type Multi = "services";

type Step =
  | { kind: "contact" }
  | { kind: "single"; key: Single }
  | { kind: "multi"; key: Multi }
  | { kind: "budget" }
  | { kind: "text" };

/** Contacts first (so even a half-finished brief reaches us), then the idea. */
const STEPS: Step[] = [
  { kind: "contact" },
  { kind: "multi", key: "services" },
  { kind: "single", key: "industry" },
  { kind: "single", key: "stage" },
  { kind: "budget" },
  { kind: "text" },
];

/** Budget slider stops, USD. The last one means "and more". */
const BUDGET_STOPS = [500, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000, 50000];
const QUICK = [1000, 2000, 5000, 10000];
const DEFAULT_STOP = 4;

type State = {
  name: string;
  phone: string;
  telegram: string;
  message: string;
  /** Slider stop index or "unknown"; undefined until the visitor picks. */
  budget?: number | "unknown";
} & Partial<Record<Single, string>> &
  Record<Multi, string[]>;

const EMPTY: State = { name: "", phone: "", telegram: "", message: "", services: [] };

const money = (n: number, plus = false) => `$${n.toLocaleString("en-US").replace(/,/g, " ")}${plus ? "+" : ""}`;
const isTop = (i: number) => i === BUDGET_STOPS.length - 1;
const budgetText = (b: State["budget"], unknown: string) =>
  b === undefined ? "" : b === "unknown" ? unknown : money(BUDGET_STOPS[b], isTop(b));
const budgetValue = (b: State["budget"]) =>
  b === undefined ? undefined : b === "unknown" ? "unknown" : `${BUDGET_STOPS[b]}${isTop(b) ? "+" : ""}`;

/** Form option for the legacy `service` field, from the first matching pick. */
function primaryService(services: string[]) {
  return (["web", "mobile", "telegram", "crm", "ai"] as const).find((s) => services.includes(s)) ?? "other";
}

/**
 * The project brief (/contacts and /brief): six steps, one question per
 * screen. Single picks advance on their own, the rest wait for "Next"; the
 * terminal on the right assembles the answers. Extra answers go to the API
 * in `details`. `initialService` (from ?service=) preselects step 2.
 */
export function ContactOnboarding({
  lang,
  dict,
  form,
  brief,
  terminal,
  aside,
  initialService = "",
}: {
  lang: Locale;
  dict: OnboardingDict;
  form: ContactFormDict;
  brief: Dictionary["brief"];
  terminal: HeroDict["terminal"];
  aside?: React.ReactNode;
  initialService?: string;
}) {
  const id = React.useId();
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [v, setV] = React.useState<State>(() => ({
    ...EMPTY,
    services: dict.options.services.some((x) => x.value === initialService) ? [initialService] : [],
  }));
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<"name" | "phone" | "telegram" | "message", string>>>({});
  const [sending, setSending] = React.useState(false);
  const [justSent, setJustSent] = React.useState(false);
  const startedAt = React.useRef(0);
  const honeypotRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const lockedAt = React.useSyncExternalStore(subscribeLock, readLock, () => null);
  const done = justSent || lockedAt !== null;
  const total = STEPS.length;
  const current = STEPS[step];
  const slider = typeof v.budget === "number" ? v.budget : DEFAULT_STOP;
  const o = dict.options as Options;
  const label = (key: keyof Options, value?: string) => o[key].find((x) => x.value === value)?.label ?? "";

  React.useEffect(() => {
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("textarea, input:not([type=radio]):not([type=checkbox])")?.focus({ preventScroll: true });
    }, 450);
    return () => clearTimeout(t);
  }, [step]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setError(null);
  };

  const set = <K extends keyof State>(key: K, value: State[K]) => {
    stampStart(startedAt);
    setV((s) => ({ ...s, [key]: value }));
    setError(null);
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  /** Validates the current step; returns true when it may advance. */
  const check = () => {
    if (current.kind === "contact") {
      const errs: typeof fieldErrors = {};
      const name = contactSchema.shape.name.safeParse(v.name);
      if (!name.success) errs.name = form.errors[name.error.issues[0].message as keyof typeof form.errors];
      const phone = v.phone.trim();
      const tg = v.telegram.trim();
      if (!phone && !tg) errs.phone = dict.errors.contactMissing;
      if (phone && !isPhone(phone)) errs.phone = dict.errors.phoneInvalid;
      if (tg && !isTelegram(tg)) errs.telegram = dict.errors.telegramInvalid;
      setFieldErrors(errs);
      return Object.keys(errs).length === 0;
    }
    if (current.kind === "single" && !v[current.key]) {
      setError(dict.errors.pick);
      return false;
    }
    if (current.kind === "multi" && v[current.key].length === 0) {
      setError(dict.errors.pick);
      return false;
    }
    if (current.kind === "budget" && (v.budget === undefined || !v.deadline)) {
      setError(dict.errors.pick);
      return false;
    }
    if (current.kind === "text") {
      const msg = contactSchema.shape.message.safeParse(v.message);
      if (!msg.success) {
        setFieldErrors({ message: form.errors[msg.error.issues[0].message as keyof typeof form.errors] });
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!check()) return;
    if (step < total - 1) go(step + 1);
    else void submit();
  };

  const pickSingle = (key: Single, value: string) => {
    set(key, value);
    setTimeout(() => {
      setDir(1);
      setStep((s) => (STEPS[s].kind === "single" && (STEPS[s] as { key: Single }).key === key ? s + 1 : s));
    }, reduce ? 0 : 360);
  };

  const toggleMulti = (key: Multi, value: string) => {
    const list = v[key];
    set(key, list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  async function submit() {
    const contact = v.telegram.trim() || v.phone.trim();
    const parsed = contactSchema.safeParse({
      name: v.name,
      contact,
      service: primaryService(v.services),
      message: v.message,
    });
    if (!parsed.success) {
      go(0);
      return;
    }
    const details: ContactDetails = {
      phone: v.phone.trim() || undefined,
      telegram: v.telegram.trim() || undefined,
      industry: v.industry,
      services: v.services,
      stage: v.stage,
      budget: budgetValue(v.budget),
      deadline: v.deadline,
    };
    setSending(true);
    const res = await sendContact(parsed.data, {
      honeypot: honeypotRef.current?.value ?? "",
      startedAt: startedAt.current,
      locale: lang,
      details,
    });
    setSending(false);
    if (res.ok) {
      setJustSent(true);
      writeLock();
      return;
    }
    if (res.fields?.name || res.fields?.contact) go(0);
    setError(res.error !== "invalid" ? form.errors[res.error] : form.errors.server);
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !(e.nativeEvent as KeyboardEvent).isComposing) {
      e.preventDefault();
      next();
    }
  };

  const slide = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 80, filter: "blur(6px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -80, filter: "blur(6px)" }),
  };

  const join = (key: Multi) => v[key].map((x) => label(key, x)).join(", ");
  const lines: BriefLine[] = [
    { flag: "--name", value: v.name.trim() },
    { flag: "--phone", value: v.phone.trim() },
    { flag: "--telegram", value: v.telegram.trim() },
    { flag: "--build", value: join("services") },
    { flag: "--industry", value: label("industry", v.industry) },
    { flag: "--stage", value: label("stage", v.stage) },
    { flag: "--budget", value: budgetText(v.budget, dict.budget.unknown) },
    { flag: "--deadline", value: label("deadline", v.deadline) },
    { flag: "--about", value: v.message.trim() },
  ].filter((l) => l.value);

  const fieldError = (key: keyof typeof fieldErrors) =>
    fieldErrors[key] ? (
      <motion.p id={`${id}-${key}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-medium text-danger">
        {fieldErrors[key]}
      </motion.p>
    ) : null;

  const giantInput = (key: "name" | "phone" | "telegram", labelText: string, placeholder: string, autoComplete: string) => (
    <div>
      <label htmlFor={`${id}-${key}`} className="font-display font-bold text-muted">
        {labelText}
      </label>
      <input
        id={`${id}-${key}`}
        name={key}
        autoComplete={autoComplete}
        maxLength={key === "name" ? 60 : 40}
        placeholder={placeholder}
        value={v[key]}
        onChange={(e) => set(key, e.target.value)}
        onKeyDown={onKeyDown}
        aria-invalid={!!fieldErrors[key]}
        aria-describedby={fieldErrors[key] ? `${id}-${key}-error` : undefined}
        className="field-giant mt-1"
      />
      {fieldError(key)}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} role="status">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                className="inline-block"
              >
                <Spark className="size-28 text-violet sm:size-36" />
              </motion.span>
              <h2 className="slant mt-8 font-display text-[clamp(2.75rem,6.4vw,6.25rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">
                {form.successTitle}
              </h2>
              <p className="type-lead mt-6 max-w-xl text-muted">{form.successText}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="xl">
                  <Link href={`/${lang}/cases`}>
                    {brief.cases}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="soft">
                  <Link href={`/${lang}`}>{brief.home}</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, y: -30 }}>
              <div className="flex items-center gap-4">
                <p className="type-accent shrink-0 text-lg font-bold tabular-nums text-violet">
                  {brief.step} {step + 1}/{total}
                </p>
                <div className="flex flex-1 gap-1" aria-hidden>
                  {STEPS.map((_, i) => (
                    <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                      <motion.span
                        className="absolute inset-0 origin-left rounded-full bg-violet"
                        initial={false}
                        animate={{ scaleX: i <= step ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 160, damping: 22 }}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div ref={panelRef} className="relative mt-8 sm:mt-10" onFocus={() => stampStart(startedAt)}>
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.fieldset
                    key={step}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    disabled={sending}
                    className="min-w-0"
                  >
                    <legend className="contents">
                      <span className="slant block font-display text-[clamp(2.25rem,5.2vw,5.25rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.045em]">
                        {dict.steps[step].title}
                      </span>
                    </legend>
                    <p className="type-lead mt-5 max-w-xl text-muted">{dict.steps[step].hint}</p>

                    {current.kind === "contact" ? (
                      <div className="mt-8 grid gap-8">
                        {giantInput("name", dict.fields.name, dict.fields.namePlaceholder, "name")}
                        <div className="grid gap-8 sm:grid-cols-2">
                          {giantInput("phone", dict.fields.phone, dict.fields.phonePlaceholder, "tel")}
                          {giantInput("telegram", dict.fields.telegram, dict.fields.telegramPlaceholder, "off")}
                        </div>
                      </div>
                    ) : null}

                    {current.kind === "single" || current.kind === "multi" ? (
                      <div
                        role={current.kind === "single" ? "radiogroup" : "group"}
                        aria-label={dict.steps[step].title}
                        className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                      >
                        {o[current.key].map((opt, i) => {
                          const checked =
                            current.kind === "single" ? v[current.key] === opt.value : v[current.key].includes(opt.value);
                          return (
                            <motion.label
                              key={opt.value}
                              initial={reduce ? false : { opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.06 + i * 0.03, duration: 0.45 }}
                              whileTap={{ scale: 0.96 }}
                              data-checked={checked}
                              className="brief-tile !min-h-24 justify-between sm:!min-h-28"
                            >
                              <input
                                type={current.kind === "single" ? "radio" : "checkbox"}
                                name={current.key}
                                value={opt.value}
                                checked={checked}
                                onChange={() =>
                                  current.kind === "single" ? pickSingle(current.key, opt.value) : toggleMulti(current.key, opt.value)
                                }
                                className="sr-only"
                              />
                              <span
                                className={cn(
                                  "grid size-7 place-items-center self-end rounded-full border-2 transition-colors duration-300",
                                  checked ? "border-white bg-white text-violet" : "border-current opacity-30",
                                )}
                              >
                                {checked ? <Check className="size-4" strokeWidth={3} /> : null}
                              </span>
                              <span className="font-display text-base font-extrabold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere] sm:text-lg">
                                {opt.label}
                              </span>
                            </motion.label>
                          );
                        })}
                      </div>
                    ) : null}

                    {current.kind === "budget" ? (
                      <div className="mt-8">
                        <p className="font-display font-bold text-muted">{dict.budget.label}</p>
                        <p
                          aria-live="polite"
                          className={cn(
                            "type-accent mt-1 text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-colors duration-300",
                            typeof v.budget === "number" ? "text-violet" : "text-lilac/50",
                          )}
                        >
                          {v.budget === "unknown" ? "?" : money(BUDGET_STOPS[slider], isTop(slider))}
                        </p>
                        <input
                          type="range"
                          min={0}
                          max={BUDGET_STOPS.length - 1}
                          step={1}
                          value={slider}
                          onChange={(e) => set("budget", Number(e.target.value))}
                          aria-label={dict.budget.label}
                          aria-valuetext={money(BUDGET_STOPS[slider], isTop(slider))}
                          className="range range-light mt-6"
                          style={{ ["--pct" as string]: `${(slider / (BUDGET_STOPS.length - 1)) * 100}%` }}
                        />
                        <div className="mt-5 flex flex-wrap gap-2">
                          {QUICK.map((amount) => {
                            const i = BUDGET_STOPS.indexOf(amount);
                            return (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => set("budget", i)}
                                aria-pressed={v.budget === i}
                                className={cn("blog-topic type-accent", v.budget === i && "blog-topic-on")}
                              >
                                {money(amount)}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => set("budget", "unknown")}
                            aria-pressed={v.budget === "unknown"}
                            className={cn("blog-topic", v.budget === "unknown" && "blog-topic-on")}
                          >
                            {dict.budget.unknown}
                          </button>
                        </div>

                        <p className="mt-10 font-display font-bold text-muted">{dict.budget.deadline}</p>
                        <div role="radiogroup" aria-label={dict.budget.deadline} className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                          {o.deadline.map((opt) => {
                            const checked = v.deadline === opt.value;
                            return (
                              <label key={opt.value} data-checked={checked} className="brief-tile !min-h-20 justify-end">
                                <input
                                  type="radio"
                                  name="deadline"
                                  value={opt.value}
                                  checked={checked}
                                  onChange={() => set("deadline", opt.value)}
                                  className="sr-only"
                                />
                                <span className="font-display text-base font-extrabold leading-tight">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {current.kind === "text" ? (
                      <div className="mt-8">
                        <label htmlFor={`${id}-message`} className="sr-only">
                          {dict.fields.message}
                        </label>
                        <textarea
                          id={`${id}-message`}
                          name="message"
                          rows={4}
                          maxLength={1000}
                          placeholder={dict.fields.messagePlaceholder}
                          value={v.message}
                          onChange={(e) => set("message", e.target.value)}
                          onKeyDown={onKeyDown}
                          aria-invalid={!!fieldErrors.message}
                          className="field-giant min-h-44 resize-none"
                        />
                        {fieldError("message")}
                      </div>
                    ) : null}

                    {error ? (
                      <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-medium text-danger">
                        {error}
                      </motion.p>
                    ) : null}
                  </motion.fieldset>
                </AnimatePresence>

                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </label>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {step > 0 ? (
                  <Button type="button" size="xl" variant="soft" onClick={() => go(step - 1)} aria-label={brief.back}>
                    <ArrowLeft />
                    <span className="max-sm:sr-only">{brief.back}</span>
                  </Button>
                ) : null}
                {current.kind !== "single" ? (
                  <Button type="button" size="xl" onClick={next} disabled={sending} className="min-w-44">
                    {sending ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        {form.sending}
                      </>
                    ) : step === total - 1 ? (
                      <>
                        {form.submit}
                        <ArrowRight />
                      </>
                    ) : (
                      <>
                        {brief.next}
                        <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </Button>
                ) : v[current.key] ? (
                  <Button type="button" size="xl" onClick={next} className="min-w-44">
                    {brief.next}
                    <ArrowRight />
                  </Button>
                ) : null}
                {current.kind === "text" && !v.message.trim() ? (
                  <Button type="button" size="xl" variant="ghost" onClick={() => void submit()} disabled={sending}>
                    {brief.skip}
                  </Button>
                ) : null}
                {current.kind === "multi" ? <span className="text-sm text-muted">{dict.multi}</span> : null}
              </div>
              {step === total - 1 ? <p className="mt-5 text-sm text-muted">{form.consent}</p> : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="min-w-0 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <BriefTerminal title={brief.summary} command={terminal.command} lines={lines} done={done} sentLabel={form.sent} />
          {aside}
        </div>
      </aside>
    </div>
  );
}
