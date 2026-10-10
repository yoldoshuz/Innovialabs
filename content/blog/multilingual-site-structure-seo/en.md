---
title: Multilingual Website SEO: Subfolders, Subdomains or Domains
description: Compare three URL structures for language versions: subfolders, subdomains and separate domains. Pros, cons, geotargeting and language switcher tips.
summary: For most sites subfolders (/ru/, /en/, /uz/) are the best choice: they share one domain's authority and are easy to maintain. Separate domains make sense when each country is effectively a separate business.
---
## The short answer

If you are unsure, choose **subfolders**: `site.com/ru/`, `site.com/en/`, `site.com/uz/`. All language versions live on one domain, links to any of them strengthen the whole site, and maintenance stays simple.

**Subdomains** (`en.site.com`) and **separate domains** (`site.uz`, `site.de`) make sense in special cases: different teams, different infrastructure, different legal entities, or a strong need to signal locality through a country domain.

## The three options compared

| Criterion | Subfolders `/en/` | Subdomains `en.` | Domains `site.de` |
|---|---|---|---|
| Domain authority | Shared | Partly separate | Fully separate |
| Country signal | Via hreflang and content | Via hreflang and content | Strong (ccTLD) |
| Maintenance cost | Low | Medium | High |
| Separate infrastructure | Hard | Easy | Easy |
| Launching a new version | Fast | Medium | Slow |

### Subfolders

- **Pros:** one domain accumulates links and trust, one analytics setup, one certificate, one deployment.
- **Cons:** harder to host versions on different servers; a mistake in shared configuration affects every language.

### Subdomains

- **Pros:** versions can live on different hosting and CMS, convenient when separate teams run them.
- **Cons:** search engines may treat subdomains as separate sites, so each has to build authority on its own.

### Separate domains (ccTLD)

- **Pros:** the clearest "this site is for this country" signal for both search engines and people.
- **Cons:** each domain is promoted from scratch, more budget for content and links, and some country domains require a local entity or representative.

## Language and country are not the same

A common confusion: a Russian-language site is not necessarily aimed at Russia. Russian speakers live in Uzbekistan, Kazakhstan and many other countries. Decide first what you are targeting:

- **Language only** — `/ru/`, `/en/`, `/uz/` with hreflang language codes (`ru`, `en`, `uz`) is enough.
- **Language + country** — for example, different prices or delivery terms. Then use a structure like `/ru-uz/`, `/ru-kz/` and hreflang with regions (`ru-UZ`, `ru-KZ`).

Do not create regional versions if their content is identical: that only produces useless duplicates.

## Must-haves regardless of structure

- **One language, one URL.** Do not switch the page language by cookies or the `Accept-Language` header without changing the address: the crawler will only ever see one version.
- **hreflang** on every page, pointing to all its translations and to itself.
- **Full translation** — headings, menus, `title`, `description`, image alt text, not just the main body.
- **The canonical URL** points to the page itself in its own language, not to the main version.
- **The `lang` attribute** on `<html>` matches the page language.

## Language switcher: doing it right

- **Links, not scripts.** The switcher should be plain `<a href>` links to the same page in another language, not to the homepage.
- **Language names in their own language:** "Русский", "English", "O‘zbekcha". Flags are a poor choice: a flag means a country, not a language.
- **No forced redirects.** You can suggest "This page is available in your language" with a banner, but do not redirect automatically: it annoys people and confuses crawlers.
- **Remember the choice.** If a visitor picked a language, respect it on later visits.

## Common mistakes

- Machine translation without editing — pages look low quality and convert poorly.
- Mixed languages on one page: English menu, Russian text.
- The switcher leads to the homepage instead of the matching page.
- A language version is blocked from indexing or missing from the sitemap.
- Changing URL structure without 301 redirects from old addresses.

## FAQ

### Can the main language stay without a prefix and the others go in folders?

Yes, `site.com/` for the main language and `site.com/en/` for the others works. A uniform pattern for every language (`/ru/`, `/en/`, `/uz/`) is simply easier to maintain and more predictable for users.

### Should I move to separate domains if the site already uses subfolders?

Usually not. A migration needs redirects and temporarily puts traffic at risk. Consider a separate domain only when the business in that country is genuinely independent.

### Does hreflang help if the structure is poorly chosen?

hreflang helps the search engine show the right version, but it will not fix a weak structure: duplicates, partial translation or switching language without switching the URL.
