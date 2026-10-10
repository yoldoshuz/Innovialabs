---
title: PostgreSQL Full-Text Search: Do You Need Elasticsearch
description: How to build search in PostgreSQL with tsvector, tsquery, GIN indexes and pg_trgm for typos, and when a dedicated search engine is really worth it.
summary: For most sites PostgreSQL is enough: tsvector with a GIN index gives relevant word search and pg_trgm handles typos, while Elasticsearch pays off only with heavy search load, complex ranking or rich faceted search.
---

## The short answer

You probably do **not** need Elasticsearch at the start. PostgreSQL has built-in full-text search: it splits text into normalized words (**tsvector**), matches them against a query (**tsquery**), ranks results and uses a **GIN index** to stay fast. The **pg_trgm** extension adds fuzzy matching for typos and partial words. Together they cover most catalogs, blogs, knowledge bases and admin panels, with no second system to sync.

## Step 1. Add a search column

A generated column keeps the search vector up to date automatically. Weights let title matches rank higher than body matches.

```sql
ALTER TABLE articles
ADD COLUMN search tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('russian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('russian', coalesce(body, '')), 'B')
) STORED;

CREATE INDEX articles_search_idx ON articles USING GIN (search);
```

`'russian'` is a built-in text search configuration with stemming, so "статьи" matches "статья". For English use `'english'`.

**Uzbek** has no built-in configuration. Use `'simple'` (lowercasing without stemming) and remove apostrophe variants so o‘zbek, o'zbek and ozbek match:

```sql
to_tsvector('simple', regexp_replace(coalesce(title_uz, ''), '[‘’ʻʼ`'']', '', 'g'))
```

Apply the same normalization to the user's query.

## Step 2. Query and rank

`websearch_to_tsquery` accepts what users actually type: plain words, quoted phrases and `-` to exclude a word.

```sql
SELECT id, title,
       ts_rank(search, q) AS rank,
       ts_headline('russian', body, q, 'MaxFragments=2') AS snippet
FROM articles,
     websearch_to_tsquery('russian', 'настройка сервера') AS q
WHERE search @@ q
ORDER BY rank DESC
LIMIT 20;
```

- `@@` filters rows that match and uses the GIN index.
- `ts_rank` orders by relevance, taking weights into account.
- `ts_headline` builds a snippet with highlighted words. It is relatively expensive, so call it only for the rows you display.

For prefix search, as in "search as you type", use `to_tsquery('russian', 'настр:*')`.

## Step 3. Typos and partial matches with pg_trgm

Full-text search matches whole normalized words, so "postgers" will not find "postgres". Trigrams solve this by comparing three-letter fragments.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX articles_title_trgm_idx ON articles USING GIN (title gin_trgm_ops);

SELECT id, title, similarity(title, 'postgers') AS sim
FROM articles
WHERE title % 'postgers'
ORDER BY sim DESC
LIMIT 10;
```

- `%` returns rows above the similarity threshold (`pg_trgm.similarity_threshold`).
- The same index speeds up `ILIKE '%text%'` queries.
- For long fields, `word_similarity` and the `<%` operator compare the query with the best matching part of the text.

A common combination: run full-text search first and, if it returns nothing, fall back to a trigram search on titles with a "Did you mean" hint.

## Common mistakes

- Calling `to_tsvector` inside `WHERE` without a matching index, which forces a full scan on every query.
- Using different text search configurations for indexing and querying.
- Running `ILIKE '%word%'` on large tables without a trigram index.
- Forgetting `coalesce`: a `NULL` field turns the whole concatenated vector into `NULL`.

## When a dedicated search engine is worth it

| Need | PostgreSQL | Elasticsearch or OpenSearch |
|---|---|---|
| Word search with stemming | Yes | Yes |
| Typo tolerance | pg_trgm | Built in, flexible |
| Ranking | `ts_rank`, simpler | BM25 relevance, boosts, function scoring |
| Facets over many fields on large data | Possible, gets heavy | Strong point |
| Autocomplete at high load | Possible | Specialized field types |
| Synonyms, many languages | Dictionaries, more manual work | Rich analyzer chain |
| Operational cost | Nothing extra | Separate cluster and sync pipeline |

Move to a dedicated engine when search becomes a **core product feature**: large catalogs with many filters, demanding relevance tuning, or search queries that start to load the main database. Until then, PostgreSQL keeps the architecture simpler.

## FAQ

### Does PostgreSQL search work for Russian and Uzbek on the same table?

Yes. Keep a separate tsvector column (or a separate expression index) per language, each with its own configuration, and pick the column based on the user's interface language.

### How large can the table be?

There is no single limit; it depends on text size, hardware and query patterns. Watch query time with `EXPLAIN ANALYZE` on real data, and consider a search engine when indexes and tuning no longer keep latency acceptable.

### Can I migrate to Elasticsearch later?

Yes. Keep search behind a separate function or service in your code, so replacing the implementation does not affect the rest of the app.
