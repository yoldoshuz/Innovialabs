---
title: What Is Serverless Computing: Pros, Cons and Use Cases
description: What serverless and functions as a service are, how pay-per-execution pricing works, which workloads fit and its limits: timeouts, cold starts, statelessness.
summary: Serverless is a model where you upload function code and the cloud runs it on events, scales it and bills you for actual invocations; it suits uneven traffic and background jobs, but not long-running processes or persistent connections.
---
## The short answer

**Serverless** does not mean there are no servers. It means **you do not manage them**. You write a function, upload it to the cloud, and the provider:

- runs it when an event arrives (an HTTP request, a queue message, a file upload, a schedule);
- starts as many copies as the load requires;
- shuts them down when there are no requests.

The most common form is **FaaS (Functions as a Service)**: AWS Lambda, Google Cloud Functions / Cloud Run functions, Azure Functions, Cloudflare Workers, Vercel Functions.

## What a function looks like

A function is a handler that receives an event and returns a result. Here is a simple HTTP function in the AWS Lambda style for Node.js:

```javascript
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? "world";
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
```

No web server, operating system or load balancer to configure — just code.

## How pricing works

The classic model is **pay-per-execution**: you pay for the number of invocations and for execution time weighted by allocated memory. No requests, almost no bill.

What drives the cost:

- **number of invocations**;
- **duration** of each invocation;
- **memory size** (which often determines the CPU you get too);
- **related services**: API gateway, database, storage, outbound traffic, logs.

That is why serverless pays off with low or uneven traffic. Under constant heavy load, a regular server or containers may be cheaper — run the numbers for your own workload.

## Workloads that fit

- **APIs and back ends for websites and mobile apps** with variable load.
- **Webhooks**: receiving events from payment systems, CRMs, Telegram bots.
- **File processing**: resizing images, generating previews, converting files after upload to storage.
- **Background and scheduled jobs**: mailings, reports, scheduled clean-ups.
- **Queue and event-stream processing.**
- **Prototypes and MVPs**, where launching fast without infrastructure matters.

## Limits

| Limit | What it means in practice |
|---|---|
| **Timeouts** | A function has a maximum run time. Long jobs must be split up or moved to other services. |
| **Statelessness** | You cannot rely on memory or local disk between invocations. Data lives in an external database, cache or storage. |
| **Cold starts** | If a function has not run for a while, the first request waits for the environment to spin up. |
| **Database connections** | Many parallel copies can exhaust a traditional database's connection limit. You need connection pooling or a suitable database. |
| **Vendor lock-in** | Triggers, permissions and related services differ per cloud, so moving requires rework. |
| **Debugging and monitoring** | The cloud environment is harder to reproduce locally; you rely on logs and tracing. |

Exact limits (time, memory, package size) differ between providers and change over time — check your cloud's documentation.

## Pros and cons at a glance

**Pros:**

- no servers or OS to administer;
- automatic scaling;
- pay for actual use;
- fast project start.

**Cons:**

- time and state limits;
- cold starts;
- harder to forecast the bill as load grows;
- dependence on the provider's ecosystem.

## How to decide

Ask yourself a few questions:

1. **Is the load uneven**, with long idle periods? — Points toward serverless.
2. **Are the tasks short** and within time limits? — Points toward serverless.
3. **Do you need persistent connections** (a WebSocket server, long-running workers)? — Points away.
4. **Does every request need minimal latency?** — Account for cold starts.
5. **Is the load high and steady?** — Compare costs with containers or a VPS.

Often the best answer is a mix: the main application in containers, with webhooks, file processing and scheduled jobs in functions.

## FAQ

### Is serverless always cheaper than a server?

No. With low or spiky traffic it usually is, because idle time is not billed. Under steady heavy load, a rented server or containers may cost less. Compare using your own traffic profile.

### How do I deal with cold starts?

Keep the package small with fewer dependencies, choose fast runtimes, and for critical functions use the provider's options to keep instances warm — these usually cost extra.

### Can I run a whole web application on serverless?

Yes, many frameworks work this way — for example, Next.js on Vercel turns each server-side part into a function. Just keep statelessness in mind and store data in external services.
