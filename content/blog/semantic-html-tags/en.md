---
title: Semantic HTML: Which Tags to Use and Why It Matters
description: Which semantic HTML tags a page needs, why button beats div, and how semantics affects accessibility, code maintenance and how machines parse pages.
summary: Semantic HTML means choosing tags by what content is (header, nav, main, article, button), not by how it looks, so screen readers, search engines and developers understand the page.
---

## What semantic HTML is

**Semantic HTML** means a tag describes *what* a piece of content is, not how it looks. A page header is a `<header>`, a menu is a `<nav>`, a button is a `<button>`. CSS handles appearance; HTML handles meaning.

If everything is built from `<div>` and `<span>`, the browser sees the page as a pile of unnamed boxes. A sighted user may not notice, but a screen reader, a search crawler and the next developer will.

## The core tags and when to use them

| Tag | Purpose |
|---|---|
| `<header>` | Intro part of a page or section: logo, title, navigation |
| `<nav>` | Main navigation for the site or a section |
| `<main>` | The page's unique content, one per page |
| `<article>` | Self-contained content: a post, a review, a product card |
| `<section>` | A thematic part with its own heading |
| `<aside>` | Supporting content: sidebar, related links |
| `<footer>` | Bottom of a page or section: contacts, copyright |
| `<button>` | An action on the page: submit, open, toggle |
| `<a>` | Navigation to an address |

A simple rule: **a link goes somewhere, a button does something**.

## Before and after

Div-based markup:

```html
<div class="header">
  <div class="logo">Shop</div>
  <div class="menu">
    <div onclick="go('/catalog')">Catalog</div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">Autumn arrivals</div>
    <div class="btn" onclick="like()">Like</div>
  </div>
</div>
```

The same page, semantic:

```html
<header>
  <a href="/">Shop</a>
  <nav>
    <a href="/catalog">Catalog</a>
  </nav>
</header>
<main>
  <article>
    <h2>Autumn arrivals</h2>
    <button type="button" onclick="like()">Like</button>
  </article>
</main>
```

Roughly the same amount of code, far more meaning.

## Why `button` beats `div`

A `<div onclick>` looks like a button but isn't one. To make it behave like a real button you'd have to add by hand:

- `tabindex="0"` so it can be reached with Tab;
- handling for Enter and Space;
- `role="button"` so a screen reader announces it as a button;
- focus styles and a `disabled` state.

`<button>` gives you all of this **for free**. The same goes for `<a href>`: a real link opens in a new tab, can be copied and gets crawled; a `div` that navigates via JavaScript does none of that.

## What semantics gives you in practice

- **Accessibility.** Screen readers build a map of the page from tags: users can jump straight to `main` or the navigation, or skim headings.
- **Maintainability.** `<nav>` and `<article>` read faster than `div.wrapper-2`, so new developers get up to speed sooner.
- **Parsing.** Search engines, browser reader modes and other parsers rely on structure to find the main content.
- **Less JavaScript.** Native elements already handle focus, keyboard input and form submission.

## Common mistakes

- **Several `<main>` elements** on one page. There should be one visible `main`.
- **`<section>` as a generic wrapper.** If a block has no heading of its own and exists only for styling, use `<div>`.
- **Headings chosen by size.** Pick `<h3>` for its nesting level, not because it's smaller. Size belongs in CSS.
- **A button inside a link**, or a link without `href`. Both break keyboard navigation.
- **Missing `type` on a button in a form.** By default a `<button>` inside a `<form>` submits it.

## How to check your markup

1. Turn off CSS and see whether the page structure still makes sense.
2. Navigate the page with the keyboard only: Tab, Enter, Space.
3. Open the accessibility panel in browser DevTools and check element roles.
4. Use the element reference on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).

## FAQ

### Should I stop using div entirely?

No. `<div>` is a perfectly fine tag for grouping things for layout. The point is not to use it in place of elements that carry meaning: buttons, links, navigation, headings.

### Does semantic HTML affect SEO?

It helps search engines understand where the main content is and how the heading structure works. It doesn't guarantee higher rankings, but it removes obstacles to parsing the page.

### What's the difference between article and section?

An `<article>` makes sense on its own, even if lifted out of the page: a post, a review, a card. A `<section>` is a thematic part of a larger whole and usually has a heading.
