---
title: Uzbek Speech Recognition: Options, Accuracy and Pitfalls
description: Which ASR options exist for Uzbek, how they handle Russian-Uzbek code-switching and dialects, and how to measure quality on real phone calls.
summary: Uzbek speech is handled by cloud APIs, open models and local providers; choose by WER on your own call recordings, and test mixed Russian-Uzbek speech separately.
---

## The short answer

There are three groups of options for Uzbek:

- **Cloud APIs from major platforms** — Google Speech-to-Text, Azure Speech and others that list Uzbek among supported languages.
- **Open models** — for example OpenAI Whisper and multilingual wav2vec2/MMS models, which you can run on your own server and fine-tune.
- **Local providers** that specialize in Uzbek and train models on local data.

Do not choose any of them from a feature page. Quality depends heavily on your recordings: phone line, noise, accent, language mixing. Only a test on real data settles it.

## The main pitfalls

**Code-switching.** Speakers in Uzbekistan constantly switch between Uzbek and Russian within one sentence. A model locked to one language distorts words from the other or "translates" them.

**Two scripts.** The model may output Latin, Cyrillic or a mix. That breaks search and analytics, so agree on a target script and normalize the output.

**Dialects and casual speech.** Tashkent, Fergana and Khorezm speech differ noticeably. Models trained on read speech handle live conversation worse.

**Telephone audio.** Compressed 8 kHz recordings are very different from studio audio. Test on calls, not podcasts.

**Names, brands, numbers.** Product names, addresses and amounts are where ASR errs most, and they matter most to the business.

## How to measure quality

1. **Pick 1-3 hours of real calls** with different agents, customers, regions and noise levels.
2. **Create a reference transcript** by hand with consistent rules: which script, how to write numbers, how to mark inaudible parts.
3. **Compute WER** (word error rate) for each candidate.
4. **Break results down by segment**: pure Uzbek, pure Russian, mixed, noisy recordings.
5. **Check business entities separately**: are product names, amounts and order numbers recognized correctly.

Before computing WER, normalize reference and hypothesis the same way — case, punctuation, apostrophes:

```python
import re

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[ʻʼ`'‘’]", "’", text)
    text = re.sub(r"[^\w\s’]", " ", text)
    return " ".join(text.split())
```

WER itself can be computed with an existing library such as `jiwer`.

## How to improve results

- **Vocabulary hints** (phrase hints, custom vocabulary) with your product names, if the API supports it.
- **Channel separation**: if your PBX records agent and customer on separate channels, transcribe them separately.
- **Fine-tuning an open model** on a few dozen hours of your labeled calls.
- **LLM post-processing**: fixing obvious errors and converting to a single script. Make sure the model does not invent content.

## How to choose

| Criterion | Cloud API | Open model | Local provider |
|---|---|---|---|
| Getting started | Fast | Needs infrastructure and GPUs | Fast |
| Data | Goes to the provider | Stays with you | Depends on the contract |
| Fine-tuning | Limited | Full control | By agreement |

## FAQ

### Does Whisper handle Uzbek?

Uzbek is among Whisper's supported languages, but quality on phone calls and mixed speech must be checked on your recordings. Fine-tuning on your own data usually helps noticeably.

### What about mixed Russian-Uzbek speech?

Do not hard-lock a single language if the service supports auto-detection or multiple languages. Include mixed fragments in your test set and compare solutions specifically on them.

### What WER is considered good?

There is no universal threshold. It depends on the task: keyword search and analytics tolerate more errors than verbatim transcripts.
