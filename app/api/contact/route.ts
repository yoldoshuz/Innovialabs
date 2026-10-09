import { NextResponse } from "next/server";
import {
  contactEnvelope,
  MIN_FILL_MS,
  type ContactErrorKey,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact-schema";
import ru from "@/lib/i18n/dictionaries/ru.json";
import { siteConfig } from "@/lib/site";

/**
 * Contact form → Telegram bot. Validates with the shared schema, filters bots
 * (honeypot + fill time + per-IP rate limit) and posts a structured message
 * to TELEGRAM_CHAT_ID.
 */

// Best-effort in-memory rate limit (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const optionLabel = (
  options: { value: string; label: string }[],
  value?: string,
) => options.find((o) => o.value === value)?.label ?? "—";

function formatMessage(
  data: ContactInput,
  meta: { locale: string; page?: string },
) {
  const contact = data.contact.trim();
  const tg = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)
    ? contact.replace(/^@/, "")
    : null;
  const contactLine = tg
    ? `<a href="https://t.me/${tg}">@${escapeHtml(tg)}</a>`
    : `<code>${escapeHtml(contact)}</code>`;

  const time = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  return [
    `<b>Новая заявка с сайта</b>`,
    ``,
    `<b>Имя:</b> ${escapeHtml(data.name)}`,
    `<b>Контакт:</b> ${contactLine}`,
    `<b>Услуга:</b> ${escapeHtml(optionLabel(ru.contactForm.serviceOptions, data.service))}`,
    ``,
    `<b>Задача:</b>`,
    data.message ? `<blockquote>${escapeHtml(data.message)}</blockquote>` : "—",
    ``,
    `<i>${time} (Ташкент) · ${meta.locale.toUpperCase()} · ${escapeHtml(
      meta.page ?? "/",
    )}</i>`,
    `<i>${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}</i>`,
  ].join("\n");
}

const json = (body: ContactResponse, status = 200) =>
  NextResponse.json(body, { status });

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = contactEnvelope.safeParse(body);
  if (!parsed.success) {
    const fields: Partial<Record<keyof ContactInput, ContactErrorKey>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (key && !fields[key]) fields[key] = issue.message as ContactErrorKey;
    }
    // A filled honeypot is a bot: answer "ok" so it doesn't retry.
    if (
      typeof body === "object" &&
      body !== null &&
      "website" in body &&
      (body as { website?: unknown }).website
    ) {
      return json({ ok: true });
    }
    return json({ ok: false, error: "invalid", fields }, 422);
  }

  const { website, startedAt, locale, page, ...data } = parsed.data;
  if (website) return json({ ok: true });
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return json({ ok: false, error: "tooFast" }, 429);
  }
  if (rateLimited(ip)) {
    return json({ ok: false, error: "rateLimited" }, 429);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set");
    return json({ ok: false, error: "server" }, 500);
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatMessage(data, { locale, page }),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[contact] Telegram error", res.status, await res.text());
      return json({ ok: false, error: "server" }, 502);
    }
  } catch (error) {
    console.error("[contact] Telegram request failed", error);
    return json({ ok: false, error: "server" }, 502);
  }

  return json({ ok: true });
}
