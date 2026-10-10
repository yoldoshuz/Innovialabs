---
title: Chain-of-Thought Prompting: Getting LLMs to Reason Step by Step
description: When step-by-step reasoning improves LLM accuracy, how to prompt for it, and how to hide the reasoning from end users in production.
summary: Chain-of-thought asks the model to reason step by step before answering, which helps with calculations, logic and multi-condition tasks. In production you separate the reasoning with tags or JSON fields and show users only the final answer.
---

## What chain-of-thought is and when it helps

**Chain-of-thought (CoT)** is a technique where the model writes out intermediate steps before giving its answer. Models generate text sequentially, so the written steps become support for the next ones — fewer errors made "in its head".

CoT usually helps with tasks where the answer cannot be produced in one jump:

- **calculations**: totals, discounts, deadlines, unit conversions;
- **logic with several conditions**: "does this customer qualify for the plan if…";
- **document analysis**: finding contradictions, cross-checking data from different places;
- **classification with complex rules**, where exceptions matter.

Where CoT barely helps: simple fact extraction, translation, short templated answers. There it only adds length, latency and cost.

Many current models can reason on their own (so-called reasoning models or an "extended thinking" mode). For them an explicit "think step by step" is often unnecessary — enabling the right mode in the API is enough.

## How to prompt for reasoning

### Simple version

Add an instruction: "First reason step by step, then give the answer." That alone changes the model's behaviour.

### Structured version

It is better to define concrete steps and separate the reasoning from the answer:

```text
Decide whether the customer gets free delivery.

Rules: {rules}
Order: {order data}

First, inside <thinking>, step by step:
1. Write down the order total and city.
2. Check each rule.
3. Account for exceptions.

Then, inside <answer>, give only "yes" or "no" and one sentence of reasoning.
```

### With examples

You can combine it with few-shot: show a short reasoning and answer in each example, and the model will follow that reasoning style.

## How to hide reasoning in production

A chatbot user does not need to see the model's scratchpad. Options:

| Method | How it works | Good for |
|---|---|---|
| Tags | Reasoning in `<thinking>`, answer in `<answer>`; code shows only `<answer>` | Plain text output |
| JSON fields | `{"reasoning": "...", "answer": "..."}`; only `answer` reaches the UI | Integrations, APIs |
| Two calls | The first call reasons, the second writes the user-facing reply | When you need polished text |
| Built-in reasoning mode | The model thinks in a separate block of the API response | When the model supports it |

Parsing example:

```python
import re

def extract_answer(text: str) -> str:
    match = re.search(r"<answer>(.*?)</answer>", text, re.DOTALL)
    return match.group(1).strip() if match else ""
```

If the tag is missing, do not show the raw text to the user. Retry the request or return a neutral error message.

## Common mistakes

- **CoT everywhere.** Step-by-step reasoning on simple tasks just burns tokens.
- **Reasoning after the answer.** If the model writes the answer first and then "justifies" it, accuracy does not improve. Reasoning must come **before** the answer.
- **Reasoning visible to users.** The scratchpad may contain doubts, internal rules and irrelevant details.
- **Treating reasoning as proof.** The steps look logical but can still contain an error. For critical calculations, verify the result in code.
- **No limit.** Unconstrained reasoning can get very long. Define specific steps or cap the length.

## How to tell whether CoT actually helps

1. Build a set of test tasks with known answers.
2. Compare accuracy with and without CoT.
3. Account for the cost: response length and latency.
4. Keep CoT only where the quality gain is worth it.

## FAQ

### Do reasoning models need chain-of-thought prompting?

Usually they do not need an explicit request to reason — they do it themselves. It still pays to describe the task, criteria and output format clearly.

### Can I log the model's reasoning?

Yes, and it is useful for debugging: you can see at which step the model went wrong. Keep in mind that logs may contain personal data from the request and store them accordingly.

### Does CoT make answers fully reliable?

No. It reduces errors in multi-step tasks but does not eliminate them. For numbers and rule checks, it is safer to verify the result programmatically.
