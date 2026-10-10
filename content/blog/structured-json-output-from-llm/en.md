---
title: How to Get Reliable JSON Output From an LLM
description: Prompt-only, JSON mode or schema-constrained output: comparing ways to get JSON from an LLM, plus validation, retry patterns and common parsing failures.
summary: The most reliable option is schema-constrained output (structured outputs) when your model and API support it; JSON mode only guarantees valid syntax, and a prompt instruction alone guarantees nothing. Either way, validate the response against a schema in code and retry on failure.
---

## Three ways to get JSON

When code rather than a human reads the LLM's reply, you need predictable JSON. There are three levels of reliability:

| Method | What it guarantees | Risks |
|---|---|---|
| **Prompt only** | Nothing: the model tries to follow the instruction | Extra text, markdown wrapping, missing fields |
| **JSON mode** | Syntactically valid JSON | Fields and types may not match expectations |
| **Schema-constrained** (structured outputs) | JSON matches the schema you pass | Not supported by every model or every schema construct |

The choice is simple: if the API supports schema-constrained output, use it. If not, use JSON mode plus strict validation. A prompt with neither is fine only for a prototype.

Another option is **tool calling** (function calling): you describe a "tool" with a parameter schema and the model returns arguments as a structure. Many teams use it precisely as a way to get JSON.

## How to prompt for JSON

Even with JSON mode the prompt matters — the model needs to understand what the fields mean.

- Show the **exact schema** or a sample object.
- Describe each field and its allowed values.
- Say what to do when data is missing: `null`, an empty array or a special value.
- Ask for **JSON only**, with no explanations and no markdown.

```text
Extract data from the request. Return only JSON with no explanations:
{
  "name": string,
  "phone": string | null,
  "service": "web" | "mobile" | "bot" | "other",
  "budget_mentioned": boolean
}
If a field is not in the text, use null.
```

## Validation: always check the response

Valid syntax does not mean correct data. Validate the reply against a schema in code — for example with Pydantic in Python or Zod in TypeScript.

```python
from typing import Literal, Optional
from pydantic import BaseModel, ValidationError

class Lead(BaseModel):
    name: str
    phone: Optional[str]
    service: Literal["web", "mobile", "bot", "other"]
    budget_mentioned: bool

def parse_lead(raw: str) -> Lead | None:
    try:
        return Lead.model_validate_json(raw)
    except ValidationError:
        return None
```

The schema in code acts as the single source of truth: you can generate the JSON Schema for the API request from it.

## Retrying on failure

Even with a good setup, some replies will fail validation. A working pattern:

1. Send the request and get the reply.
2. Validate it.
3. On failure, retry **including the validation error**: "Your reply failed validation: field service has an invalid value. Fix it and return only JSON."
4. Cap the number of attempts (one or two retries is usually enough).
5. If it still fails, log it and return a clear error or send the item to manual review.

Do not retry forever, and do not "repair" JSON with regular expressions — that hides the problem.

## Common parsing failures

- **Markdown wrapping.** The model returns JSON inside a triple-backtick code block. Fix: schema-constrained output or JSON mode; as a last resort, carefully strip the wrapper before parsing.
- **Text before or after the JSON.** "Here is the result:" before the object. Fix: an explicit ban in the prompt plus validation.
- **Truncated output.** The token limit ran out mid-object. Fix: raise the limit and check the stop reason in the API response.
- **Wrong types.** `"true"` instead of `true`, a number as a string. Fix: schema and validation, with type coercion in code where appropriate.
- **Invented values.** The model fills a field that is not in the text. Fix: allow `null` and state explicitly that guessing is not allowed.
- **An overly complex schema.** Deep nesting and dozens of fields raise the error rate. Fix: simplify or split into several requests.

## FAQ

### Do I need validation if the API guarantees schema compliance?

Yes, at least a minimal one. The guarantee covers structure, not meaning: a value can be formally allowed and still wrong. Validation also protects you from API-side changes and truncated replies.

### Which is better: JSON mode or tool calling?

If you just need a structured reply, schema-constrained output or JSON mode is simpler. Tool calling fits when the model should decide whether to call an action and which one.

### Can the model reason and still return JSON?

Yes. Add a reasoning field to the schema before the answer fields and use only the fields you need in code. Order matters: the reasoning should come before the result.
