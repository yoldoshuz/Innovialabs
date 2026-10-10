---
title: How to Build a Sales Funnel in a Telegram Bot
description: A sales funnel in a Telegram bot: stages from first touch to repeat purchase, deep links, segmentation, follow-up messages and conversion tracking.
summary: Split the customer path into stages from /start to repeat purchase, tag the source with a deep link, segment with button questions, bring back drop-offs with short reminders, and log every stage as an event to measure conversion.
---
## Short answer

A bot funnel is a chain of stages where each step offers **one clear action**:

1. entry through a deep link carrying the source;
2. first value — a selection, a calculation, a gift;
3. qualification — two or three button questions;
4. an offer for that segment;
5. a request or payment;
6. follow-ups for people who stopped;
7. repeat purchases and referrals.

Every stage is logged as an **event** in the database, so you see where people leave.

## Funnel map

| Stage | What the bot does | Event |
|---|---|---|
| Entry | receives `/start` with a tag | `start` |
| Value | delivers the promised material | `lead_magnet` |
| Qualification | asks button questions | `qualified` |
| Offer | shows a product or plan | `offer_viewed` |
| Payment | sends an invoice or hands over to a manager | `checkout`, `paid` |
| Repeat | reminds, gives a bonus | `repeat` |

## Deep links: where did the person come from

A link like `https://t.me/your_bot?start=ig_reels_oct` opens the bot, and when the user taps "Start" it receives `/start ig_reels_oct`. The parameter is up to 64 characters of Latin letters, digits, `_` and `-`. Create a separate link per channel: stories, a blogger, the website, a flyer.

```python
from aiogram.filters import CommandStart, CommandObject

@router.message(CommandStart(deep_link=True))
async def start_with_source(message: Message, command: CommandObject):
    source = command.args  # e.g. "ig_reels_oct"
    await save_first_source(message.from_user.id, source)  # only if not saved yet
    await track(message.from_user.id, "start", source)
    await message.answer("Hi! Shall we find the right option in a minute?", reply_markup=start_kb)
```

Store the **first source** separately — otherwise a later visit through another link overwrites where the customer originally came from. From your website, pass the tag in the same link by shortening UTM parameters to a compact code.

## Segmentation

Ask only what changes the offer: what they are interested in, for whom, what volume or budget, which delivery city. Every question uses buttons, not free text. Store answers as user **tags**: the bot uses them to pick the offer, and you use them to choose broadcast audiences.

## Follow-up messages

If someone stops at a stage, after a set delay the bot comes back with one action: "Order", "Ask a manager", "Not now". Rules:

- you can only message people who started the bot and haven't blocked it; a `403` error means a block — mark the user inactive;
- one or two reminders per stage, then pause;
- every reminder has a "Stop reminders" button;
- store jobs in the database and run them with a scheduler, not an in-memory timer, so they survive restarts;
- respect Telegram's sending rate limits and on a `429` response wait for the `retry_after` time.

## Payment and repeat purchase

You can take payment inside the bot via Telegram Payments with a payment provider, sell digital goods through Telegram Stars, or link to checkout on your website. The funnel doesn't end at purchase:

- confirm the order and send status updates;
- ask for a rating after a while;
- remind about a repeat purchase when the product usually runs out;
- give a referral link such as `?start=ref_12345` to see who brought whom.

## Conversion tracking

One events table is enough:

```sql
CREATE TABLE funnel_events (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  event      TEXT NOT NULL,
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

SELECT source, event, COUNT(DISTINCT user_id) AS users
FROM funnel_events
GROUP BY source, event
ORDER BY source, event;
```

Dividing user counts of adjacent stages gives step conversion, and splitting by `source` shows which channel brings buyers rather than just subscribers.

## Common mistakes

- **selling in the first message** — without value or questions, people leave;
- **one link for all channels** — you can't tell what works;
- **reminders without an opt-out** — blocks go up;
- **no handover to a manager** — a complex question hits a dead end in the menu.

## FAQ

### How many stages should the funnel have?

As many as the buying decision needs. If a stage neither changes the offer nor moves the user closer to payment, remove it.

### Can I broadcast to every bot user?

Yes, to everyone who started the bot and hasn't blocked it. But segmented broadcasts work better and lead to fewer blocks.

### How do I find the weak stage?

Compare user counts on adjacent stages by source. Change one element at a time — text, button or order — and watch how the step conversion moves.
