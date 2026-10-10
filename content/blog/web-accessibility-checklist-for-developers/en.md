---
title: Web Accessibility Checklist for Developers
description: Concrete code-level accessibility checks: keyboard, focus, alt text, labels, contrast, landmarks, reduced motion, screen readers and axe testing.
summary: Make sure everything works by keyboard with visible focus, images and fields have text names, contrast is sufficient, markup is semantic, motion respects reduced motion, then test with axe and a screen reader.
---
## The essentials in one minute

Most accessibility problems are solved with ordinary markup, no complex libraries. The minimum set of checks:

1. Everything works **with the keyboard**, and **focus is visible**.
2. Images have **alt**, fields have a **label**, icon buttons have an **accessible name**.
3. Text and UI **contrast** is sufficient.
4. Markup is **semantic**: ordered headings, landmarks, real buttons and links.
5. Motion respects **prefers-reduced-motion**.
6. The result is tested with **axe** and a **screen reader**.

Details for each item follow.

## Keyboard and focus

- [ ] Every interactive element is reachable with **Tab**, and the order matches the visual order.
- [ ] Buttons are `<button>`, links are `<a href>`. A `div` with `onClick` is not keyboard accessible.
- [ ] No `tabindex` above 0 — it breaks the natural order.
- [ ] Modals trap focus inside, close on **Esc** and return focus to the button that opened them.
- [ ] There is a "Skip to content" link at the top of the page.
- [ ] Focus is **never hidden** with `outline: none` without a replacement.

```css
:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}
```

`:focus-visible` shows the ring during keyboard navigation and stays out of the way on mouse clicks.

## Images and media

- [ ] Informative images have meaningful `alt` describing the purpose, not "image".
- [ ] Decorative images use `alt=""` so screen readers skip them.
- [ ] Icons inside buttons are hidden (`aria-hidden="true"`) and the button has text or an `aria-label`.
- [ ] Videos have captions, audio has a transcript.
- [ ] Autoplay with sound is disabled.

## Forms

- [ ] Every field has a `<label>` linked via `for` and `id`. A placeholder is not a label.
- [ ] Required fields are marked by more than color.
- [ ] Errors are shown as text next to the field and linked with `aria-describedby`.
- [ ] Fields use `autocomplete` (name, email, phone) — this also helps people with motor impairments.

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email"
       aria-describedby="email-error" aria-invalid="true">
<p id="email-error">Enter an email like name@example.com</p>
```

## Contrast and color

- [ ] Normal text has a contrast of at least **4.5:1**, large text at least **3:1** (WCAG AA).
- [ ] Field borders, icons and focus states have at least **3:1** against the background.
- [ ] Information is not conveyed by **color alone**: an error is a red border plus text or an icon.
- [ ] Text remains readable at 200% zoom and is not clipped.

## Semantics and landmarks

- [ ] One `<h1>` per page, headings follow levels without skipping.
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` are used — screen readers jump between them.
- [ ] Page language is set: `<html lang="en">`.
- [ ] Lists are `<ul>`/`<ol>`, data tables are `<table>` with `<th>`.
- [ ] Links make sense out of context: not "here" but "Download the price list".

## Animation and motion

- [ ] Nothing flashes more than three times per second.
- [ ] Auto-moving content can be paused.
- [ ] Large animations turn off when the system reduce-motion setting is on:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Testing

| Tool | What it finds |
|---|---|
| **axe DevTools** / **Lighthouse** | Missing alt and labels, low contrast, ARIA errors |
| **Keyboard** | Focus traps, invisible focus, unreachable elements |
| **Screen reader** (NVDA, VoiceOver, TalkBack) | Unclear names, wrong reading order, silent buttons |
| **200% zoom and mobile width** | Clipped text, horizontal scrolling |

Add automated checks to CI — for example `@axe-core/playwright` in end-to-end tests — but don't treat them as a full replacement for manual testing.

## FAQ

### Where do we start if the site is already built?

Walk through the main flows using only the keyboard and run axe on key pages. These two steps quickly reveal the most critical issues.

### Should we add ARIA everywhere?

No. Use native HTML elements first — accessibility is built into them. ARIA is only needed where HTML falls short, such as complex widgets.

### How often should accessibility be checked?

With every new component and before each release. It helps to put this checklist into the task's definition of done.
