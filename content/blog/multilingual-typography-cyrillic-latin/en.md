---
title: Designing for Cyrillic and Latin: Multilingual Typography
description: How to choose fonts for Russian and Uzbek (o‘, g‘, қ, ғ), plan for text length differences across languages and build layouts that survive translation.
summary: Choose a typeface with full Cyrillic support, including extended Cyrillic, test Uzbek o‘, g‘ and the apostrophe in it, design for the longest language without fixed widths, and test layouts with real translations rather than an English draft.
---

## The short answer

An interface in Russian, Uzbek and English runs into three problems:

1. **The font** must render Cyrillic and Latin with equal quality, including Uzbek-specific characters.
2. **Text length** varies by language, and the same button may not fit the translation.
3. **Language rules** — plurals, number and date formats — affect how strings are built.

All three are solved at the design stage, not after translation.

## How to choose a font

Check a typeface against a concrete list:

- **Cyrillic is properly designed, not bolted on.** Compare "ж", "ы", "д", "л" with Latin letters of the same weight — they should feel like one family in stroke, width and character.
- **There is a Cyrillic italic.** True Cyrillic italics change letterforms ("т", "д", "и"). Without a real italic, the browser just slants the upright, and it shows.
- **Extended Cyrillic.** Uzbek Cyrillic needs "ў", "қ", "ғ", "ҳ". In Google Fonts some of these live in the **cyrillic-ext** subset rather than the basic cyrillic one, so it has to be included explicitly.
- **Uzbek Latin marks.** The letters o‘ and g‘ use a mark that looks like a turned comma, while the tutuq belgisi (ma’lumot) uses an apostrophe. Make sure the characters you choose exist in the font and do not fall back to a mismatched glyph from a system font.
- **Enough weights.** At minimum regular, semibold and bold. Browser-synthesized bold looks crude.

Safe starting points are typefaces with broad language support: Inter, Manrope, Roboto, Noto Sans, IBM Plex Sans, PT Sans. You still need to test them on your own text.

A handy test string:

```text
O‘zbekiston, g‘oya, ma’lumot, sun’iy intellekt
Ўзбекистон, қоғоз, ғоя, ҳаёт
Съешь же ещё этих мягких французских булок
The quick brown fox jumps over the lazy dog
```

## The Uzbek apostrophe: what to know

Users type o‘ in different ways: with a plain apostrophe, a backtick or the correct typographic mark. That leads to practical rules:

- **In UI and content**, agree on one character and use it everywhere.
- **In search and filters**, normalize all variants to one, or "g‘oya" typed two ways becomes two different words.
- **In forms**, do not treat a plain apostrophe as an error.
- **In capitals**, check how O‘ and G‘ look in headings — in some fonts the mark sits too low or too far away.

## Text length across languages

Russian and Uzbek phrasing is often longer than English. Uzbek is agglutinative: suffixes attach to a word, and a single word can get very long ("foydalanuvchilarimizga"). What follows from that:

| Where it breaks | How to design |
|---|---|
| Buttons | Width fits content, not fixed; allow wrapping to two lines |
| Navigation | Spare room, or collapse into a menu when space runs out |
| Tables | Wrap column headers instead of truncating |
| Cards | No fixed height; get equal heights in a row from the grid |
| Large headings | Test long words, use `overflow-wrap` or careful hyphenation |

A time-saving habit: **lay out the design in the longest language first**, or use pseudo-localization — artificially lengthened strings that reveal weak spots before real translations arrive.

## Language rules that affect layout

- **Plurals.** Russian has three forms ("1 файл", "2 файла", "5 файлов"), Uzbek nouns do not change after a number ("5 ta fayl"), English has two forms. Do not glue strings from fragments — use plural-aware templates.
- **Word order.** "Delete file" and "Faylni o‘chirish" are built differently, so a variable may land in a different place in the string.
- **Numbers and dates.** Thousand and decimal separators and date formats differ: render them through localization tools, not hardcoded strings.
- **Text in images.** Any text inside an image needs a separate version per language — move text into the layout whenever possible.

## Common mistakes

- Choosing a font from its Latin specimen without checking Cyrillic.
- Loading only the basic Cyrillic subset, so "қ" and "ғ" render in a different font.
- Fixed button widths tuned for English.
- Truncating with an ellipsis where the full name matters.
- Testing layouts only with placeholder text.

## FAQ

### Can I use different fonts for Cyrillic and Latin?

You can, if they are paired by x-height, weight and character. It complicates maintenance and risks mismatches in mixed text, so a single typeface that handles both scripts well is usually more reliable.

### Which language should I design for first?

For your audience's main language, but test with the longest one. If the interface looks good in Uzbek or Russian, English will usually fit without trouble.

### How do I check that a font supports the characters I need?

Type a test string with all the special letters in Figma and in a browser. If a character looks different in weight or style, it is being substituted from a fallback font.
