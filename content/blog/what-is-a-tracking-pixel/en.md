---
title: What Is a Tracking Pixel and How Meta and TikTok Pixels Work
description: How a pixel collects website events, why ad optimization and audiences depend on them, how browsers and ad blockers limit pixels, and how to check one fires.
summary: A pixel is a snippet of an ad platform's code on your site that sends it events such as page views, leads and purchases. Meta and TikTok use this data to optimize delivery, count conversions and build audiences, so pixel accuracy directly shapes ad performance.
---

## The short answer

A **pixel** is a piece of JavaScript from an ad platform that you install on your website. When a visitor does something, such as opening a page, adding a product to the cart or submitting a form, the pixel sends the platform an **event** with parameters.

The name dates back to when tracking used an invisible 1×1 pixel image. Today it is a full script, though the image sometimes remains as a fallback for browsers without JavaScript.

Every major ad system has one: **Meta Pixel**, **TikTok Pixel**, the Google Ads tag. In Yandex Metrica, the counter plays a similar role.

## How a pixel collects events

1. The base code loads on every page and sends a page view event.
2. At key steps you fire **standard events**: view content, add to cart, initiate checkout, lead, purchase. Meta and TikTok use their own event names, but the logic is the same.
3. You attach **parameters** to events: value, currency, product IDs. Without value, the platform cannot calculate ROAS.
4. The platform matches the event to a user through its own cookies, logged-in account data and, if you send them, hashed contact details.

A purchase event for Meta Pixel looks like this:

```js
fbq('track', 'Purchase', { value: 49.90, currency: 'USD' });
```

## Why ads need it

- **Optimization.** The algorithm learns from your conversions and looks for people similar to those who bought. The more accurate events it gets, the better the targeting.
- **Reporting.** The platform shows how many leads and sales each campaign produced and calculates cost per action.
- **Audiences.** Retargeting people who viewed a product but did not buy, excluding existing buyers and building lookalike audiences from customers.

## What limits pixels

- **Browser privacy protections.** Safari and other browsers shorten cookie lifetimes and block third-party cookies. Some users get "lost" between visits.
- **Ad blockers** cut off requests to ad platform domains, so events never arrive.
- **User consent.** In some jurisdictions, the pixel must not run before cookie consent, so some events are legitimately never sent.
- **iOS restrictions** affect tracking inside apps and in traffic coming from them.

The platforms' answer is **server-side event sending**: Meta's Conversions API and TikTok's Events API. Events go directly from your server, so they depend less on the browser. The usual setup combines the pixel with a server channel and removes duplicates using a shared **event_id**.

## How to check a pixel fires

1. **Helper extensions**: Meta Pixel Helper and TikTok Pixel Helper for Chrome show which events fired on a page and flag errors.
2. **Test events** in Events Manager (on both Meta and TikTok): open your site in test mode and watch events arrive in real time.
3. **DevTools → Network.** Filter requests by the platform's domain and confirm the event was sent with parameters filled in.
4. **Walk the whole path**, from product view to the thank-you page. Make sure the purchase is sent once, not on every page refresh.
5. **Reconcile numbers**: compare purchases in the ad account and in your CRM for the same period. They will never match exactly, but a large gap means something is broken.

## Common mistakes

- The pixel is installed but only sends page views, so there is nothing to optimize for.
- Purchase events without value and currency.
- Double installation: the pixel is hardcoded and also added through Google Tag Manager.
- The purchase fires whenever someone opens the thank-you page directly by URL.

## FAQ

### Do I need a pixel if I am not running ads?

If you have no ads and none are planned, there is no reason to install it. If ads are planned, install it in advance: accumulated events and audiences will help when campaigns start.

### Is a pixel the same as Google Analytics 4 or Yandex Metrica?

No. Analytics systems show you what happens on your site. A pixel sends events to an ad platform for optimization and audiences. You usually need both.

### Can I use only server-side sending without a pixel?

Technically yes, but most setups use both channels: the pixel captures browser signals and the server covers losses. Configure deduplication so one purchase is not counted twice.
