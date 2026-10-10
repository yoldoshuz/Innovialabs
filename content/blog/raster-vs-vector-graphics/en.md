---
title: Raster vs Vector Graphics: Formats and When to Use Them
description: Raster vs vector explained: how PNG, JPG, WebP, SVG, PDF and AI handle scaling and file size, and which format fits logos, photos, icons and print.
summary: Raster images store a grid of pixels and suit photos, while vector images describe shapes mathematically and scale without loss, so logos and icons belong in vector and photos in JPG or WebP.
---

## The short answer

A **raster image** is a grid of pixels, each with its own color. Phone photos, screenshots and scans are all raster. Raster images have a fixed resolution: enlarge one beyond its pixel count and it turns blurry or jagged.

A **vector image** is a description of shapes: points, lines, curves and fills. The computer redraws them at whatever size is needed, so vectors **scale without losing quality**, from a 16-pixel icon to a billboard.

A simple rule: **anything drawn (logos, icons, flat illustrations) goes in vector; anything photographed goes in raster.**

## Side-by-side comparison

| | Raster | Vector |
|---|---|---|
| Made of | Pixels | Shapes and curves |
| Scaling | Loses quality when enlarged | Lossless at any size |
| File size | Grows with resolution | Depends on artwork complexity |
| Photos | Ideal | Not suitable |
| Logos, icons | Only as exports at a specific size | Ideal |
| Editing | Changing pixels | Changing shapes, colors, lines |

## Formats and when to use them

### Raster formats

- **JPG (JPEG)**: lossy compression, no transparency. Great for photos: files are small and the losses are barely visible in pictures. Poor for text, logos and sharp-edged graphics, where artifacts appear.
- **PNG**: lossless compression with transparency. Good for screenshots, UI graphics and anything with crisp edges. For photos, files are much heavier than JPG.
- **WebP**: a modern web format with lossy and lossless modes, transparency and animation. It usually produces smaller files than JPG and PNG at similar quality, and modern browsers support it.

### Vector and mixed formats

- **SVG**: the vector format for the web, essentially a text file describing shapes. Ideal for logos and icons on a website: sharp on any screen, and it can be recolored and animated with CSS.
- **PDF**: a universal document format that can hold both vector and raster content. The standard for sending artwork to print and for presentations.
- **AI**: Adobe Illustrator's native format. It's a **source file**, not a publishing format: you keep the logo in it with all its layers so you can edit it and export other formats later.

## Which format to choose: cheat sheet

| Task | Format |
|---|---|
| Logo on a website | SVG |
| Logo for print | PDF (vector) or AI/EPS source for the printer |
| Logo for social media and messengers | PNG at the right size |
| UI icons | SVG |
| Photos on a website | WebP, with JPG as a fallback if needed |
| Screenshot with text | PNG or lossless WebP |
| Printing photos | High-resolution raster; confirm the requirements with the print shop |
| Storing brand source files | AI, SVG, PDF |

## File size and site performance

Heavy images are a common cause of slow pages. What helps:

- **don't serve an image larger than it's displayed**: a photo several thousand pixels wide inside a 400-pixel card wastes bandwidth;
- **compress photos** as WebP or JPG at a sensible quality;
- **use SVG** for logos and icons instead of PNG;
- **optimize SVGs**, since exports from design tools often carry extra metadata;
- serve different sizes for different screens with `srcset` and `sizes`.

```html
<img
  src="photo-800.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1600.webp 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Photo description"
  loading="lazy"
>
```

## Common mistakes

- A logo that exists only as a JPG on a white background, so it can't sit on a colored backdrop.
- Auto-tracing a tiny raster logo into vector and expecting a perfect result.
- Photos saved as PNG, making files much heavier with no visible benefit.
- Vectorizing a photo for the sake of "scalability."
- No source files at all: the company only has an image pulled from a messenger.

## FAQ

### Can a raster logo be turned into a vector?

Yes, but a clean result usually means redrawing it by hand in a vector editor. Auto-tracing works for simple shapes, while complex details often come out with uneven outlines.

### Which is better for a website: WebP or JPG?

WebP in most cases, since files are usually smaller at similar quality. JPG remains a reliable universal option when you need compatibility with very old software.

### Which logo files should I get from a designer?

At minimum: a vector source (AI or equivalent), SVG for the web, PDF for print and PNG with a transparent background in several sizes. Ideally in color, black and white versions.
