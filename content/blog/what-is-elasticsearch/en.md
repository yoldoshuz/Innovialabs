---
title: What Is Elasticsearch and How Search Engines Index Data
description: How Elasticsearch works: inverted indexes, documents, shards, analyzers and relevance scoring, plus when a project really needs it or OpenSearch.
summary: Elasticsearch is a distributed search engine that stores JSON documents in an inverted index, so it finds matching words across millions of records fast and ranks results by relevance; you need it when database LIKE queries can no longer deliver good full-text search.
---

## The short answer

**Elasticsearch** is a search and analytics engine built on the Apache Lucene library. You send it JSON **documents** (products, articles, log lines), it breaks their text into terms and stores them in an **inverted index**. A search then looks up terms instead of scanning every record, and returns results sorted by **relevance**, not just by "matches or doesn't".

**OpenSearch** is a community fork of Elasticsearch maintained under the Linux Foundation. For the basics described here, both work the same way.

## The inverted index

A normal table is organized "document → words". An inverted index flips it to "word → documents", like the index at the back of a book.

Take three product descriptions:

1. "Red leather bag"
2. "Leather wallet, brown"
3. "Red cotton t-shirt"

The index looks roughly like this:

| Term | Documents |
|---|---|
| red | 1, 3 |
| leather | 1, 2 |
| bag | 1 |
| wallet | 2 |
| brown | 2 |
| cotton | 3 |

A query for "red leather" reads two short lists and combines them. Document 1 contains both terms, so it ranks first; documents 2 and 3 match one term each. No full scan is needed, which is why this stays fast as data grows.

## Analyzers: how text becomes terms

Before text lands in the index, an **analyzer** processes it:

- **Character filters** clean the input, for example strip HTML tags.
- A **tokenizer** splits text into words.
- **Token filters** lowercase words, remove stop words, reduce words to a stem ("bags" → "bag") or add synonyms.

The same analyzer is applied to the search query, so "Bags" in a query matches "bag" in a document. Language matters: Russian and Uzbek have rich word endings, so the right language analyzer or stemmer noticeably affects result quality. Most search problems in practice are analyzer problems.

## Documents, indexes and mappings

- A **document** is one JSON object with a unique ID.
- An **index** is a collection of similar documents, roughly like a table.
- A **mapping** describes the field types: `text` fields are analyzed for full-text search, `keyword` fields are stored as-is for exact filters, sorting and aggregations.

```json
{
  "mappings": {
    "properties": {
      "title":    { "type": "text" },
      "brand":    { "type": "keyword" },
      "price":    { "type": "float" },
      "in_stock": { "type": "boolean" }
    }
  }
}
```

Changing the type of an existing field usually requires **reindexing**, so plan the mapping before loading data.

## Shards and replicas

An index is split into **shards**, each a self-contained Lucene index. Shards are spread across the nodes of a cluster, so data and query load are distributed. **Replicas** are copies of shards on other nodes: they protect against a node failure and can serve read queries.

A common mistake is creating too many small shards. Each shard has overhead, so for a small or medium project fewer, larger shards are usually healthier.

## Relevance scoring

For each match Elasticsearch calculates a **score**. The default algorithm, **BM25**, takes into account:

- how often the term appears in the document;
- how rare the term is across the whole index (rare words weigh more);
- the length of the field (a match in a short title weighs more than in a long text).

You can tune ranking: boost the `title` field over `description`, add freshness or popularity, use fuzzy matching for typos.

## When a project actually needs it

Elasticsearch or OpenSearch makes sense when you have:

- **Full-text search** over a large catalog or content base with typos, word forms and synonyms.
- **Faceted filtering**: counts by brand, price range and category next to the results.
- **Autocomplete** and search-as-you-type.
- **Logs and events**: centralized search and aggregations over large volumes.

You probably do not need it when:

- the data is small and `LIKE` or the database's built-in full-text search (for example in PostgreSQL) is good enough;
- you only need exact filters by ID, status or date;
- the team is not ready to run another stateful service.

Keep in mind that Elasticsearch is usually a **secondary store**. The source of truth stays in the main database, and data is synced into the search index. That sync, plus cluster monitoring and memory, is the real cost of adopting it.

## FAQ

### Can Elasticsearch replace my main database?

It is not a good idea. It lacks the strict transactions and relational constraints of a database like PostgreSQL. Keep the main data in the database and use Elasticsearch as a fast search layer on top.

### What is the difference between Elasticsearch and OpenSearch?

OpenSearch started as a fork of Elasticsearch and is developed separately under an open-source license. The core ideas, query language and concepts are very similar; differences are in licensing, some features and hosting options.

### Why does search not find a word that is clearly in the text?

Most often the cause is the analyzer or mapping: the field is mapped as `keyword` instead of `text`, or the analyzer does not handle that language's word forms. Check how the text is tokenized with the `_analyze` API.
