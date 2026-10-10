---
title: LLM Context Window Explained: Limits, Long Documents, Tricks
description: What a language model's context window is, what happens when it overflows, the lost-in-the-middle effect and how to handle long documents.
summary: The context window is how much text, in tokens, a model sees in one request; anything that does not fit does not exist for it, so long documents are handled with summarization, chunking or RAG.
---
## What the context window is

The **context window** is the maximum amount of text, measured in tokens, a model processes in a single request. Everything counts toward it at once:

- the system instruction;
- the conversation history;
- attached documents and tool results;
- the answer the model generates.

A model does not remember past conversations on its own. Every request is a blank slate, and a chat's "memory" exists only because the application resends the history inside the window.

## What happens when it overflows

It depends on how the application is built:

- **the API returns an error** if the request is longer than the window;
- **the application drops old messages**, and the model "forgets" the start of the conversation;
- **the answer gets cut off** if no room is left for generation.

The second case is the dangerous one: there is no error, yet the model answers confidently without seeing key conditions from earlier in the chat.

## The lost-in-the-middle effect

Even if a document fits, the model is not equally attentive to every part of it. Research describes the **lost-in-the-middle** effect: models use information at the beginning and end of a long context more reliably than information in the middle.

What this means for you:

- put the **key instruction at the start**, or repeat it at the end;
- place the user's question **after the document**, not before it;
- do not add extra material "just in case" — noise makes the relevant part harder to find.

Modern models handle long context better than earlier ones, but you still need to test quality on your own data.

## How to handle long documents

| Approach | How it works | When it fits |
|---|---|---|
| Just a big window | Whole document in one request | One-off analysis of a single document |
| Chunking | Document split into parts, each processed separately | Translation, data extraction, part-by-part review |
| Map-reduce summarization | Summaries of parts, then a summary of summaries | Condensing very long texts |
| Rolling summary | Older part of the chat replaced with a short recap | Long chats, support assistants |
| RAG | Only relevant fragments are retrieved from a knowledge base | Questions over a large knowledge base |

## How to choose

1. **One document, one-off task** — if it fits in the window, send it whole.
2. **Many documents or a knowledge base** — use **RAG**: search picks a few matching fragments and the model answers from them.
3. **Long conversation** — keep recent messages verbatim and compress older ones into a summary.
4. **Part-by-part task** (translation, labeling) — split into chunks with a small overlap so meaning is not lost at the boundaries.

## Common mistakes

- **Assuming a big window solves everything.** Long context is more expensive, slower and does not guarantee attention to detail.
- **Cutting a document mid-sentence or mid-table.** Split by sections and paragraphs.
- **Ignoring language.** Russian and Uzbek text takes more tokens than English, so the window fills up faster.
- **Leaving no room for the answer.** Reserve tokens for generation in advance.

## FAQ

### Does the model remember what I wrote in a previous chat?

No, unless the application deliberately passes that information along. "Memory" features in chat services work the same way: saved facts are inserted into the context of a new request.

### If the window is huge, is RAG still needed?

In many cases, yes. RAG is cheaper and faster, works with knowledge bases that would not fit in any window, and lets you cite the sources of an answer.

### How can I tell the context is overflowing?

Signs include the model forgetting conditions from the start of the chat, contradicting itself, or answers being cut off. Log token counts per request so you see the problem before users do.
