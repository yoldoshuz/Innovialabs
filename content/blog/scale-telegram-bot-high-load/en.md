---
title: How to Scale a Telegram Bot for High Load
description: Telegram bot architecture for high load: webhooks and task queues, Redis for state, idempotent update handling, horizontal scaling and rate limits.
summary: Receive updates via webhook and push them straight into a queue, process them with stateless workers that keep state in Redis, deduplicate by update_id, and route outgoing messages through a shared rate limiter.
---
## The architecture in one paragraph

A bot under load is not one process but a pipeline:

1. A **webhook receiver** gets the update, checks the secret and puts it in a queue. Telegram gets a response immediately.
2. A **task queue** (Redis Streams, RabbitMQ, Kafka, Celery, arq and so on) absorbs spikes.
3. **Stateless workers** process updates. You can run as many as you need.
4. **Redis** holds FSM states, caches, locks and rate-limit counters.
5. A **sender** emits outgoing messages while respecting Telegram's limits.

## Why webhooks, not long polling

**Long polling** (`getUpdates`) cannot scale horizontally: only one consumer can fetch updates at a time, and a second one gets a conflict error. High load calls for a **webhook**:

- Telegram pushes updates to your HTTPS endpoint;
- you can run several receivers behind a load balancer;
- the `max_connections` parameter of `setWebhook` caps parallel connections from Telegram;
- `secret_token` in `setWebhook` lets you check the `X-Telegram-Bot-Api-Secret-Token` header and reject foreign requests.

The receiver must **respond fast**. If processing happens inside the request and stalls, Telegram builds up a backlog and retries delivery, and users see delays.

## Update order within a chat

Parallel processing breaks ordering: a user's second message may be handled before the first, sending the FSM into the wrong state.

Solutions:

- **partition by `chat_id`**: updates from one chat always land in the same partition or queue and are processed sequentially;
- a **per-chat lock** in Redis for the duration of processing;
- different chats are still processed in parallel.

## Idempotency

An update can arrive twice: Telegram retries on errors or timeouts, and the queue retries a task after a worker crash. Protection:

```python
# Mark update_id as processed; the key lives for a day
is_new = await redis.set(f"upd:{update.update_id}", 1, nx=True, ex=86400)
if not is_new:
    return  # duplicate, skip
```

That is not enough if a worker dies mid-processing, so make **side effects** idempotent too:

- order creation uses a unique key (`update_id` or `callback_query.id`);
- balance deductions run in a transaction that checks the operation has not happened yet;
- message sends record "already sent" before any retry.

## State in Redis

If the FSM lives in process memory, a second worker knows nothing about it. Move all state out:

- **FSM and dialog data** go to Redis (`RedisStorage` in aiogram), with a TTL for abandoned dialogs;
- **long-lived data** (users, orders) goes to the main database;
- **reference data caches** go to Redis so you do not hit the database on every message.

Then any worker can handle any update, and restarts lose nothing.

## Horizontal scaling

- Receivers and workers are **stateless containers**, scaled by queue length or CPU.
- Separate queues for different task classes: **interactive** (replies to users) and **background** (broadcasts, reports, file processing). A broadcast must never slow down replies.
- Heavy operations (PDF generation, AI calls, media processing) belong in a separate worker pool with timeouts.
- The database often becomes the bottleneck before the bot does: connection pooling, indexes, read replicas.

## Telegram limits on outgoing messages

Telegram limits how fast you can send. Guidance from the official FAQ: no more than one message per second to a single chat, no more than 20 messages per minute to a group, and roughly 30 messages per second for bulk notifications. Limits can change, so check the documentation.

In practice:

- a **shared rate limiter** in Redis (token bucket) — a local counter per worker fails once you have many workers;
- a **per-chat** and a **global** limit at the same time;
- on a `429` response, read `retry_after` and reschedule the task instead of retrying immediately;
- run broadcasts as a queue with progress tracking so you can resume after a failure rather than start over;
- for very large broadcasts Telegram offers a paid `allow_paid_broadcast` mode, billed in Stars.

## Observability

- `getWebhookInfo`: `pending_update_count` and `last_error_message` are the first things to check when there are delays.
- Metrics: queue length, processing time, error rate, number of `429` responses.
- Logs with `update_id` and `chat_id` to trace one update through the whole system.

## FAQ

### When is it time to add a queue?

When handling an update takes noticeable time, when you call external services (payments, AI, CRM), or when you need broadcasts. If the bot is simple and replies instantly, a webhook and a few processes are enough.

### Can I run several copies of a long-polling bot?

No. Only one process can receive updates through `getUpdates` at a time. Switch to a webhook for multiple instances.

### What happens if my server is down?

Telegram keeps undelivered updates for a limited time and retries webhook delivery. They will arrive once you recover, which is why idempotency and checks on update freshness matter.
