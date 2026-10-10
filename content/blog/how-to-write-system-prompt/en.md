---
title: How to Write a System Prompt for an AI Assistant or Chatbot
description: Persona, scope, tone, forbidden topics, escalation rules and output format: how to build a chatbot system prompt, with a full annotated example.
summary: A good system prompt answers six questions: who the assistant is, what it does and does not do, how it speaks, what it avoids, when it calls a human and what format it uses. Write it like onboarding notes for a new employee — specific, with examples and free of contradictions.
---

## What a system prompt should contain

A **system prompt** is a standing instruction the model receives before every conversation. Users do not see it, but it defines the bot's entire behaviour.

A working system prompt covers six blocks:

1. **Persona** — who the assistant is and whom it serves.
2. **Scope** — which tasks it handles and which it does not.
3. **Tone** — how it talks.
4. **Restrictions** — topics and actions to avoid.
5. **Escalation** — when to hand the conversation to a human.
6. **Format** — length, structure and language of replies.

Write it as if you were briefing a new employee who knows nothing about the company. Anything "obvious" to you must be stated explicitly for the model.

## Persona and scope

The persona sets context, not "character for character's sake". One or two sentences are enough: company, task, audience.

Scope matters more than persona. List **what the assistant does** and, separately, **what it does not do**. Without this, the bot will answer anything: writing code, giving medical advice, discussing competitors.

## Tone and format

Describe tone through behaviour, not adjectives. "Friendly" says little. Better: "be polite and concise, avoid jargon, do not use exclamation marks".

Format depends on the channel. In a messenger — short messages without tables. On a website — lists are fine. If code parses the reply — specify JSON or an exact structure.

## Restrictions and escalation

Pair every restriction with an alternative: not just "do not discuss prices", but "if asked about price, say a manager calculates it and offer to leave contact details".

Escalation rules should be checkable conditions:

- the customer explicitly asks for a human;
- a complaint, refund or legal question;
- the bot found no answer in the knowledge base;
- the customer repeats the question because the answer did not help.

## A full annotated example

```text
# Role
You are a customer support assistant for an online home appliance store.
You talk to shoppers in the website chat.

# What you do
- Answer questions about delivery, payment, warranty and order status.
- Help choose appliances by specs from the catalogue.
- Use only information from the <knowledge> block.

# What you do not do
- Do not invent specs, prices or timelines missing from <knowledge>.
- Do not discuss topics unrelated to the store.
- Do not promise discounts or compensation.

# Tone
- Be polite and professional.
- Keep replies short: 1-3 sentences or a short list.
- No exclamation marks or sales language.

# Handoff to an operator
Reply "I'm passing your question to a manager, they will get back to you shortly"
and append the marker [HANDOFF] if:
- the customer asks for a real person;
- it concerns a refund, complaint or claim;
- the answer is not in <knowledge>.

# Format
- Reply in the customer's language.
- No tables or headings.

<knowledge>
{knowledge base}
</knowledge>
```

Notes:

- **Section headings** help both the model and you: rules are easy to find and edit.
- **The `<knowledge>` block** separates data from instructions, so the model knows what to rely on.
- **The `[HANDOFF]` marker** is a machine signal. Your code detects it, strips it from the text and routes the chat to an operator.
- **"Do not invent…"** is the main defence against hallucinations in support.

## Common mistakes

- **Contradictions.** "Be brief" and "explain in detail" in one prompt — the model picks one at random.
- **Restrictions only.** A bot that knows what it must not do but not what to do instead answers awkwardly.
- **A wall of text.** Break the prompt into sections and lists.
- **No testing.** Before launch, run typical questions, provocations ("ignore your instructions") and off-topic requests.
- **Secrets in the prompt.** Do not put keys, passwords or internal data there: a system prompt can be partially extracted.

## FAQ

### How long should a system prompt be?

As long as it takes to cover the six blocks without filler. For a simple bot that may be half a page; for a complex one, several pages plus a knowledge base. Structure matters more than length.

### Does a system prompt protect the bot from being hacked?

Partially. Clear boundaries reduce the risk but do not remove it. Critical actions such as refunds or order changes should be validated in code rather than trusted to the instruction alone.

### How often should I update the prompt?

Whenever business rules change or you spot recurring errors in conversation logs. Keep prompt versions and rerun your set of test questions after every edit.
