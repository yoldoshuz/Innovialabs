---
title: Redis Use Cases: Caching, Sessions, Queues and Rate Limits
description: Practical Redis patterns with code: cache-aside with TTL, sessions, simple queues, pub/sub, leaderboards, rate limiting and choosing an eviction policy.
summary: Redis is an in-memory store for fast, short-lived data: use it for cache with TTL, sessions, lightweight queues, pub/sub, leaderboards and rate limits, while keeping the source of truth in your main database.
---

## What Redis is good for

**Redis** keeps data in memory and answers in microseconds to milliseconds. That makes it ideal for data that is read very often, lives briefly or must be counted quickly. It is not a replacement for your main database: treat most Redis data as something you can lose and rebuild.

Examples below use `redis-cli` commands; every client library (Node.js, Python, Go, PHP) exposes the same commands.

## Cache-aside with TTL

The application checks the cache first, and on a miss reads from the database and stores the result with an expiration time.

```python
import json

def get_product(product_id):
    key = f"product:{product_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    product = db.fetch_product(product_id)
    redis.set(key, json.dumps(product), ex=300)  # TTL 5 minutes
    return product

def update_product(product_id, data):
    db.update_product(product_id, data)
    redis.delete(f"product:{product_id}")  # invalidate
```

Rules that save you from bugs:

- **Always set a TTL**, so stale data disappears even if invalidation fails.
- **Delete the key on update** rather than writing the new value from several places.
- Add a small random spread to TTLs so thousands of keys do not expire at the same moment.

## Session storage

Sessions fit Redis well: small, read on every request, and they must expire.

```bash
SET session:9f2c... '{"userId":42,"role":"admin"}' EX 86400
GET session:9f2c...
EXPIRE session:9f2c... 86400   # sliding expiration on activity
DEL session:9f2c...            # logout
```

Most web frameworks have a ready Redis session adapter. Several app servers can share sessions, so you can scale horizontally.

## Simple queues

A list works as a basic job queue: producers push, workers block-wait for jobs.

```bash
LPUSH queue:emails '{"to":"user@example.com","template":"welcome"}'
BRPOP queue:emails 0   # worker waits until a job appears
```

The weakness: if a worker crashes after taking a job, the job is lost. For reliable processing use **Redis Streams** with consumer groups (`XADD`, `XREADGROUP`, `XACK`) or a proven library such as BullMQ, Sidekiq or Celery on top of Redis.

## Pub/sub

Pub/sub broadcasts messages to everyone currently subscribed.

```bash
SUBSCRIBE orders:new
PUBLISH orders:new '{"orderId":1001}'
```

Messages are **not stored**: an offline subscriber misses them. Use pub/sub for live notifications and cache invalidation across servers, and Streams when delivery matters.

## Leaderboards

Sorted sets keep members ordered by score.

```bash
ZINCRBY leaderboard:weekly 50 user:42
ZREVRANGE leaderboard:weekly 0 9 WITHSCORES   # top 10
ZREVRANK leaderboard:weekly user:42           # user's position
```

## Rate limiting

A fixed-window counter is the simplest limiter: count requests per key per minute.

```python
import time

def allow(user_id, limit=60):
    key = f"rate:{user_id}:{int(time.time() // 60)}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, 60)
    return count <= limit
```

Fixed windows allow bursts at window edges. For smoother limits use a sliding window with a sorted set or a token bucket implemented in a Lua script, so the check and update happen atomically.

## Eviction policies

When Redis reaches `maxmemory`, the `maxmemory-policy` setting decides what happens.

| Policy | Behavior | Use for |
|---|---|---|
| `noeviction` | Rejects writes when full | Queues, data you cannot lose |
| `allkeys-lru` | Evicts least recently used keys | Pure cache |
| `allkeys-lfu` | Evicts least frequently used keys | Cache with stable hot keys |
| `volatile-lru` | Evicts only keys with TTL | Mixed cache and persistent data |
| `volatile-ttl` | Evicts keys closest to expiry | Mixed workloads with meaningful TTLs |

A common approach is **separate Redis instances** for cache (`allkeys-lru`) and for queues or sessions (`noeviction` with persistence enabled).

## FAQ

### Can Redis lose data?

Yes, if persistence is off or between snapshots. Redis offers RDB snapshots and an append-only file (AOF); enable them where data matters, and still keep the source of truth in your main database.

### How much memory does Redis need?

It depends on the number of keys, value sizes and data structures. Measure with `INFO memory` and `MEMORY USAGE key` on realistic data, and leave headroom for peaks and background saving.

### Is Redis needed for a small project?

Often not at the start. Add it when you see repeated slow queries, need shared sessions across servers, or need rate limits and background jobs.
