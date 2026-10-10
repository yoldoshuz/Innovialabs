---
title: How to Choose and Pair Fonts for a Website
description: A practical method to pick a heading and body font pair by contrast and mood, check licenses, language support and loading speed, plus proven free pairs.
summary: Pick a highly readable body font first, then a heading font that contrasts with it in one clear way (structure, weight or width) and fits the brand mood; check the license, language support and loading cost before you commit.
---

## The short answer

Most websites need **two fonts at most**: one for headings, one for body text. Choose the **body font first**, because it carries most of the reading. Then pick a **heading font** that differs from it in one noticeable way and matches the brand mood. Before you commit, check three practical things: **license**, **character set** for your languages and **web performance**.

## Step 1. Choose the body font

Body text must be comfortable at small sizes on cheap screens. Look for:

- **large x-height** (lowercase letters are tall relative to capitals);
- **open shapes** in letters like a, e, c;
- clearly different **Il1** and **O0**;
- at least regular, medium and bold weights, ideally italics;
- good **hinting** or a font designed for screens.

Neutral sans serifs (Inter, Source Sans 3, IBM Plex Sans, PT Sans) are safe defaults for interfaces. Serif body fonts work well for long reading, such as blogs and media.

## Step 2. Pick the heading font by contrast

Two fonts that are almost the same look like a mistake. Two fonts that differ in everything look chaotic. Aim for **one strong contrast**:

| Contrast type | Example | Effect |
|---|---|---|
| Structure: serif + sans | Playfair Display + Source Sans 3 | classic, editorial |
| Weight: heavy display + light text | Montserrat ExtraBold + Lora | confident, bold |
| Width: condensed + normal | a condensed grotesque + Inter | dense, poster-like |
| Same family, different styles | IBM Plex Serif + IBM Plex Sans | coherent, safe |

A **superfamily** (one family with serif and sans versions) is the easiest way to get harmony without guessing.

## Step 3. Match the mood

Fonts carry associations. Match them to the brand, not to your personal taste:

- **geometric sans** (round O, simple forms): modern, tech, friendly;
- **humanist sans** (calligraphic roots): warm, approachable, readable;
- **high-contrast serif**: premium, fashion, editorial;
- **slab serif**: sturdy, practical, slightly retro;
- **monospace** as an accent: technical, developer-oriented.

Test the pair on a real screen of your site: a hero, a card, a form, a long paragraph. A pair that looks good in a specimen can fail in a dense interface.

## Step 4. Check the license

- Fonts on **Google Fonts** are mostly under the **SIL Open Font License**, which allows commercial use and self-hosting.
- Commercial fonts often separate **desktop**, **web** and **app** licenses. A desktop license does not automatically cover embedding on a website.
- Web licenses may be limited by page views or domains. Read the terms before launch, not after.
- Keep the license file in the repository next to the font files.

## Step 5. Check languages and characters

If your site has several languages, every font must cover all of them. For Russian you need **Cyrillic**; for Uzbek Latin you need the right apostrophe characters in o‘ and g‘. Many display fonts are Latin-only. Type a real sentence in every language and look for fallback glyphs that suddenly appear in another font.

## Step 6. Keep it fast

Every extra weight is another file to download.

- Use **WOFF2**.
- Load only the weights you use, often 2–3 per family, or one **variable font**.
- **Subset** to the scripts you need.
- Use `font-display: swap` so text shows immediately with a fallback.
- **Preload** the one or two files used above the fold.
- Prefer **self-hosting** so fonts are served from your own domain.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

body { font-family: "Inter", system-ui, sans-serif; }
```

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

## Proven free pairs

| Headings | Body | Character |
|---|---|---|
| Playfair Display | Source Sans 3 | editorial, elegant |
| Manrope | Inter | clean, product, tech |
| Montserrat | Lora | bold headings, warm reading |
| Roboto Slab | Roboto | practical, neutral |
| PT Serif | PT Sans | designed together, strong Cyrillic |
| IBM Plex Serif | IBM Plex Sans | corporate, technical |

Character sets change between releases, so confirm Cyrillic or Latin Extended support on the font page before use.

## Common mistakes

- Three or more families on one page.
- Choosing the heading font first and forcing the body font to match.
- Display fonts for body text.
- Loading every weight "just in case".
- Forgetting that one of the site languages is not supported.

## FAQ

### Can I use one font for everything?

Yes. A good family with several weights, used with a clear size scale, is often enough and loads faster. Contrast then comes from size and weight instead of a second font.

### Are Google Fonts free for commercial websites?

Most are published under open licenses that allow commercial use, but check the license listed for each specific font before launch.

### How many font weights should a site load?

As few as the design needs. Regular and bold for text plus one heading weight cover most sites; a variable font can replace several static files.
