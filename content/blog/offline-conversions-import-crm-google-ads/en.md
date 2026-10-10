---
title: How to Import Offline Conversions from CRM into Google Ads
description: How to store the GCLID with each lead, send deal stages and revenue from your CRM back to Google Ads, set up enhanced conversions for leads and improve bidding.
summary: Store the GCLID in your CRM with every lead, and when a lead becomes qualified or turns into a payment, send that conversion with its value back to Google Ads; bidding then optimises for real sales instead of form fills.
---
## The short answer: why and how

By default, Google Ads only sees what happens on the website: form submissions, calls, messenger clicks. But a lead is not a sale. Some leads are irrelevant, some never pay, and deals vary widely in value.

**Offline conversion import** closes that gap:

1. When someone clicks an ad, Google adds a click identifier, the **GCLID**, to the URL.
2. The website stores it and passes it to the CRM with the lead.
3. As the deal progresses, the CRM sends an event to Google Ads: GCLID, conversion name, time and value.
4. Google links the event to the click and teaches the algorithm to find similar buyers.

## Step 1. Store the GCLID with the lead

Make sure **auto-tagging** is enabled in the account. Then save the parameter on the first visit and put it into a hidden form field:

```js
const params = new URLSearchParams(location.search);
const gclid = params.get('gclid');
if (gclid) {
  try { localStorage.setItem('gclid', gclid); } catch {}
}

// on form submit
const field = document.querySelector('input[name="gclid"]');
if (field) field.value = localStorage.getItem('gclid') || '';
```

Users may arrive from an ad, leave and come back later, so the value is stored rather than read only from the current URL. The Google tag with conversion linking enabled also writes the GCLID to its own first-party cookie.

In the CRM, add a dedicated **GCLID** field on the lead or deal and make sure it survives when a lead is converted into a deal.

## Step 2. Create conversions for deal stages

In Google Ads, create conversions of type **Import → from CRMs, files or other data sources → track conversions from clicks**. Two or three are usually enough:

| Conversion | When to send | Role in bidding |
|---|---|---|
| Qualified lead | A manager confirms the prospect is a fit | Primary while deals are few |
| Deal won | Contract signed or payment received, with value | Primary once volume is sufficient |
| Website lead | Form submission | Secondary, for observation |

The algorithm needs **enough conversion volume**. If payments are rare, optimise for qualified leads and send deals as an additional signal.

## Step 3. Send data from the CRM

Options from simplest to most advanced:

- **Manual CSV upload** in the conversions section — good for validating the setup.
- **Scheduled uploads** from Google Sheets, via HTTPS or SFTP.
- **Native CRM integrations** with Google Ads or connector services.
- **Google Ads API** — for a custom CRM and full automation.

Minimal file format:

```csv
Parameters:TimeZone=Asia/Tashkent
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
EAIaIQobChMI...,Deal won,2026-10-01 14:30:00,1200,USD
```

Important:

- the **conversion name** must exactly match the one created in Google Ads;
- the **conversion time** must be after the click time, with the correct time zone;
- upload regularly: Google Ads accepts conversions for a click only within a limited window; check the help centre for the current limit.

## Enhanced conversions for leads

The GCLID gets lost more often than you might expect: people call instead of filling in a form, switch devices or clear cookies. **Enhanced conversions for leads** solve this with customer data:

1. On the website, the Google tag sends **hashed email or phone** when the form is submitted.
2. When the deal closes, you upload the conversion with the same hashed email or phone from the CRM.
3. Google matches them without a GCLID.

You need to enable the feature in conversion settings and accept the customer data terms. Data is normalised (lowercase, no spaces) and hashed with SHA-256 — by the Google tag or your integration. Details are in the Google Ads help centre.

## How this improves bidding

Once real deals with values reach Google Ads, you can move to **Maximize conversion value** or **target ROAS**. The algorithm starts prioritising queries and audiences that bring revenue, not just leads. It also exposes campaigns that generate many cheap but irrelevant leads.

## Common mistakes

- The GCLID is saved on the lead but not carried over to the deal.
- Wrong time zone — the conversion appears to happen "before" the click and is rejected.
- The same event is uploaded twice.
- Switching to value-based bidding with too few deals.

## FAQ

### What about leads that come in by phone?

Use call tracking that passes the GCLID to the CRM, or enhanced conversions for leads matched on the phone number.

### How often should I upload conversions?

The closer to the event, the better for the algorithm. An automated daily upload is a reasonable minimum.

### Do I still need the GCLID if enhanced conversions for leads are set up?

It is best to keep both: the GCLID gives exact matching, and customer data helps when the click ID is lost.
