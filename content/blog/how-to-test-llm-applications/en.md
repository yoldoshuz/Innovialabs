---
title: How to Test LLM Applications: Evals, Datasets, LLM-as-Judge
description: How to test LLM apps: build a golden dataset, combine automated and human evaluation, avoid LLM-as-judge pitfalls and catch regressions on prompt or model changes.
summary: Test an LLM application on a golden set of real examples with clear criteria, combining code checks, an LLM judge and sampled human review, and rerun that set every time the prompt or model changes.
---
## The short answer

Classic unit tests do not map directly to LLMs: the output differs slightly every time. Instead of "string equals string" you build **evals** — a set of examples with quality criteria that runs automatically. The foundation is a **golden dataset**; on top of it sit three levels of evaluation: deterministic checks, **LLM-as-judge** and sampled human review.

## Step 1. Build a golden dataset

A **golden dataset** is inputs plus the expected result or the criteria of a good answer.

- Use **real user requests**, not invented ones.
- Add **hard cases**: ambiguous questions, off-topic requests, attempts to bypass rules.
- Cover every **scenario** of the app, not just the most common one.
- For each example, record what counts as correct: an exact answer, required facts, forbidden content.
- Keep the dataset in the repository next to the prompts and version it.

A few dozen examples is enough to start; add every failure you find in production.

## Step 2. Deterministic checks

Anything that can be checked with code should be — it is fast, cheap and stable:

- the output is valid JSON matching a schema;
- an extracted field matches the reference;
- no forbidden words or personal data in the answer;
- length stays within limits;
- the agent called the right tool with the right arguments.

```python
def check(case, output):
    data = json.loads(output)
    assert data["category"] == case["expected_category"]
    assert len(data["reply"]) < 1000
```

## Step 3. LLM-as-judge

For open-ended answers (tone, completeness, faithfulness to context) a judge model receives the question, the answer and the criteria, and returns a score.

Pitfalls:

- **Vague criteria** — "rate quality from 1 to 10" produces noise. Binary questions work better: "does the answer state the delivery time? yes/no".
- **Length bias** — judges tend to overrate longer answers.
- **Position bias** — when comparing two answers, order affects the choice; swap them.
- **Self-preference** — a model may rate answers from its own family higher.
- **The judge makes mistakes too** — compare its scores with human ones on a sample before trusting it.

## Step 4. Human evaluation

People are needed where the cost of an error is high or the criterion is subjective. To make it useful:

- give experts a **clear rubric**, not "like / dislike";
- review a **sample**, not everything;
- use human scores to **calibrate** the LLM judge.

## Step 5. Regression testing

Any change to the prompt, model, parameters or RAG index can improve one thing and break another. So:

1. Run the full dataset **before every release**, ideally in CI.
2. Compare metrics with the **previous version**, not an abstract threshold.
3. Look beyond the average at the **specific examples** that got worse.
4. Pin the model version and parameters so results are reproducible.
5. Account for **randomness**: run important examples several times.

## Common mistakes

- Testing "by eye" on a couple of prompts.
- A dataset made of easy examples only.
- Trusting the LLM judge blindly without checking it against humans.
- Not adding production failures to the dataset.

## FAQ

### How many examples does the dataset need?

A few dozen covering the main scenarios and hard cases is enough to start. Diversity and labeling quality matter more than size; the set grows with the product.

### Can the same model be both generator and judge?

It can, but there is a self-preference risk. It is safer to use a different model as the judge and regularly compare its scores with human ones.

### How do you test agents that use tools?

Check not only the final answer but the trajectory: which tools were called, in what order and with what arguments. Replace external services with stubs in tests.
