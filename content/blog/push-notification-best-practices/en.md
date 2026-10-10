---
title: Push Notification Best Practices: How Not to Get Disabled
description: When to ask for permission, how to segment users, pick timing and frequency, personalize copy, deep link to the right screen and measure opt-outs and opens.
summary: Ask for permission when the benefit is obvious, send only what is useful to a specific segment in their local time and without overdoing it, deep link to the right screen and track not just opens but opt-outs too.
---

## The short answer: one core rule

People disable push when notifications are **not about them**, arrive **at the wrong time** or come **too often**. Every message should pass one test: "Will this person be glad to get it right now?"

Opting out is nearly irreversible. The user can only turn notifications back on manually in settings, and few ever do.

## When to ask for permission

- **Not on the first screen.** A prompt right after install, with no context, is more likely to be declined.
- **At the moment of value**: after an order ("We'll tell you when the courier leaves"), when following a product, after booking an appointment.
- **Soft ask (pre-permission)**: first show your own screen explaining the benefit, and only on agreement trigger the system dialog. On iOS the system dialog appears once, so protect it.
- **Provisional authorization on iOS**: notifications are delivered quietly to Notification Center and the user decides whether to keep them.
- On Android 13+, the **POST_NOTIFICATIONS** permission is also requested explicitly.

## Segmentation

One blast to everyone is the fastest route to opt-outs. Segment by:

- **behavior**: new, active, dormant, abandoned cart;
- **interests**: categories, city, language;
- **stage**: finished onboarding or not, has purchased or not.

Separate **transactional** notifications (order status, payment, new message) from **marketing** ones. People almost always want the first kind; the second needs care.

## Timing and frequency

- Send in the **user's local time**, not server time.
- Set **quiet hours**; no marketing pushes at night.
- Add a **frequency cap** per user per day and per week across all marketing campaigns combined.
- Mind the context: an abandoned cart reminder helps a few hours later, not a month later.

## Copy and personalization

- **The title carries the point**: what happened or what the person gets.
- Specific beats generic: "Your order is with the courier" works better than "We have news for you!"
- Personalization is not just a first name, it is **relevance**: an item from the wishlist, the city, the interface language.
- No all caps, clickbait or fake urgency.
- Write in the user's interface language.

## Deep linking

A push should open a **specific screen**, not the home page:

- pass the path in the `data` field, for example `screen: order, id: 1042`;
- handle **logged-out users**: sign in first, then route to the target screen;
- if the item was deleted or is unavailable, show a clear message instead of an empty screen.

## Channels on Android

Create separate **notification channels** such as Orders, Messages and Promotions. Then a user can mute promotions without turning off everything.

## What to measure

| Metric | What it shows |
|---|---|
| Opt-in rate | Share of users who allowed notifications |
| Delivery rate | How many messages were actually delivered |
| Open rate | Share of delivered messages that were opened |
| Opt-out rate | How many people disabled notifications after a campaign |
| Conversion | The target action after opening: a purchase, a return to the app |

Check the permission status in code on each launch; that reveals opt-outs your messaging service's reports may miss. Test copy and timing with **A/B tests** on part of the audience.

## Common mistakes

- Showing the system permission prompt on the first screen.
- Sending the same message to every user.
- Pushes that open the home screen instead of the relevant one.
- Marketing sent at night or in server time.
- Watching only opens and missing a rise in opt-outs.

## FAQ

### How many pushes per week is acceptable?

There is no universal number. Go by value and data: if opt-outs rise after campaigns, reduce frequency. Transactional notifications usually do not count toward the cap.

### Can I use push for advertising?

Yes, with consent. App Store guidelines prohibit using push for promotions unless users have explicitly opted in, and the app must let them opt out of such messages.

### What if a user has already disabled notifications?

Show them in the app what they miss, for example in settings or after an event where a push would have helped, and offer a button that opens system settings. Do not nag about it constantly.
