---
title: Hybrid Search and Reranking: Improving RAG Retrieval Quality
description: How to combine BM25 with vector search, use reciprocal rank fusion, cross-encoder rerankers and query rewriting so your RAG system finds the right context.
summary: Hybrid search combines exact word matching (BM25) with semantic similarity (vectors), a reranker reorders candidates more precisely, and query rewriting rescues poorly phrased questions. Turn each step on only after measuring it on your own test set.
---
## The short answer: why RAG needs hybrid search

A RAG answer can never be better than the documents it retrieves. Pure vector search captures meaning well but misses **exact terms**: SKUs, error codes, surnames, rare abbreviations. Classic **BM25** finds exact matches but does not understand synonyms or paraphrasing.

Hybrid search runs both methods and merges the results. A **reranker** then carefully scores each query–document pair and picks the best ones for the LLM.

## How the pipeline works

1. **Query rewriting** (optional) — an LLM clarifies or expands the query.
2. **Two searches in parallel** — BM25 and vector, each returning top candidates.
3. **List fusion** — for example, reciprocal rank fusion.
4. **Reranking** — a cross-encoder reorders the merged list.
5. **Context selection** — the top few chunks go into the prompt.

## BM25 vs vector search

| Criterion | BM25 | Vector search |
|---|---|---|
| Exact terms, codes, names | Strong | Often misses |
| Synonyms and paraphrasing | Weak | Strong |
| New words without retraining | Works right away | Depends on the embedding model |
| Explainability | High | Low |

They fail on different queries, so together they produce a more complete candidate set.

## Reciprocal rank fusion

BM25 scores and cosine similarity live on different scales, so adding them directly is wrong. **RRF** uses only each document's position in each list:

```python
def rrf(rankings, k=60):
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)
```

A document ranked high in both lists rises to the top. The `k` parameter dampens the weight of the first positions; 60 is a common starting point. The alternative is a weighted sum of normalized scores, but then you have to tune the weights.

## Cross-encoder rerankers

A bi-encoder (ordinary embeddings) encodes the query and the document **separately** — fast but coarse. A **cross-encoder** reads the query and document **together** and judges their match far more precisely, but more slowly.

So the pattern is: cheap retrieval picks a few dozen candidates, and the reranker chooses the best among them. The more candidates you pass to the reranker, the better the chance of finding the right one — and the higher the latency. Find the balance by measuring.

## Query rewriting

Users write short queries with typos and references to earlier messages. Useful techniques:

- **Rewriting with conversation history** — "and how much is it?" becomes a full question.
- **Multi-query** — an LLM generates several query variants, merged with RRF.
- **HyDE** — an LLM writes a hypothetical answer, and retrieval uses its embedding.

Each technique adds an LLM call, which means extra latency and cost.

## How to measure the gains

Do not trust other people's numbers — test on your own data:

- Build a **test set** of real questions with the correct documents labeled.
- Track **recall@k** (did the right document appear in the top k) and **MRR** or **nDCG** (how high it ranked).
- Compare configurations one at a time: vectors only, hybrid, hybrid plus reranker.
- Measure **latency** and cost of each step separately.

## Common mistakes

- Adding raw BM25 scores to cosine similarity.
- Giving the reranker too few candidates — it has nothing to choose from.
- Shipping everything at once without measurements and never knowing what helped.
- Ignoring chunking quality — no reranker can rescue bad chunks.

## FAQ

### Do I need a reranker if I already have hybrid search?

Not always. If recall@k is high but the right document often sits below the top spots, a reranker usually helps. If the right document is missing from the candidates entirely, start with retrieval and chunking.

### Can hybrid search run in a single database?

Yes, many vector databases and search engines support full-text and vector search together. That simplifies infrastructure, but you should still verify the fusion logic.

### How much latency does a reranker add?

It depends on the model, the number of candidates and the hardware. Measure on your own data and cap the candidate count so responses stay within your acceptable time.
