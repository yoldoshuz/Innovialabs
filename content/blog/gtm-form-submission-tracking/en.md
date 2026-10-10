---
title: How to Track Form Submissions with Google Tag Manager
description: Four ways to track form submissions in Google Tag Manager, and how to send the event to GA4, Yandex Metrica and ad pixels without duplicates or false fires.
summary: The most reliable method is to have your developer push a dataLayer event after a successful submission and catch it in GTM with a Custom Event trigger. That single trigger then fires tags for GA4, Yandex Metrica and ad pixels.
---
## The short answer

Google Tag Manager can catch a form submission in four ways. The best is a **dataLayer event** that the site pushes only after the server confirms it received the lead. The other methods work when you have no access to the code, but each has weak spots.

## Comparing the methods

| Method | How it works | Pros | Cons |
|---|---|---|---|
| **Form Submission trigger** | Listens for the standard submit event | No developer needed | Often silent on AJAX forms; may count failed submissions |
| **Element Visibility** | Fires when a "Thank you" message appears | Works with AJAX forms | Breaks when markup or copy changes |
| **Thank-you page** | A view of `/thank-you` | Simple and transparent | Requires a redirect; duplicates on refresh |
| **dataLayer push** | The site reports a successful submission itself | Most accurate, can pass parameters | Needs a developer |

## Method 1: dataLayer (recommended)

The developer adds this to the success handler of the server response:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit_success',
  form_name: 'brief',
  form_location: 'contacts'
});
```

In GTM:

1. **Variables → User-Defined → Data Layer Variable**: create `form_name` and `form_location`.
2. **Triggers → Custom Event**, event name `form_submit_success`.
3. Use this trigger in the tags below.

Do not push names, phone numbers or emails into the dataLayer — personal data must not be sent to analytics.

## Method 2: Form Submission trigger

Enable the built-in Form variables (Form ID, Form Classes). Create a **Form Submission** trigger and tick **Check Validation** so that forms blocked by a validation script are not counted. Limit the trigger to the right form by Form ID. Always test in Preview — on forms built with JavaScript frameworks this trigger is often silent.

## Method 3: Element Visibility

Use an **Element Visibility** trigger with the CSS selector of the success message, such as `.form-success`. Choose "Once per page" and enable **Observe DOM changes**, because the message appears after the page has loaded. Agree with your developer that this class will not be renamed.

## Method 4: Thank-you page

A **Page View** trigger where `Page Path` equals `/thank-you`. To avoid duplicates, the page should not be reachable directly and a refresh should not resubmit the lead. For several forms, use separate pages or a URL parameter.

## Sending the event to GA4, Metrica and pixels

Attach several tags to the single `form_submit_success` trigger.

**GA4.** A **Google Analytics: GA4 Event** tag with the event name `generate_lead`, Google's recommended event for leads. Add the parameter `form_name` = `{{form_name}}`. Then mark the event as a **key event** (conversion) in the GA4 interface.

**Yandex Metrica.** If the Metrica tag is already on the site, a **Custom HTML** tag is enough:

```html
<script>
  ym(XXXXXXXX, 'reachGoal', 'form_submit_success');
</script>
```

In Metrica, create a **JavaScript event** goal with the same ID.

**Meta Pixel.** Custom HTML calling the standard event:

```html
<script>
  fbq('track', 'Lead');
</script>
```

**Google Ads.** A **Google Ads Conversion Tracking** tag with the conversion ID and label from your account.

If the site shows a cookie consent banner, configure tags with Consent Mode so they do not fire before the user agrees where consent is required.

## How to test

1. Click **Preview** in GTM and submit the form on the site.
2. In Tag Assistant, confirm the event appears and all tags show as "Fired".
3. Check GA4 **DebugView**, and use `?_ym_debug=1` for Metrica.
4. Submit the form with a validation error — the tags must not fire.
5. Only then publish the container with a clear version description.

## FAQ

### Why doesn't the Form Submission trigger fire?

Most likely the form is sent via JavaScript without a standard submit event, or a script stops the event from propagating. Switch to a dataLayer push or Element Visibility.

### Can I rely on GA4's automatic form tracking?

GA4 enhanced measurement can collect `form_start` and `form_submit`, but it does not know whether the submission succeeded. For conversions, use your own event fired after the server responds.

### Do I need a separate tag for each form?

No. One trigger and one tag per system is enough, with the `form_name` parameter telling forms apart. That keeps the container easy to maintain.
