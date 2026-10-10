---
title: "Document Chunking for RAG: Strategies, Sizes and Overlap"
description: Fixed, recursive, semantic and structure-aware chunking for RAG: how to pick chunk size and overlap and how to handle tables and PDFs.
summary: A chunk should make sense on its own and hold one idea. For most cases, splitting by document structure, recursively dividing long sections with a small overlap, works best, and the size is tuned on test questions.
---

## The short answer

In a RAG system the model never sees the whole document, only the retrieved **chunks**. If a chunk is cut mid-thought or mixes three topics, retrieval finds the wrong thing and the model answers poorly.

A practical starting point for most business documents:

- split **by structure**: headings, sections, clauses;
- divide long sections **recursively**: by paragraph, then by sentence;
- add a **small overlap** between neighbouring chunks;
- attach the **heading path** and metadata to every chunk.

Tune the exact size on your own data rather than on someone else's advice.

## Four strategies

| Strategy | How it works | Pros | Cons |
|---|---|---|---|
| Fixed | Cuts every N tokens | Simple and predictable | Breaks sentences and tables |
| Recursive | Splits by separators: paragraph → line → sentence | Keeps natural boundaries | Unaware of meaning |
| Semantic | Places a boundary where the meaning of adjacent sentences shifts | Coherent chunks | Costlier, needs embeddings at split time |
| Structure-aware | Uses markup: Markdown/HTML headings, clauses, sections | Best boundaries for policies and docs | Needs a good parser |

In practice they are combined: structure first, then recursive splitting inside sections that are too long.

## How chunk size affects answers

**Small chunks:**
- match narrow questions more precisely;
- but lose context: "the term is 10 days" without saying the term of what.

**Large chunks:**
- carry more context;
- but blur the embedding: the vector describes several topics at once, so ranking suffers;
- eat the model's context window and add noise.

Ways to get the best of both:

- **Heading enrichment**: prepend "Document → Section → Subsection" to the chunk so a small piece becomes self-explanatory.
- **Small-to-big**: search over small chunks, then pass the whole parent section to the model.
- **Overlap**: repeat a few sentences from the previous chunk so ideas on the boundary are not lost. Too much overlap fills results with duplicates.

## Tables

A table cut in half is useless: rows without column headers cannot be read. What to do:

- keep a table whole if it fits a reasonable size;
- split large tables by rows, **repeating the header** in each chunk;
- for reference data, turn each row into text: "Plan: Basic; Term: 12 months; Condition: ...";
- store tables as Markdown or HTML, not as a stream of words.

## PDFs and scans

PDF is a print format, not a text format. Typical problems: headers and footers in every chunk, mixed-up columns, hyphenated words, tables flattened into lines.

Checklist:

- use a parser that understands **layout structure** (headings, columns, tables);
- remove headers, footers and page numbers;
- rejoin hyphenated words and paragraphs broken by page boundaries;
- for scans, run OCR and then spot-check by hand;
- keep the page number in metadata for citations.

## How to tune parameters

1. Collect real questions and note where in the documents each answer lives.
2. Build 2–3 chunking variants (different size, overlap, strategy).
3. For each, measure whether the right passage appears in the top-k results.
4. Pick a variant, then check the quality of final answers.

Change one parameter at a time, or you will not know what helped.

## Common mistakes

- One size for every document type: contracts, FAQs and manuals need different handling.
- Chunks without metadata, so you can neither cite nor filter.
- Indexing raw PDF text without cleanup.
- Tuning without a test question set.

## FAQ

### What chunk size should I start with?
Start with structure-aware splitting and medium-length pieces, roughly one meaningful clause or a couple of paragraphs. Then compare against a smaller and a larger variant on your own questions.

### Do I need semantic chunking?
Not necessarily. If your documents have clear structure, structure-aware and recursive splitting often perform comparably at lower cost. Semantic chunking helps with long text that has no headings.

### Do I have to re-index everything when I change the strategy?
Yes. A new chunking strategy produces new chunks, so their embeddings must be recomputed.
