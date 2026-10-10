---
title: How to Set Up Events and Key Events (Conversions) in GA4
description: GA4 events explained: automatic, recommended and custom events, parameters and custom dimensions, marking key events and verifying everything in DebugView.
summary: In GA4 every action is an event with parameters; use recommended names like generate_lead, register the parameters you need as custom dimensions, mark important events as key events and verify everything in DebugView before publishing.
---
## The short answer: how events work in GA4

GA4 measures everything as **events**: a page view, a click, a form submission, a purchase. Each event carries **parameters** — extra data such as the form name or order value.

The workflow:

1. Check which events are already collected **automatically**.
2. Use Google's **recommended events** for common actions.
3. Create **custom events** for everything else.
4. Register the parameters you need as **custom dimensions**.
5. Mark important actions as **key events**.
6. Verify everything in **DebugView**.

## Types of events

| Type | Examples | What you need to do |
|---|---|---|
| **Automatic** | `first_visit`, `session_start`, `user_engagement` | Nothing, they are collected by default |
| **Enhanced measurement** | `page_view`, `scroll`, `click`, `file_download`, `form_start` | Enable in the stream settings |
| **Recommended** | `generate_lead`, `sign_up`, `login`, `purchase`, `add_to_cart` | Send with the exact name and parameters |
| **Custom** | `brief_submit`, `calculator_used` | Choose a name and send it |

**Use recommended names whenever they fit.** GA4 and Google Ads have ready-made reports and features for them, such as ecommerce reports for `purchase`.

## How to send an event

**With gtag.js:**

```javascript
gtag('event', 'generate_lead', {
  form_name: 'contact',
  value: 1,
  currency: 'USD'
});
```

**With Google Tag Manager.** The site pushes an event to the dataLayer, and in GTM you create a "Google Analytics: GA4 Event" tag triggered by that event:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_success',
  form_name: 'brief'
});
```

Send the event **after the action succeeds** — for example, when the server confirms the lead was received, not when the button is clicked.

**Naming rules:**

- Latin letters, digits and underscores, starting with a letter;
- names are case-sensitive: `Generate_Lead` and `generate_lead` are different events;
- reserved prefixes `google_`, `ga_` and `firebase_` are not allowed;
- one consistent `snake_case` style for all events.

## Parameters and custom dimensions

Parameters you send with an event **do not show up in reports automatically**. To see `form_name`, for example:

1. Open Admin → Custom definitions.
2. Click "Create custom dimension".
3. Enter a name, a scope (**event** or **user**) and the parameter name exactly as it appears in code.

Note that data is only collected from the moment of registration; it is not backfilled. Do not register parameters with unique values such as order IDs or timestamps — that creates high cardinality and an "(other)" row in reports.

## Key events

**Key events** are what GA4 now calls conversions. They are the actions that matter to the business: a lead, a purchase, a sign-up.

How to mark them:

- in Admin → Events, toggle "Mark as key event" next to the event;
- if the event is not in the list yet, create a key event manually using its exact name.

Do not mark everything as a key event: scrolls and page views blur the picture. Import into Google Ads only the key events you actually want to optimize bids for — there they are called conversions.

## Verifying in DebugView

DebugView in Admin shows events from your device in near real time. To enable debug mode:

- start **Preview** in Google Tag Manager — debug mode turns on automatically;
- or add `debug_mode: true` to the tag configuration;
- or use the Google Analytics Debugger browser extension.

Perform the action on your site and check that the event arrived once, the name is spelled correctly and the parameters are filled in. Remove `debug_mode` from the code afterwards.

## FAQ

### Why do I see an event in DebugView but not in reports?

Standard reports update with a delay: data processing can take up to a day or two. Also check that the internal traffic or developer traffic filter is not excluding it.

### Can I create an event without a developer?

Yes, if the action is already tracked: in Admin → Events you can create a new event based on an existing one, such as `page_view` on a thank-you page. Complex actions are easier to set up with GTM.

### How is a key event different from a Google Ads conversion?

A key event is a GA4 concept. When you import it into Google Ads, it becomes a conversion that can be used for bid optimization.
