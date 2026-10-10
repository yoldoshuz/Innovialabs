---
title: Transformer Architecture Explained: Attention in Plain Words
description: What self-attention is, how encoders differ from decoders and why transformers replaced RNNs, explained with simple diagrams and no formulas.
summary: A transformer processes the whole text at once and, for each word, uses attention to decide which other words to rely on; it trains faster and keeps context better than RNNs.
---
## The short version

The **transformer** is the neural network architecture behind modern language models. Its core idea is **attention**: while processing each word, the model looks at every other word in the text and decides which ones matter right now.

Example: "The cat did not jump on the table because **it** was tired." To understand that "it" means the cat, not the table, the model has to link these words. Attention makes that link directly, no matter how many words sit in between.

## How self-attention works

Text is first split into **tokens** (words or word pieces), and each becomes a vector, a list of numbers describing meaning. Then for every token the model computes three vectors:

- **Query**: "what am I looking for?"
- **Key**: "what can I offer?"
- **Value**: "what information will I pass on?"

A library analogy: you arrive with a query, compare it with the labels on the shelves (keys) and take the contents (values) of the best-matching shelves, blended by how well they matched.

```text
"it" --query--> compared with the key of every word
                The cat  did  not  jump  on  the  table ... tired
attention:      high     low  low  low   low low  medium    medium
result: new representation of "it" = blend of values with these weights
```

There are several such "attention heads", and each learns to notice something different: one grammar links, another meaning, and so on. This is **multi-head attention**. Many attention layers are stacked, and understanding of the text deepens layer by layer.

Since attention alone does not know word order, **positional information** is added to the vectors to tell the model where each token sits.

## Encoder vs decoder

The original transformer had two parts:

| Part | What it does | Typical uses |
|---|---|---|
| **Encoder** | Reads the whole text and builds an understanding; every word sees all others | Classification, search, embeddings |
| **Decoder** | Generates text one token at a time; sees only previous tokens | Chatbots, text and code generation |
| **Encoder + decoder** | Understands the input and generates an output | Machine translation, summarization |

Most popular chat models are **decoder-only**: they repeatedly predict the next token based on everything written so far.

## Why transformers replaced RNNs

**RNNs** (recurrent neural networks) read text one word at a time, passing a "memory" from step to step. That caused problems:

- **Slow training.** Steps ran strictly in sequence and could not be parallelized well on GPUs.
- **Short memory.** Information from the start of a long text gradually faded.

A transformer processes all tokens **in parallel** and connects any two words **directly** through attention. That made it possible to train models on huge amounts of data and to hold long-range context better.

The trade-off: attention compares every token with every other token, so cost grows quickly with text length. That is why models have a **context window** limit, and researchers keep looking for cheaper attention variants.

## What this means in practice

- It explains why a model has a **context limit** and why long prompts cost more.
- It explains why a model "remembers" only what is in the current context: it has no memory of its own between requests.
- Document search often uses encoder models (embeddings), while answers come from decoders. That is how RAG is built.

## FAQ

### Do I need to understand transformer math to use LLMs?

No. To work with models through an API, it is enough to understand tokens, the context window and that the model predicts the next token. The math matters when building models themselves.

### Are transformers only used for text?

No. The same attention idea is applied to images, audio and code: data is split into token-like chunks and processed in a similar way.

### Why does a model sometimes "forget" the start of a long conversation?

If the conversation is longer than the context window, older messages are cut or compressed. Even inside the window, the model may pay less attention to some details, so it helps to restate what matters.
