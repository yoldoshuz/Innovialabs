---
title: Typography Basics for Web and Interface Design
description: Type scale, line height, line length, weights and tracking explained with practical starting values for readable text on websites and app screens.
summary: Good screen typography rests on a few decisions: a body size of about 16px or larger, line height around 1.4–1.6, lines of roughly 45–75 characters, a limited type scale and two or three weights. Get these right and most interfaces become readable before any styling.
---

## What typography in an interface actually is

Typography is not choosing a nice font. It is a set of rules that controls **size, spacing, line length and weight** so that people read and scan text without effort. On screens it carries most of the interface: buttons, labels, errors and navigation are all text.

The good news is that a handful of values covers the majority of cases. Start from proven defaults, then adjust by looking at real content on real devices.

## Practical starting values

| Parameter | Starting point for screens |
|---|---|
| Body text size | 16px, often 17–18px for long reading |
| Small text (captions, hints) | 13–14px, never the main reading size |
| Line height for body | 1.4–1.6 |
| Line height for headings | 1.1–1.25 |
| Line length | about 45–75 characters per line |
| Paragraph spacing | roughly equal to one line of text |
| Weights in use | 2–3 (for example regular, medium, bold) |

These are starting points, not laws. A font with a large x-height looks bigger at the same pixel size; a narrow font may need a slightly larger size.

## Type scale

A **type scale** is a fixed set of sizes you reuse everywhere instead of picking a new number for every element. It keeps hierarchy consistent and makes a design system manageable.

A common approach is a modular scale: each step is the previous one multiplied by a ratio such as 1.2 or 1.25. On a 16px base with a 1.25 ratio you get roughly 16, 20, 25, 31, 39, 49. Round them to whole pixels and keep 5–7 steps; more sizes than that usually means hierarchy is unclear.

In CSS, define the scale once as variables or tokens:

```css
:root {
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.25rem;   /* 20px */
  --text-xl: 1.5625rem; /* 25px */
  --text-2xl: 1.9375rem;/* 31px */
}
body { font-size: var(--text-base); line-height: 1.5; }
```

Use `rem` units so the text respects the user's browser font settings.

## Line height and line length

**Line height** (leading) gives the eye a path back to the start of the next line. Too tight and lines merge; too loose and the paragraph falls apart. Body text needs more air than headings: large headings with 1.5 line height look disconnected.

**Line length** (measure) is often ignored on wide desktop layouts. Text stretched across 1400px is tiring to read. Limit the container, for example with `max-width: 65ch`, which ties the width to the character count of the font.

## Weights and tracking

- **Weights** create hierarchy. Use bold or semibold for headings and emphasis, regular for reading. Thin weights (100–300) at small sizes lose contrast and become hard to read.
- **Tracking** (letter spacing) usually stays at the font's default for body text. Large headings often benefit from slightly negative tracking; small uppercase labels need slightly positive tracking.
- **Contrast** matters as much as size. Light grey text on white may look elegant in a mockup but fails real users. Check text against WCAG contrast requirements.

## Common mistakes

1. **Too many sizes and weights.** Every new value weakens hierarchy.
2. **Body text below 16px on mobile.** It forces zooming and on some mobile browsers small input text triggers automatic zoom.
3. **Full-width paragraphs** on large screens.
4. **Centered long text.** Centering works for short headings, not for paragraphs.
5. **Hierarchy only through size.** Weight, color and spacing are equally strong tools.
6. **Fixed `px` everywhere,** which ignores user preferences.

## How to check your typography

- Open the page on a phone and a laptop and read a full paragraph, not just look at it.
- Zoom the browser to 200% and confirm nothing breaks or overlaps.
- Squint at the screen: the hierarchy of headings, subheadings and body should still be visible.
- Test with real content, including long words and long translations.

## FAQ

### What is the minimum font size for a website?

For main reading text, 16px is a reliable minimum on both desktop and mobile. Smaller sizes are acceptable for secondary elements such as captions or metadata, but not for paragraphs people need to read.

### How many fonts should one interface use?

Usually one or two families. One well-built family with several weights is enough for most products; a second font is typically added for headings or brand accents.

### Should line height be set in pixels or as a number?

Use a unitless number such as 1.5. It scales with the font size of each element, while a fixed pixel value has to be recalculated every time the size changes.
