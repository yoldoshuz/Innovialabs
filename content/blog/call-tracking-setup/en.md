---
title: What Is Call Tracking and How to Set It Up
description: How call tracking works: static vs dynamic, number pools, integration with Metrica, GA4 and CRM, and why ads are misjudged when calls are not counted.
summary: Call tracking swaps the phone number on your site and in ads so every call is tied to its source: channel, campaign, keyword. Without it, a business that sells by phone only sees form leads and makes decisions on incomplete data.
---
## The short answer

**Call tracking** identifies where a calling customer came from. A service gives you virtual numbers, shows them in place of your main number and forwards calls to your phone or PBX. Based on which number was dialed, the system knows the source and passes it to analytics and your CRM.

## Why calls must be counted

If customers often call instead of filling in a form, then without call tracking:

- a channel that drives calls looks **unprofitable** because it brings few form leads;
- Google Ads and Yandex Direct automated bidding learns only from forms and **cuts budget** in the wrong places;
- sales and marketing argue about lead quality with no shared data.

This matters most for services, repairs, healthcare, real estate and B2B — anywhere calling is easier for the customer than writing.

## Static vs dynamic call tracking

| | Static | Dynamic |
|---|---|---|
| **Principle** | One number per source | Each site visitor sees their own number from a pool |
| **Precision** | Channel or medium level | Session level: source, campaign, keyword, page |
| **Use for** | Billboards, print, radio, business cards, specific platforms | Websites with paid and organic traffic |
| **Numbers needed** | One per tracked source | Depends on traffic |
| **Complexity** | Low | Higher: a site script and pool setup |

They are often combined: static numbers for offline ads, dynamic ones for the website.

## How a number pool works

With dynamic call tracking, a script on the site swaps the number. The number is "held" for the visitor during the visit and for some time after, so they have time to call. If the pool has fewer numbers than concurrent visitors, one number maps to several people and the call cannot be tied to a session precisely.

Pool size depends on:

- **concurrent visitors** at peak hours;
- **hold time** of a number per visitor;
- **share of traffic** you enable swapping for (for example, paid channels only).

Call tracking services usually calculate the required number count from your site statistics — follow their recommendation rather than the cheapest plan.

## How to set it up

1. **Define what you need to know.** Only the channel, or down to the keyword? That decides static versus dynamic.
2. **Choose a service** with numbers in your country and integrations with your telephony, CRM and analytics.
3. **Set up forwarding** to your phones or virtual PBX. Make sure callers hear a normal ring and managers can see the call came from the site.
4. **Install the script** on every page. The number on the site must be text with the class or attribute specified in the settings, and a `tel:` link — a number inside an image cannot be swapped.
5. **Assign sources** to static numbers: which number goes on which medium.
6. **Connect analytics**: send calls as goals to Yandex Metrica and as events to GA4. Calls then appear next to forms in reports and ad platforms.
7. **Connect your CRM**: each call creates or updates a deal with its source, call recording and the customer's number.
8. **Test**: open the site via a link with UTM tags, call the number shown and check the source in the service, analytics and CRM.

## Integration with analytics and CRM

The real value of call tracking is **end-to-end analytics**. The chain is: ad → tagged visit → call → CRM deal → payment. When every link is connected, you can measure cost per sale for each campaign, not just cost per call.

Remember that calls can be **repeat** or **irrelevant**: spam, suppliers, existing customers. Set a "qualified first-time call" flag in the service or CRM, and pass only those to ad platforms.

## Common mistakes

- The number isn't swapped on some pages or in the mobile version.
- The pool is too small, so calls are attached to random sessions.
- The main number remains in the header, footer, images or structured data, and calls bypass tracking.
- All calls, including spam and repeats, are sent to ad platforms.
- Calls are recorded without notifying customers — check the legal requirements in your country.

## FAQ

### Will number swapping hurt SEO or map listings?

Keep the main number in business listings and directories — it should match everywhere. On the site, swapping happens via a script in the browser, while the source HTML keeps the main number. Check the service settings to make sure swapping is not applied to search engine crawlers.

### Can I manage without call tracking?

If you get only a handful of calls, you can ask "how did you hear about us" and log the answer in the CRM. But that data is imprecise, and automated bidding cannot learn from it.

### What about messenger inquiries?

They are tracked similarly: links with a unique parameter or a prefilled start message, click goals, and passing the source to the CRM. Many call tracking services already support this.
