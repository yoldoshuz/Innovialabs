---
title: What Are Tokens in LLMs and Why They Affect Price and Quality
description: How language models split text into tokens, why Russian and Uzbek use more tokens than English, and how tokens drive API costs and limits.
summary: A token is a chunk of text the model works with; APIs bill per token and limits are measured in tokens, so the same text in Russian or Uzbek usually costs more than in English.
---
## What a token is

A **token** is the smallest unit of text a language model works with. It is not a word or a letter but a fragment: a whole short word, part of a long word, a punctuation mark, or a space together with the start of a word.

The model never sees raw text. First, a **tokenizer** turns the string into a sequence of numbers — token IDs from the model's vocabulary. The model reads those numbers and generates its answer one token at a time.

For example, "Hello, world" might become three or four tokens: `Hello`, `,`, ` world`. A long or rare word gets split into several pieces.

## Why Russian and Uzbek cost more than English

Tokenizer vocabularies are built from large text collections where English dominates. As a result:

- common English words often become **a single token**;
- Russian words with endings and prefixes split into **several pieces**;
- Uzbek text, especially with characters like ‘ and ’, often splits even further because there is less of it in training data.

The outcome: the same idea in Russian or Uzbek can take noticeably more tokens than in English. How many more depends on the specific model and its tokenizer. Newer models generally handle non-English languages better, but the gap usually remains.

## How tokens affect price

Most model APIs charge **per token**, counted separately:

- **input tokens** — your prompt, system instruction, chat history, attached documents;
- **output tokens** — what the model generated (usually priced higher than input).

In practice this means:

- a long system instruction is paid for **on every request**;
- chat history grows with each message, so each new reply costs more than the previous one;
- asking for "a detailed answer" directly increases the bill.

## How tokens affect limits and quality

Every model has a **context window** — the maximum number of tokens it processes at once (input and output together). There is usually a separate limit on response length too.

The more tokens go to overhead, the less room is left for what matters:

- a long document in Uzbek may not fit where the same document in English would;
- if the answer hits the limit, it **stops mid-sentence**;
- an overloaded context weakens the model's attention to detail.

## How to save tokens without losing quality

1. **Trim the system prompt.** Remove repetition and pleasantries; keep the rules and examples.
2. **Do not send the whole history.** Keep recent messages and replace older ones with a short summary.
3. **Limit response length** — both in the instruction and with the max-tokens parameter.
4. **Send only what is needed.** Pass relevant fragments instead of an entire document (this is what RAG is for).
5. **Use prompt caching** if your provider supports it: the repeated part of a request becomes cheaper.
6. **Match the model to the task.** Classification or field extraction is often fine on a small, cheaper model.

## How to count tokens in advance

Major providers offer tokenizers or token-counting endpoints. For OpenAI models you can use the `tiktoken` library:

```python
import tiktoken

enc = tiktoken.get_encoding("cl100k_base")
text = "How many tokens are in this sentence?"
print(len(enc.encode(text)))
```

Different models use different tokenizers, so count with the tool that matches your model. Before launching a project, run typical requests in every language you need through a counter — that way your budget rests on your own data.

## FAQ

### Is a token the same as a word?

No. A short common word can be one token, while a long or rare word can be several. Spaces and punctuation are part of tokens too.

### Is it cheaper to write prompts in English?

English instructions are usually shorter in tokens, and many teams write them in English while keeping the answer in the target language. Still, check quality: some tasks work better when the instruction and data share a language.

### Why did the model's answer get cut off?

Most likely it hit the output token limit or the context window. Raise the response limit, shorten the input, or ask the model for a shorter answer.
