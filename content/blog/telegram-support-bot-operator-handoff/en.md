---
title: How to Build a Telegram Support Bot with Operator Handoff
description: How to set up a Telegram support bot: FAQ flows, ticket creation, routing conversations to a staff group or helpdesk, and delivering answers to customers.
summary: The bot first resolves common questions through an FAQ; when it cannot, it opens a ticket and routes the conversation to a staff group with a separate topic per customer or to a helpdesk, then copies the operator's reply back, so the customer only ever talks to the bot.
---
## The short answer

A support bot with operator handoff works in three layers:

1. **Self-service.** An FAQ on buttons resolves common questions without a human.
2. **Ticket.** If there is no answer, the bot opens a ticket: number, category, description, contact.
3. **Operator.** The conversation goes to a staff group or a helpdesk, and the bot delivers the operator's reply to the customer.

The customer only ever talks to the bot. Staff personal accounts stay private, and the whole history lives in one place.

## Layer 1. FAQ flows

- Collect **real frequent questions** from support conversations, not invented ones.
- Group them into 4-6 button sections: payment, delivery, account, refunds.
- Each answer should be **complete**: an instruction, a link or an action. After it, show "This helped" and "I need an operator" buttons.
- A **"Contact an operator"** button is available at every step. Hide it, and people will start writing through other channels.
- Free text can be matched to the FAQ by keywords or knowledge base search, but when the match is uncertain, offer an operator right away.

## Layer 2. Creating a ticket

Before handing over to a human, the bot collects the minimum so the operator does not start with questions:

- **category** (via buttons);
- **description** of the issue as text, optionally with a screenshot;
- **order or account number**, if the category needs it;
- **contact**, if the customer is not identified.

The bot creates a database record: ticket ID, the customer's Telegram ID, status (`open`, `in_progress`, `waiting_customer`, `closed`), assigned operator, creation time. The customer immediately gets the ticket number and an honest expectation of reply time during business hours.

## Layer 3. Routing to an operator

| Option | How it works | When it fits |
|---|---|---|
| Group with topics | A supergroup with topics enabled, one topic per customer | Small team working right in Telegram |
| Group with replies | The bot forwards a message, the operator replies to it | A very simple flow |
| Helpdesk | Tickets are created in a support system via API, replies come back via webhook | You need SLAs, reports, multiple channels |

A **group with topics** is the most convenient way to start. Add the bot to a supergroup as an admin with permission to manage topics; it creates a topic for each ticket and copies the customer's messages there. The operator writes in the topic, and the bot copies the reply to the customer.

```python
from aiogram import Bot, F, Router
from aiogram.types import Message

router = Router()

@router.message(F.chat.type == "private")
async def from_customer(message: Message, bot: Bot):
    ticket = await tickets.get_open(message.from_user.id)
    if ticket is None:
        ticket = await tickets.create(message.from_user.id)
        topic = await bot.create_forum_topic(
            chat_id=STAFF_CHAT_ID,
            name=f"#{ticket.id} {message.from_user.full_name}",
        )
        ticket = await tickets.attach_thread(ticket.id, topic.message_thread_id)
    await message.copy_to(STAFF_CHAT_ID, message_thread_id=ticket.thread_id)

@router.message(F.chat.id == STAFF_CHAT_ID, F.message_thread_id, ~F.forum_topic_created)
async def from_operator(message: Message):
    ticket = await tickets.by_thread(message.message_thread_id)
    if ticket and not (message.text or "").startswith("/"):
        await message.copy_to(ticket.user_id)
```

Why `copyMessage` instead of forwarding: a copy does not show the author, so the customer never sees the operator's name, and staff receive messages without extra labels.

Service commands in a topic, such as `/close`, are not sent to the customer; instead the bot changes the ticket status and closes the topic.

## Returning replies and closing

- The operator's reply reaches the customer from the bot. Optionally, the bot adds a signature like "Support team".
- When the operator closes the ticket, the bot tells the customer and offers rating buttons.
- If the customer writes after closing, either a new ticket is created or the old one reopens. Decide this rule upfront.
- Tickets with no customer response beyond a set period close automatically with a notification.

## Common mistakes

- The bot is in the group without admin rights, so privacy mode hides operators' messages from it.
- One shared feed for all customers: replies go to the wrong person.
- No off-hours mode: the customer waits at night without knowing support is back in the morning.
- Keeping the topic-to-customer mapping only in process memory: replies are lost after a restart.
- Passing attachments to operators without checking type and size.

Details on group topics are in the [Bot API documentation](https://core.telegram.org/bots/api#createforumtopic).

## FAQ

### How many operators can work in such a group?

The limit is mostly organizational: a topics group works well while the team can see all tickets. Once you need assignment, queues and SLA reports, move to a helpdesk via its API.

### Can I add AI to the first line?

Yes: a model answers from the knowledge base and hands the conversation to an operator when it is unsure or when the customer asks. Make sure answers rely only on verified company materials.

### Does the customer see which staff member replied?

No, if the bot copies messages. The customer only sees the bot, and you can add the operator's name as a signature if your service needs it.
