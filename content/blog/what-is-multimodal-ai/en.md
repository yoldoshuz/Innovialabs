---
title: What Is Multimodal AI: Models That See, Hear and Read
description: How one model understands text, images and audio together, and which tasks it handles: screenshots, charts, photos of documents and voice messages.
summary: A multimodal model accepts not only text but also images or audio and reasons about them in one context. This lets a single request read a screenshot, a chart or a photo of a document.
---
## In short: what "multimodal" means

A **modality** is a type of data: text, image, audio, video. A **multimodal model** works with several modalities at once. You send a photo of an invoice and write "extract the total and date", and the model sees the image and understands the text request in one call.

Previously this required a chain of systems: OCR for text, a separate object recognition model, ASR for speech and rules gluing it all together. A multimodal LLM covers many of these tasks with one model.

## How it works inside

A simplified view:

1. **An encoder per modality.** An image is cut into small fragments (patches), audio into short segments. Each fragment becomes a vector of numbers.
2. **A shared space.** These vectors are projected into the same format the model uses for text tokens.
3. **The language model.** The LLM then processes "image tokens" and text tokens together and generates an answer.

That is why the model can not only describe an image but **reason** about it: compare two charts, find the bug on a UI screenshot, explain a diagram.

## Practical tasks

| Task | Input | Output |
|---|---|---|
| Reading documents | Photo of an invoice, waybill or form | Fields as JSON: total, date, tax ID, line items |
| Screenshots | Screenshot of an error or interface | Explanation of the problem, steps to fix |
| Charts and tables | Image of a chart from a report | Insights, trends, data as a table |
| Product photos | Shot from a store shelf or warehouse | Description, category, condition check |
| Voice | Customer's audio message | Transcript, request summary, sentiment |
| Handwritten notes | Photo of a whiteboard after a meeting | Structured task list |

### Example: extracting data from a document photo

A request to the model might look like this:

```text
The image is a waybill. Return JSON with fields:
supplier, date (YYYY-MM-DD), total, items[{name, qty, price}].
If a field is not visible, use null. Do not guess values.
```

Key points: a clear output schema, a date format and an explicit ban on guessing.

## Where multimodal wins and where it does not

**Wins:**

- documents in varied formats where rigid OCR templates break;
- tasks that need contextual understanding, not just character recognition;
- quick prototypes: no need to train a separate model.

**Loses or needs care:**

- real-time video streams — specialized CV models are faster;
- very small text and poor photo quality — the model may misread digits;
- large volumes of identical documents — request costs may exceed a classic pipeline.

## How to adopt it without surprises

- **Verify numbers.** Check totals and dates with control rules: line items add up to the total, the date is within a valid range.
- **Require structured output** (JSON) and validate it in code.
- **Improve the input:** cropping, rotation and sufficient resolution noticeably affect results.
- **Keep a human in the loop** for low-confidence or disputed cases.
- **Mind the data:** document photos often contain personal information, so decide in advance where and how they are processed.

## FAQ

### Does a multimodal model replace OCR?

In many tasks, yes, especially when documents vary and you need to understand structure. But for large streams of identical forms, classic template-based OCR can be cheaper and more predictable. They are often combined.

### Do these models understand video?

Some models accept video or a set of frames and can describe what happens. For continuous real-time camera analysis, specialized computer vision models are usually used.

### Can I trust numbers the model reads from a photo?

Only with verification. A model can misread a blurry digit and still return it confidently. Add checks in code and manual review for important documents.
