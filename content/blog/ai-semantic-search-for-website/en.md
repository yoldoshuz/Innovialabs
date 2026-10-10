---
title: How to Add AI Semantic Search to Your Website or App
description: How embedding-based search finds results by meaning, handles typos and multiple languages, and how to combine it with filters and classic keyword search.
summary: Semantic search turns texts and queries into embedding vectors and returns the closest in meaning; it works best paired with keyword search and with filters for price, category and availability.
---
## The short answer

Classic search looks for **matching words**: a query for "running footwear" may miss "marathon sneakers". Semantic search looks for **matching meaning**. Every document and every query is turned into an **embedding** — a vector of numbers where texts with similar meaning end up close together. Search becomes a question of which vectors are nearest to the query vector.

## How it works

1. **Prepare the data.** Take products, articles or support answers. Split long texts into chunks along meaningful boundaries.
2. **Create embeddings.** Run each chunk through an embedding model — a cloud API or an open model on your own server.
3. **Store them.** Put the vectors into a store with vector search: the pgvector extension for PostgreSQL, Qdrant, Elasticsearch/OpenSearch and similar.
4. **Query.** The user's query is converted to a vector with the same model, and the store returns the nearest chunks.
5. **Show results.** Display them as a list, or pass them to an LLM if you need an answer in plain words (that is RAG).

## What meaning-based search gives you

- **Synonyms and paraphrases.** "Laptop won't turn on" finds the article "Computer does not start".
- **Typos.** Embedding models work with word pieces, so small typos often do not break the search.
- **Multiple languages.** Multilingual models place "телефон", "phone" and "telefon" close together. In Uzbekistan this matters: users mix Russian with Uzbek in both Latin and Cyrillic script.
- **Descriptive queries.** "A gift for my girlfriend under a set budget" — something keyword search barely handles.

## Where it gets things wrong

- **Exact codes and SKUs.** A query for "iPhone 15 Pro 256" must find exactly that model, not "similar phones".
- **Rare names and brands** the model has not seen.
- **Negation.** "Sugar-free" and "with sugar" may land close together.

That is why real systems use **hybrid search**: classic full-text search (BM25) and vector search run in parallel, and the results are merged, for example with Reciprocal Rank Fusion.

## Combining it with filters

A user wants "comfortable sneakers", but only **in stock, size 42 and below a certain price**. Filters must work together with vector search:

- **Pre-filtering** — first select records that match the filters, then find the nearest among them. More accurate, and most vector stores support it.
- **Post-filtering** — first find the N nearest, then drop what does not match. Simpler, but strict filters can leave an empty list.

A pgvector example with filters and vector similarity in one query:

```sql
SELECT id, title, price
FROM products
WHERE category = 'shoes'
  AND in_stock = true
  AND price <= 500000
ORDER BY embedding <=> $1   -- $1: query vector, <=> is cosine distance
LIMIT 20;
```

## Step-by-step rollout

1. Collect **real queries** from search logs, especially those with zero results.
2. Choose an embedding model that supports your languages and test it on those queries.
3. Run hybrid search next to the old one and compare the results.
4. Add filters and, if needed, a **reranker** — a model that reorders the top results more precisely.
5. Set up **reindexing**: new and changed items must get embeddings automatically.
6. Track metrics: share of empty results, clicks on results, add-to-cart actions.

## Common mistakes

- Dropping full-text search and keeping only vectors.
- Chunking documents too large or too small — precision suffers.
- Switching embedding models without recomputing old vectors: vectors from different models are incompatible.
- Not testing quality on your own data and languages.

## FAQ

### Do I need a separate vector database?

Not necessarily. If you already run PostgreSQL and the data volume is moderate, the pgvector extension is often enough. A dedicated vector store makes sense for large volumes and heavy load.

### How is semantic search different from a RAG chatbot?

Semantic search returns a list of matching documents. RAG takes those documents and passes them to a language model to write an answer. Search is the foundation; RAG is built on top of it.

### Will it work for Uzbek?

It depends on the embedding model. Multilingual models support Uzbek to varying degrees, so test your chosen model on real queries from your users.
