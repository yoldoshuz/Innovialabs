"use client";

import type { Locale } from "@/lib/i18n/config";
import {
  contactSchema,
  SENT_LOCK_MS,
  SENT_STORAGE_KEY,
  type ContactDetails,
  type ContactErrorKey,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact-schema";

/**
 * Client side of the contact contract, shared by the classic form
 * (/contacts) and the brief wizard (/brief): validation, the "already sent"
 * lock and the POST itself.
 */
export type ContactValues = { name: string; contact: string; service: string; message: string };
export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, ContactErrorKey>>;

export const EMPTY_CONTACT: ContactValues = { name: "", contact: "", service: "", message: "" };

export function validateContact(values: ContactValues) {
  const result = contactSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} as ContactErrors };
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ContactField;
    if (key && !errors[key]) errors[key] = issue.message as ContactErrorKey;
  }
  return { data: null, errors };
}

/* ---------------- "already sent" lock, persisted in localStorage -------- */

const lockListeners = new Set<() => void>();

export function readLock(): number | null {
  try {
    const at = Number(window.localStorage.getItem(SENT_STORAGE_KEY));
    return at && Date.now() - at < SENT_LOCK_MS ? at : null;
  } catch {
    return null;
  }
}

export function writeLock(at: number = Date.now()) {
  try {
    window.localStorage.setItem(SENT_STORAGE_KEY, String(at));
  } catch {
    /* private mode — the in-memory state still locks this session */
  }
  lockListeners.forEach((fn) => fn());
}

export function subscribeLock(fn: () => void) {
  lockListeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    lockListeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

/** POSTs a validated brief; network failures come back as `server`. */
export async function sendContact(
  data: ContactInput,
  extra: { honeypot: string; startedAt: number; locale: Locale; details?: ContactDetails },
): Promise<ContactResponse> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        website: extra.honeypot,
        startedAt: extra.startedAt || Date.now(),
        locale: extra.locale,
        page: window.location.pathname,
        details: extra.details,
      }),
    });
    const body = (await res.json().catch(() => null)) as ContactResponse | null;
    return body ?? { ok: false, error: "server" };
  } catch {
    return { ok: false, error: "server" };
  }
}

/** Remembers when the visitor first touched the form (anti-bot timing). */
export function stampStart(ref: { current: number }) {
  if (!ref.current) ref.current = Date.now();
}
