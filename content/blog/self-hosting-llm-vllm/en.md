---
title: Self-Hosting LLMs in Production With vLLM
description: How to run open LLMs in production with vLLM: GPU sizing, batching, latency vs throughput tuning, OpenAI-compatible API and real cost compared to hosted APIs.
summary: vLLM serves open models on your own GPUs through an OpenAI-compatible API with efficient batching; it pays off when load is steady, data must stay in-house, and you have people to operate it.
---
## The short answer

**vLLM** is an open-source inference server for large language models. It loads an open model (Llama, Qwen, Mistral and others) onto your GPUs and exposes an **OpenAI-compatible HTTP API**, so existing client code often works by changing only the base URL.

Its main strengths are **PagedAttention** (memory-efficient storage of the KV cache) and **continuous batching** (new requests join the running batch instead of waiting). Together they let one GPU serve many concurrent users.

Self-hosting makes sense when:

- data cannot leave your infrastructure;
- load is high and predictable enough to keep GPUs busy;
- you need a fine-tuned or specific open model;
- you have engineers who can operate GPU servers.

## Sizing the GPU

Memory is the first constraint. A rough estimate:

- **Weights** = parameters x bytes per parameter. A 7B model in FP16 (2 bytes) needs about 14 GB; in 8-bit about 7 GB; in 4-bit about 3.5-4 GB.
- **KV cache** grows with context length and the number of concurrent requests. This is what limits how many users fit at once.
- **Overhead** for activations and the CUDA runtime.

If the model does not fit on one card, vLLM can split it across several GPUs with **tensor parallelism**. Quantized models (AWQ, GPTQ, FP8) reduce memory needs at some cost in quality, which you should measure on your own tasks.

## Starting the server

```bash
pip install vllm
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --tensor-parallel-size 1
```

The client uses the standard OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="local")
resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

Exact flags change between releases, so check the [official vLLM documentation](https://docs.vllm.ai/) for your version.

## Throughput vs latency

These two goals pull in different directions:

| Goal | What helps | Trade-off |
|---|---|---|
| **High throughput** (many tokens/sec in total) | larger batches, more concurrent sequences, higher memory utilization | each user waits longer |
| **Low latency** (fast first token) | smaller batches, shorter max context, prefix caching for repeated system prompts | fewer users per GPU |

Key knobs:

- **`--max-model-len`** — a shorter context frees KV cache for more parallel requests.
- **`--max-num-seqs`** — the cap on concurrent sequences in a batch.
- **`--gpu-memory-utilization`** — how much VRAM vLLM may reserve.
- **Prefix caching** — reuses computation when many requests share the same long system prompt.

Measure **time to first token (TTFT)**, **time per output token** and **total tokens per second** under realistic load before choosing settings.

## Production checklist

- Put vLLM behind a reverse proxy with **authentication** and **rate limits** — the server itself is not a full API gateway.
- Run it in **Docker** with pinned model and image versions.
- Export metrics (vLLM exposes a Prometheus endpoint) and alert on queue length, GPU memory and error rate.
- Plan for **cold starts**: loading a large model takes time, so keep warm replicas.
- Have a **fallback** to a hosted API for outages or traffic spikes.

## Self-hosted vs hosted API: total cost

Do not compare only the GPU price to the per-token price. Count everything:

- **GPU cost** — paid whether the card is busy or idle. Low utilization makes every token expensive.
- **Engineering time** — setup, updates, monitoring, on-call.
- **Model quality** — an open model may need more prompt work or fine-tuning to match a frontier API.
- **Scaling** — hosted APIs absorb spikes; your cluster has a fixed ceiling.

A hosted API usually wins for spiky or small volumes and early prototypes. Self-hosting starts to pay off with **steady high load**, strict **data residency** requirements, or a need for a custom model.

## Common mistakes

- Choosing a GPU by weight size alone and forgetting the KV cache.
- Setting maximum context far beyond what users actually send.
- Benchmarking with one request instead of realistic concurrency.
- Exposing the vLLM port directly to the internet.

## FAQ

### Can vLLM replace the OpenAI API in my code?

For chat and completions, usually yes: point the SDK at your vLLM base URL and use the model name you served. Some features, such as specific tool-calling formats, depend on the model and server version, so test them.

### Is one GPU enough?

For small and mid-sized models with modest traffic, often yes, especially with quantization. Larger models or high concurrency need more memory or several GPUs with tensor parallelism.

### When is a hosted API cheaper?

When load is irregular or small, GPUs would sit idle most of the time, and you have no strict requirement to keep data on your own servers.
