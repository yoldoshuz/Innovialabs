"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, LoaderCircle, Send } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ContactFormDict } from "@/types";
import { siteConfig } from "@/lib/site";
import { onContactIntent } from "@/lib/contact-intent";
import {
  contactSchema,
  SENT_LOCK_MS,
  SENT_STORAGE_KEY,
  type ContactErrorKey,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Values = { name: string; contact: string; service: string; message: string };
type Field = keyof Values;
type Errors = Partial<Record<Field, ContactErrorKey>>;

const EMPTY: Values = { name: "", contact: "", service: "", message: "" };
const FIELD_ORDER: Field[] = ["name", "contact", "service", "message"];

/* ---------------- "already sent" lock, persisted in localStorage -------- */

const lockListeners = new Set<() => void>();

function readLock(): number | null {
  try {
    const at = Number(window.localStorage.getItem(SENT_STORAGE_KEY));
    return at && Date.now() - at < SENT_LOCK_MS ? at : null;
  } catch {
    return null;
  }
}

function writeLock(at: number) {
  try {
    window.localStorage.setItem(SENT_STORAGE_KEY, String(at));
  } catch {
    /* private mode — the in-memory state still locks this session */
  }
  lockListeners.forEach((fn) => fn());
}

function subscribeLock(fn: () => void) {
  lockListeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    lockListeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

/* ------------------------------------------------------------------------ */

function validate(values: Values) {
  const result = contactSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} as Errors };
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as Field;
    if (key && !errors[key]) errors[key] = issue.message as ContactErrorKey;
  }
  return { data: null, errors };
}

/**
 * Brief form: name, phone/Telegram, service, optional message. Validates on
 * blur and submit, filters bots, and after a successful send stays locked
 * (button shows ✓ Sent) — the lock survives reloads via localStorage.
 */
