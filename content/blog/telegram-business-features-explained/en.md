---
title: Telegram Business Features: Hours, Quick Replies and Chatbots
description: What Telegram Business includes: opening hours, location, greeting and away messages, quick replies, and connecting a chatbot to your personal business account.
summary: Telegram Business turns a personal account into a work account: it shows your hours and location, sends greeting and away messages automatically, offers template quick replies and lets you connect a bot that answers customers on your behalf.
---
## The short answer

**Telegram Business** is a set of features for people who talk to customers from their personal account. It comes with a **Telegram Premium** subscription and lives under Settings → Telegram Business. The key features are:

- **business hours** and **location** in your profile;
- a **greeting message** for new customers;
- an **away message** outside working hours;
- **quick replies**, templates you call up with `/`;
- a **connected chatbot** that answers in your personal chats.

It suits specialists and small teams who already sell through personal chats: craftspeople, consultants, Telegram-based shops.

## Business hours and location

**Business hours** are set per weekday with a time zone. Customers see in your profile whether you are open right now and know when to expect a reply.

**Location** appears in your profile together with a map pin. It is useful for salons, cafes, showrooms and anywhere customers visit in person.

## Greeting and away messages

A **greeting message** is sent automatically when someone new writes to you, or someone who has not been in touch for a while. You choose what "a while" means. You can also choose who receives it and who is excluded, for example existing contacts.

An **away message** goes out when you are unavailable. Schedule options:

- always, for example while on vacation;
- outside business hours;
- on a custom schedule.

You can also send it **only when you are offline**, so customers do not get a template while you are actually in the chat.

What to put in these messages:

- introduce yourself and say briefly what you do;
- say when you will reply;
- ask the customer to describe their request right away, which speeds up the answer;
- link to your catalog or price list if you have one.

## Quick replies

**Quick replies** are saved messages with short commands. In a chat you type `/` and pick a template, such as `/price`, `/address` or `/payment`. A template can include text, photos and files.

Replies worth saving first:

- prices or a link to the price list;
- your address and directions;
- payment and delivery options;
- answers to the two or three most common questions.

## Connecting a chatbot

The most powerful feature is a **bot that works inside your personal chats**. Customers write to you as usual, and the bot replies: it collects requests, answers common questions and books appointments.

How it works:

1. The bot must support **Business Mode**, which its developer enables in the bot settings via BotFather.
2. In Telegram Business you select the bot under Chatbots.
3. You choose which chats it works in: all except selected ones, or only selected ones.
4. You decide whether the bot is allowed to reply.

In any chat you can pause the bot and continue the conversation yourself.

For developers: the bot receives updates about the connection and messages from business chats, and replies by passing the connection ID:

```json
{
  "business_connection_id": "<connection ID>",
  "chat_id": 123456789,
  "text": "Hello! Which service are you interested in?"
}
```

Details are in the [Bot API documentation](https://core.telegram.org/bots/api).

## Common mistakes

- **A greeting that fills half the screen.** The customer wants to know one thing: when you will reply and what to write.
- **An away message with no time frame.** "We'll reply soon" promises nothing.
- **A bot with no handoff to a human.** If the bot does not understand a question, it should say so honestly and pass the chat to you.
- **Enabling the bot in every chat**, including personal chats with family and friends. Limit it to work chats.

## FAQ

### Do I need Telegram Premium for Telegram Business?

Yes, Telegram Business features are part of the Telegram Premium subscription. Creating a bot is free, but its development and hosting are separate costs.

### Can customers tell a bot is answering?

Messages are sent on your behalf in your chat. It is still good practice to mark automatic replies honestly so customers are not misled.

### How is Telegram Business different from a regular bot?

A regular bot is a separate account the customer has to open. With Telegram Business, the bot replies inside your personal chat, so the customer talks to you directly.
