---
title: How to Build an Appointment Booking Bot in Telegram
description: Service and staff choice, free slots, reminders, rescheduling and calendar sync: how to design a Telegram booking bot for a salon, clinic or studio.
summary: A booking bot walks the client through service, specialist, date, time and confirmation, calculates free slots from schedules and service length, sends reminders on its own, lets people reschedule with one tap and keeps all bookings in a single calendar or CRM.
---
## The short answer

A good booking bot does four things:

1. **Shows only time that is actually free**, based on schedules, service length and existing bookings.
2. **Guides the client through a short flow**: service → specialist → date → time → contact → confirmation.
3. **Sends reminders** and lets people confirm, reschedule or cancel with a button.
4. **Syncs with a calendar or CRM**, so staff never keep bookings in two places.

## The booking flow step by step

- **Service.** Buttons grouped by category. Every service has a duration and a price.
- **Specialist.** Show only people who provide the chosen service, and add an "Any available" option.
- **Date.** Upcoming days as buttons, or a month calendar where days without free time are disabled.
- **Time.** Only free slots for the chosen day.
- **Contact.** Phone number via the "Share contact" button, once; after that the bot remembers it.
- **Confirmation.** A summary with service, specialist, date, time, address and price, plus a "Book" button.

In a salon, "service first, then specialist" feels natural. If clients stick to one person, let them start there: "Book with my specialist".

## How to calculate free slots

A slot is more than an hour in a grid. The bot has to account for:

- each specialist's **working hours**, days off and vacations;
- **service duration**: a two-hour treatment won't fit into a one-hour gap;
- a **buffer** between clients for cleaning or preparing the room;
- **resources**: rooms, chairs or equipment, which may be fewer than staff;
- the business's **time zone**, not the user's.

The main risk is **double booking**, when two people pick the same time at once. Protect against it with a short hold on the slot during checkout and a server-side check on confirmation. If the slot is gone, the bot says so plainly and offers the nearest alternatives.

## Reminders and visit confirmation

Reminders noticeably help with no-shows, and a bot is the easiest place to send them: the client is already in the chat.

- **The day before**: details plus "I'll come", "Reschedule" and "Cancel" buttons.
- **A couple of hours before**: a short note with the address and, if useful, a location pin.
- **After the visit**: a request to rate the service or an offer to book again.

Keep Telegram's limitation in mind: **a bot cannot message someone first** if that person has never started it. A booking made by phone can't be moved into the bot automatically; invite the client with a link.

## Rescheduling and cancellation

- Rescheduling is **one action**: the bot offers new slots and frees the old one only after the new one is confirmed.
- Set **rules**, such as how many hours before the visit a client can still cancel without calling. The business decides the time; the bot just applies it.
- Staff get a notification about every cancellation and reschedule so they can offer the freed time to others.

## Calendar and CRM sync

There must be **one source of truth** for the schedule.

| Situation | Solution |
|---|---|
| You already use a booking system or CRM with an API | The bot is a front end to it: reads slots and creates bookings via the API |
| Bookings live in Google Calendar | Two-way sync: busy time in the calendar closes slots in the bot |
| Nothing yet | Your own bookings database plus a simple admin panel or staff chat |

One-way sync "from the bot only" is risky: the bot won't see bookings made by phone or by staff.

## Common mistakes

- Showing every slot and checking availability only at the end.
- Ignoring service duration and resources.
- Not offering "any specialist".
- Leaving the client no way to reach a person.

## FAQ

### Do I need a Mini App for booking?

Not necessarily. For a handful of services and specialists, chat buttons are enough. A Mini App helps when there are many services, you want a visual schedule grid, or clients book several services at once.

### Can I take a prepayment for a booking?

Yes, the bot can send an invoice or a payment link before confirmation. Make sure the slot is assigned to the client only after a successful payment.

### How do I move regular clients into the bot?

Share the bot link in messages, on your website and social media, and put a QR code at the front desk. After the first start, the bot can send reminders on its own.
