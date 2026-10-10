---
title: OCR for Uzbek and Russian Documents: Latin, Cyrillic, Mixed
description: How to choose OCR for Uzbek Latin, Cyrillic and mixed-script documents: classic engines, vision LLMs, a fair test method and ways to raise accuracy.
summary: There is no universal winner: take 50-100 of your real documents, run them through 2-3 engines and a vision LLM, measure character and field errors, and pick the setup that fits your document types.
---

## The short answer

For Uzbek and Russian documents you have three classes of tools: **classic OCR engines** (Tesseract, ABBYY), **cloud services** (Google Cloud Vision, Azure Document Intelligence, AWS Textract) and **vision LLMs** (models that "read" an image and return structured output directly). Which one is best depends on your documents, so the choice can only be made by testing on your own sample.

The main regional challenge is **mixed scripts**: Uzbek Latin with o‘ and g‘, Uzbek Cyrillic with ў, қ, ғ, ҳ, and Russian text on the same page. An engine tuned for one language often confuses similar-looking letters.

## How the approaches differ

| Approach | Strengths | Weaknesses |
|---|---|---|
| Tesseract | Free, runs locally, has `uzb` and `uzb_cyrl` models | Sensitive to scan quality, weak on tables |
| Commercial OCR | Good layout analysis, tables, stability | Cost, data may leave for the cloud |
| Vision LLM | Understands context, extracts fields to JSON | Can "invent" text that is not there; pricier at volume |

A key caveat for vision LLMs: the model can **hallucinate** — "correct" a contract number into a plausible one or add a missing word. For amounts, tax IDs and dates, that is critical.

## How to run a fair test

1. **Build a sample**: 50-100 real documents of different types — scans, phone photos, PDFs, stamps, handwritten notes.
2. **Create ground truth**: manually transcribe the text or key fields. Without it, comparison becomes "seems better".
3. **Pick metrics**: **CER** (character error rate) for running text and **field accuracy** (whether the whole value matches) for document details.
4. **Split results by script**: Latin, Cyrillic, mixed pages. An average hides failures.
5. **Check special characters separately**: o‘, g‘, apostrophe ’, ў, қ, ғ, ҳ. A common error is replacing o‘ with o' or dropping the apostrophe.

Tesseract accepts several languages at once:

```bash
tesseract scan.png out -l uzb+uzb_cyrl+rus
```

## How to raise accuracy

- **Image preprocessing**: deskew, crop margins, increase contrast, around 300 dpi for scans.
- **Script detection per block**: on mixed pages, detect the script of each fragment first, then recognize it with the right model.
- **Character normalization**: map apostrophe variants (', `, ‘, ’) to one standard before saving to the database.
- **Field validation**: check formats of tax IDs, dates, amounts and checksums. Catch errors with rules, not people.
- **Hybrid OCR + LLM**: classic OCR produces text, an LLM structures it into fields. This lowers the risk of invented values compared to a pure vision LLM.
- **Human-in-the-loop**: route low-confidence documents to an operator.

## Common mistakes

- Testing on perfect PDFs while production gets skewed photos.
- Choosing based on a single-document demo.
- Trusting a vision LLM on financial fields without validation.
- Storing text with mixed apostrophes, so search later misses half the records.
- Ignoring personal data rules when sending scans to an external service.

## FAQ

### Can I rely on a vision LLM alone?

For one-off tasks and unstructured documents, often yes. For high-volume extraction of document details, an OCR + LLM + validation pipeline is safer, because the model can confidently return a wrong value.

### How do I handle pages with both Latin and Cyrillic?

Enable several language models at once, or split the page into blocks and detect the script for each. Always measure results separately on mixed pages.

### How many documents do I need for a test?

A few dozen per document type is enough if the sample reflects real conditions: scan quality, photos, stamps and handwritten notes.
