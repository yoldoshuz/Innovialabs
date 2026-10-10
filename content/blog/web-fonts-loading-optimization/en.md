---
title: 'Web Fonts: How to Load Fonts Fast Without Layout Shifts'
description: Load web fonts fast: WOFF2, font-display, preload, Cyrillic and Latin subsetting, self-hosting versus Google Fonts and fallback metric overrides.
summary: Serve WOFF2 from your own domain, split fonts into unicode-range subsets, preload only the key file, pick a font-display value and match the fallback font's metrics, so text appears at once and the layout does not jump.
---

## The short answer

Fonts slow a site down in two ways: text **takes a while to appear**, and when the font arrives, lines **change width and height** so the page jumps (which hurts CLS). The recipe:

1. **WOFF2** format.
2. **Subsetting**: only the characters you need, with Cyrillic and Latin in separate files.
3. **Self-hosting** on your own domain.
4. **preload** for one or two key files.
5. A **font-display** value that fits the job.
6. **Metric overrides** on the fallback font so the swap is invisible.

## WOFF2 and fewer weights

WOFF2 compresses better than older formats and is supported by all current browsers. There is no need to ship TTF or EOT anymore.

The biggest saving is the number of files. Every weight and style (400, 500, 700, italic) is a separate download. If the typeface comes as a **variable font**, one file replaces several weights. Check the design: two or three weights are often enough.

## Subsetting: Cyrillic and Latin

A full font contains Greek, Vietnamese, symbols and more that your site never uses. Split it into subsets and declare a **unicode-range**: the browser downloads a file only if the page actually contains those characters.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2000-206F;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-cyrillic.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

For Uzbek Latin, check the ‘ and ’ characters (U+2018, U+2019): they must fall into one of the ranges. You can cut files with `pyftsubset` from the fonttools package.

## Self-hosting or Google Fonts

| | Your domain | Google Fonts |
|---|---|---|
| Connections | No extra ones | Separate domains for CSS and files |
| Cross-site cache | No | Also no: browsers partition cache per site |
| Control | Full: subsets, preload, headers | Limited |
| Privacy | No requests to a third party | Requests go to an external service |

The old argument for Google Fonts was a shared cache, but modern browsers isolate cache per site, so that advantage is gone. That is why **self-hosting** usually wins. Frameworks can do it for you: `next/font`, for example, downloads fonts at build time and serves them from your domain.

## preload: be selective

```html
<link rel="preload" href="/fonts/inter-cyrillic.woff2"
      as="font" type="font/woff2" crossorigin>
```

- The **crossorigin attribute is required** even on your own domain, otherwise the file is fetched twice.
- Preload **one or two files**: body text and maybe headings. Preloading everything competes with CSS and images.

## font-display: which value

- **swap**: text shows immediately in the fallback font, then switches. Good for body text, but without metric matching it causes a jump.
- **optional**: if the font does not arrive within a very short window, the browser stays with the fallback. No jumps, but the brand font may not appear on the first visit.
- **fallback**: a middle ground.
- **block**: hides text until the font loads. Almost never right for body text.

## Matching fallback metrics

The jump happens because Arial and your font have different glyph widths and line heights. Create an adjusted fallback:

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "Inter", "Inter Fallback", sans-serif;
}
```

The values above are an example: each font needs its own, calculated from its metrics. Tools such as Fontaine or Capsize do this, and `next/font` generates the fallback automatically.

## Common mistakes

- Loading a font through `@import` inside CSS, which adds a sequential request.
- Shipping six weights when only two are used.
- Forgetting `crossorigin` on preload.
- Serving fonts without long caching: files with a hash in the name can be cached for a long time.

## FAQ

### Can I just use system fonts?

Yes. A system font stack needs no download at all and is the fastest option. If the brand does not require a specific typeface, it is a sensible choice.

### Why does the font still flash after I added preload?

Usually because `crossorigin` is missing, the path is wrong, or the preloaded subset is not the one the page needs. Check the Network tab: the file should load once and early.

### Do I need a separate subset for Uzbek text?

Uzbek Latin is almost fully covered by basic Latin, but check the ‘ and ’ apostrophes and make sure they exist in the font and in your chosen unicode-range.
