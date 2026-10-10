---
title: How to Set Up Google Analytics 4 on Your Website
description: GA4 setup step by step: property and data stream, gtag or GTM, enhanced measurement, data retention, internal traffic filter and Google Ads linking.
summary: Create a GA4 property and web data stream, install the tag with gtag.js or Google Tag Manager, review enhanced measurement, extend data retention to 14 months, exclude internal traffic and link GA4 to Google Ads.
---
## The short answer: setup order

1. Create a GA4 **account** and **property**.
2. Add a **web data stream** and get an ID like `G-XXXXXXXXXX`.
3. Install the tag on your site with **gtag.js** or **Google Tag Manager**.
4. Review **enhanced measurement**.
5. Set **data retention** to 14 months.
6. Set up an **internal traffic filter**.
7. Link GA4 to **Google Ads**.

## Step 1. Property and data stream

In Admin, click "Create" and follow the wizard:

- **Account** — usually one per company.
- **Property** — one per product (a business's website and app can share one property). This is where you set the reporting **time zone** and **currency** — get them right from the start so days and revenue are counted correctly.
- **Data stream** — choose "Web", enter the site URL and a name.

Once the stream is created you will see the **Measurement ID** `G-...`, which you need for installation.

## Step 2. Installation: gtag.js or GTM

**Option 1: gtag.js.** Paste the snippet into the `<head>` of every page:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Option 2: Google Tag Manager.** Create a **Google Tag**, enter the `G-...` ID and use a trigger that fires on all pages (Initialization — All Pages). Publish the container.

| | gtag.js | Google Tag Manager |
|---|---|---|
| Complexity | One code snippet | Requires learning the interface |
| New events | Code changes | Interface changes, no site release |
| Other pixels | Each one in code separately | All in one container |

If you plan to add the Meta Pixel, Yandex Metrica and conversion events, **GTM is more convenient** in the long run.

Verify the installation: open your site and check the Realtime report — your visit should appear almost immediately.

## Step 3. Enhanced measurement

**Enhanced measurement** is enabled in the web stream settings. It automatically collects:

- page views, including page changes in SPAs via browser history;
- scrolls to the bottom of the page;
- outbound clicks;
- site search;
- engagement with embedded YouTube videos;
- file downloads;
- form interactions.

Turn off whatever creates noise. Form tracking, for instance, may fire on any form, including search — in that case a custom event for successful submission is more accurate.

## Step 4. Data retention

By default GA4 keeps detailed event-level data for **2 months**. In Admin → Data collection and modification → Data retention, switch it to **14 months**. This affects Explorations: without it you cannot compare year over year. Standard reports are not affected by this setting.

## Step 5. Internal traffic filter

Visits from your team and developers skew the numbers.

1. In the web stream settings, open "Configure tag settings → Define internal traffic" and add a rule for your office **IP address**.
2. In Admin → Data filters, find the **Internal Traffic** filter. It is created in the **Testing** state.
3. Confirm the filter flags the right traffic, then switch it to **Active**. Filtered-out data cannot be recovered.

## Step 6. Linking Google Ads

In Admin → Product links → Google Ads links, choose your ad account. Then:

- enable **auto-tagging** in Google Ads so clicks are attributed correctly;
- import GA4 **key events** into Google Ads as conversions;
- use GA4 audiences for remarketing.

If your site serves users in regions with cookie consent requirements, set up **Consent Mode** together with your consent banner.

## FAQ

### Can I run GA4 and Yandex Metrica at the same time?

Yes, they do not interfere with each other. Managing both through Google Tag Manager is the most convenient option.

### Why do GA4 numbers differ from my ad platform?

The systems use different attribution models, conversion windows and counting methods. Some users also block trackers. Small discrepancies are normal, so compare trends.

### What if no data shows up?

Open the Realtime report and Tag Assistant: check that the tag loads, the ID is correct and the ad blocker in your browser is turned off.
