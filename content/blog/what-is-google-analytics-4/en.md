---
title: What Is Google Analytics 4 and How Its Data Model Works
description: Google Analytics 4 for beginners: the event-based model, users, sessions, key events and standard reports, and how GA4 differs from Universal Analytics.
summary: Google Analytics 4 is Google's free analytics for websites and apps where everything, from a page view to a purchase, is recorded as an event with parameters; you mark the events that matter to the business as key events and read results in standard reports and explorations.
---
## Short answer

**Google Analytics 4 (GA4)** is Google's analytics service for websites and mobile apps. It answers three basic questions: **who** comes to you, **where from**, and **what they do** — view pages, click, submit forms, buy.

Its core idea: **every interaction is an event**. A page view, a scroll, a click on a phone number and a purchase are all recorded the same way: an event name plus parameters with details.

GA4 replaced **Universal Analytics**, which stopped processing data in 2023. The main shift is from a model built on sessions and pageviews to a model built on events and users.

## The data model: four building blocks

### Events

An **event** is anything a user does. GA4 has four kinds:

- **Automatically collected:** for example `first_visit`, `session_start`.
- **Enhanced measurement:** turned on with a switch, no code: page views, scrolls, outbound clicks, site search, file downloads, video and form interactions.
- **Recommended:** names Google suggests for common actions, such as `generate_lead`, `sign_up`, `purchase`.
- **Custom:** your own events when nothing above fits.

Each event carries **parameters**: page address, button text, order value. To use your own parameter in reports, register it as a **custom dimension** or metric.

Sending a lead event from a site where GA4 is installed with gtag.js:

```js
gtag('event', 'generate_lead', {
  form_name: 'contact',
  value: 1
});
```

### Users

GA4 counts **users** by a device and browser identifier, and optionally by your own **User-ID** for logged-in people. Reports show **active users** by default, along with **new users**.

### Sessions

A **session** starts with the `session_start` event and ends after a period of inactivity, 30 minutes by default. GA4 adds the idea of an **engaged session**: one that lasted longer than 10 seconds, included a key event or had at least two page views. **Engagement rate** is the share of such sessions; **bounce rate** in GA4 is simply its inverse.

### Key events

**Key events** are the events important to your business: a request, a call, a sign-up, a purchase. You mark any event as key in the admin panel, and GA4 then shows them across reports and attributes them to traffic sources. Earlier versions of GA4 called them conversions; Google Ads still uses that word.

## How data gets in

1. Create a **property** and a **data stream** for your site or app.
2. Install the tag: paste the gtag.js snippet with your measurement ID (it starts with `G-`), use Google Tag Manager, or a CMS integration.
3. Check enhanced measurement settings.
4. Send the events you need and mark the important ones as key events.
5. Link **Google Ads** and, if needed, **BigQuery** for raw data export.

## Standard reports

- **Realtime** — what is happening now; handy for checking that tracking works.
- **Acquisition** — where users and sessions come from: channels, sources, campaigns.
- **Engagement** — events, pages and screens, key events.
- **Monetization** — purchases and revenue, if e-commerce is set up.
- **Retention** — how often users come back.
- **User attributes and Tech** — geography, language, devices, browsers.

For questions the standard reports do not answer, use **Explorations**: free-form tables, funnels and path analysis.

## How GA4 differs from Universal Analytics

| | Universal Analytics | GA4 |
|---|---|---|
| Base unit | Session and pageview | Event |
| Goals | Separate "goals" settings | Any event marked as key |
| Website and app | Separate products | One property, several streams |
| Bounce rate | Single-page sessions | Inverse of engagement rate |
| Raw data | Paid tier only | BigQuery export available on the free tier |

## Common beginner mistakes

- Not marking any key events, so reports show traffic but not results.
- Counting the same form twice: enhanced measurement and a custom event.
- Using custom parameters without registering them as dimensions.
- Keeping the default short data retention, which limits explorations to recent months.
- Not filtering internal traffic from the team.

## FAQ

### Is GA4 free?

Yes, the standard version is free and fits most small and medium businesses. A paid version exists for large companies with high data volumes and extra service needs.

### Why do GA4 numbers differ from my ad account or CRM?

Each system counts differently: ad accounts count clicks, GA4 counts users and sessions on the site, a CRM counts real leads. Blocked cookies, ad blockers and attribution rules also play a role. Use each system for its own question rather than expecting identical figures.

### Can I see Universal Analytics data in GA4?

No. The two products have different data models, and historical Universal Analytics data does not move into GA4. Comparing old and new periods directly is not reliable either, because metrics are calculated differently.
