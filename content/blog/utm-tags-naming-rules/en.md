---
title: How to Create UTM Tags: Naming Rules and a Ready Template
description: A consistent UTM naming convention, a ready template, dynamic parameters for Google Ads, Meta and Yandex Direct, and mistakes that split reports.
summary: Write UTM tags in lowercase Latin letters only, with no spaces, using one approved list of values for source and medium, and rely on dynamic parameters inside ad platforms. Then every channel shows up as one row in reports instead of ten variations.
---
## The short answer

**UTM tags** are link parameters that tell analytics where a visitor came from. There are five:

| Parameter | Meaning | Example |
|---|---|---|
| `utm_source` | The platform | `google`, `facebook`, `yandex`, `telegram` |
| `utm_medium` | The traffic type | `cpc`, `paid_social`, `email`, `referral` |
| `utm_campaign` | The campaign | `brand_search_2026_10` |
| `utm_content` | The ad or creative | `video_15s_a` |
| `utm_term` | Keyword or audience | `crm_for_business` |

The first three are required. What matters most is not the tags themselves but a **shared dictionary**: the same channel is always named the same way.

## Naming rules

1. **Lowercase only.** Analytics is case-sensitive: `Facebook` and `facebook` become two sources.
2. **Latin letters, digits, `_` or `-`.** No spaces, non-Latin characters or symbols — they get encoded as `%D0%...` and become unreadable.
3. **One separator company-wide.** Pick `_` or `-` and never mix them.
4. **A fixed list for source and medium.** Only the person responsible for analytics adds new values.
5. **Build campaign names from blocks**: `product_goal_geo_date`, for example `crm_leads_tashkent_2026_10`.
6. **Don't repeat information.** If the source is `google`, the campaign name doesn't need "google".
7. **Use standard medium values** that GA4 recognizes: `cpc` for paid search, `email`, `referral`, `social`, or values containing `paid` for paid social. That way traffic lands in the right channel group. Check the exact grouping rules in the Google Analytics documentation.

## A ready template

Keep one shared spreadsheet (Google Sheets is enough) with these columns:

| Date | Channel | source | medium | campaign | content | term | Base URL | Final link | Owner |
|---|---|---|---|---|---|---|---|---|---|

Build the final link (column I) with a formula instead of by hand:

```text
=H2&"?utm_source="&C2&"&utm_medium="&D2&"&utm_campaign="&E2&"&utm_content="&F2&"&utm_term="&G2
```

If the base URL already contains `?`, replace the first `?` in the formula with `&`.

Keep a **dictionary** of allowed values on a separate sheet and attach dropdown data validation to the source and medium columns, so typos become impossible.

**URL builders** work too: Google's Campaign URL Builder and Yandex's equivalent. Even then, values come from your dictionary.

## Dynamic parameters in ad platforms

Instead of tagging each ad by hand, ad platforms can fill in values themselves.

**Google Ads.** Turn on **auto-tagging** (gclid) — it connects Google Ads with GA4. You can add ValueTrack parameters in the tracking template:

```text
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

**Meta Ads.** In the ad's URL parameters field:

```text
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

If you insert names dynamically, name campaigns in the ad account by the same rules: Latin, lowercase, no spaces.

**Yandex Direct.** The yclid parameter is added automatically when Metrica is linked. For UTM, use Direct's parameters:

```text
utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}
```

Check each platform's help center for the current list of parameters — it expands over time.

## Mistakes that split your data

- **Inconsistent case and spelling**: `fb`, `facebook`, `Facebook.com` — three sources instead of one.
- **UTM tags on internal links**: a click on an on-site banner overwrites the original source, and a paid visit turns into an "internal" one.
- **Redirects that strip parameters**: confirm that the tags are still in the address bar after the redirect.
- **Spaces and non-Latin characters** in dynamically inserted campaign names.
- **Organic posts tagged without a system**: one team writes `instagram`, another `ig`.
- **No record in the spreadsheet**: three months later nobody remembers what `test2_new` meant.

## FAQ

### Do I need UTM tags if Google Ads auto-tagging is on?

For Google Ads and GA4, auto-tagging is usually enough. UTM tags still help when you analyze traffic in other systems — Yandex Metrica, your CRM, end-to-end analytics — that cannot decode gclid.

### How should I tag links in Telegram and newsletters?

The same way, from the dictionary: for example `utm_source=telegram&utm_medium=social` for channel posts and `utm_source=newsletter&utm_medium=email` for newsletters. The key is one variant for the whole project.

### Do UTM tags affect SEO?

Not by themselves, but tagged links should not be used for internal linking or in the sitemap. For pages opened with parameters, set a canonical URL without tags.
