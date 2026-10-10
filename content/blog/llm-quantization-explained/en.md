---
title: "LLM Quantization Explained: 8-bit, 4-bit, GGUF and Quality Loss"
description: How LLM quantization shrinks models, how 8-bit, 4-bit, GGUF, GPTQ and AWQ differ, and how to measure the real quality drop on your own tasks.
summary: Quantization stores model weights with fewer bits, cutting memory and often speeding up inference; 8-bit is usually close to the original, 4-bit is a practical compromise, and the only reliable quality check is testing on your own data.
---
## What quantization does

A language model is mostly a huge set of numbers — **weights**. By default they are stored as 16-bit floats (FP16 or BF16). **Quantization** stores them with fewer bits: 8, 4 or even fewer.

The effect is simple arithmetic. A 7B-parameter model needs about 14 GB in 16-bit, about 7 GB in 8-bit and about 3.5-4 GB in 4-bit (plus some overhead). This lets you:

- run a model on a smaller or cheaper GPU, or even on a CPU or laptop;
- fit a larger model on the same hardware;
- free memory for the KV cache and serve more parallel requests;
- often speed up generation, because less data moves through memory.

The price is **precision**. Fewer bits mean rounding errors, and the model can become slightly less accurate.

## How it works in brief

The idea is to map a range of real values onto a small set of integer levels. With 4 bits there are only 16 levels, so methods differ in how cleverly they choose them:

- **Per-group scaling** — weights are split into small groups, each with its own scale, so outliers do not ruin the whole matrix.
- **Calibration** — some methods run sample data through the model to decide which weights matter most.
- **Mixed precision** — sensitive layers keep more bits, others get fewer.

## Formats and methods compared

| Method / format | Where it is used | Key idea |
|---|---|---|
| **8-bit (INT8, FP8)** | GPU servers, vLLM, TensorRT-LLM | Minimal quality loss, roughly half the memory |
| **GPTQ** | GPU inference | 4-bit, uses calibration data to minimize error layer by layer |
| **AWQ** | GPU inference | 4-bit, protects the weights most important for activations |
| **bitsandbytes (NF4)** | Hugging Face, QLoRA fine-tuning | Quantizes on load, convenient for experiments and training |
| **GGUF** | llama.cpp, Ollama, LM Studio | A file format for CPU and mixed CPU/GPU, many levels like Q8_0, Q5_K_M, Q4_K_M |

**GGUF** is a container format, not one method. Its names encode the level: `Q8_0` is 8-bit, `Q4_K_M` is a popular 4-bit "K-quant" variant. Higher numbers mean more bits and better quality, lower numbers mean a smaller file.

## How much quality you lose

General patterns, not guarantees:

- **8-bit** is usually very close to the original for most tasks.
- **5-6-bit** is a safe middle ground.
- **4-bit** is the common compromise: noticeably smaller, often good enough, but losses appear on hard reasoning, math, code and less common languages.
- **3-bit and below** degrade quickly, especially for small models.

Larger models usually tolerate quantization better than small ones. A quantized large model can outperform a small model at full precision with similar memory use.

## How to measure the drop for your task

Public benchmarks will not tell you how the model behaves on your data. Test it yourself:

1. **Build an eval set** — 50-200 real requests from your domain with expected answers or grading criteria.
2. **Run the baseline** — the same model in 16-bit or 8-bit.
3. **Run quantized variants** — for example Q8, Q5, Q4 — with the same prompts and temperature 0.
4. **Score the outputs** — exact match for structured tasks, an LLM-as-judge or human review for free text.
5. **Check format errors** — broken JSON or failed tool calls often appear before general quality drops.
6. **Measure speed and memory** under realistic load.

Perplexity is a useful quick signal when comparing quantizations of the same model, but it does not replace task-specific tests.

## How to choose

- **Enough GPU memory?** Use 16-bit or 8-bit and skip the risk.
- **Tight GPU budget?** Try AWQ or GPTQ 4-bit, then verify on your eval set.
- **CPU, laptop or edge device?** Use GGUF with llama.cpp or Ollama; start at Q4_K_M or Q5_K_M.
- **Fine-tuning on a small GPU?** QLoRA with 4-bit bitsandbytes is the standard path.

## Common mistakes

- Choosing the smallest file without testing your real tasks.
- Comparing different models and quantizations at once, so you cannot tell what caused the difference.
- Forgetting that the KV cache also needs memory — the weights are not the whole picture.
- Assuming a quantized model behaves the same in another language as in English.

## FAQ

### Is 4-bit good enough for production?

Often yes for chat, classification and summarization, but it depends on the task. Run your own eval set against an 8-bit or 16-bit baseline before deciding.

### What is the difference between GGUF and GPTQ?

GGUF is a file format for llama.cpp-based tools, built mainly for CPU and mixed hardware. GPTQ is a quantization method mostly used for GPU inference. They target different runtimes.

### Does quantization make the model faster?

Usually, because less data is moved through memory. The real speedup depends on hardware and whether the runtime has optimized kernels for that format.
