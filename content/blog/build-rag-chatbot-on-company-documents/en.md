---
title: How to Build a RAG Chatbot on Your Company Documents
description: A step-by-step guide to a RAG chatbot over internal documents: ingestion, chunking, embeddings, retrieval, cited answers and access control.
summary: A RAG chatbot finds the passages in your documents that match a question and hands them to an LLM, which answers only from them and cites the source. Quality depends on clean data, good chunking and access control applied at retrieval time.
---

## How it works in short

**RAG (Retrieval-Augmented Generation)** is an approach where a language model answers from retrieved passages of your documents instead of from memory. The bot is not trained on your data: documents live in a separate index, and for each question the system pulls out the few most relevant pieces.

The pipeline has two parts:

- **Indexing** (once and on updates): load documents → extract text → split into chunks → embeddings → write to a vector store.
- **Answering** (per question): embed the question → find similar chunks → build a prompt with that context → LLM answer with citations.

## A minimal stack

A first working version does not need a heavy framework:

| Layer | Option |
|---|---|
| Text extraction | PDF/DOCX parser, OCR for scans |
| Embeddings | an API model or an open multilingual model |
| Storage | PostgreSQL + pgvector or Qdrant |
| LLM | any model that follows instructions well |
| Interface | web widget or Telegram bot |

## Step 1. Load and clean documents

Answer quality is capped by source quality. Before indexing:

- remove duplicates and outdated versions of policies;
- extract text while keeping headings and tables;
- store **metadata** for each document: title, section, date, link, department or access group.

You will need metadata for citations and for filtering.

## Step 2. Chunking

Each document is cut into pieces that make sense on their own. A good starting point is to split by structure (headings, numbered clauses) and split long sections recursively with a small overlap. Prepending the section heading helps: "Leave → How to apply" is easier to find than a bare paragraph.

## Step 3. Embeddings and index

An embedding model turns each chunk into a vector. Keep in mind:

- questions and documents must be encoded with **the same model**;
- if staff write in Russian and Uzbek, test the model in both languages;
- switching models means re-embedding the whole index.

## Step 4. Retrieval

The baseline is fetching the top-k nearest chunks. What noticeably improves results:

- **hybrid search**: vector plus full-text, so SKUs, order numbers and exact terms are found;
- **a reranker**: a separate model reorders candidates by relevance;
- **metadata filters**: department, document type, validity.

## Step 5. A prompt with citations

Tell the model explicitly not to invent anything. An example structure:

```text
Answer only using the passages below.
If the passages do not contain the answer, say you could not find it.
After each statement, give the source number in square brackets.

[1] Leave policy, section 3.2: ...
[2] Working hours order: ...

Question: ...
```

In the interface the numbers become links to documents, so users can verify the answer.

## Step 6. Access control

The most common mistake is a single shared index where the bot tells everyone everything. Permissions must be enforced **at retrieval time**, not in the prompt:

- every chunk carries a field with its access groups;
- each query adds the current user's groups as a filter;
- chunks the user cannot see never reach the model's context.

Asking the model "do not reveal confidential data" is not protection.

## Common mistakes

- Indexing everything, including drafts and outdated versions.
- Chunks that are too large, so the context fills with noise.
- No test question set, so improvements are judged by eye.
- No process to update the index when documents change.

## How to evaluate quality

Collect 30–50 real employee questions with correct answers and sources. Check two things separately: **did retrieval find the right passage** and **did the model answer correctly from it**. That tells you whether to fix retrieval or the prompt.

## FAQ

### Do we need to fine-tune a model on our documents?
For answering from documents, usually not. RAG is easier to keep current: change a document, re-index it, no retraining.

### Can everything run inside the company?
Yes. Open embedding models and LLMs can run on your own servers, and the vector store can live in your infrastructure. Plan for the hardware requirements.

### What if the bot gives inaccurate answers?
First check whether the right passage reached the context. If not, improve chunking and retrieval; if it did, refine the prompt.
