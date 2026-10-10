---
title: Preventing XSS in React and Next.js Applications
description: Where React escapes data for you and where it does not: dangerouslySetInnerHTML, javascript: links, Markdown rendering, DOMPurify sanitizing and CSP in Next.js.
summary: React escapes text in JSX, so XSS in React apps happens around that protection: dangerouslySetInnerHTML, unsafe URLs, Markdown with raw HTML and direct DOM access. Sanitize HTML with DOMPurify, validate link schemes and enable a CSP.
---

## The short answer

By default, React protects you from most XSS: anything you render in JSX as `{value}` becomes text, not HTML. A `<script>` string shows up on the page as literal characters.

Vulnerabilities appear where a developer goes around that protection. There are only a few such places, and a code search finds them quickly.

## Where React escapes automatically

- Text inside JSX: `<p>{comment}</p>`.
- Most attribute values: `<input value={name} />`, `title`, `alt`, `className`.
- Props rendered in the same ways.

This works the same in Next.js client and server components.

## Where React does not protect you

### dangerouslySetInnerHTML

The name is honest: the string is inserted as HTML with no checks.

```tsx
// vulnerable if bio comes from a user
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

Use it only with HTML you have sanitized, or with content fully controlled by your team.

### javascript: links

React escapes the `href` value but does not check the URL scheme. A link to `javascript:alert(document.cookie)` runs code on click. Recent React versions warn about or block such URLs, but do not rely on that. Check the scheme yourself:

```ts
export function safeUrl(input: string): string {
  try {
    const url = new URL(input, "https://placeholder.local");
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? input : "#";
  } catch {
    return "#";
  }
}
```

Apply the same check to `iframe` `src`, `window.location` assignments and post-login redirects.

### Direct DOM access

`ref.current.innerHTML = ...`, `document.write`, `eval`, `new Function` and third-party jQuery plugins bypass React and escape nothing.

### Data inside a script tag

If you embed JSON in a `<script>` tag (JSON-LD for SEO, for example), a `</script>` string inside the data closes the tag. Escape the `<` character:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }}
/>
```

### Spreading user-controlled props

`<div {...userProvidedObject} />` lets anyone pass any attribute, including `dangerouslySetInnerHTML` or `href`. Pass explicitly listed fields only.

## Markdown and user HTML

Markdown rendering is a frequent XSS source because Markdown allows embedded HTML.

- **react-markdown** does not render raw HTML by default, which makes it the safe option. If you add `rehype-raw`, also add `rehype-sanitize`.
- **marked, markdown-it** and similar libraries return an HTML string. Sanitize it before passing it to `dangerouslySetInnerHTML`.

```ts
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(rawHtml);
```

DOMPurify runs in the browser. For server-side sanitizing, use it with jsdom or the `isomorphic-dompurify` wrapper. Sanitize on output, not only on save, because sanitizer rules improve over time.

## Content Security Policy

**CSP** is a header that limits where the browser may load and run scripts from. If an XSS slips through, a strict policy stops the inline script from executing.

A basic strict policy with a nonce:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

In Next.js you set headers in the config, or generate them per request when you need a nonce. Note that nonces require dynamic rendering. Start with `Content-Security-Policy-Report-Only`, collect violations, and only then enforce. The directives are documented on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## Code review checklist

1. Search for `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`. Each one needs a justification.
2. Every `href` and `src` built from external data passes a scheme check.
3. Markdown renders without raw HTML, or through a sanitizer.
4. No spreading of unknown objects into props.
5. Session cookies use `HttpOnly`, `Secure` and `SameSite`.
6. A CSP is in place, at least in report-only mode.

## FAQ

### Do Next.js server components prevent XSS?

They escape text just like regular React. But `dangerouslySetInnerHTML` and unsafe URLs are just as dangerous on the server, because the HTML still runs in the browser.

### Is it OK to keep tokens in localStorage?

Any successful XSS can read them. For sessions, `HttpOnly` cookies are safer: scripts cannot read them, though they can still send requests on the user's behalf.

### Is a CSP enough on its own?

No. CSP is a second line of defense. The main protection is never inserting unchecked HTML or unsafe URLs in your code.
