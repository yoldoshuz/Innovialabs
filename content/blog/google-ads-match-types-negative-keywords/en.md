---
title: Google Ads Keyword Match Types and Negative Keywords Guide
description: How broad, phrase and exact match behave in Google Ads today, how to read the search terms report and build negative keyword lists that stop wasted spend.
summary: Match type sets how far a search can drift from your keyword: broad covers related topics, phrase covers searches that include its meaning, exact covers searches with the same meaning. Irrelevant traffic is cut with negative keywords found in the search terms report.
---
## The short answer

In Google Ads a keyword is not the literal text of a search but a signal about a topic. The **match type** sets how widely Google may interpret it:

| Type | Syntax | Which searches can trigger the ad |
|---|---|---|
| Broad | `laptop repair` | Searches related in meaning, even without your words |
| Phrase | `"laptop repair"` | Searches that include the meaning of the keyword |
| Exact | `[laptop repair]` | Searches with the same meaning or intent |

All three include **close variants**: misspellings, singular and plural forms, synonyms, reordered words. So even exact match today does not mean "only this text".

## How each type behaves

**Broad match** has the widest reach. Google looks beyond the keyword at context: other keywords in the ad group, the landing page, the person's recent searches. "laptop repair" may show for "macbook won't turn on". Broad match works best together with Smart Bidding that optimizes for conversions. With manual bids and no conversion tracking it burns budget fast.

**Phrase match** shows ads on searches that include the meaning of your keyword, with extra words before or after it. Word order matters when it changes the meaning. "laptop repair" can show for "same day laptop repair in Tashkent", and you can block "laptop repair DIY" with a negative.

**Exact match** gives the tightest control. It shows on searches with the same meaning: "laptop repair", "repair laptop", "fix my laptop" — yes; "laptop repair price" usually not, because the intent is more specific.

## How to choose

- **Small budget, no conversion data yet** — phrase and exact.
- **Conversions tracked, using Maximize conversions or target CPA** — test broad and compare results.
- **Brand terms and your most expensive searches** — exact, to keep costs under control.

Avoid adding the same keyword in several match types within one ad group without a reason. Google picks the most relevant keyword itself, and duplicates only muddy the reports.

## The search terms report

This is your main tool for managing match types. It lists the actual searches that triggered impressions and clicks.

Where: **Keywords → Search terms** at campaign or ad group level.

How to read it:

1. Sort by cost or clicks.
2. Label each search as relevant, irrelevant or unclear.
3. Add relevant searches that convert well as exact or phrase keywords.
4. Add irrelevant ones as negatives.

Google hides some searches for privacy reasons; they are grouped as "Other search terms". That is expected — make decisions on the visible part.

## Negative keywords

Negatives behave differently from regular keywords: **they do not expand to close variants**. Excluding "free" will not block "freebie" — add forms and synonyms explicitly.

| Negative type | Syntax | What it blocks |
|---|---|---|
| Broad | `free` | Searches containing all the negative's words in any order |
| Phrase | `"do it yourself"` | Searches containing those words in that order |
| Exact | `[repair]` | Only that exact search |

Where to add them:

- **Ad group or campaign level** — for specific cases.
- **Negative keyword lists** in the Shared library — for common exclusions such as "jobs", "download", "free", "salary". One list can be applied to many campaigns.
- **Cross-negatives** between ad groups: if one group targets "iphone repair" and another "phone repair", add "iphone" as a negative in the second so searches land in the right group with the right ad.

## Common mistakes

- Not opening the search terms report for weeks after launch.
- Over-aggressive negatives: excluding "price" and losing buyers.
- Expecting one negative to block every form of the word.
- Broad match with manual bids and no conversions.

## FAQ

### How often should I review search terms?

Often in the first weeks after launch, while the core negative list is being built. Once few new irrelevant searches appear, a regular scheduled review is enough.

### Should I still use broad match modifier?

No, it no longer exists: its behaviour was folded into phrase match. Old keywords with plus signs now act as phrase match, and you cannot create new ones with that syntax.

### Why does exact match show my ad on other searches?

Because exact match includes close variants with the same meaning: word forms, misspellings, synonyms and reordered words. If a variant does not suit you, block it with an exact match negative.
