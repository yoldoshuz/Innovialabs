---
title: How to Design a Lead Generation Bot Scenario in Telegram
description: How to build a bot dialogue from first touch to a qualified lead: entry points, questions, branching, contact request, lead magnet and manager notification.
summary: A good scenario opens with a clear benefit, asks 2-4 questions with buttons, branches on the answers, requests the phone via a Share contact button and immediately sends the manager a lead card with every answer and the source.
---
## The short answer

A lead generation scenario is a short five-step path:

1. **Entry** with a clear promise: what the person will get.
2. **Qualification**: 2-4 questions with answer options on buttons.
3. **Branching**: different continuations for different answers.
4. **Contact**: phone number via the "Share contact" button.
5. **Handoff**: a lead card for the manager and a clear next step for the customer.

Anything that does not move the person along this path is better removed.

## Step 1. Entry points

People arrive at the bot from different places, and you should know which one from the very first message:

- ads in Telegram or other channels;
- a button in your channel or a pinned post;
- an offline QR code;
- a link from your website.

Create a separate link with a parameter for each source: `t.me/your_bot?start=ads_spring`. The bot receives `/start ads_spring`, stores the source and can open the dialogue differently, for example by offering exactly what the ad promised.

## Step 2. The first message

The first message decides whether the person continues. It should contain:

- **who you are** in one line;
- **what the person gets** in a couple of minutes in the bot: an estimate, a selection, a consultation, a resource;
- **one main button** to start.

Do not open by asking for a phone number. Value and questions first; the contact comes once the person is engaged.

## Step 3. Qualifying questions

Ask only what helps the manager prepare for the conversation or filter out poor fits. A typical set:

| Question | Why |
|---|---|
| Which service or product interests you | Route to the right specialist |
| The task or situation | Understand the context before the call |
| Timeline | Gauge urgency |
| Budget or volume | Separate qualified leads |

Rules for questions:

- **buttons instead of free text** wherever possible;
- **one message, one question**;
- **show progress**: "Question 2 of 3";
- **a "Back" button** or a way to change an answer;
- **an "Other" option** with free input so you do not lose unusual customers.

## Step 4. Branching

Branch when different answers require different actions:

- **Poor-fit answer** (say, a volume that is too small): politely offer a suitable option or useful resource instead of a call.
- **Urgent request**: offer to connect with a manager right away.
- **Different services**: their own follow-up questions for each.

Draw the flow before development: each node is a message, each arrow is a button. If the diagram does not fit on one screen, the scenario is probably too long.

## Step 5. Requesting the contact

The easiest way to get a phone number is a **keyboard button with `request_contact`**: the person taps once and Telegram passes the number of their account.

```python
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup

kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Share contact", request_contact=True)]],
    resize_keyboard=True,
    one_time_keyboard=True,
)
```

Check that `contact.user_id` matches the sender's ID: this confirms the person shared their own number rather than forwarding someone else's. Also allow typing the number manually, and explain why you need it.

## Step 6. Lead magnet

A lead magnet is a useful resource in exchange for a contact or for completing the scenario: a checklist, a price list, a curated selection, a cost estimate. Two placement options:

- **After the contact**: more leads with phone numbers, but some people drop off at this step.
- **Before the contact**: more people reach the end, and you ask for the contact as the next step.

The resource must be genuinely useful and related to your service. Deliver it as a file or a message right in the bot.

## Step 7. Manager notification

Right after the lead is submitted, the bot sends a card to the work chat:

- name, phone, username;
- every answer;
- the source from the `start` parameter;
- submission time;
- "Take it" and "Message customer" buttons.

In parallel, the lead goes to the CRM. The bot tells the customer what happens next and when to expect contact.

## Common mistakes

- Too many questions before the first result.
- Free text input where buttons would do.
- No saved progress: the person returns and starts from scratch.
- Dialogues abandoned midway are never followed up. One reminder after some time is fine; more is too much.
- The lead reaches the manager without the answers, so they ask the same questions again.

## FAQ

### How many questions should a scenario have?

As many as the manager needs for the first conversation, and not one more. If a question does not change what happens next, remove it.

### Where do I store answers if the user abandons the dialogue?

In the bot's database, after every step. Then the person can resume where they left off, and you can see which question loses the most people.

### Do I need a lead magnet for a simple service?

Not necessarily. If people arrive with a ready request, a fast path to a manager works better than any resource.
