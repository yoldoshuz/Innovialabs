---
title: "Image Optimization for the Web: WebP, AVIF, srcset, Lazy Loading"
description: How to choose image formats, set compression, srcset and sizes, lazy loading and dimensions that prevent layout shift, and when an image CDN helps.
summary: Serve WebP or AVIF, size images to the screen with srcset and sizes, lazy-load only below the fold, always set width and height, and automate it with your build or an image CDN.
---

## The essentials in a minute

Images are often the heaviest part of a page and frequently the LCP element. Optimizing them comes down to four things:

1. **The right format** — WebP or AVIF instead of heavy JPEG/PNG.
2. **The right size** — the browser downloads an image sized for the screen, not the original.
3. **The right moment** — anything below the fold loads later.
4. **Reserved space** — so the page does not jump while loading.

## Choosing a format

| Format | When to use | Notes |
|---|---|---|
| **AVIF** | Photos and complex images where weight matters most | Slower to encode; keep a fallback |
| **WebP** | All-round choice for photos and graphics with transparency | Widely supported in modern browsers |
| **JPEG** | Fallback for photos | Use progressive and a sensible quality |
| **PNG** | Screenshots with fine text when precision matters | Usually too heavy for photos |
| **SVG** | Icons, logos, simple illustrations | Optimize with SVGO, do not embed raster inside |

You can serve several formats with `<picture>` — the browser picks the first one it supports:

```html
<picture>
  <source srcset="/img/hero.avif" type="image/avif">
  <source srcset="/img/hero.webp" type="image/webp">
  <img src="/img/hero.jpg" alt="Description" width="1200" height="630">
</picture>
```

## Compression

- Lossy compression is almost always fine for photos. Tune quality by eye on real examples rather than one number for everything.
- Strip metadata (EXIF) — it is useless on a web page.
- Do not ship raw camera images as final assets — run them through your build or tools like Squoosh, sharp or imagemin.

## Responsive images: srcset and sizes

`srcset` lists versions of the image at different widths, and `sizes` tells the browser how wide the image will be on screen. The browser then picks the best file, taking pixel density into account.

```html
<img
  src="/img/card-800.webp"
  srcset="/img/card-400.webp 400w, /img/card-800.webp 800w, /img/card-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 33vw"
  alt="Card description"
  width="800" height="600">
```

A common mistake is omitting `sizes`: the browser then assumes the image fills the whole viewport and downloads the largest version.

## Lazy loading

- The `loading="lazy"` attribute defers images until they approach the viewport. No JavaScript is required.
- Do **not** use it on above-the-fold images, and especially not on the LCP image — it delays rendering.
- For the hero image, do the opposite and add `fetchpriority="high"`.
- `decoding="async"` helps keep decoding off the critical path of the main thread.

## Dimensions and CLS

If an `<img>` has no `width` and `height`, the browser does not know its aspect ratio until the file loads, so content below it jumps. That hurts **CLS**.

- Always set `width` and `height` (the real proportions), and use `height: auto` in CSS for responsiveness.
- For containers with background images, use `aspect-ratio`.

## Image CDNs and frameworks

Manually generating variants for every image is tedious, so it is usually automated:

- **Image CDN** — a service or your own proxy that resizes, converts and compresses on the fly based on URL parameters, then caches the result.
- **Framework components** — for example, `next/image` in Next.js generates `srcset`, serves modern formats and lazy-loads by default.

When choosing, look at AVIF/WebP support, automatic format negotiation via the `Accept` header, caching and bandwidth costs.

## Checklist

- [ ] Photos in WebP/AVIF with a fallback.
- [ ] `srcset` plus a correct `sizes`.
- [ ] `loading="lazy"` only below the fold.
- [ ] `width`/`height` or `aspect-ratio` on every image.
- [ ] Meaningful `alt` for content images, empty `alt=""` for decorative ones.
- [ ] Metadata stripped, SVGs optimized.

## FAQ

### Should I use WebP or AVIF?

If your tooling allows, serve both via `<picture>` or an image CDN: AVIF is usually smaller and WebP is a reliable fallback. If you need just one format, WebP is simpler to work with.

### Do I need a JS library for lazy loading?

In most cases no: native `loading="lazy"` is enough. Libraries only help in special cases, such as complex reveal effects.

### Does image optimization affect SEO?

Yes, indirectly: it improves speed and Core Web Vitals. Descriptive file names and `alt` text also help with image search.
