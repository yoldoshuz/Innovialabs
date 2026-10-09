<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Innovialabs design rules

- Follow `public/Innovialabs-Brand-Guidelines.pdf` strictly: palette Violet `#7C3AED`, Deep `#5B21B6`, Lilac `#A78BFA`, Mist `#EDE9FE`, Ink `#1A1033`, Night `#120B24`; Manrope (headings), Inter (text), Space Grotesk (latin accents only).
- Logos only from `public/Innovialabs-logo` (via `components/brand/logo.tsx`) — never retype, recolor or outline them.
- All styling lives in `app/globals.css` as Tailwind v4 tokens/classes. Custom typography classes use the `type-*` prefix (tailwind-merge drops custom `text-*` classes).
- **TABOO: pill badges** — small rounded chips with a dot and tiny uppercase letter-spaced text (e.g. `• ПРОЦЕСС`) above headings. They read as AI-generated filler. Open sections with a giant heading instead; no decorative eyebrow labels.
- Copy comes only from the approved texts (`lib/i18n/dictionaries/ru.json` is the source; en/uz are translations of it). Never invent numbers, clients or results — leave a block out instead.
- Reference for feel: Yandex YoungCon — minimalism, gigantism, heavy slanted headings, big blocks, playful motion.
