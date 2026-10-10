---
title: Load Testing with k6: How to Find Your App's Limits
description: A practical k6 guide: writing scripts, modeling realistic load, reading latency percentiles and error rates, and turning results into concrete fixes.
summary: Write a k6 script that repeats real user actions, ramp load up in stages with clear thresholds for p95 latency and errors, watch server metrics in parallel, and fix the first bottleneck you find before testing again.
---

## The short answer

**k6** is an open-source load testing tool where scenarios are written in JavaScript and run from the command line. To find your app's limits:

1. Pick the critical user flows (login, catalog, checkout, search).
2. Script them in k6 with realistic pauses and data.
3. Increase load step by step and set **thresholds** for latency and errors.
4. Watch the server side (CPU, memory, database, queues) during the run.
5. Find where latency or errors start to grow, fix the cause, repeat.

The goal is not a big number of requests per second. It is knowing **at what load the user experience breaks and why**.

## A first script

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://staging.example.com/api/products');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

Run it with `k6 run script.js`. Here 50 virtual users (VUs) ramp up over two minutes, hold for five and ramp down. The thresholds are example values: replace them with targets that match your product. If a threshold fails, k6 exits with a non-zero code, so the test can run in CI.

## Modeling realistic load

A test is only as useful as its load profile. Things to get right:

- **User flows, not single endpoints.** Combine requests in the order a real user makes them, with `sleep()` between steps as think time.
- **Varied data.** Use different product IDs, search queries and accounts, otherwise caches make everything look fast.
- **Open vs closed model.** With VUs, a slow server makes users wait and send fewer requests, hiding the problem. Executors like `constant-arrival-rate` or `ramping-arrival-rate` keep sending requests at a set rate regardless of response time, which is closer to real traffic.
- **Test types.** A short **smoke** test checks the script; a **load** test checks expected traffic; a **stress** test pushes beyond it; a **spike** test adds a sudden jump; a **soak** test holds load for hours to catch memory leaks and connection exhaustion.

Run tests against a staging environment that resembles production. If you must test production, agree on a time window and warn the team and any external providers.

## Reading the results

k6 prints a summary at the end. The lines that matter most:

| Metric | What it tells you |
|---|---|
| `http_req_duration` p(95), p(99) | How slow the slowest 5% and 1% of requests are |
| `http_req_duration` avg | Rarely useful alone: averages hide long tails |
| `http_req_failed` | Share of failed requests (network errors, 4xx/5xx by default) |
| `checks` | Whether responses had the expected content |
| `iterations` | How many full user flows completed |
| `dropped_iterations` | Arrival-rate tests: requests k6 could not start, a sign of too few VUs or an overloaded generator |

Look at **trends over time**, not only the summary. The useful finding is the point where p95 starts to climb steeply or errors appear while load is still rising. That is your practical limit.

## Turning findings into fixes

Latency numbers only say that something is slow. To learn what, correlate the test with server metrics and logs:

- **CPU near the limit** on app servers: profile hot code, add caching, scale horizontally.
- **Database is the bottleneck**: slow query log, missing indexes, N+1 queries, too small a connection pool.
- **Errors without high CPU**: connection limits, file descriptor limits, timeouts in nginx or the load balancer, rate limits of external APIs.
- **Latency grows slowly over a soak test**: memory leaks, growing queues, unclosed connections.

Change one thing at a time and rerun the same script, so the comparison is fair. Keep the scripts in the repository next to the code.

## Common mistakes

- The load generator itself runs out of CPU or bandwidth and becomes the bottleneck.
- No think time, so a handful of VUs behaves like an attack rather than users.
- Ignoring errors because latency looks good: fast 500 responses are still failures.
- Testing only the home page while the real load lands on search and checkout.
- Hitting third-party payment or SMS APIs from the test instead of using mocks.

## FAQ

### How many virtual users should I simulate?

Start from your real or expected traffic: peak concurrent users and requests per second from analytics or logs. Test that level first, then go beyond it to see how much headroom you have.

### Can k6 test websites with heavy front-end JavaScript?

The core HTTP module measures backend and API performance. k6 also has a browser module for page-level metrics, but protocol-level tests are cheaper and usually where server limits are found.

### How often should load tests run?

Before launches and major releases, and ideally a shorter version in CI on a schedule, so performance regressions are caught early. See the official documentation at [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/).
