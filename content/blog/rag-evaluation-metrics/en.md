---
title: RAG Evaluation Metrics: Recall, Faithfulness and Relevance
description: Which RAG evaluation metrics to use, kept separate for retrieval and generation, how to compute them and how to tell whether retrieval or the LLM fails.
summary: Evaluate RAG in two layers: retrieval metrics (recall@k, MRR) show whether the right context was found, and generation metrics (faithfulness, answer relevance) show whether the model used it correctly. The split tells you immediately where to look.
---
## The short answer: why you split the metrics

RAG has two parts: **retrieval** and **generation** (the LLM). A bad answer can come from two different causes: the right document was never found, or the model found it and distorted it. A single "good/bad answer" score does not tell you what to fix.

So you measure **by layer**: first the quality of the retrieved context, then the quality of the answer relative to that context.

## Retrieval metrics

These need a test set: a question plus the documents (or chunks) that actually contain the answer.

| Metric | What it shows |
|---|---|
| **Recall@k** | Whether at least one relevant document is in the top k |
| **Precision@k** | What share of the top k is actually relevant |
| **MRR** | How high the first correct document ranks |
| **nDCG@k** | Ranking quality, accounting for degrees of relevance |
| **Context precision** | How much noise ended up in the LLM's context |

Computing recall@k and MRR:

```python
def recall_at_k(retrieved, relevant, k):
    return int(any(doc in relevant for doc in retrieved[:k]))

def reciprocal_rank(retrieved, relevant):
    for i, doc in enumerate(retrieved, start=1):
        if doc in relevant:
            return 1 / i
    return 0.0
```

Averages over the whole test set are your recall@k and MRR.

## Generation metrics

These judge the model's answer:

- **Faithfulness** — are all claims in the answer supported by the retrieved chunks? A low score means hallucinations.
- **Answer relevance** — does the answer address the question asked, not a neighboring one?
- **Correctness** — does the answer match the reference, when one exists?
- **Citation accuracy** — does the model cite the chunks it actually took facts from?

## How to compute generation metrics

Human labeling is reliable but expensive. In practice teams use **LLM-as-a-judge**:

1. Split the answer into individual claims.
2. For each, ask a judge model: is this supported by the context? Yes or no.
3. Faithfulness = the share of supported claims.

To make the judge trustworthy:

- Give it **clear criteria** and binary decisions rather than a 1–10 scale.
- Check it against a **small human-labeled sample** and see how often they agree.
- Keep the **prompt and model fixed**, or results across runs are not comparable.

Ready-made libraries for RAG evaluation exist, but understand the logic of each metric yourself so you can read the results correctly.

## Diagnosis: where it breaks

| Retrieval recall | Faithfulness | Likely cause | What to do |
|---|---|---|---|
| Low | Any | The right context is not found | Chunking, embeddings, hybrid search |
| High | Low | The model invents beyond the context | Prompt, citation instructions, another model |
| High | High, but off-topic answer | Poor answer relevance | Query rewriting, prompt |
| High, but low context precision | Dropping | Too much noise in context | Reranker, smaller k |

## Building an evaluation process

- Build a **test set from real user questions**, including hard ones and ones with no answer.
- Add questions where the system should honestly say **"I don't know"**.
- Run the evaluation **on every change**: model, prompt, chunking, retrieval.
- Change **one thing at a time**, or you will not know what made the difference.
- Read the bad examples yourself — numbers show where, examples show why.

## FAQ

### How many questions does a test set need?

Start with what you can label quickly and well — even a small set beats none. Keep adding real questions over time, especially the ones the system got wrong.

### Can I evaluate RAG without reference answers?

Partly. Faithfulness and answer relevance need only the question, context and answer. Correctness and retrieval metrics do require labeling.

### How far can I trust an LLM judge?

As far as it agrees with humans on your sample. Regularly compare its scores with manual labels, and avoid using the same model as both generator and sole judge without checking.
