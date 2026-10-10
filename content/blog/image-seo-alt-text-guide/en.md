---
title: Image SEO: Alt Text, File Names, Formats and Compression
description: How to write alt text, name files, choose WebP and AVIF, serve responsive images and use lazy loading so images speed up your site and bring traffic.
summary: An optimized image has clear alt text, a meaningful file name, a modern format, the right size for the screen, and lazy loading for everything below the first screen.
---
## What matters first

Images affect SEO in two ways. The first is **understanding**: a search engine does not "see" a picture the way a person does and relies on alt text, the file name and surrounding text. The second is **speed**: heavy images are often the main reason for slow loading and poor Core Web Vitals, especially LCP.

The minimum set: meaningful **alt**, a clear **file name**, **WebP or AVIF** format, **sizes that fit the screen** and **lazy loading** for images below the first screen.

## How to write alt text

Alt is the text replacement of an image for screen readers and search engines. Write what you would tell someone who cannot see the picture.

| Bad | Good |
|---|---|
| `alt="image1"` | `alt="Courier handing an order to a customer at the entrance"` |
| `alt="sofa buy sofa cheap sofa"` | `alt="Grey three-seat sofa with wooden legs"` |
| alt missing | `alt=""` for purely decorative elements |

- **Specific and short:** one sentence is usually enough.
- **Use a keyword only if it naturally** describes the image.
- **Do not start with "image of…"** — screen readers already announce it is an image.
- **Decorative images** get an empty `alt=""` so they are skipped.

## File names

- `IMG_4821.jpg` says nothing. `grey-three-seat-sofa.webp` does.
- Use Latin characters, lowercase and hyphens instead of spaces.
- Do not rename already indexed images without a reason.

## Formats

| Format | When to use |
|---|---|
| **AVIF** | Photos and complex images when minimal size matters |
| **WebP** | A universal choice with wide support |
| **JPEG** | Fallback for photos |
| **PNG** | Screenshots and graphics with transparency when WebP does not fit |
| **SVG** | Logos, icons, simple vector graphics |

Serve a modern format with a fallback through `<picture>`:

```html
<picture>
  <source srcset="/img/sofa.avif" type="image/avif" />
  <source srcset="/img/sofa.webp" type="image/webp" />
  <img src="/img/sofa.jpg" alt="Grey three-seat sofa" width="1200" height="800" />
</picture>
```

## Size and responsiveness

The main mistake is loading an image several thousand pixels wide to display it in a 400-pixel block. Use `srcset` and `sizes` so the browser picks the right file:

```html
<img
  src="/img/sofa-800.webp"
  srcset="/img/sofa-400.webp 400w, /img/sofa-800.webp 800w, /img/sofa-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Grey three-seat sofa"
  width="800" height="533" />
```

- Always set **width and height** — this prevents layout shifts (CLS).
- Compress files before publishing; choose the quality visually by comparing results.

## Lazy loading and the first screen

- Add `loading="lazy"` to images below the first screen.
- **Do not lazy-load the main first-screen image** — it slows down LCP. Instead, you can give it `fetchpriority="high"`.
- Many frameworks, such as Next.js with its `Image` component, handle part of this work, but you still set alt text and priorities.

## Traffic from image search

- Place the image next to relevant text and a caption.
- Use **original images**: your own product photos and diagrams are worth more than stock.
- Add important images to the sitemap or make sure they are crawlable and not blocked in robots.txt.
- Reference the image in Product or Article structured data.

## Common mistakes

- Images are loaded only by a script and the crawler cannot find them.
- Text is baked into an image instead of HTML.
- The same alt text on every image on the page.
- Lazy loading on the hero image.

## FAQ

### Does every image need alt text?

The attribute is always needed, but content only for informative images. For decorative ones leave `alt=""` so screen readers skip them.

### Which is better: WebP or AVIF?

AVIF usually gives a smaller file at the same quality, while WebP encodes faster and has wider support. The safe approach is to serve both through `<picture>` with a JPEG fallback.

### Does an image caption affect SEO?

Captions and surrounding text help search engines understand the image's context. They help people too, so caption important illustrations.
