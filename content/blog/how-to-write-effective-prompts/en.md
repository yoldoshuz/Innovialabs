---
title: How to Write Effective Prompts: Structure, Examples, Templates
description: A reusable five-part prompt structure (role, context, task, constraints, format) with before-and-after examples for common business tasks.
summary: A good prompt has five parts: role, context, task, constraints and output format. The more precisely you describe the situation and the result you want, the fewer revisions you need afterwards.
---

## The short answer

A model knows nothing about your company, customers or goal until you tell it. So a weak prompt is almost always **missing context**, not using the "wrong words". A structure that works:

1. **Role**: who the model acts as.
2. **Context**: what is going on, for whom, what data exists.
3. **Task**: what exactly to do, as one clear action.
4. **Constraints**: what to avoid, length, tone, language.
5. **Format**: what the answer should look like.

## A template you can copy

```text
Role: you are a [specialist] who [does what].
Context: [company, audience, situation, input data].
Task: [one specific action].
Constraints: [length, tone, what not to do, which language].
Format: [list, table, JSON, email with a subject line, etc.].
```

You do not have to label the parts "Role" or "Context". What matters is that the information is there.

## Example 1: an email to a customer

**Before:**

> Write an email to a customer about a delay.

**After:**

> You are an account manager at an online home appliance store. A customer ordered a fridge, and delivery is delayed by 3 days because of the supplier. The customer has already contacted support and is annoyed. Write a short apology email: explain the reason without shifting blame, give the new date, and offer free carrying to their floor. Tone: calm and respectful, no corporate jargon. Under 120 words, with a subject line.

In the second version the model does not have to guess the situation, tone or compensation.

## Example 2: data analysis

**Before:**

> Analyze sales.

**After:**

> You are an analyst at a retail chain. Below is a quarterly sales export by store (CSV). Find the 3 stores with the biggest revenue drop compared with the previous quarter and suggest possible causes based only on the data in the table. If the data is not enough to draw a conclusion, say so. Answer as a table: store, change, hypothesis, what to check.

The line "if the data is not enough, say so" reduces the risk of made-up conclusions.

## Example 3: a product description

**Before:**

> Describe the product: backpack.

**After:**

> You are a marketplace copywriter. Product: city backpack, 20 L, water-repellent fabric, 15.6-inch laptop compartment. Audience: students and office workers. Write a title under 60 characters and a 5-bullet description where each bullet is a benefit, not a spec. Do not use the words "perfect" or "best".

## Techniques that clearly improve results

- **Show an example of the answer you want.** One sample often beats a long description.
- **Separate instructions from data.** Put the text to process in quotes, tags or a block so the model does not confuse it with instructions.
- **Break big tasks down.** First the plan, then each part separately.
- **Say what to do, not only what to avoid.** "Use short sentences" is clearer than "don't write in a complicated way".
- **Ask for clarifying questions.** "If something is missing, ask first" saves iterations.
- **Iterate.** The first answer is a draft. Say specifically what to change.

## Common mistakes

| Mistake | Fix |
|---|---|
| No context | Describe the audience, goal and input data |
| Several tasks in one sentence | List the steps as a numbered list |
| Vague format | Specify length and structure |
| Asking to "make it better" | Name exactly what is wrong |
| Pasting confidential data | Anonymize it before sending |

## Turning prompts into a team tool

Save prompts that work as **templates with fill-in fields** in a shared doc or knowledge base. People stop reinventing requests and results become predictable. If a template is used constantly, it can be built into your CRM, a bot or an internal service via the API.

## FAQ

### Do I always need to set a role?

No, but it helps set the level of expertise and the style. Context and a clearly described result matter more than the role.

### Is a long prompt bad?

No, as long as every part is useful. A long prompt with relevant context usually beats a short one; repetition and contradictions make it worse.

### Do the same prompts work in ChatGPT, Claude and Gemini?

The role, context, task, constraints, format structure is universal. Models differ in details, so test important templates on the model you actually use.
