---
title: How to Choose an Embedding Model for Search and RAG
description: How to compare embedding models on Russian and Uzbek quality, dimensions, cost and hosting, and how to benchmark them on your own data.
summary: Choose an embedding model by its results on your own documents and questions, not by a general leaderboard: build a small test set, run 2–4 candidates and compare how often the right passage lands in the top results.
---

## The main rule

An **embedding model** turns text into a vector, and it decides whether search finds the right passage. Public leaderboards are useful for a shortlist, but the final choice is made **on your data**: your languages, your terminology and the way your users phrase questions.

If staff and customers write in Russian and Uzbek while some documents are in English, test that specifically. A model's overall score tells you nothing about it.

## Selection criteria

### Multilingual quality

- Russian is well covered: most multilingual models handle it.
- **Uzbek** has less training data. Quality varies a lot between models, especially in Latin script with apostrophes (o‘, g‘) and when Latin and Cyrillic are mixed.
- **Cross-lingual retrieval** matters: a question in Uzbek should find an answer in a Russian document, if that is a real use case.

### Vector dimensions

Dimensions affect index size, memory and search speed. Bigger is not always better. Some models let you **truncate the vector** with a moderate quality loss, which helps with large indexes.

### Maximum input length

If chunks exceed the model's limit, text is silently cut. Match chunk size to the limit.

### Cost and hosting

| Option | Pros | Cons |
|---|---|---|
| API model | Quick start, no hardware | Data goes to the provider, pay per volume, service dependency |
| Open model on your server | Data stays with you, no per-request fee | Needs a server (often with a GPU), setup and maintenance |

Count not only indexing but **every user query**, which must be embedded too.

### Asymmetric retrieval

Many models expect different prefixes or modes for queries and documents. Skipping them hurts quality. Read the model card.

## How to benchmark on your data

1. **Build a set**: 50–100 real questions, each with the correct passage or document. Include questions in every language your users write in.
2. **Freeze chunking**: identical chunks for all models, or the comparison is unfair.
3. **Index** the documents with each candidate model.
4. **Compute metrics**:
   - **Recall@k**: the share of questions where the correct passage is in the top-k;
   - **MRR**: how high the correct passage ranks.
5. **Break results down by language**: a model can be strong in Russian and weak in Uzbek.
6. **Read the failures**: they often reveal a systematic issue, such as terms or abbreviations.

A minimal Recall@k calculation:

```python
def recall_at_k(results, gold, k=5):
    hits = sum(1 for q, ids in results.items() if gold[q] in ids[:k])
    return hits / len(results)
```

## What else improves search besides the model

- **Hybrid search** with a full-text index, for SKUs, numbers and rare terms.
- **A reranker** over the top-k candidates.
- **Chunk enrichment** with section headings.

Sometimes these steps give more than switching models.

## Common mistakes

- Choosing by leaderboard without testing your languages.
- Mixing vectors from different models in one index; they are incompatible.
- Ignoring query and document prefixes.
- Testing only on "convenient" questions written by developers.

## FAQ

### Can we switch models later?
Yes, but you will need to re-embed all documents and rebuild the index. Keep the original chunk text, not just the vectors.

### What if no model handles Uzbek well?
Add hybrid search and a reranker, and check text normalization (apostrophes, Latin and Cyrillic). For larger projects, fine-tuning an open model on your own question–answer pairs is an option.

### How many questions does a test need?
A few dozen real questions are enough for a first comparison. What matters more is that they reflect real queries and every language your users use.
