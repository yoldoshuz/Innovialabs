---
title: How to Run an LLM Locally With Ollama
description: Step-by-step Ollama setup, choosing a model for your RAM and GPU, using the local API, and honest expectations for quality and speed.
summary: Install Ollama, pull a model that fits your memory and call it through the local API on port 11434; local models are great for private and simple tasks but trail large cloud models.
---

## In short: what Ollama is and why use it

**Ollama** is a free tool that downloads open language models and runs them on your own computer or server. Data never leaves your machine, there is no per-token billing, and once a model is downloaded it works offline.

Typical use cases for a local LLM:

- processing confidential documents inside the company;
- prototypes and experiments without API costs;
- simple tasks: classification, field extraction, text drafts;
- isolated environments with no outside access.

## Step 1. Install

- **macOS and Windows** — download the installer from the official site and run it.
- **Linux** — run the official script:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

After installation Ollama runs as a background service. Check it:

```bash
ollama --version
```

## Step 2. Pick a model for your hardware

The main constraint is **memory**. The model has to fit in GPU VRAM or, without a GPU, in system RAM. More parameters mean a smarter model and more memory.

Guidance from the Ollama documentation:

| Model size | Minimum RAM |
|---|---|
| around 7B parameters | 8 GB |
| around 13B | 16 GB |
| around 33B | 32 GB |

What to keep in mind:

- **Quantization** (for example, 4-bit versions) shrinks a model a lot at the cost of a small quality loss. Most models in the Ollama library are already quantized.
- A **GPU** makes generation many times faster than a CPU. Without one, choose small models.
- Long context also consumes memory — leave headroom.
- For languages other than English, test models on your own texts: quality varies noticeably.

## Step 3. Run and chat

```bash
ollama pull llama3.2
ollama run llama3.2
```

`run` opens a chat in the terminal. Useful commands:

- `ollama list` — installed models;
- `ollama ps` — what is loaded in memory right now;
- `ollama rm <model>` — delete a model and free disk space.

## Step 4. The local API

Ollama serves an HTTP API at `http://localhost:11434`. Connect your application to it:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Briefly explain what Docker is"}],
  "stream": false
}'
```

There is also an **OpenAI-compatible endpoint** at `/v1/chat/completions`, so many existing SDKs and libraries work with Ollama once you change the base URL. Details are in the [Ollama API docs](https://github.com/ollama/ollama/blob/main/docs/api.md).

If you need the API from another machine, do not expose the port to the internet unprotected: Ollama has no built-in authentication. Put a reverse proxy with auth in front of it or use a VPN.

## Realistic expectations

- **Quality.** Small local models trail leading cloud models in complex reasoning, coding and less common languages. For simple, narrow tasks they are often enough.
- **Speed.** On a laptop without a GPU, answers come slowly, especially from larger models. The first request is slower because the model loads into memory.
- **Load.** One machine serves a limited number of parallel requests. A team or a product needs a dedicated GPU server.
- **Maintenance.** Model updates, monitoring and security are now your job.

## Common mistakes

- Pulling a model that does not fit in memory and getting very slow performance from swapping.
- Comparing a small local model with a flagship cloud model and being disappointed.
- Exposing port 11434 publicly without protection.
- Skipping tests on real data before rollout.

## FAQ

### Can I run Ollama without a graphics card?

Yes, Ollama runs on the CPU. Generation is slower, so choose smaller models.

### Is it safe to process confidential data in Ollama?

The model runs locally and data is not sent to external services. Overall safety still depends on how well the machine and API access are protected.

### Is Ollama suitable for production?

For internal tools with moderate load, yes. For heavy parallel traffic, teams usually use dedicated inference servers or cloud APIs.
