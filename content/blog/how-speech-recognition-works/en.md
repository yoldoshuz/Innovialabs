---
title: How Speech Recognition (ASR) Works: From Audio to Text
description: How an ASR system turns audio into text, what word error rate means, why accents, noise and code-switching hurt accuracy, and where businesses use it.
summary: ASR turns a sound wave into features, a neural network maps them to words, and a language model picks the most likely text. Quality is measured with WER and must always be tested on your own recordings.
---
## In short: what ASR does

**ASR (Automatic Speech Recognition)** is the technology that turns speech into text. The input is an audio file or a live microphone stream; the output is a transcript, often with timestamps and speaker labels.

Under the hood it is a chain of steps: audio preparation, feature extraction, an acoustic model, language-aware decoding and text post-processing.

## The pipeline: from sound to text

1. **Audio preparation.** The recording is converted to a single sample rate, mono, with normalized volume. Noise may be reduced and silence cut out (VAD, voice activity detection).
2. **Feature extraction.** The waveform is split into short windows and turned into a spectrogram, a picture of which frequencies sound at each moment. The most common choice is the **mel spectrogram**, which is close to how the human ear perceives sound.
3. **Acoustic model.** A neural network reads the spectrogram and predicts which sounds, letters or word pieces were spoken.
4. **Decoding.** Out of many candidates, the most likely word sequence is chosen. A **language model** helps here: it knows that "pay the invoice" is far more common than "pay the in voice".
5. **Post-processing.** Punctuation, capitalization, turning "two hundred fifty" into "250", and speaker labeling (diarization).

Modern systems often merge steps 3 and 4 into a single **end-to-end model**, trained on huge amounts of audio-text pairs, which outputs a finished sentence directly.

## How quality is measured: WER

The main metric is **WER (Word Error Rate)**, the share of word-level errors:

```text
WER = (S + D + I) / N
```

- **S** — substitutions ("bill" recognized as "pill");
- **D** — deleted words;
- **I** — inserted extra words;
- **N** — number of words in the reference transcript.

Lower is better. For languages without clear word boundaries, **CER** applies the same idea at the character level.

Keep in mind: WER from someone else's benchmark says little about your data. A model that shines on clean studio speech may struggle with call-center recordings.

## What hurts recognition

| Factor | Why it hurts | What helps |
|---|---|---|
| Noise and echo | Masks parts of words | A good microphone, noise suppression, models trained on noisy data |
| Accents and dialects | Pronunciation differs from training data | Fine-tuning on your recordings, a model that covers your languages |
| Code-switching | Language changes mid-sentence | Multilingual models, term dictionaries |
| Phone line | Narrow frequency band, compression | Models built for telephony |
| Terms and names | The model has never seen rare words | Hotwords, custom vocabulary |
| Crosstalk | Overlapping voices | Diarization, separate recording channels |

**Code-switching** matters a lot in Uzbekistan: people easily mix Uzbek, Russian and English terms in one sentence. Not every model handles this, so test on exactly that kind of audio.

## Where businesses use ASR

- **Call centers:** call transcription, search across conversations, script compliance, automatic CRM notes.
- **Voice messages:** transcribing audio in messengers and chatbots.
- **Voice assistants and IVR:** the customer speaks, the system understands the request and routes it.
- **Meetings and interviews:** minutes, subtitles, short summaries via an LLM.
- **Media:** video subtitles, archive search.

## How to choose a solution

- Collect **30–50 real recordings** in typical conditions and create reference transcripts.
- Run several models and calculate WER on your own data.
- Decide whether you need **real-time** processing or batch is enough.
- Check whether audio may go to the cloud or must be processed **on-premise** due to data requirements.
- Account for post-processing: punctuation, numbers, speaker labels.

## FAQ

### Can Uzbek speech be recognized?

Yes, several multilingual models support Uzbek, but quality depends heavily on the model and recording conditions. Test on your own audio, especially if speakers mix languages.

### How is ASR different from a voice assistant?

ASR only turns speech into text. An assistant then understands the meaning (often with an LLM), takes an action and may reply by voice using speech synthesis (TTS).

### Do I need to train my own model?

Usually not: a ready-made model plus a term dictionary is enough. Fine-tuning makes sense when too many errors remain on your data, for example due to specialized vocabulary or accents.
