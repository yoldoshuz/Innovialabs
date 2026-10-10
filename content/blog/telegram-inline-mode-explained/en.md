---
title: What Is Inline Mode in Telegram Bots and How to Use It
description: How @bot queries work in any Telegram chat, which result types inline mode supports, and practical business uses such as sharing catalog items with friends.
summary: Inline mode lets users call a bot in any chat by typing @botname and a query; the bot returns a list of results and the user sends the chosen one into the current chat, which is ideal for sharing products, articles and links.
---
## How inline mode works

**Inline mode** lets people use a bot without opening a chat with it. In any conversation, group or channel, the user types `@botname` and a query into the input field, for example `@shopbot sneakers`. A list of results appears above the keyboard, and the chosen result is sent to the current chat marked "via @botname".

Key properties:

- the bot **does not need to be a member** of the chat where it is called;
- the bot **cannot see the conversation**, only the query text and user info;
- the user sends the message, so the other people see it from that user.

## How it works under the hood

1. Enable the mode in BotFather with `/setinline`, where you also set the placeholder hint.
2. As the user types, the bot receives an **`inline_query`** update: the query text, an `offset` for pagination and usually the type of chat the user is typing in.
3. The bot replies with **`answerInlineQuery`**, sending up to 50 results per answer.
4. To learn which result was picked, enable `/setinlinefeedback`; you then receive `chosen_inline_result` updates.

Useful answer parameters:

- `cache_time`: how many seconds Telegram caches the results on its side;
- `is_personal`: cache per user when results are personalized;
- `next_offset`: load the next batch as the user scrolls;
- `button`: a button above the results that opens a private chat with the bot or a Mini App, for example to sign in.

## Result types

| Type | What gets sent |
|---|---|
| Article | a text message, often with a preview and buttons |
| Photo, GIF, Video | media by URL or already uploaded to Telegram |
| Audio, Voice, Document | audio, voice note, file |
| Location, Venue | a map point or a place with an address |
| Contact | a contact card |
| Game | a game registered with the bot |

Media also have "cached" variants that use the `file_id` of a file already on Telegram's servers, which is faster and more reliable than external URLs. Any result can carry an **inline keyboard**, for example an "Open in store" button.

## Business uses

- **Sharing products.** A shopper searches through `@shopbot`, sends a card with photo and price to a friend or family chat, and a button leads to the bot or Mini App to order.
- **Knowledge base and support.** A support agent drops a ready answer or a link to a guide straight into the customer conversation.
- **Referral links and promo codes.** Users send a personal invitation into any chat.
- **Content lookup.** Articles, recipes, schedules, exchange rates: anything people discuss in chats.
- **Group decisions.** Sending a booking slot, a poll or a meeting address into a group chat.

## Common mistakes

- **Slow answers.** Users wait for results on every keystroke. Search an index rather than scanning, and avoid heavy external API calls per character.
- **Nothing on an empty query.** When the user has typed only `@botname`, show popular or recent items.
- **Wrong caching.** Personal prices or account data without `is_personal` can be served to other users from the cache.
- **Treating buttons like normal messages.** An inline message has no regular `message` object; callback queries carry an `inline_message_id`, and edits must use it.

## FAQ

### Do I need to add the bot to a group to use inline mode?

No. Inline mode works in any chat where the user can send messages, unless group admins have restricted messages sent via bots.

### Can the bot read messages in the chat where it was called?

No. It receives only the query text, user info and, if the user allowed it, location. The rest of the conversation is not visible to it.

### How is inline mode different from inline buttons?

Inline buttons are attached to the bot's messages in its own chat. Inline mode is calling the bot via `@botname` in any other chat. The only link between them is the `switch_inline_query` button that launches inline mode.
