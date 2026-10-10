---
title: What Is a Large Language Model (LLM) and How Does It Work
description: A plain explanation of LLMs: how a model learns from text, why it predicts the next token, what it can do and where its limits are for business.
summary: An LLM is a neural network trained on huge amounts of text to predict the next piece of text; answering, summarizing and writing grow out of that skill, but the model can be confidently wrong and does not know your fresh data.
---
## In short: what an LLM is

A **Large Language Model (LLM)** is a neural network trained on an enormous amount of text that can continue text. Given your question, it generates the most fitting continuation one piece at a time, and that is the answer you see.

ChatGPT, Claude, Gemini and Llama are all LLMs or products built on them. "Large" refers to the huge number of parameters (internal adjustable numbers) and the volume of training data.

## What a token is

A model works with **tokens**, not words. A token is a chunk of text: a whole word, part of a word or a punctuation mark. A long or rare word may be split into several tokens.

Tokens matter in two practical ways:

- **cost**: APIs usually charge by the number of input and output tokens;
- **context window**: how many tokens the model can consider at once (your request, documents and its own answer).

## How an LLM is trained

Training happens in several stages.

1. **Pre-training.** The model sees a huge corpus of text and learns to guess the next token. When it is wrong, its internal weights are nudged slightly. Repeated an enormous number of times, this makes the model absorb grammar, facts, style and logical connections.
2. **Instruction tuning.** Using "question and good answer" examples, the model learns to follow requests instead of just continuing text.
3. **Learning from feedback.** People or other models rate answers, and the model is shifted toward helpful, safe and accurate responses.

Modern LLMs are built on the **Transformer** architecture with an **attention** mechanism: when generating each token, the model weighs which parts of the context matter most.

## Why simple prediction produces so many skills

To predict the continuation of any text well, a model has to capture meaning. That one ability turns into many tasks:

| Task | What it looks like to the model |
|---|---|
| Answering a question | Continue the question with the most likely answer |
| Summarizing | Continue a long text with its short version |
| Translating | Continue the text with the same meaning in another language |
| Writing code | Continue a task description with code |
| Classifying | Continue a customer message with the right category |

## Key limitations

Understand these before you build an LLM into business processes.

- **Hallucinations.** The model generates plausible text; it does not check facts. It can confidently invent a number, a link or a name.
- **Knowledge cutoff.** The model knows the world only up to the end of its training and does not know your internal data unless you provide it.
- **Limited context.** Anything that does not fit in the window is invisible to the model.
- **Non-determinism.** The same prompt can produce slightly different answers.
- **Weak at exact calculation.** Arithmetic and strict logic are safer to hand to code or external tools.
- **Privacy.** You need to know where the data you send to a cloud model goes.

## How teams work around these limits

- **RAG (Retrieval-Augmented Generation)**: before answering, the system finds relevant company documents and passes them to the model along with the question.
- **Tool use**: the model calls a calculator, search, database or API instead of guessing.
- **Clear prompts**: a role, an answer format, examples and an instruction not to invent anything missing from the sources.
- **Human review** where the cost of a mistake is high: legal, medical and financial texts.

## FAQ

### Does an LLM understand text like a person?

Not in the human sense. The model has learned the statistical patterns of language so well that its answers look meaningful, but it has no experience or intentions of its own and can fail where a person would not.

### Why does ChatGPT sometimes make up facts?

Because its job is to generate a likely continuation, not to look up a verified fact. If the exact data is not in the context, the model may fill the gap with a plausible invention. RAG, source citations and review help.

### Can an LLM be trained on my company's data?

Usually you do not need to retrain the model: passing the right documents through RAG is enough. Fine-tuning makes sense when you need a specific style or answer format across a large volume of similar tasks.
