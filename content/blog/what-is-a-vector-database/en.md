---
title: What Is a Vector Database and When Do You Need One
description: A vector database quickly finds records similar in meaning among embeddings. How it differs from SQL and when a simple pgvector setup is enough.
summary: A vector database stores embeddings and quickly finds the vectors nearest to a query; it powers semantic search and RAG, but at the start PostgreSQL with the pgvector extension is often enough.
---
## The short answer

A **vector database** is storage optimized for one main question: "which records are **closest in meaning** to this query?". It stores **embeddings** (vectors of hundreds of numbers) and can quickly find the nearest neighbors among millions of them.

It is the foundation for semantic search, recommendations and **RAG**, where a chatbot answers using your knowledge base.

## Nearest-neighbor search

The task is called **nearest neighbor search**: given a query vector, find the **k** vectors closest to it (by cosine similarity or distance).

The naive approach compares the query with every vector. That is fine for thousands of records and slow for millions.

So vector databases use **approximate search** (ANN, approximate nearest neighbor) and special indexes such as **HNSW** or **IVF**. They trade a small amount of accuracy for a large gain in speed: the result is almost always the same, but found much faster.

## How it differs from a SQL database

| | Regular SQL database | Vector database |
|---|---|---|
| Main query | Exact matches and filters: `WHERE price < 100` | Similarity: "find the closest in meaning" |
| Data | Strings, numbers, dates | Vectors plus metadata |
| Indexes | B-tree, hash | HNSW, IVF and other ANN indexes |
| Result | Exact | Approximate, ranked by closeness |
| Transactions and relations | A core strength | Usually weaker or absent |

Important: it is **not a replacement** for a relational database. Orders, users and payments still live in SQL. A vector database adds search by meaning.

## When pgvector is enough

**pgvector** is a PostgreSQL extension that adds a `vector` type and indexes for nearest-neighbor search.

```sql
CREATE EXTENSION vector;

CREATE TABLE docs (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

SELECT id, content
FROM docs
ORDER BY embedding <=> '[...]'
LIMIT 5;
```

The `<=>` operator computes cosine distance. The vector dimension must match your embedding model.

**pgvector is usually enough if:**

- you already run PostgreSQL and do not want to maintain another service;
- data volume is moderate and search load is not extreme;
- you need to combine meaning-based search with regular filters and `JOIN`s in one query;
- transactions and a single backup matter to you.

## When you need a dedicated vector database

- **Very large volumes** of vectors and high load, where horizontal scaling matters.
- You need built-in features: **hybrid search**, multi-tenancy, a managed cloud service.
- The team is ready to maintain one more infrastructure component.

Popular options include Qdrant, Weaviate, Milvus and Pinecone. Choose based on a test with your own data rather than reviews.

## Common mistakes

- **Starting with a dedicated vector database** for a prototype with a couple of thousand documents. Unnecessary complexity.
- **Ignoring metadata.** Without filters by language, date or access rights, search returns things it should not.
- **Not tracking the model.** When you change the embedding model, all vectors must be recomputed.
- **Not checking quality.** Index speed means nothing if it finds the wrong results.

## FAQ

### Can I store vectors in MySQL or MongoDB?

Many popular databases are adding vector search support. If your main database can do it, start there and move to a specialized solution only when you hit its limits.

### Does a vector database create embeddings itself?

Usually not: you get vectors from an embedding model and write them to the database. Some solutions can call a model automatically, but that is a convenience, not a requirement.

### Does an AI chatbot need a vector database?

Only if the bot answers from your documents (RAG) and there are quite a lot of them. A bot without a knowledge base does not need vector search.
