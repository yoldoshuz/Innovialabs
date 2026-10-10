---
title: Tilda Website Launch Checklist
description: What to check before launching a Tilda site: domain and HTTPS, favicon and meta tags, form receivers, analytics, mobile layout, page speed and 404 page.
summary: Before launching a Tilda site, connect your domain with HTTPS, fill in the favicon and meta tags for every page, link forms to receivers and send a test lead, install analytics, check mobile and speed, and assign a 404 page.
---
## Short answer

A site is ready to launch when seven things are done:

1. Your own domain is connected and HTTPS works.
2. There is a favicon, and every page has a title, description and social preview image.
3. All forms are linked to receivers and test submissions arrived.
4. Analytics is installed and form goals fire.
5. The site is checked on a phone, including every Zero Block breakpoint.
6. Pages load fast and images are optimized.
7. A 404 page is assigned and all pages are published.

Here is what to check for each item.

## Domain and HTTPS

- Add the domain in site settings, then create the DNS records Tilda shows at your registrar: usually an **A record** for the root domain and a **CNAME** for `www`.
- Choose the primary version: with `www` or without. The other one should redirect to it.
- Wait for the SSL certificate to be issued and turn on the redirect to **HTTPS**.
- Check that every variant of the address opens the site and ends up at the same one.

DNS changes can take up to several hours, so connect the domain in advance rather than on launch day.

## Favicon, meta tags and social previews

- Upload a **favicon** in site settings; without it the browser tab looks unfinished.
- In each page's settings, fill in a **title** and **description** that are unique and clearly describe the page.
- Set a short **page URL** in Latin characters: `/services`, not `/page12345.html`.
- Upload a preview image for social networks and messengers, and check how the link looks in Telegram.

## Forms and lead receivers

The most common post-launch problem is leads that never arrive.

- Connect **data receivers** in site settings: email, Telegram, Google Sheets, a CRM.
- Open **every form block** and tick the receivers it should use. Connecting a service in settings is not enough — a form with no receiver ticked will not send data anywhere.
- Add a consent checkbox for personal data processing and a link to the privacy policy.
- Set up a success message or a thank-you page.
- **Send a test submission from every form** and make sure it reaches every receiver.

## Analytics

- Site settings have fields for Google Analytics, Yandex Metrica and Google Tag Manager IDs. For other trackers, use the custom code field for `head`.
- Verify ownership in Google Search Console and Yandex Webmaster via a meta tag or a DNS record.
- Check that form submission events appear in analytics and set them up as **goals** or conversions.

An example verification meta tag added to the `head` code:

```html
<meta name="google-site-verification" content="your-verification-code" />
```

## Mobile check

- Open the site on a real phone, not just in preview mode.
- In Zero Block, check every breakpoint: 1200, 960, 640, 480 and 320 pixels. Nothing should overlap or get cut off.
- Check the menu, buttons, form fields and text size — they should be easy to tap.
- Make sure heavy animations do not interfere with scrolling.

## Page speed

- Compress images before uploading; do not use multi-megabyte photos for small blocks.
- Enable lazy loading of images in settings if it is off.
- Limit the number of fonts and weights.
- Do not overload the first screen with video and animation.
- Test key pages in PageSpeed Insights and fix whatever slows them down most.

## 404 page and final checks

- Create a 404 page with clear text and a link to the home page, and assign it in site settings.
- Make sure indexing is **not disabled** in settings.
- If you are replacing an old site, map old URLs to new ones so you do not lose search traffic.
- **Publish every page** after the last edits; unpublished changes do not reach the live site.
- Click through every link in the menu and footer.

## FAQ

### How long does it take to connect a domain to Tilda?

The setup itself takes minutes, but DNS records take anywhere from minutes to several hours to update, and the SSL certificate is issued after that. Connect the domain a day or two before launch.

### Why are form submissions not reaching my email?

Most often no receiver is ticked in the form block, or emails land in spam. Check the block settings and the spam folder, and add a second channel such as Telegram or Google Sheets.

### Do I need to create a sitemap and robots.txt manually?

No, Tilda generates them automatically. Just keep indexing enabled and submit the sitemap in webmaster tools.
