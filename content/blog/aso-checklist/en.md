---
title: ASO Checklist: Title, Keywords, Screenshots and Ratings
description: A practical ASO checklist: keyword research, App Store and Google Play metadata limits, screenshots and video, listing localization and A/B tests.
summary: ASO is the work on your store page that helps people find your app for the right searches and install it more often. The core: keywords in the title and metadata, strong first screenshots, a localized listing, review management and regular A/B tests.
---

## What ASO is and what it consists of

**ASO (App Store Optimization)** is optimizing your app page in the App Store and Google Play. It has two goals:

- **Visibility** — the app appears for relevant searches and in featured collections.
- **Conversion** — someone who opens the page taps "Install".

Visibility depends on keywords, title, rating and install momentum. Conversion depends on the icon, screenshots, video, reviews and copy. Work on both: strong visibility with weak screenshots just wastes impressions.

## Step 1. Keyword research

- Write down **how users describe the problem**, not how you name the product: "expense tracker", not "next-generation finance manager".
- Check search suggestions in the stores and competitor pages: which words appear in their titles and subtitles.
- Rate each keyword on **relevance**, rough demand and competition. Broad high-volume terms are nearly out of reach for a new app — start with narrower queries.
- Build a separate list **for each language and country**: translated keywords often differ from what people actually type.

## Step 2. Metadata: what goes where

These limits have been stable for years, but check the store documentation before publishing.

| Field | App Store | Google Play |
|---|---|---|
| Title | up to 30 characters | up to 30 characters |
| Subtitle / short description | Subtitle, up to 30 | Short description, up to 80 |
| Keyword field | Keywords, up to 100 | none |
| Full description | up to 4000, barely affects search | up to 4000, indexed |
| Promotional text | up to 170, editable without a release | none |

Checklist:

- **Title**: brand plus your single most important keyword, no lists.
- **App Store**: don't repeat title or subtitle words in the Keywords field, separate keywords with commas and no spaces, and never use other companies' trademarks.
- **Google Play**: keywords should appear naturally in the short and full descriptions. Keyword stuffing breaks the rules, and terms like "best", "#1" or "free" in the title are banned by the metadata policy.
- Write the first lines of the full description for a human: what the app does and why it helps.

## Step 3. Screenshots and video

Search results show only the **first screenshots**, and they decide whether the page gets opened.

- One screenshot — **one benefit**, with a large 3–6 word caption.
- Show the outcome ("budget under control"), not a settings screen.
- The first screenshot carries the main value; the next ones cover key scenarios.
- Prepare sizes for every required device; Google Play also needs a **feature graphic**.
- App Store preview videos autoplay muted, so the video must make sense without sound and open with its strongest seconds.

## Step 4. Ratings and reviews

- Use the **system APIs**: `requestReview` (StoreKit) on iOS and the **In-App Review API** on Google Play. Both systems limit how often the prompt appears.
- Ask **after a success moment**: a completed order or finished level, not on first launch.
- Don't ask "Do you like the app?" before the system prompt — Google Play guidance explicitly discourages it, and Apple requires the built-in mechanism.
- **Reply to reviews**, especially negative ones: replies are visible to everyone reading the page.

## Step 5. Listing localization

- Localize **screenshots** too, not just text: captions, currencies, sample data.
- Research keywords from scratch for each language.
- For CIS markets a Russian listing is usually the minimum; check the supported languages in the store console.

## Step 6. A/B testing the store page

- The App Store offers **Product Page Optimization** (icon, screenshots, video tests) and **Custom Product Pages** for ad campaigns.
- Google Play offers **Store listing experiments** and **custom store listings** for countries and audiences.
- Change **one variable** per test and wait for enough data, not the first "winner" after two days.

## Common mistakes

- A slogan title with no keywords.
- Screenshots that are bare UI with no captions.
- One English listing for every country.
- Asking for a rating right after install.
- Doing ASO once and forgetting it: revisit metadata with every notable update.

## FAQ

### How long until ASO shows results?

Screenshot changes affect conversion as soon as they go live. Keyword rankings move more slowly and depend on store indexing, competition and install momentum, so judge results over several weeks.

### Does the full description affect App Store search?

App Store search relies mainly on the title, subtitle and keyword field. The full description matters for conversion, and on Google Play it is also indexed.

### Can I buy reviews to boost my rating?

No. It breaks both stores' rules and can get reviews or the app removed. The reliable route is asking at the right moment and responding quickly to complaints.
