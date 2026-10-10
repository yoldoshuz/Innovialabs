---
title: What Is LLM Fine-Tuning and When Is It Worth Doing
description: Fine-tuning changes a model's behavior using your examples but does not teach it new facts. What data it needs, what drives cost and when it beats RAG.
summary: Fine-tuning is extra training of a ready-made language model on your examples so it reliably answers in the right format and style; for new knowledge RAG is usually better, and you should start with prompts.
---
## The short answer

**Fine-tuning** is additional training of an existing language model on **your own set of examples** of "input, correct output". Afterwards the model more reliably does what you showed it: keeps a format and tone, classifies by your rules.

The key thing to remember: fine-tuning is good at changing a model's **behavior** and poor at adding **knowledge**. If you need a bot that knows your price list or policies, RAG is usually the right tool.

## What actually changes in the model

During training, the model's **weights** are adjusted: the internal parameters that determine its output. Often not all weights are changed, only a small add-on to them (methods like **LoRA**), which is cheaper and faster.

What fine-tuning gives you:

- **Consistent format:** strict JSON, a fixed answer structure.
- **Style and tone:** brand voice, brevity, the right terminology.
- **A narrow task:** ticket classification, field extraction, labeling by your rules.
- **Shorter prompts:** instructions are "baked in", so you do not send them every time.

What it does not reliably give: up-to-date facts, frequently changing data and source citations.

## Prompting, RAG or fine-tuning

| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| What it changes | Instructions in the request | Adds retrieved documents to the request | Model weights |
| New knowledge | No | Yes, and easy to update | Poorly |
| Format and style | Good, but not always consistent | No effect | Consistent |
| Time to launch | Fast | Medium | Longest |
| What you need | Well-written instructions | A document base and search | A high-quality example set |

The sensible order is almost always: **prompting first**, then **RAG** for knowledge, and only if that is not enough, **fine-tuning**. The approaches can be combined.

## When fine-tuning is worth it

- A prompt with examples no longer helps: the model **regularly breaks the format** or style.
- The task is **narrow and repetitive**, with high request volume.
- You want to move to a **smaller model** that, once fine-tuned, handles the task as well as a larger one but runs faster and cheaper.
- You have **hundreds or thousands of high-quality examples** of correct answers.

## What data you need

- **Input and reference-answer pairs** in the format your training platform requires.
- **Quality over quantity.** The model will learn mistakes and contradictions in the examples too.
- **Variety:** examples should cover real cases, including hard ones.
- **A separate test set** the model was not trained on, so you can compare "before" and "after" honestly.
- **No personal data** unless you have grounds to use it.

## What drives the cost

There is no single figure; the cost is made up of factors:

- **base model size** and method (full fine-tuning or LoRA);
- **data volume** and number of training epochs;
- **dataset preparation**, often the most labor-intensive part because people do it;
- **infrastructure:** a provider's cloud service or your own GPUs;
- **running cost** of the model after training and its upkeep: when a new base model comes out, you may need to retrain.

## Common mistakes

- Fine-tuning so the model "remembers" company documents. That is what RAG is for.
- Starting without measurement: no metric means no way to tell if it was worth it.
- Building a dataset from random conversations without review.
- Forgetting that the model may get worse at tasks not covered by training.

## FAQ

### Can I fine-tune ChatGPT or Claude?

Some providers let you fine-tune certain models via their API or cloud platforms. The list of available models changes, so check the provider's current documentation.

### How many examples do I need?

It depends on the task. For format and style a small set is sometimes enough; complex classification needs more. Start small, measure the result and add data as needed.

### Does fine-tuning eliminate hallucinations?

No. It can reduce errors on a specific task, but it does not guarantee factual accuracy. For fact-based answers, RAG with sources is more reliable.
