# Innovialabs

Site of Innovialabs — IT development studio. *Where ideas become products.*

Next.js 16 (App Router) · Tailwind CSS v4 · motion · GSAP · three.js · Radix (shadcn/ui) · zod.

## Run

```bash
npm install
cp .env.example .env.local   # then fill the values
npm run dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap, OG images |
| `TELEGRAM_BOT_TOKEN` | Token of `@innovialabs_bot` |
| `TELEGRAM_CHAT_ID` | Chat or group that receives leads. Message the bot (or add it to a group), then read `chat.id` from `https://api.telegram.org/bot<TOKEN>/getUpdates` |
| `NEXT_PUBLIC_CONTACT_PHONE` | Optional phone shown in the footer |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION` | Optional search console verification |

## Structure

- `app/[lang]` — localized routes (`ru` default, `en`, `uz`): `/`, `/services`, `/services/[slug]`, `/cases`, `/cases/[slug]`, `/company`, `/contacts`.
- `app/api/contact` — contact form → Telegram (validation, honeypot, fill-time check, rate limit).
- `lib/i18n/dictionaries` — all copy. `ru.json` is the approved source; `en`/`uz` must keep the same shape.
- `lib/content.ts` — language-agnostic data (case URLs, screenshots, stack).
- `app/globals.css` — the whole design system (brand tokens, typography, liquid glass).
- `public/Innovialabs-logo`, `public/Innovialabs-Brand-Guidelines.pdf` — brand assets.

Design rules for contributors are in [AGENTS.md](AGENTS.md).
