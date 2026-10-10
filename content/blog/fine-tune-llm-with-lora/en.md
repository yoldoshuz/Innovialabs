---
title: How to Fine-Tune an Open LLM With LoRA and QLoRA
description: A step-by-step guide to fine-tuning an open LLM with LoRA and QLoRA: dataset format, training setup, hyperparameters, GPU needs and evaluation.
summary: LoRA trains small adapters on top of a frozen model, and QLoRA does the same on a 4-bit base, so fine-tuning fits on a single GPU. A clean dataset and an honest comparison with the base model decide success.
---
## The short answer: what LoRA and QLoRA are

**LoRA** (Low-Rank Adaptation) leaves the original model weights untouched. It adds small low-rank matrices to selected layers and trains only those. The resulting adapter is tiny, easy to store separately and easy to attach to the base model.

**QLoRA** uses the same idea, but loads the base model in **4-bit quantization**. That sharply reduces GPU memory: models that once needed several GPUs become trainable on one.

Fine-tuning is the right tool when you want to change a model's **style, output format or behavior**. If the goal is to give the model new facts, RAG is usually a better fit.

## Step 1. Prepare the dataset

Data quality matters more than any hyperparameter. A common format is chat-style JSONL:

```json
{"messages": [{"role": "system", "content": "You are a support assistant."}, {"role": "user", "content": "How do I return an item?"}, {"role": "assistant", "content": "Start a return from your account page..."}]}
```

What to check:

- **The chat template** must match the one the model was trained with. Use the tokenizer's built-in chat template.
- **Remove duplicates and contradictions** — the model learns them as diligently as good examples.
- **Hold out a test set** up front and never train on it.
- **Diversity** beats volume: a few hundred good examples often do more than thousands of near-identical ones.

## Step 2. Set up training

A common stack is Hugging Face `transformers`, `peft` and `trl`. A minimal QLoRA config:

```python
from transformers import BitsAndBytesConfig
from peft import LoraConfig
import torch

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

lora = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules="all-linear",
    task_type="CAUSAL_LM",
)
```

Then load the model with `quantization_config=bnb` and pass the dataset and LoRA config to `SFTTrainer` from `trl`. Details are in the [PEFT documentation](https://huggingface.co/docs/peft).

## Step 3. Hyperparameters that matter

| Parameter | What it does | Where to start |
|---|---|---|
| `r` (rank) | Adapter capacity | 8–16, higher if the model underfits |
| `lora_alpha` | Update scale | Often set to 2×r |
| learning rate | Training speed | Higher than full fine-tuning; tune by validation loss |
| epochs | Passes over data | 1–3; more risks overfitting |
| `target_modules` | Which layers to adapt | All linear layers usually work best |

Watch **validation loss**: if it rises while training loss keeps falling, the model is overfitting.

## Step 4. GPU requirements

Exact numbers depend on the model, context length and batch size, so think in factors:

- **Model size** is the main driver. QLoRA cuts weight memory roughly fourfold compared with 16-bit loading.
- **Sequence length** — long examples increase activation memory.
- **Gradient checkpointing** saves memory at the cost of speed.
- **Gradient accumulation** emulates a large batch on a small GPU.

Start with a short run on a small slice of data to confirm everything fits in memory.

## Step 5. Evaluate against the base model

Without a baseline comparison you cannot claim fine-tuning helped.

- Run **the same test set** through the base and the tuned model.
- Use **task metrics**: classification accuracy, format compliance, share of valid JSON.
- Add **blind human review** or LLM-as-a-judge with clear criteria.
- Check for **regressions**: has the model lost general skills?

## Common mistakes

- Wrong chat template — the model answers oddly or never stops.
- Training on "dirty" data collected without review.
- Too many epochs on a small dataset.
- Judging only by loss without reading actual outputs.

## FAQ

### LoRA or QLoRA — which should I choose?

If memory allows, LoRA on a 16-bit model is simpler and a bit faster. If your GPU is limited, QLoRA lets you fine-tune a noticeably larger model.

### How many examples do I need?

There is no universal number. Changing format and style often takes a few hundred quality examples; complex skills need more. Let test-set metrics guide you.

### Can I merge the adapter into the model?

Yes, you can merge the adapter into the base weights for simpler deployment. With QLoRA, merge into a full- or half-precision copy of the model, not the 4-bit one.
