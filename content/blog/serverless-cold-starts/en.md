---
title: Serverless Cold Starts: Why They Happen and How to Reduce Them
description: Why serverless functions are sometimes slow on the first request, what drives cold start time and which techniques actually reduce it in production.
summary: A cold start is the delay of creating a new function instance: loading code, starting the runtime and running init; reduce it with lighter runtimes, small bundles, lazy init, provisioned concurrency and edge runtimes.
---
## The short answer

A **cold start** is the extra delay when the platform has to launch a new function instance because no warm, idle one is available. It happens after a period of inactivity, during sudden traffic spikes and after deploying a new version. Subsequent requests to an already warm instance are fast.

You attack cold starts from two sides: **make initialization lighter** (runtime, code size, dependencies) and **keep instances ready in advance** (provisioned concurrency, edge runtimes).

## The cold start lifecycle

1. **Environment allocation.** The platform creates an isolated environment: a container, microVM or isolate.
2. **Code download.** The function package or container image is fetched.
3. **Runtime start.** Node.js, Python, the JVM, .NET and so on boot up.
4. **Your initialization code.** Everything outside the handler runs: imports, database connections, config loading, SDK client creation.
5. **Request handling.** Only now is the handler invoked.

Steps 1–4 are the cold start. If more requests arrive, the instance is reused and steps 1–4 are skipped until the platform recycles it.

## What affects the duration

| Factor | Effect |
|---|---|
| Runtime | Lightweight interpreted runtimes usually start faster than the JVM or .NET without special optimization |
| Bundle size | More code and dependencies mean longer download and parsing |
| Init work | Heavy imports, DB connections and secret loading slow startup |
| Memory setting | With many providers CPU scales with memory, so init can run faster |
| Private network attachment | In some setups adds latency when creating the environment |
| Container image | Large images take longer to pull than compact packages |

## How to reduce cold starts

**Shrink the bundle.** Use a bundler with tree-shaking, import only the modules you need rather than a whole SDK, and drop unused dependencies.

**Initialize lazily.** Create heavy clients only when they are actually needed and reuse them across invocations:

```js
let db;
async function getDb() {
  if (!db) db = await connect(process.env.DATABASE_URL);
  return db;
}

export async function handler(event) {
  const conn = await getDb();
  // ...
}
```

**Pick a suitable runtime.** For latency-sensitive functions a lightweight runtime often wins. If you are on the JVM, look at post-init snapshot features (such as SnapStart in AWS Lambda) or native compilation.

**Provisioned concurrency.** The platform keeps a set number of initialized instances ready. There are no cold starts up to that level, but you pay for readiness even when traffic is low. It suits predictable traffic and important APIs.

**Minimum instances.** On container-based platforms (Cloud Run, for example) you can set a minimum number of always-on instances, which is the same latency-versus-cost trade-off.

**Edge runtimes.** Edge environments built on V8 isolates start much faster than containers, but come with limits: not every Node.js API is available, and time and memory limits are stricter.

**Ping warming.** Periodic requests keep one instance warm but do nothing for traffic spikes that need new instances. Treat it as a stopgap, not a solution.

## Common mistakes

- Connecting to the database and loading all secrets on every invocation.
- Pulling in an entire SDK for a single method.
- Enabling provisioned concurrency for every function instead of the critical ones.
- Measuring latency only on warm invocations and missing the real picture.

## FAQ

### How do I know the delay is really a cold start?

Check the platform's logs and tracing: many providers report init duration separately. If slow requests line up with periods after idleness, deploys or traffic spikes, it is almost certainly a cold start.

### Should we give up on serverless because of cold starts?

Not necessarily. For background jobs, webhooks and infrequent operations a small delay does not matter. For APIs with strict latency requirements, use provisioned concurrency, minimum instances, an edge runtime or an always-on server.

### Does adding memory always speed up cold starts?

Not always, but it often helps when the provider scales CPU with memory. Test it on your own function: measure init time across a few configurations and compare the cost.
