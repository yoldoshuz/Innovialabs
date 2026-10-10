---
title: AI Hallucinations: Why LLMs Make Things Up and How to Reduce It
description: Why language models confidently state false facts and which techniques actually reduce hallucinations: grounding, citations, refusals and verification.
summary: An LLM predicts plausible text rather than checking facts, so it sometimes makes things up. Grounding in your data (RAG), demanding citations, allowing "I don't know" and automated checks reduce this.
---

## Why models make things up

A **hallucination** is an answer that sounds confident and fluent but is factually wrong: a law article that doesn't exist, a library function nobody wrote, an incorrect date.

The cause lies in how the model works. An LLM is trained to continue text in the most plausible way. It has no built-in fact database it consults before answering. When the model "doesn't know", it still generates text that looks like a correct answer.

The main causes:

- **Gaps in training data.** The model knows little about rare, local or recent topics, but answers anyway.
- **Outdated knowledge.** Training data stops at a certain date, while the world keeps changing.
- **Pressure from the question.** "What is the number of the regulation on..." assumes a number exists, and the model happily "recalls" one.
- **Long or noisy context.** With many documents in a prompt, the model can mix details from different sources.
- **Style over substance.** The model reproduces form well (references, numbers, terms) even where there is no content behind it.

## Where hallucinations hurt most

- Legal, medical and financial answers.
- Specific numbers, dates, names, links and quotes.
- Code calling APIs that don't exist in the library.
- Customer-facing answers on behalf of a company: prices, terms, deadlines.

The more expensive a mistake, the more layers of protection you need.

## How to reduce hallucinations in practice

### 1. Grounding

The most effective technique is to give the model the data it needs right in the request. This is **RAG** (Retrieval-Augmented Generation): the system finds relevant fragments in your documents and passes them to the model along with the question. The model answers from the text, not "from memory".

### 2. Require citations

Ask the model to state which fragment each fact comes from. This disciplines the answer and makes it fast to verify. If no citation can be found, the claim is questionable.

### 3. Allow refusals

State explicitly in the instructions: "If the answer is not in the provided materials, say you don't know." Without this permission, models tend to answer at any cost.

```text
Answer only based on the documents below.
If the answer is not there, reply: "The documents do not contain this information".
For each fact, cite the document number in square brackets.
```

### 4. Verification steps

- **Self-check:** a second request asks the model to compare its answer with the sources and flag unsupported claims.
- **Structured output:** JSON with a strict schema is easier to validate in code than free text.
- **Checks in code:** links are opened, IDs are matched against a database, generated code is compiled and tested.
- **Human in the loop:** for critical answers, a staff member must confirm.

### 5. Settings and wording

- A low **temperature** makes answers less "creative" for factual tasks.
- A narrow role and clear boundaries work better than "answer any question".
- Split a complex task into steps instead of one giant request.

### 6. Evaluation (evals)

Collect a set of real questions with reference answers and run them through the system regularly. This shows whether changes to the prompt, model or retrieval actually help, instead of judging by a couple of lucky examples.

## Common mistakes

- Trusting an answer because it sounds confident.
- Adding RAG without checking whether retrieval finds the right fragments. Poor retrieval is a frequent source of errors.
- Not testing questions whose answers are missing from the knowledge base.
- Letting AI answer customers on sensitive topics without any review.

## FAQ

### Can hallucinations be eliminated completely?

No. They can be reduced significantly and made visible through citations and checks, but errors cannot be fully ruled out in a generative model. That is why important decisions need oversight.

### Will a newer model solve the problem?

Stronger models make fewer mistakes, but the underlying principle is the same. Grounding, refusals and verification remain necessary with any model.

### What should I implement first?

Start with RAG over your documents, an "if you don't know, say so" instruction and a small set of test questions. This gives the main effect for moderate effort.
