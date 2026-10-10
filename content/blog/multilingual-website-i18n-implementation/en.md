---
title: How to Build a Multilingual Website: i18n in Practice
description: i18n in practice: URL strategy, translation files, locale detection, pluralization, date and number formats, using Russian, Uzbek and English as the example.
summary: A multilingual site rests on four decisions: a separate URL per language, translations in keyed files, gentle locale detection without forced redirects, and formatting numbers, dates and plurals with Intl.
---

## The short answer

**i18n** (internationalization) is preparing a site to work in several languages; **l10n** (localization) is the translations and adaptation themselves. To avoid rework later, build in from day one:

1. **A separate URL** for each language.
2. **Text in translation files**, not in code.
3. **Locale detection** without forced redirects.
4. **Formatting** of numbers, dates and plurals by each language's rules.

The example below is a site in Russian, English and Uzbek, where Uzbek exists in both Latin and Cyrillic script.

## URL strategy

| Option | Example | Pros | Cons |
|---|---|---|---|
| Subfolders | `site.uz/ru/`, `site.uz/en/` | Simple, one domain, shared SEO weight | — |
| Subdomains | `ru.site.uz` | Can be split across servers | More setup |
| Separate domains | `site.uz`, `site.com` | Strong country signal | Costly and complex |
| Parameter | `?lang=ru` | — | Bad for search |

For most projects **subfolders** are the best choice. For Uzbek you can use `/uz/` for Latin and `/uz-cyrl/` for Cyrillic. Link versions in markup with `hreflang` using `ru`, `en`, `uz-Latn`, `uz-Cyrl`, and add `x-default`.

## Translation files

Store strings in JSON by key, one file per language:

```json
{
  "nav": { "services": "Services", "contacts": "Contacts" },
  "form": { "submit": "Send request" }
}
```

Practical rules:

- **One source language** is the source of truth; the others are translated from it.
- **Keys by meaning** (`form.submit`), not by text.
- **Do not glue phrases** from pieces: word order differs between languages. Use placeholders: `"Hello, {name}"`.
- **Check for missing keys** in CI: if a key is absent from one file, the build should say so.

Uzbek Cyrillic can be produced by transliterating from Latin, but always proofread the result: automation stumbles on loanwords and apostrophes.

## Locale detection

- On the **root URL** `/` you can read the `Accept-Language` header and redirect to a suitable version.
- **Do not redirect** from explicit URLs like `/en/...`: users and crawlers must get exactly the page they asked for.
- Store the **user's choice** in a cookie and respect it on later visits.
- The language switcher should lead to **the same page** in another language, not to the home page.

## Plurals

English and Uzbek nouns have two forms; Russian has more: "1 товар", "3 товара", "5 товаров". Do not hand-write conditions — use `Intl.PluralRules`:

```ts
const rules = new Intl.PluralRules("ru");
const forms: Record<string, string> = {
  one: "товар", few: "товара", many: "товаров", other: "товара",
};

const label = (n: number) => `${n} ${forms[rules.select(n)]}`;
label(1);  // "1 товар"
label(3);  // "3 товара"
label(11); // "11 товаров"
```

Libraries such as i18next or next-intl do the same through ICU MessageFormat.

## Dates, numbers and currencies

```ts
new Intl.NumberFormat("ru").format(1234567.5); // "1 234 567,5"
new Intl.NumberFormat("en").format(1234567.5); // "1,234,567.5"
new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date());
```

Do not format by hand: thousands separators, decimal commas and day/month order differ. Support for `uz-Latn` and `uz-Cyrl` depends on the runtime, so check the output on the server and in browsers, and define your own format if needed.

## Common mistakes

- Country flags instead of language names in the switcher.
- The interface is translated, but **meta tags**, alt texts and emails are not.
- The same `title` on every language version.
- Layout breaks on long words: German and Uzbek text can be noticeably longer than Russian or English.

## FAQ

### Can I use machine translation?

As a draft, yes, but publishing without review by a native speaker is risky: both trust and the search quality of pages suffer.

### Do I need separate pages for Uzbek Latin and Cyrillic?

If your audience reads both scripts, yes, and they should be full versions with their own URLs and `hreflang`. If almost everyone reads Latin, start with that.

### Should page URLs be translated?

Translated slugs help users but complicate routing. A simple compromise is one shared Latin slug for all languages.
