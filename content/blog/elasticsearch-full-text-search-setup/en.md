---
title: How to Add Full-Text Search to a Site with Elasticsearch
description: Set up Elasticsearch for a site: index mappings and analyzers for Russian and Uzbek, syncing from the main database, typo tolerance and autocomplete.
summary: Create an index with separate fields per language and proper analyzers, keep it in sync with your main database through events or periodic reindexing, and use fuzziness plus search_as_you_type for typos and autocomplete.
---

## How it works in short

Elasticsearch is a **separate search index** next to your main database. The database stays the source of truth; Elasticsearch gets a copy of the searchable fields, prepared by **analyzers** that split text into tokens, lowercase them and reduce words to their base form. Search quality depends mostly on three things: the mapping, the sync process and the query.

## Step 1. Design the index and analyzers

Store each language in its own field, so each gets the right analyzer.

- **Russian**: the built-in `russian` analyzer handles stop words and stemming ("телефоны" matches "телефон").
- **Uzbek**: there is no built-in Uzbek analyzer. A practical baseline is a custom analyzer that lowercases text and removes the different apostrophe characters (‘ ’ ʻ ʼ ' and backtick), because users type o‘zbek, o'zbek and ozbek interchangeably.

```json
PUT /products
{
  "settings": {
    "analysis": {
      "char_filter": {
        "uz_apostrophes": {
          "type": "pattern_replace",
          "pattern": "[‘’ʻʼ'`]",
          "replacement": ""
        },
        "ru_yo": { "type": "mapping", "mappings": ["ё => е", "Ё => Е"] }
      },
      "analyzer": {
        "uz_text": {
          "type": "custom",
          "char_filter": ["uz_apostrophes"],
          "tokenizer": "standard",
          "filter": ["lowercase"]
        },
        "ru_text": {
          "type": "custom",
          "char_filter": ["ru_yo"],
          "tokenizer": "standard",
          "filter": ["lowercase", "russian_stop", "russian_stemmer"]
        }
      },
      "filter": {
        "russian_stop": { "type": "stop", "stopwords": "_russian_" },
        "russian_stemmer": { "type": "stemmer", "language": "russian" }
      }
    }
  },
  "mappings": {
    "properties": {
      "title_ru": {
        "type": "text", "analyzer": "ru_text",
        "fields": { "suggest": { "type": "search_as_you_type", "analyzer": "ru_text" } }
      },
      "title_uz": {
        "type": "text", "analyzer": "uz_text",
        "fields": { "suggest": { "type": "search_as_you_type", "analyzer": "uz_text" } }
      },
      "description_ru": { "type": "text", "analyzer": "ru_text" },
      "description_uz": { "type": "text", "analyzer": "uz_text" },
      "category": { "type": "keyword" },
      "price": { "type": "integer" },
      "updated_at": { "type": "date" }
    }
  }
}
```

Uzbek is agglutinative: without a stemmer, "kitoblar" and "kitob" are different tokens. Typo tolerance and prefix search (below) partly cover this. Test with real queries from your users, and check token output with the `_analyze` API.

Use `keyword` for fields you filter or aggregate on (category, brand, status) and `text` for fields you search in.

## Step 2. Sync data from the main database

| Approach | How | Trade-offs |
|---|---|---|
| Periodic reindex | A job selects rows where `updated_at` changed since the last run and sends them via the Bulk API | Simple; search lags by the job interval |
| Events from the app | After saving, the app publishes an event to a queue; a worker updates the index | Near real-time; needs a queue and retries |
| Change data capture | A tool reads the database change log and streams changes | Catches every change; more infrastructure |

Practical rules:

- Use the **Bulk API** for batches, not one request per document.
- Handle deletes explicitly, for example with a `deleted_at` column.
- Read and write through an **index alias**. For a full rebuild, create a new index, fill it, then switch the alias with no downtime.

## Step 3. Typo tolerance

`fuzziness: "AUTO"` allows a small number of character edits depending on word length.

```json
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "telefn samsung",
      "fields": ["title_ru^3", "title_uz^3", "description_ru", "description_uz"],
      "fuzziness": "AUTO",
      "prefix_length": 1
    }
  }
}
```

`prefix_length: 1` requires the first letter to match, which reduces noise and speeds up the query. The `^3` boost makes title matches rank above description matches.

## Step 4. Autocomplete

The `search_as_you_type` field creates helper subfields for prefix matching. Query them with `bool_prefix`:

```json
GET /products/_search
{
  "size": 5,
  "_source": ["title_ru", "title_uz"],
  "query": {
    "multi_match": {
      "query": "smartf",
      "type": "bool_prefix",
      "fields": [
        "title_ru.suggest", "title_ru.suggest._2gram", "title_ru.suggest._3gram",
        "title_uz.suggest", "title_uz.suggest._2gram", "title_uz.suggest._3gram"
      ]
    }
  }
}
```

On the frontend, send the request after a short debounce and cancel outdated requests.

## Common mistakes

- One `text` field with the default analyzer for all languages.
- Exposing Elasticsearch directly to the browser. Keep it behind your backend and never open it to the internet without authentication.
- Changing a mapping in place. Most mapping changes require a reindex into a new index.

## FAQ

### Do I need Elasticsearch, or will PostgreSQL search do?

For a catalog or blog of moderate size PostgreSQL full-text search with trigrams is often enough. Elasticsearch pays off with complex relevance tuning, heavy faceted search or high search load.

### What about Uzbek text in Cyrillic?

If your content or users mix scripts, add a transliteration step: normalize both the indexed text and the query to one script in your application before sending them to Elasticsearch.

### How do I add synonyms?

Use the `synonym_graph` token filter in the search analyzer with a list like "smartphone, phone". Updating synonyms is easier when they are applied only at search time.
