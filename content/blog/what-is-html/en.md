---
title: What Is HTML and How a Web Page Is Structured
description: HTML for beginners: tags, attributes, document structure with head and body, the most common elements and a minimal working page you can open in a browser.
summary: HTML is a markup language that describes a page's structure with tags: headings, paragraphs, links, images, forms. The browser reads HTML and turns it into what you see on screen.
---
## In short: HTML is the skeleton of a page

**HTML** (HyperText Markup Language) is a markup language, not a programming language. It does not calculate or make decisions; it describes **what** is on the page: where the heading is, where a paragraph, a link, an image or a button goes.

**CSS** controls the look and **JavaScript** controls the behavior, but every web page is built on HTML. Without it the browser has nothing to show.

## Tags and attributes

HTML is made of **elements**. An element is usually written as a pair of tags — opening and closing — with content in between:

```html
<p>This is a paragraph of text.</p>
```

Some elements are **void** and have no closing tag, such as an image or a line break:

```html
<img src="logo.png" alt="Company logo">
<br>
```

**Attributes** refine an element and are written inside the opening tag as `name="value"`:

- `href` — the link address;
- `src` — the path to an image or video file;
- `alt` — a text description of an image for blind users and search engines;
- `class` and `id` — names used by styles and scripts;
- `lang` — the page language.

Elements can be nested, but they must be closed in reverse order.

## Document structure

Every HTML page has the same skeleton:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello!</h1>
    <p>This is my first web page.</p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML documentation</a>
  </body>
</html>
```

What is going on:

- `<!DOCTYPE html>` — tells the browser this is modern HTML.
- `<html>` — the root element that contains everything else.
- `<head>` — service information not shown on the page: encoding, the tab title, a description for search engines, linked styles.
- `<body>` — all the visible content of the page.

Save this code as `index.html` and double-click it — the browser will show a working page.

## Common elements

| Element | Used for |
|---|---|
| `<h1>`–`<h6>` | Headings of different levels |
| `<p>` | A paragraph of text |
| `<a>` | A link |
| `<img>` | An image |
| `<ul>`, `<ol>`, `<li>` | Bulleted and numbered lists |
| `<strong>`, `<em>` | Important and emphasized text |
| `<form>`, `<input>`, `<button>` | Forms and buttons |
| `<table>`, `<tr>`, `<td>` | Data tables |
| `<div>`, `<span>` | Generic containers with no meaning |

## Semantics: tags with meaning

Besides `<div>`, HTML has **semantic** elements that describe a block's role:

- `<header>` — the site or section header;
- `<nav>` — navigation;
- `<main>` — the main content of the page;
- `<article>` — a self-contained publication;
- `<section>` — a thematic section;
- `<footer>` — the footer.

Semantics helps **search engines** understand the page and **screen readers** read it correctly to people with visual impairments. These elements look the same as a `<div>` but are far more useful.

## Common beginner mistakes

- **Several `<h1>` tags just for big text.** Heading level is structure; size is set in CSS.
- **Empty or missing `alt` on meaningful images.** Accessibility and SEO suffer.
- **Nothing but `<div>` instead of semantic tags.**
- **Buttons made from `<div>`.** Use `<button>` for actions — it works with the keyboard without extra code.
- **Unclosed tags and wrong nesting.** The browser will try to fix the error, but the result may be unexpected.

## FAQ

### Is HTML a programming language?

No. It is a markup language: there are no variables, conditions or loops. JavaScript adds logic; HTML only describes structure and content.

### What should I learn after HTML?

CSS, to control appearance and responsive layouts, then JavaScript, to add interactivity. MDN Web Docs is a convenient reference for all three.

### Do I need HTML if my site is built with a website builder or CMS?

Not in depth, but the basics help. They let you structure headings properly, fill in alt text for images and understand why a page does not look as intended.