export function ContactForm({
  lang,
  dict,
  telegramLabel,
  className,
}: {
  lang: Locale;
  dict: ContactFormDict;
  telegramLabel: string;
  className?: string;
}) {
  const id = React.useId();
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Partial<Record<Field, boolean>>>({});
  const [sending, setSending] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [justSent, setJustSent] = React.useState(false);
  const startedAt = React.useRef(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  const lockedAt = React.useSyncExternalStore(subscribeLock, readLock, () => null);
  const locked = justSent || lockedAt !== null;

  // Service cards elsewhere on the page can preselect an option.
  React.useEffect(
    () =>
      onContactIntent(({ service, note }) => {
        setValues((v) => ({
          ...v,
          service,
          message: note && !v.message.trim() ? `${note}: ` : v.message,
        }));
        setErrors((e) => ({ ...e, service: undefined }));
      }),
    [],
  );

  const markStart = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const set = (field: Field, value: string) => {
    markStart();
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(next).errors[field] }));
    }
  };

  const blur = (field: Field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (values[field] !== "") {
      setErrors((prev) => ({ ...prev, [field]: validate(values).errors[field] }));
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked || sending) return;
    setServerError(null);

    const { data, errors: found } = validate(values);
    if (!data) {
      setErrors(found);
      setTouched({ name: true, contact: true, service: true, message: true });
      const first = FIELD_ORDER.find((f) => found[f]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const honeypot =
      formRef.current?.querySelector<HTMLInputElement>('[name="website"]')?.value ?? "";

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(data satisfies ContactInput),
          website: honeypot,
          startedAt: startedAt.current || Date.now(),
          locale: lang,
          page: window.location.pathname,
        }),
      });
      const body = (await res.json().catch(() => null)) as ContactResponse | null;

      if (body?.ok) {
        setValues(EMPTY);
        setErrors({});
        setTouched({});
        setJustSent(true);
        writeLock(Date.now());
        return;
      }
      if (body && !body.ok && body.fields) setErrors(body.fields);
      setServerError(
        body && !body.ok && body.error !== "invalid" ? dict.errors[body.error] : dict.errors.server,
      );
    } catch {
      setServerError(dict.errors.server);
    } finally {
      setSending(false);
    }
  }

  const err = (field: Field) => (errors[field] ? dict.errors[errors[field]!] : null);
  const describedBy = (field: Field) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      onFocus={markStart}
      className={cn("rounded-[2rem] bg-paper p-5 sm:p-8", className)}
    >
      <fieldset disabled={locked || sending} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldBox id={`${id}-name`} label={dict.name} error={err("name")}>
            <Input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              placeholder={dict.namePlaceholder}
              value={values.name}
              maxLength={60}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => blur("name")}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name")}
              required
              className="bg-white hover:bg-white"
            />
          </FieldBox>
          <FieldBox id={`${id}-contact`} label={dict.phone} error={err("contact")}>
            <Input
              id={`${id}-contact`}
              name="contact"
              autoComplete="tel"
              placeholder={dict.phonePlaceholder}
              value={values.contact}
              maxLength={40}
              onChange={(e) => set("contact", e.target.value)}
              onBlur={() => blur("contact")}
              aria-invalid={!!errors.contact}
              aria-describedby={describedBy("contact")}
              required
              className="bg-white hover:bg-white"
            />
          </FieldBox>
        </div>

        <fieldset
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? `${id}-service-error` : undefined}
          className="flex flex-col"
        >
          <legend className="mb-2.5 font-display text-[0.95rem] font-bold">{dict.service}</legend>
          <div className="flex flex-wrap gap-2">
            {dict.serviceOptions.map((option) => {
              const checked = values.service === option.value;
              return (
                <label key={option.value} className="option" data-checked={checked}>
                  <input
                    type="radio"
                    name="service"
                    value={option.value}
                    checked={checked}
                    onChange={() => {
                      set("service", option.value);
                      setErrors((prev) => ({ ...prev, service: undefined }));
                    }}
                    className="sr-only"
                  />
                  {checked ? <Check className="size-4" strokeWidth={3} /> : null}
                  {option.label}
                </label>
              );
            })}
          </div>
          <FieldError id={`${id}-service-error`} error={err("service")} />
        </fieldset>

        <FieldBox
          id={`${id}-message`}
          label={dict.message}
          hint={dict.optional}
          error={err("message")}
        >
          <Textarea
            id={`${id}-message`}
            name="message"
            placeholder={dict.messagePlaceholder}
            value={values.message}
            maxLength={1000}
            rows={3}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className="min-h-28 bg-white hover:bg-white"
          />
        </FieldBox>

        {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="submit"
          size="xl"
          disabled={locked || sending}
          className={cn("w-full overflow-hidden sm:w-auto sm:min-w-60", locked && "!opacity-100 bg-deep")}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={locked ? "sent" : sending ? "sending" : "idle"}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              {locked ? (
                <>
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.1 }}
                    className="grid size-7 place-items-center rounded-full bg-white text-deep"
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </motion.span>
                  {dict.sent}
                </>
              ) : sending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {dict.sending}
                </>
              ) : (
                <>
                  {dict.submit}
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
        <Button asChild size="xl" variant="ghost" className="w-full sm:w-auto">
          <a href={siteConfig.telegram.bot} target="_blank" rel="noopener noreferrer">
            <Send />
            {telegramLabel}
          </a>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {locked ? (
          <motion.div
            key="ok"
            role="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <p className="mt-5 font-display text-lg font-extrabold">{dict.successTitle}</p>
            <p className="mt-1 text-muted">{dict.successText}</p>
          </motion.div>
        ) : (
          <motion.p key="consent" exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden text-sm text-muted">
            {dict.consent}
          </motion.p>
        )}
      </AnimatePresence>

      {serverError ? (
        <p role="alert" className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}

function FieldBox({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="flex items-baseline gap-2">
        {label}
        {hint ? <span className="text-sm font-normal text-muted">{hint}</span> : null}
      </Label>
      {children}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1.5 text-sm font-medium text-danger"
        >
          {error}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
