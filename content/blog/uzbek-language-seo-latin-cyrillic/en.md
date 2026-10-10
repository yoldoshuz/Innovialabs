---
title: SEO for Uzbek Content: Latin vs Cyrillic Script
description: How people search in Uzbek in two scripts, how search engines handle Latin and Cyrillic, and how to structure and mark up Uzbek content properly.
summary: Make Latin-script Uzbek your main version — it is the official alphabet. Add a Cyrillic version only if your audience really searches in Cyrillic, as a separate page with hreflang uz-Cyrl.
---
## The short answer

Uzbek lives in two alphabets. **Latin** is the official script and the standard for younger audiences, government services and most new websites. **Cyrillic** still appears in searches by older people, in some media and in familiar words.

For most projects the strategy is: **main version in Latin**, and a Cyrillic version only if your data shows demand for it. To a search engine `o‘zbek` and `ўзбек` are different strings, so one version does not automatically rank for queries in the other script.

## How people actually search

Uzbek queries are very inconsistent:

- **Two scripts:** "telefon ta’mirlash" and "телефон таъмирлаш".
- **Different apostrophes:** `o‘`, `o'`, a backtick instead of an apostrophe, or none at all — `ozbek`, `togri`.
- **Mixed with Russian:** "ремонт телефона Ташкент" and "telefon remont toshkent" in the same niche.
- **Transliteration:** `sh`, `ch`, `ng` instead of Cyrillic letters, and sometimes the reverse.

So before you start, check real queries: search suggestions, keyword research tools, webmaster tool data and your site's internal search.

## How search engines deal with it

- Search engines can partially match spelling variants, but **you cannot rely on it**: behavior differs between engines and changes over time.
- A page ranks primarily on the text it actually contains. If a page has no Cyrillic, it will show up weakly for Cyrillic queries.
- The `lang` attribute and hreflang help the search engine understand the page's language and script.

## How to structure Uzbek content

| Situation | What to do |
|---|---|
| Mostly young or B2B audience | Latin only, `/uz/` |
| A noticeable share of Cyrillic queries | Two versions: `/uz/` and `/uz-cyrl/` |
| You need to reach Russian speakers | A separate `/ru/` version |

If you build two Uzbek versions, they are **full separate pages**, not a script toggle on one URL.

## Markup

```html
<!-- on the Latin version -->
<html lang="uz-Latn">
<link rel="alternate" hreflang="uz-Latn" href="https://site.com/uz/" />
<link rel="alternate" hreflang="uz-Cyrl" href="https://site.com/uz-cyrl/" />
<link rel="alternate" hreflang="ru" href="https://site.com/ru/" />
```

If there is no Cyrillic version, `lang="uz"` and `hreflang="uz"` are enough.

## Practical rules

- **One character for the apostrophe.** Pick one symbol for `o‘` and `g‘` (for example `‘`) and use it across the whole site. Mixed characters break internal search and look sloppy.
- **Spelling variants, naturally.** If people search both "ta’mirlash" and "tamirlash", you can mention the second form in the text or FAQ, without keyword stuffing.
- **URLs in Latin without apostrophes:** `/uz/telefon-tamirlash/`. Special characters in addresses get encoded and become unreadable.
- **No unchecked auto-transliteration.** Mechanically converting Latin to Cyrillic produces errors in words with apostrophes and in loanwords.
- **Translate everything:** title, description, alt text, menus, structured data.

## Common mistakes

- The Uzbek version is an unedited machine translation from Russian.
- Latin and Cyrillic mixed on one page.
- One URL with a button that switches the script — the search engine sees only one variant.
- An Uzbek page marked `lang="ru"` because of a template.

## FAQ

### Should I build a Cyrillic version from the start?

Usually not. Launch the Latin version, collect query data and add Cyrillic if you see noticeable demand for it.

### Which apostrophe is correct for o‘ and g‘?

The official orthography defines a specific mark, but in practice people use different characters. For SEO consistency matters more: choose one and use it everywhere.

### Can Russian and Uzbek be combined on one page?

Better not. Search engines struggle to detect the language of such a page, and users find it hard to read. Separate versions connected with hreflang work better.
