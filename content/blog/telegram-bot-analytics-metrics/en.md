---
title: How to Track Telegram Bot Analytics: Metrics and Tools
description: Which bot metrics to track (starts, retention, funnel steps, blocks), how to attribute traffic with the start parameter and which tools collect the data.
summary: Log every user action as an event on your server, pass the traffic source through the start parameter in the bot link, then calculate starts, activation, retention, funnel conversion and block rate in your own database or a product analytics tool.
---
## The short answer

A bot has no detailed built-in analytics the way a website gets them from a tracking script. You collect them yourself:

1. **The bot server logs events**: start, button tap, scenario step, order, payment, block.
2. **The traffic source** is passed in the bot link through the **start parameter**.
3. **Metrics** are calculated from events: starts, activation, retention, funnel, blocks.
4. You view the data in **your own database with a dashboard** or in a **product analytics tool**.

## Key metrics

| Metric | What it shows | How to calculate |
|---|---|---|
| Starts | How many new people arrived | First /start per unique user in a period |
| Activation | Whether people reached first value | Share of starters who completed the key action |
| Retention | Whether users come back | Share of users active 1, 7 and 30 days after starting |
| Funnel | Where people drop off | Conversion between scenario steps |
| Blocks | How annoying the bot is | Share of users who blocked the bot, especially after broadcasts |
| Sources | Which channel brings the best users | Starts, activation and purchases split by start parameter |

Define the **key action** yourself: an order for a store, a confirmed visit for booking, a resolved question for support.

## The funnel, step by step

Break the main scenario into steps and log each one:

- start → category → product card → cart → contact → payment;
- start → service → time slot → booking confirmed.

Look beyond overall conversion to the **biggest drop** between neighboring steps. That is usually where a confusing button, an extra question or awkward input lives.

## Tracking blocks

When a user blocks the bot, Telegram sends a **my_chat_member** update with the status **kicked**. If they unblock it, the status changes back. Also, trying to message a user who blocked the bot returns an access error.

Log both signals as events. A jump in blocks right after a broadcast is a clear sign that messages are too frequent or irrelevant.

## Traffic sources via the start parameter

A link like `https://t.me/your_bot?start=ads_spring` sends the bot the command `/start ads_spring`. The parameter can be up to 64 characters: Latin letters, digits, `_` and `-`. Mini Apps have a similar **startapp** parameter.

Here is how it looks in aiogram 3:

```python
from aiogram import Router
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message

router = Router()

@router.message(CommandStart())
async def on_start(message: Message, command: CommandObject):
    source = command.args or "direct"
    await track_event(message.from_user.id, "bot_start", source=source)  # your event logging function
    await message.answer("Hello!")
```

Practical rules:

- Use a **naming scheme**: `channel_campaign_variant`, such as `tgads_spring_a`, `site_footer`, `qr_store1`.
- Store the user's **first source** separately and record repeat starts as separate events.
- Never put **personal data** in the parameter: it is visible in the link.

## Tools

- **Your own database + dashboard.** An events table in PostgreSQL or an analytical database, plus a BI tool for charts. Full control and no limits on your data.
- **Product analytics platforms.** The server sends events through their API or SDK, and funnels, cohorts and retention come as ready-made reports.
- **Web analytics in a Mini App.** A Mini App is a web page, so you can add a familiar web analytics script.
- **Dedicated bot analytics services**: a quick start, but less flexibility.

Minimum event fields: **user ID, event name, timestamp, source, properties** (amount, product, step). When sending data to external services, pass an internal ID, not a phone number or name.

## Common mistakes

- Counting everyone who ever pressed Start as a "user", ignoring blocks.
- Logging only final orders without intermediate steps.
- One bot link for every ad campaign.
- Renaming events without documentation, so charts stop adding up.

## FAQ

### Can I tell where a user came from without the start parameter?

Not reliably. Without it, the bot only sees that a start happened. That is why every source needs its own link.

### How often should I check the metrics?

Starts and blocks after every campaign and broadcast; funnel and retention weekly or monthly, so you see trends rather than random swings.

### What should I start with: my own database or a ready-made service?

If events are already written to the bot's database, start with a simple dashboard on top of it. An external service makes sense when you need cohorts and complex funnels without building reports yourself.
