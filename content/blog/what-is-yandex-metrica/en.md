---
title: What Is Yandex Metrica and What Can It Track
description: Yandex Metrica explained: the counter, goals, Webvisor session recordings, click maps, standard reports, privacy settings and when it suits CIS audiences.
summary: Yandex Metrica is a free web analytics service from Yandex that counts visits, sources and goals and, unlike most free tools, includes session recordings (Webvisor) and click and scroll maps, which makes it popular for sites with audiences in the CIS.
---
## Short answer

**Yandex Metrica** is a free web analytics service. After you add its code (the **counter**) to your site, it shows how many people come, where they come from, what they do and which of them complete your goals.

What sets it apart is that behaviour tools come built in: **Webvisor** replays real visits like a video, and **maps** show where people click and how far they scroll. In many other setups that requires a separate product.

## The counter

The counter is a JavaScript snippet that you create in the Metrica interface and add to every page, usually in the `<head>`. When creating it, you choose options such as:

- **Webvisor** — record visits for playback.
- **Click map** — collect click data.
- **Accurate bounce rate** — count a visit as non-bounce if the person stayed on the page for a while.
- **E-commerce** — read order data from the `dataLayer`.

You can install it directly, through Google Tag Manager, or with a CMS plugin. After installation, check the counter status in the interface and open your site to see the visit appear.

## Goals

A **goal** is an action you want to count: a request, a call, a purchase. Main goal types:

- **Page visit** — a thank-you page or checkout URL was opened.
- **JavaScript event** — your site sends a signal from code, for example after a successful form submission.
- **Contact clicks** — clicks on a phone number, email or messenger link.
- **Form submission** — sending any form on the page.
- **Number of page views** — the visitor viewed at least N pages.
- **Composite goal** — several steps in order, which works like a small funnel.

Sending a JavaScript goal (replace the number with your counter ID):

```js
ym(12345678, 'reachGoal', 'lead_form');
```

Goals then appear as a dimension in every report, so you can see which sources, pages and devices bring results.

## Webvisor and maps

- **Webvisor** records mouse movements, clicks, scrolling and transitions between pages. Watching a few dozen recordings of people who left the order form often explains more than any table.
- **Click map** shows where people click, including on elements that are not links.
- **Link map** shows how often each link is used.
- **Scroll map** shows how far down the page people get and where they spend the most time.
- **Form analytics** shows which fields people fill in and where they abandon the form.

## Standard reports

- **Sources** — summary of traffic sources, search engines, social networks, ad systems and UTM tags.
- **Conversions** — goal completions by source and over time.
- **Attendance** — visits, visitors, page views, bounce rate.
- **Audience** — geography, age and gender estimates, interests.
- **Technology** — devices, browsers, screen sizes.
- **E-commerce** — orders and revenue, if configured.

In Metrica, a **bounce** is a visit with only one page view that lasted less than 15 seconds. For large volumes, reports can use **sampling**; there is a setting to raise accuracy at the cost of speed. Raw visit and hit data is available via the **Logs API**.

## Privacy

Webvisor sees what users do, so treat it carefully:

- Do not record the contents of fields with personal data. Use the Webvisor settings for field content and mark sensitive blocks with the `ym-hide-content` class.
- Mention analytics and cookies in your **privacy policy**, and show a cookie notice where your audience or law requires one.
- Check the requirements of local personal data legislation, including where data is processed. In Uzbekistan this is the Law on Personal Data.
- Give access to the counter only to people who need it, with view-only rights where possible.

## When Metrica is especially useful

- Your audience is in Uzbekistan, Kazakhstan or other CIS countries, where Yandex search and services are widely used.
- You run **Yandex Direct**: Metrica goals can be used for ad optimisation and audience building.
- You want session recordings and click maps without paying for a separate tool.
- Your team prefers a Russian-language interface.

Many sites run Metrica alongside Google Analytics 4: each covers its own ad ecosystem, and comparing them helps catch tracking errors.

## FAQ

### Is Yandex Metrica free?

Yes, the service, including Webvisor and maps, is free to use. Limits mainly concern data volume and how long some data, such as Webvisor recordings, is stored.

### Does the Metrica counter slow down the site?

The code loads asynchronously, so it does not block page rendering. With Webvisor enabled the script does more work, so check page speed after installation, especially on mobile.

### Can I use Metrica without Yandex Direct?

Yes. Metrica works for any traffic: Google Ads, Meta Ads, SEO, email or messengers. Direct integration is an extra, not a requirement.
