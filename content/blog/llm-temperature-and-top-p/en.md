---
title: LLM Temperature and Top-p: How to Set Generation Parameters
description: What temperature and top-p do, how they change model output with examples, and which settings to use for data extraction, support and creative writing.
summary: Temperature controls how random the choice of the next token is, while top-p limits that choice to the most likely options. Use low values for precise tasks, higher ones for creative work, and usually change only one parameter.
---
## In short: what these parameters do

An LLM generates text one **token** (a word or part of one) at a time. At each step the model computes a probability for every possible next token and then **picks** one. Temperature and top-p control exactly that choice.

- **Temperature** is how "bold" the pick is. Low: the most likely token is taken almost every time. High: less likely options get a better chance.
- **Top-p (nucleus sampling)** is the pool to pick from. The model sorts tokens by probability and keeps only the most likely ones until their combined probability reaches p. The rest are discarded.

## What it looks like in practice

Say the model is continuing "Our store is open…" with these estimates:

| Token | Probability |
|---|---|
| daily | 0.50 |
| from | 0.25 |
| until | 0.15 |
| around-the-clock | 0.07 |
| underwater | 0.03 |

- **Temperature near 0:** almost always "daily". Answers are stable and predictable.
- **Higher temperature:** the distribution flattens, so "around-the-clock" or even "underwater" shows up more often. Text is more varied, but the risk of oddities grows.
- **Top-p = 0.9:** the model keeps "daily", "from" and "until" (together 0.90) and picks only among them. Rare, strange options are cut off while some variety remains.

### One prompt with different settings

Prompt: "Suggest a name for a coffee shop."

- Low temperature: several runs return the same or very similar names.
- Medium: options differ but stay sensible.
- High: unexpected and sometimes meaningless word combinations appear.

## Recommended settings by task

Exact ranges depend on the model and provider, so follow the logic rather than specific numbers from someone else's examples.

| Task | Temperature | Top-p | Why |
|---|---|---|---|
| Data extraction, classification, JSON | minimal (0 or close) | default | You need one correct, reproducible answer |
| Support answers, RAG | low | default | Accuracy and grounding beat variety |
| Summaries, paraphrasing | low to medium | default | Natural wording without drifting from meaning |
| Marketing copy, ideas, names | medium to high | default or slightly lower | Variety of options is valuable |

An API call with parameters:

```python
response = client.chat.completions.create(
    model="your-model",
    messages=[{"role": "user", "content": "Extract the date and amount from the text..."}],
    temperature=0,
)
```

## Common mistakes

- **Changing both parameters at once.** Many providers' docs advise tuning either temperature or top-p. That makes it clear what affected the result.
- **Expecting determinism at temperature 0.** Answers become much more stable, but identical output on every run is not guaranteed.
- **Treating hallucinations with temperature.** Low temperature reduces randomness but adds no knowledge. RAG, clear instructions and answer verification fight made-up facts.
- **Raising temperature for "liveliness" in support.** Set tone in the prompt, not through randomness.
- **Not checking parameter support.** Some models, especially reasoning modes, ignore or restrict these settings. Check the docs for the specific model.

## How to pick values

1. Start with defaults, or a low temperature for precise tasks.
2. Collect 20–30 typical requests.
3. Run them several times with different values of one parameter.
4. Judge not only quality but also stability: how much answers differ between runs.
5. Pin the chosen values in code and revisit them when you switch models.

## FAQ

### Should I use temperature or top-p?

For most tasks temperature is enough and more intuitive. Top-p helps when you want variety without rare odd options. Change one parameter and leave the other at its default.

### Why do answers still differ sometimes at temperature 0?

Provider-side computation and request handling details affect the result. Answers will be very similar, but byte-for-byte identity is not guaranteed.

### Does temperature affect speed or cost?

Not directly: cost depends on the number of tokens. Indirectly, a high temperature may produce longer answers and therefore more tokens.
