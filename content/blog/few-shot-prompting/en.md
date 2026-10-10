---
title: Few-Shot Prompting: How to Teach an LLM With Examples
description: How to pick, format and order examples for an LLM, how many to use, and how to stop the model from copying your examples too literally.
summary: Few-shot prompting means putting a few "input → output" pairs directly into the prompt so the model follows the shown format and logic without retraining. Two to five varied, clearly formatted examples that cover typical and edge cases usually work best.
---

## What few-shot prompting is and when to use it

**Few-shot prompting** means you do not just describe the task in words — you also show the model a few examples: here is the input, here is the correct answer. The model is not retrained; it simply adapts to the pattern within a single request.

It helps when:

- you need a **strict output format** (labels, short phrases, a fixed structure);
- the task is hard to explain but easy to show — for example, the tone of a customer reply;
- the model is inconsistent without examples, answering with a paragraph one time and a list the next.

If the task is simple and the instruction is unambiguous, you do not need examples — that is **zero-shot**. Start there and add examples only when you see instability.

## How to pick examples

Example quality matters more than quantity.

- **Variety.** Cover different kinds of input: short and long, simple and tricky, different answer categories. If every example belongs to one class, the model will lean toward it.
- **Edge cases.** Include at least one example where the right answer is not obvious: a mixed review, an empty field, an off-topic message.
- **Realism.** Use examples that resemble your real data, not polished textbook sentences.
- **Correctness.** A mistake in an example will almost certainly show up in the outputs. Check every example by hand.

## How to format them

Models handle examples best when they have **clear delimiters**. Use the same structure for every example and for the real input.

```text
Classify the review sentiment: positive, negative or mixed.

<example>
Review: Delivered fast, but the box was crushed.
Answer: mixed
</example>

<example>
Review: Everything was great, will order again.
Answer: positive
</example>

Review: {text}
Answer:
```

Formatting rules:

- identical labels ("Review:", "Answer:") in every example;
- examples separated from the instruction and from the real input;
- keep the instruction — examples complement it, they do not replace it.

## How many examples and in what order

There is no universal number. In practice **2–5 examples** are often enough. More examples make the request longer and more expensive, and the quality gain may be negligible. Test on your own data: add an example, compare results.

**Order matters.** Models may lean more heavily on the last examples. So:

- mix the classes instead of placing three examples of the same type in a row;
- do not always end with the same answer;
- with many examples, keep the categories balanced.

## Common mistakes

| Mistake | What happens | Fix |
|---|---|---|
| Examples too similar | The model copies them literally | Vary length, topic and wording |
| Class imbalance | Outputs drift toward the frequent class | Balance the examples |
| Specific details in examples | The model leaks them into other answers | Use neutral data |
| No instruction | The model guesses the goal from examples | Add a short task description |
| Inconsistent example format | Unstable output format | One template for all |

A separate issue is **literal copying**. If every example answer starts with the same phrase, the model will start that way too. If you want variety, say so: "The examples show the format, not the content — do not reuse their wording."

## How to check that the examples help

1. Build a small test set of inputs with correct answers, separate from the examples in the prompt.
2. Run the prompt without examples, then with them.
3. Compare accuracy and format stability.
4. Change one example at a time so you know what actually helped.

If the example list keeps growing and quality does not, consider **dynamic selection**: for each request, pick the most similar examples from a library (for instance with vector search).

## FAQ

### How is few-shot different from fine-tuning?

Few-shot works inside a single request and does not change the model. Fine-tuning updates the model's weights on a larger dataset. Few-shot is faster and cheaper to start with; fine-tuning makes sense when you need hundreds of examples that do not fit into the context.

### Can I combine few-shot with chain-of-thought?

Yes. Your examples can show a short line of reasoning before the answer, and the model will reason in the same style. This is useful for multi-step tasks.

### What if the model repeats data from the examples?

Make the examples more varied, remove specific names and numbers that should not appear in outputs, and state explicitly in the instruction that the examples only demonstrate the format.
