---
title: "pgvector vs Qdrant vs Pinecone vs Weaviate: Vector DB Comparison"
description: Comparing pgvector, Qdrant, Pinecone and Weaviate on setup, filtering, scaling, hosting and price, with a recommendation by project size.
summary: If you already run PostgreSQL and the data is modest, start with pgvector. For large search with complex filters and self-hosting, pick Qdrant; for a fully managed service with no DevOps, Pinecone; for built-in hybrid search, Weaviate.
---

## The short answer

- **pgvector** is a PostgreSQL extension. The best start if you already have Postgres and not too many vectors.
- **Qdrant** is a dedicated open-source vector database. Strong at filtering and performance, self-hosted or in the cloud.
- **Pinecone** is a managed cloud service only. Minimal administration, but data and infrastructure sit with the provider.
- **Weaviate** is an open-source database focused on hybrid search and built-in vectorization modules, available self-hosted and in the cloud.

## Comparison on key parameters

| | pgvector | Qdrant | Pinecone | Weaviate |
|---|---|---|---|---|
| Type | Postgres extension | Standalone DB | Managed service | Standalone DB |
| Self-hosted | Yes | Yes | No | Yes |
| Cloud option | Via Postgres providers | Yes | Yes (only option) | Yes |
| Filtering | SQL `WHERE`, JOINs | Payload filters built into search | Metadata filters | Property filters |
| Hybrid search | Via Postgres full-text search | Via sparse vectors | Supported | Built in |
| Learning curve | Low if you know SQL | Medium | Low | Medium |

## Setup and operations

**pgvector** installs as an extension, no new system required:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE chunks (id bigserial PRIMARY KEY, content text, embedding vector(1024));
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
```

Backups, permissions and replication work like regular Postgres. The dimension in the example must match your model.

**Qdrant** and **Weaviate** start in Docker with one command, but they are separate services you must monitor, back up and upgrade.

**Pinecone** needs no servers: create an index via the API or console and go. The trade-off is dependence on one provider and data stored outside your infrastructure.

## Filtering

Filters are essential in RAG: access rights, department, language, date. There is a nuance:

- In **pgvector** a filter is a plain `WHERE`. Convenient, but with very selective filters approximate search can return fewer results than expected; test and tune for this.
- **Qdrant** applies filters while traversing the index and builds indexes on payload fields, a strength for complex conditions.
- **Pinecone** and **Weaviate** also support metadata filtering combined with vector search.

## Scaling

- **pgvector** scales like Postgres: vertically, read replicas, partitioning. Very large HNSW indexes need a lot of memory.
- **Qdrant** and **Weaviate** support sharding and replication in a cluster.
- **Pinecone** is scaled by the provider; you manage only index settings.

## What drives the price

Exact plans change, so reason in factors:

- **volume**: number of vectors × dimensions, which sets memory and disk;
- **load**: queries per second and update frequency;
- **billing model**: per server (self-hosted) or per storage and operations (managed services);
- **hidden costs**: engineering time to run a self-hosted setup.

Self-hosted usually pays off with steady load and DevOps on hand; a managed service fits small teams that value launch speed.

## What to choose by project size

**Small project or MVP** (internal knowledge base, catalog): **pgvector**. One database for data and vectors, transactions, familiar tools.

**Medium to large search** with complex filters and a requirement to keep data in-house: **Qdrant** or **Weaviate**. Consider Weaviate if hybrid search is a core requirement.

**A team without DevOps** that needs a fast launch and does not mind where data lives: **Pinecone**.

## Common mistakes

- Adding a separate vector database when pgvector would do.
- Not testing filtered search quality on real data.
- Forgetting backups for a self-hosted vector database.
- Storing only vectors without the source text and metadata.

## FAQ

### Can we start with pgvector and move to another database later?
Yes. If you keep source text and metadata, migration means exporting vectors and loading them into the new system. Isolate the search layer in your code to make this easy.

### Does a small chatbot need a vector database?
With a modest number of documents, a separate vector database is optional; pgvector or even an in-app index is enough.

### Where should data live if data residency matters?
Choose a self-hosted option (pgvector, Qdrant, Weaviate) on servers in the required jurisdiction, or a cloud plan with a suitable region.
