---
title: 301 vs 302 Redirects: Differences and SEO Impact
description: Learn the difference between permanent and temporary redirects, codes 307 and 308, meta refresh, redirect chains and loops, and which type to use when.
summary: A 301 tells search engines a page has moved for good and the old URL should be replaced in the index, while a 302 says the move is temporary and the old URL should be kept; for changed addresses you almost always need a 301.
---
## The key difference

A **redirect** is a server response that sends browsers and crawlers from one URL to another.

- **301 Moved Permanently** — the page has moved **for good**. Search engines replace the old URL with the new one in the index and transfer signals to it.
- **302 Found** — the move is **temporary**. Search engines usually keep the old URL indexed because they expect it to come back.

A simple rule: if the old address will never return, use **301**. If it will, use **302**.

## What 307 and 308 are

Codes 307 and 308 were introduced to remove ambiguity around HTTP methods. Browsers historically could turn a POST request into GET on a 301 or 302.

| Code | Type | Request method preserved |
|---|---|---|
| 301 | permanent | not guaranteed |
| 302 | temporary | not guaranteed |
| 307 | temporary | yes |
| 308 | permanent | yes |

For SEO, **308 behaves like 301** and **307 like 302**. For ordinary pages opened with GET, the difference is barely noticeable. 307/308 matter for APIs and forms.

Note: a browser may show a "307 Internal Redirect" when HSTS is enabled for a domain. That is internal browser behavior, not a response from your server.

## Which redirect to use when

| Situation | Code |
|---|---|
| Moving to a new domain | 301 |
| Switching from HTTP to HTTPS | 301 |
| Merging www and non-www | 301 |
| Changing URL structure, removing a page that has a replacement | 301 |
| Temporary promotion or maintenance page | 302 |
| A/B test with different URLs | 302 |
| Redirecting by language or location | 302, ideally letting the user choose |
| Redirecting POST requests in an API | 307 or 308 |

If a temporary 302 stays in place for months, Google may eventually start treating it as permanent. Do not rely on that: set the right code from the start.

## Meta refresh and JavaScript redirects

A redirect can also be done inside the page:

```html
<meta http-equiv="refresh" content="0; url=https://example.com/new-page">
```

Google generally treats an instant meta refresh as permanent and a delayed one as temporary. A JavaScript redirect is seen only after the page is rendered. Both are fallbacks for when you cannot change server settings. **A server-side redirect is always more reliable.**

## Chains and loops

A **chain** is when A points to B, B to C, and C to D. Every hop slows loading, wastes crawl resources, and search engines only follow a limited number of hops.

A **loop** is when A points to B and B points back to A. The page never loads, and the browser shows an error.

How to avoid them:

- Point old URLs **straight to the final address**, not through intermediate ones.
- After each migration, update old rules so they do not point to URLs that have become redirects themselves.
- Update internal links to the new URLs instead of relying on redirects.
- Check chains with a site crawler or from the command line:

```bash
curl -sIL http://example.com/old-page | grep -iE "^(HTTP|location)"
```

## An nginx example

Merging HTTP and www into one address in a single hop:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

## Common mistakes

- Using 302 for a site move "just in case".
- Redirecting every deleted page to the homepage. Search engines may treat that as a soft 404; point to a closely related section or return 404/410 instead.
- Testing a 301 in a browser without clearing the cache: browsers remember permanent redirects for a long time.
- Forgetting sitemap.xml: it should list only final URLs.

## FAQ

### Does a 301 redirect lose page authority?

Google states that 3xx redirects do not cause a loss of ranking signals. Chains and imprecise redirects to irrelevant pages still hurt, though, so careful setup matters.

### How long should I keep a 301 after a move?

As long as possible, at least until the new URLs have fully replaced the old ones in the index and the old addresses no longer receive traffic. People may follow old links from other sites for years.

### Which should an API use: 301 or 308?

For APIs and forms, use 308 for a permanent move and 307 for a temporary one: they guarantee that the request method and body stay unchanged.
