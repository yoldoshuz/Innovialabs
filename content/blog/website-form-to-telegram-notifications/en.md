---
title: How to Send Website Form Submissions to Telegram
description: Send website form leads to a Telegram chat or group via the Bot API on the server, keeping the bot token off the frontend and never losing leads on failures.
summary: The form posts to your server, which validates the data, saves the lead and calls the Bot API sendMessage with a token from environment variables; on failure it retries, and the lead stays in the database either way.
---
## Short answer

The correct setup looks like this:

**browser → your server handler → database or log → Bot API `sendMessage` → chat or group**.

The bot token lives only on the server. If you call the Bot API straight from page JavaScript, any visitor sees the token in the Network tab and can send messages as your bot, flood your group with spam or take over the bot.

## Step 1. The bot and the lead chat

1. Create a bot in BotFather and save the token.
2. Create a group for leads and add the bot. It doesn't need admin rights to post.
3. Find the `chat_id`: send a message mentioning the bot in the group, such as `/start@your_bot`, then open `https://api.telegram.org/bot<TOKEN>/getUpdates`. Look for `chat.id` in the response.

What to know about `chat_id`:

- groups have a negative ID, supergroups start with `-100`;
- if the group turns into a supergroup, the ID changes — the Bot API returns an error with `migrate_to_chat_id`;
- `getUpdates` doesn't work while the bot has a webhook set;
- to receive leads in a private chat, start the bot yourself first — otherwise it can't message you.

## Step 2. Environment variables

```bash
TELEGRAM_BOT_TOKEN=123456789:replace-with-your-token
TELEGRAM_CHAT_ID=-1001234567890
```

Don't add prefixes that expose these variables to the browser, such as `NEXT_PUBLIC_` in Next.js. The `.env` file must stay out of the repository.

## Step 3. The server handler

A Next.js route handler example. The same logic works on any backend.

```ts
// app/api/lead/route.ts
const API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function notifyTelegram(text: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return true;
      const data = await res.json().catch(() => ({}));
      if (res.status !== 429 && res.status < 500) {
        console.error("Telegram rejected lead", res.status, data.description);
        return false; // configuration error: retrying won't help
      }
      const wait = data.parameters?.retry_after ?? 2 ** attempt;
      await new Promise((r) => setTimeout(r, wait * 1000));
    } catch {
      // timeout or network error: try again
    }
  }
  return false;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ ok: false }, { status: 400 });
  if (body.website) return Response.json({ ok: true }); // honeypot: silently drop spam bots

  const name = String(body.name ?? "").trim().slice(0, 100);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  if (!name || !phone) return Response.json({ ok: false }, { status: 400 });

  const lead = await saveLead({ name, phone }); // save the lead first
  const text = `<b>New lead #${lead.id}</b>\nName: ${esc(name)}\nPhone: ${esc(phone)}`;
  if (!(await notifyTelegram(text))) await markForRetry(lead.id);

  return Response.json({ ok: true });
}
```

`saveLead` and `markForRetry` are your own database functions.

## Step 4. Handling failures

Telegram is a notification channel, not lead storage. So:

- **save the lead first** to a database or at least a log, then send the notification;
- **set a timeout** on the Bot API request so the form doesn't hang;
- **retry** only on `429` (wait for `retry_after`) and `5xx` errors, with a limited number of attempts;
- **don't retry** on `400` and `403`: a wrong `chat_id`, a bot removed from the group or broken markup needs an alert, not a retry;
- **add a backup channel** for unsent leads: a background retry queue or an email;
- **tell the user it worked** once the lead is saved, not once the notification arrives.

In serverless environments, long waits inside a request are undesirable, so move retries to a background job.

## Spam and markup protection

- **escape** `&`, `<` and `>` with `parse_mode: "HTML"` — otherwise one character in a name breaks the message;
- **limit field length**: Telegram messages have a length limit;
- add a **hidden honeypot field** and per-IP rate limiting;
- **validate on the server**, even if the browser already checked the data.

## FAQ

### Can leads go to a private chat instead of a group?

Yes, if you started the bot and use your own ID as `chat_id`. A group works better for a team, though: every manager sees the leads and can discuss them in replies.

### Why does getUpdates return an empty list?

Usually the bot has a webhook set, or the group had no messages the bot can see. In privacy mode a bot only receives commands and mentions in groups, so send a command with its username.

### Do I need a separate server?

No. A server handler in your site's backend or a serverless function is enough — what matters is that the token never reaches the browser.
