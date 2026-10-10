---
title: What Is Function Calling (Tool Use) in LLMs
description: How a language model returns a structured function call, how your code executes it, and where it helps: order status, booking slots, CRM actions.
summary: Function calling means the model does not act itself; it returns JSON with a function name and arguments, your code runs the function and sends the result back for the answer.
---
## The short answer

**Function calling** (also called **tool use**) is how you connect a language model to your systems. You describe a set of functions to the model: name, purpose and parameters. When a user asks for something that needs real data, the model replies not with text but with a **structured call**: "call `get_order_status` with `order_id = 1042`".

Key point: the model **executes nothing on its own**. It only decides which function to call and with which arguments. Your code runs it, and your code controls access.

## How the loop works

1. You send the model the user message and a **list of tools** with a JSON Schema for parameters.
2. The model returns either a normal answer or a tool call request.
3. Your code validates the arguments and calls the real function (database, API, CRM).
4. The result goes back to the model as a "tool result" message.
5. The model writes a clear answer for the user, or asks for another tool.

A tool definition usually looks like this:

```json
{
  "name": "get_order_status",
  "description": "Returns the status of an order by its number",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "Order number" }
    },
    "required": ["order_id"]
  }
}
```

Exact field names differ between providers, but the idea is the same everywhere: name, description, parameter schema.

## Practical examples

- **Order status.** A customer writes "where is order 1042?". The model calls `get_order_status`, gets "handed to courier" and replies in plain language.
- **Booking a slot.** The model first calls `get_free_slots(date)`, offers options, then after the customer picks one calls `book_slot(slot_id, phone)`.
- **CRM.** A manager types "create a deal for Acme LLC, consulting". The model fills `create_deal` arguments from free text.
- **Knowledge base search.** A `search_docs(query)` tool is the core of many RAG bots.

## What matters in practice

- **Good descriptions.** The model picks a tool based on its `description`. Be specific about when to use it and when not to.
- **Argument validation.** The model may get a date format wrong or invent an ID. Check everything on the server.
- **Access control.** A user must not see someone else's order just because they typed its number. Check ownership from the session, not from the model's words.
- **Confirm risky actions.** Payments, deletions, sending emails: only after an explicit "yes" from the user.
- **Readable errors.** If a function fails, return a short error message to the model so it can ask the user again.
- **Few tools.** Dozens of similar functions confuse the model. A handful of clear ones works better.

## Common mistakes

| Mistake | What to do |
|---|---|
| Trusting model arguments blindly | Validate with a schema and business rules |
| Exposing a tool with broad permissions | Narrow functions with minimal access |
| No limit on the number of steps | Cap iterations in the loop |
| Sending a huge raw API response to the model | Return only the fields needed |

## FAQ

### Are function calling and an AI agent the same thing?

No. Function calling is the mechanism; an agent is a system that decides in a loop which tools to call to reach a goal. Agents are built on top of function calling.

### Can the model call a function that is not in the list?

It can return an unexpected name or wrong arguments, so your code should execute only known functions and reject everything else.

### Do I need my own model for this?

No. Major commercial models and many open models support tool calling through their APIs. The real work is describing functions well and writing reliable code around them.
