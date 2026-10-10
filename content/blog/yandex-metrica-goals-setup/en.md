---
title: How to Set Up Goals in Yandex Metrica
description: Goal types in Yandex Metrica, how to set up page visits, JavaScript events, form and phone click goals, test them and use them for Yandex Direct bidding.
summary: A goal in Metrica is a visitor action you count as a result: a lead, a call, a jump to a messenger. Create goals in the tag settings, verify them with debug mode and mark the important ones as key goals so Yandex Direct can optimize ads for conversions.
---
## The short answer

A **goal** in Yandex Metrica is the action your site exists for: submitting a request, tapping the phone number, opening Telegram, placing an order. Without goals, Metrica only shows traffic. With them, you see which sources actually deliver results.

Setup path: **Metrica → your tag → Goals → Add goal**. Pick a type, set a condition, save. A goal only collects data from the moment it is created — nothing is counted retroactively — so set goals up before you launch ads.

## Goal types and when to use each

| Goal type | What it counts | Use it for |
|---|---|---|
| **Page visit** | Opening a URL that matches a condition | Thank-you page, cart, checkout |
| **JavaScript event** | A `reachGoal` call from site code | AJAX forms, calculators, actions without a URL change |
| **Form submission** | A form's submit event | Simple HTML forms |
| **Phone number click** | Tapping a `tel:` link | Mobile traffic, businesses that sell by phone |
| **Messenger click** | Clicking a Telegram, WhatsApp or similar link | When leads arrive in chats |
| **Email click, file download** | The matching links | Price lists, presentations, contacts |
| **Composite goal** | A sequence of steps | Funnels: catalog → product → cart → order |

Metrica can create some goals automatically (**auto goals**), such as phone and messenger clicks. That is a good start, but review their names and logic manually.

## Setting up the main goals

**Page visit.** Choose a condition: URL matches, contains, begins with, or a regular expression. For a thank-you page, "contains" `/thank-you` is usually enough. Make sure the page can only be reached after a real submission, or the goal will be inflated.

**JavaScript event.** The most reliable option for modern sites. In Metrica, set a **goal ID** such as `lead_form`. Your developer then calls it when the submission succeeds — after the server responds, not on the button click:

```js
ym(XXXXXXXX, 'reachGoal', 'lead_form');
```

Replace `XXXXXXXX` with your tag number. The ID is case-sensitive: `lead_form` and `Lead_Form` are different goals.

**Form submission.** Metrica lists the forms it finds on the page. This works when the form submits in the standard way. If the form is sent via JavaScript without a submit event, the goal may never fire — use a JavaScript event instead.

**Phone and messenger clicks.** The phone number must be a `tel:+998...` link and the messenger a regular link. A number shown as an image or plain text cannot be tracked.

**Composite goal.** Define several steps, each with its own condition. Reports then show at which step people drop off — useful for online stores and multi-step forms.

## How to test a goal

1. Open the site with `?_ym_debug=1` in the address, for example `site.com/?_ym_debug=1`.
2. Open the browser console (F12 → Console).
3. Perform the target action. The console should log the goal being reached with its ID.
4. After a while, check **Reports → Conversions**: the goal should show a non-zero value.

Test on desktop and mobile, with ad blockers off. Some visitors do use blockers, so a small gap between Metrica and your CRM is normal.

## Using goals in Yandex Direct

- **Link the tag** to the campaign in its settings.
- Mark **key goals** — the ones Direct will optimize delivery for. Conversion-based automatic strategies need a goal that is already collecting conversions.
- Set a **conversion value** if some leads are worth more than others.
- Use goals for **retargeting**, for example people who reached the cart but did not order.

## Common mistakes

- A goal on clicking "Submit" instead of a successful submission, so empty forms and validation errors are counted.
- One shared goal for all forms, so you cannot tell which form works.
- A thank-you page that fires again on refresh or from bookmarks, duplicating conversions.
- The tag is missing from some pages or installed twice.
- Passing "soft" goals, like viewing two pages, to Direct — the algorithm then learns to bring low-intent traffic.

## FAQ

### How many goals should I create?

As many as you have real contact points: each form, the phone, each messenger, plus one or two composite goals for the funnel. Dozens of goals "just in case" make reports harder to read.

### Why don't Metrica goals match the leads in my CRM?

Usually because of ad blockers, declined cookies, repeat submissions and spam. Compare trends, and for exact numbers connect Metrica to your CRM with end-to-end analytics.

### Can I send offline sales to Metrica?

Yes. Metrica supports uploading offline conversions matched to visitors by an identifier, so you can see which ads led not just to a lead but to a payment.
