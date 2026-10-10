---
title: How to Integrate an LLM API Into Your Product
description: A practical guide to production LLM API integration: key handling, streaming, rate limits, retries, provider fallbacks and logging for every call.
summary: Call the LLM only from your server, stream responses to users, handle rate limits with backoff retries, keep a fallback provider and log every request with its token usage.
---

## The short answer

Integrating an LLM API is not a single `fetch` to a provider. It is a thin layer on your server that stores keys, limits load, retries failed calls, switches to a fallback model and writes logs. Your UI talks only to your backend, never to the provider directly.

A minimal reliable setup:

1. The **client** sends a request to your API.
2. The **backend** checks the user and their limits, then builds the prompt.
3. An **LLM gateway** (your module) calls the provider with a timeout, retries and fallback.
4. The answer is **streamed** back to the client and metadata goes to the logs.

## API keys: server side only

- **Never put a key in frontend or mobile code** — it can be extracted from the bundle in minutes.
- Keep keys in environment variables or a secrets manager, not in the repository.
- Use **separate keys for dev, staging and production**, so a leaked test key never touches production.
- Set spending limits in the provider dashboard and enable alerts.
- Rotate keys regularly and revoke compromised ones immediately.

## Streaming responses

Models generate text gradually, and a full answer can take noticeable time. **Streaming** shows text as it is produced, so the interface feels fast.

- Most providers stream via **Server-Sent Events (SSE)**.
- Your backend reads the provider stream and proxies it to the client without waiting for the end.
- Handle disconnects: if the user closes the tab, abort the provider request so you do not pay for unused tokens.
- Background jobs (summaries, classification) do not need streaming — fetch the full answer.

## Rate limits and retries

Providers limit requests and tokens per minute. Exceeding them returns **429**; overload returns **5xx** errors.

Retry rules:

- Retry only **transient errors**: 429, 5xx, network timeouts. Retrying 400 or 401 is pointless.
- Use **exponential backoff with jitter**: the pause grows with each attempt and is slightly random.
- Respect the `Retry-After` header if the provider sends it.
- Cap both the number of attempts and the total timeout.

```ts
async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const retryable = err.status === 429 || err.status >= 500 || err.code === "ETIMEDOUT";
      if (!retryable || i >= attempts - 1) throw err;
      const delay = Math.min(1000 * 2 ** i, 15000) * (0.5 + Math.random() / 2);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

Also add **your own limits** per user and per plan — otherwise one heavy customer can burn the whole budget.

## Fallbacks between providers

One provider's outage should not take your product down.

- Define a **single interface** for model calls in your code and keep a separate adapter per provider.
- Set a chain: primary model → backup model from the same provider → a model from another provider.
- Remember that **prompts behave differently** across models. Test the fallback on the same scenarios.
- For critical features, keep a simple non-LLM fallback: a template, a database search, or a "please try again later" message.

## Logging and observability

Without logs you cannot tell why an answer was bad or where the bill came from.

What to record for every call:

| Field | Why |
|---|---|
| Request and user ID | Investigating complaints |
| Model and prompt version | Comparing quality |
| Input and output tokens | Cost control |
| Time to first token and total latency | Speed |
| Status, retries, fallback used | Reliability |

Prompt and response text may contain personal data. **Mask it** or store it briefly with access limited to the people who need it.

## Common mistakes

- Calling the provider from the browser with the key in the code.
- Retrying without delay, which makes overload worse.
- No timeout: the request hangs and the user waits.
- Prompts hardcoded without versions, so nobody knows what changed.
- No per-user or spending limits.

## FAQ

### Do I need a separate LLM gateway service?

At the start, a module inside your backend is enough. A separate gateway makes sense when several services call LLMs and you need central control of keys, limits and logs.

### How can I reduce token costs?

Trim the context, cache repeated answers, use lighter models for simple tasks and cap the maximum response length.

### Should I store conversation history with the provider?

It is better to store history yourself and send the relevant part with each request. That way you control the data and are not tied to one provider.
