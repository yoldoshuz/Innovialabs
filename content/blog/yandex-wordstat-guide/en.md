---
title: How to Use Yandex Wordstat for Keyword Research
description: A practical guide to Yandex Wordstat: quote, !, + and - operators, regional filters, seasonality, device split and reading search volumes correctly.
summary: Wordstat shows how many times per month a query and all its extensions appeared in Yandex; to see real demand for a specific phrase, use operators such as quotes and ! together with a regional filter.
---

## What Wordstat shows

**Yandex Wordstat** is Yandex's free service with search query statistics. The key point: the number next to a query is the **number of search result impressions per month**, not the number of people. By default it includes **every query containing your words** in any order and form.

For example, the volume for "apartment renovation" includes "apartment renovation prices", "turnkey apartment design and renovation" and so on. So the headline number almost always overstates demand for a specific phrasing.

## Operators

| Operator | Example | What it does |
|---|---|---|
| `" "` | `"apartment renovation"` | Only queries made of these words, nothing added |
| `!` | `!apartment !renovation` | Fixes the exact word form |
| `+` | `renovation +in apartment` | Counts a stop word (preposition, conjunction) |
| `-` | `apartment renovation -free` | Excludes queries with this word |
| `[ ]` | `[tickets moscow tashkent]` | Fixes word order |
| `( \| )` | `renovation (apartment \| house)` | Combines variants in one query |

Operators can be combined. The most common pattern is **quotes with exclamation marks**: `"!apartment !renovation"`. This gives the exact volume of the phrase in that form. Operators matter most for Russian and Uzbek, where words change form.

## How to read volumes

Look at three levels:

1. **Broad** — `apartment renovation`: overall interest including all long tails.
2. **Phrase** — `"apartment renovation"`: exactly these words in any form.
3. **Exact** — `"!apartment !renovation"`: the phrase in a specific form.

If the broad volume is large but the phrase volume is near zero, people rarely type that query as is — demand is spread across long tails. Those tails are what you should collect.

## Region

Volume depends heavily on region. If you operate in one city, **select it in the region filter** — otherwise you see demand from Yandex's entire audience, most of which is irrelevant to you. For businesses delivering nationwide, check both the total and the split by major cities.

Remember that Wordstat reflects only Yandex users. Where most people search on Google, its data is useful for comparing queries with each other, not for sizing the whole market.

## Seasonality

The **dynamics** view shows how volume changed by month or week. It helps you:

- launch content and ads **before peak demand**, not during it;
- avoid mistaking a seasonal dip for a site problem;
- spot rising topics before competitors.

Compare the same months across years, not adjacent months.

## Devices

Wordstat lets you view statistics separately for **desktops, phones and tablets**. If most demand comes from phones, make sure the mobile version of key pages is fast and convenient — that is what most users will see.

## Workflow

1. Enter a seed query without operators and review the left column of extensions.
2. Mark useful long tails; add irrelevant words to a negative list.
3. Check phrase and exact volumes for each candidate.
4. Set the right region.
5. Review dynamics and device split.
6. Move the results into your semantic core table.

## Common mistakes

- **Treating broad volume as demand** for a specific phrase.
- **Forgetting the region** and planning around country-wide or global numbers.
- **Ignoring low-volume queries** — they are often easier to rank for and reflect intent more precisely.
- **Ignoring seasonality** when evaluating results.

## FAQ

### Why is the sum of long-tail volumes larger than the seed query's?

It is not a bug: each long tail includes its own extensions, so the same queries are counted in several rows. Never add up volumes from the left column.

### Is Wordstat useful for estimating Google demand?

Only indirectly. It reflects Yandex users' behavior. For Google, use Keyword Planner and Search Console; use Wordstat to compare phrasings with each other.

### Do I need an account to use Wordstat?

You need to sign in with a Yandex ID. The service itself is free.
