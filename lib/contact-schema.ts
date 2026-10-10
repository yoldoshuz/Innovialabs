import { z } from "zod";

/**
 * Contact form contract shared by the client form and the API route.
 * Error messages are dictionary keys (`contactForm.errors.*`), so the same
 * schema produces localized messages on the client.
 */
export const SERVICE_VALUES = ["web", "mobile", "telegram", "ai", "crm", "other"] as const;

/** Minimum time a human needs to fill the form (anti-bot). */
export const MIN_FILL_MS = 3000;
/** How long a successful submission locks the form in this browser. */
export const SENT_LOCK_MS = 7 * 24 * 60 * 60 * 1000;
export const SENT_STORAGE_KEY = "innovialabs:contact-sent";

export type ContactErrorKey =
  | "nameShort"
  | "nameLong"
  | "nameInvalid"
  | "contactRequired"
  | "contactInvalid"
  | "serviceRequired"
  | "messageLong"
  | "messageInvalid"
  | "messageLinks";

// Letters (any script), spaces, hyphens, dots and the apostrophes used in
// Uzbek names (O‘ktam, Ma’mur).
const NAME_RE = /^\p{L}[\p{L}\p{M}\s'’‘ʻ.\-]*$/u;
const TG_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
const LINK_RE = /(https?:\/\/|www\.|t\.me\/)/gi;

/** Phone: 9–15 digits; Uzbek numbers (+998) must have exactly 12. */
export function isPhone(value: string) {
  if (!/^\+?[\d\s()\-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 15;
}

export function isTelegram(value: string) {
  return TG_RE.test(value);
}

/**
 * Rejects keyboard mashing: mostly letters, real words, no long runs of one
 * character, some variety of characters. Empty text passes (field optional).
 */
export function looksMeaningful(text: string) {
  const compact = text.replace(/\s+/g, "");
  if (!compact) return true;
  const letters = compact.match(/\p{L}/gu)?.length ?? 0;
  if (letters / compact.length < 0.5) return false;
  if (/(.)\1{5,}/u.test(compact)) return false;
  const words = text.match(/\p{L}{2,}/gu) ?? [];
  if (!words.length) return false;
  // A "word" longer than 30 letters is almost always mashing.
  if (words.some((w) => w.length > 30)) return false;
  // Long text made of a handful of characters ("asdasdasdasd…").
  if (compact.length > 15 && new Set(compact.toLowerCase()).size < 6) return false;
  return true;
}

const err = (key: ContactErrorKey) => ({ message: key });

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, err("nameShort"))
    .max(60, err("nameLong"))
    .regex(NAME_RE, err("nameInvalid")),
  contact: z
    .string()
    .trim()
    .min(1, err("contactRequired"))
    .max(40, err("contactInvalid"))
    .refine((v) => isPhone(v) || isTelegram(v), err("contactInvalid")),
  service: z.enum(SERVICE_VALUES, err("serviceRequired")),
  /** Optional free text; validated only when filled. */
  message: z
    .string()
    .trim()
    .max(1000, err("messageLong"))
    .refine((v) => (v.match(LINK_RE)?.length ?? 0) <= 2, err("messageLinks"))
    .refine(looksMeaningful, err("messageInvalid")),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Extended brief from the /contacts onboarding. Values are option ids from
 * `onboarding.options`; the API maps them to labels and drops unknown ones.
 */
const choice = z.string().trim().max(30);
export const contactDetails = z
  .object({
    phone: z.string().trim().max(40).optional(),
    telegram: z.string().trim().max(40).optional(),
    industry: choice.optional(),
    services: z.array(choice).max(12).optional(),
    stage: choice.optional(),
    /** USD amount from the slider ("50000+" for the top stop) or "unknown". */
    budget: z.string().regex(/^(\d{1,7}\+?|unknown)$/).optional(),
    deadline: choice.optional(),
  })
  .strict();

export type ContactDetails = z.infer<typeof contactDetails>;

/** Extra anti-spam fields sent alongside the payload. */
export const contactEnvelope = contactSchema.extend({
  /** Honeypot — real users never see or fill it. */
  website: z.string().max(0).optional().default(""),
  /** ms timestamp when the user first interacted with the form. */
  startedAt: z.number().int().positive(),
  locale: z.enum(["ru", "en", "uz"]),
  page: z.string().max(200).optional(),
  details: contactDetails.optional(),
});

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error: "invalid" | "tooFast" | "rateLimited" | "server";
      fields?: Partial<Record<keyof ContactInput, ContactErrorKey>>;
    };
