---
title: Google Consent Mode v2: What It Is and How to Implement It
description: How Google Consent Mode v2 works: the four consent signals, basic vs advanced mode, consent banner integration, conversion modeling and EU requirements.
summary: Consent Mode v2 is how your site tells Google tags what a visitor agreed to, and the tags adjust: without consent they skip cookies, and Google partly recovers lost conversions through modeling. For advertising to EEA traffic, sending these signals is mandatory.
---

## The short answer

**Consent Mode** is an API in gtag.js and Google Tag Manager that passes the visitor's consent state to Google Ads and GA4 tags. It does not ask the visitor anything itself: your cookie banner collects consent, and Consent Mode delivers the result to the tags.

Version 2 added two signals to the existing ones. The full set for ads and analytics:

| Signal | Controls |
|---|---|
| `ad_storage` | cookies and storage for advertising |
| `analytics_storage` | cookies for analytics (GA4) |
| `ad_user_data` | whether user data may be sent to Google for ads |
| `ad_personalization` | whether data may be used for personalization and remarketing |

Each signal is either `granted` or `denied`.

## How it works technically

The logic is always the same: **a default state first, then an update**.

1. Before any tag loads, you set a `default`, usually everything `denied` in regions that require consent.
2. The visitor makes a choice in the banner.
3. The banner calls `update` with the new values.

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
</script>
```

When the visitor clicks "Accept", the banner calls `gtag('consent', 'update', {...})` with `granted` for the allowed categories. `wait_for_update` gives the banner time (in milliseconds) to load before the first hits go out. The `region` parameter lets you set different defaults per country.

## Basic vs advanced mode

| | Basic | Advanced |
|---|---|---|
| Tags before consent | Blocked | Load immediately |
| Data without consent | Nothing is sent | **Cookieless pings** without identifiers |
| Modeling | Generic model, less precise | Model trained on your site's data, more precise |
| Risk and effort | Easier to clear with legal | Confirm that pings are acceptable in your jurisdiction |

**Basic mode** is the conservative option: until consent, Google receives nothing. **Advanced mode** sends anonymous signals (that an event happened, no cookies), which gives Google more material for modeling. The choice is as much your privacy lawyer's call as a technical one.

## Conversion modeling

When a visitor declines cookies, a click on an ad cannot be directly linked to a purchase. Google fills the gap with **modeling**: it uses the behavior of consenting users to estimate how many conversions came from those who declined.

What to keep in mind:

- Modeled conversions appear in Google Ads reports next to observed ones and feed automated bidding.
- GA4 has separate **behavioral modeling**, but it only switches on above certain traffic and daily event thresholds, so a small site may not get it.
- A model is an estimate, not a fact. Check trends against your CRM.

## When Consent Mode is required

Since 2024, Google requires consent signals if you use advertising features (remarketing, personalization, conversion measurement) for users in the **European Economic Area**, as well as the UK and Switzerland. Without `ad_user_data` and `ad_personalization`, audiences and measurement for that traffic degrade.

If your audience is only in Uzbekistan or the CIS, Google's requirement does not formally apply. But if a noticeable share of traffic comes from the EU, or you plan to advertise there, implement it now. Also check local personal data law: Consent Mode does not replace compliance with it.

## Banner integration, step by step

1. **Pick a CMP** (consent management platform) that supports Consent Mode v2. For AdSense, Ad Manager and AdMob in the EEA, Google requires a certified CMP.
2. **Connect it via GTM**: most CMPs ship a tag template. Fire it on the *Consent Initialization – All Pages* trigger so the `default` runs before every other tag.
3. **Enable consent overview** in the GTM container settings and review which Google tags have built-in consent checks and which third-party tags need checks added manually.
4. **Set regions**: strict defaults for the EEA, looser ones elsewhere if your policy allows it.
5. **Optionally** enable `url_passthrough` (passes click parameters in URLs without cookies) and `ads_data_redaction` (drops ad identifiers when consent is denied).

## How to verify the setup

- In **Tag Assistant**, open the Consent tab to see the default and updated states.
- In DevTools, the Network tab shows `gcs` and `gcd` parameters on Google requests; they encode the consent state.
- Google Ads conversion diagnostics show the Consent Mode status.

Common mistakes:

- The `default` fires **after** the first tags, so early hits go out with no status.
- The banner updates only `ad_storage` and `analytics_storage` and forgets the two new signals.
- Meta, TikTok and other tags keep running without consent: Consent Mode only governs Google tags.

## FAQ

### Can I implement Consent Mode without GTM?

Yes. Call `gtag('consent', 'default', ...)` in the page code before gtag.js loads and `update` from the banner's handler. GTM just makes management and debugging easier.

### Does Consent Mode make my site GDPR compliant?

No. It only passes the visitor's choice to Google tags. Compliance depends on your banner, privacy policy, list of data processors and how you handle data overall.

### Why did conversions drop after implementation?

Some visitors decline cookies, so observed conversions go down. Modeled conversions appear with a delay and not in every account: with low data volume, modeling may not activate.
