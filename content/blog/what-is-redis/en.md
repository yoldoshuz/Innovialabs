---
title: What Is Redis and Why Is It So Fast
description: Redis explained simply: the in-memory key-value model, its data structures, persistence options, the limits of keeping data in RAM, and typical use cases.
summary: Redis is a key-value store that keeps all data in RAM, which is why it responds so quickly. It is used for caching, sessions, queues, counters and leaderboards rather than as the only database for important data.
---

## Redis in short

**Redis** is a **key-value** data store that keeps everything in **RAM**. You store a value under a key, such as `session:42`, and later get it back instantly by that key.

Redis usually does not replace your main database — it works next to it. PostgreSQL or MySQL hold the durable data, while Redis speeds up whatever is requested often or has to be very fast.

## Why Redis is so fast

- **Data lives in memory.** Reading from RAM is orders of magnitude faster than reading from disk. This is the main reason.
- **Simple operations.** No complex query planner and no JOINs: each command knows exactly where the data is, and most operations have predictable complexity.
- **Single-threaded command execution.** Commands run one after another, so no locks are needed and every command is atomic. Network I/O is still handled efficiently without waiting on each client.
- **A lightweight protocol** and optimized internal encodings for its data structures.

The flip side of single-threaded execution: one slow command, such as scanning every key with `KEYS *`, delays every other client.

## Data structures

A Redis value is not just a string. That is what makes it such a versatile tool.

| Type | What it is | Typical use |
|------|-----------|-------------|
| Strings | A string or number | Page cache, view counter |
| Hashes | Fields inside one key | User profile, shopping cart |
| Lists | An ordered list | Simple job queue, activity feed |
| Sets | Unique values | Unique visitors, tags |
| Sorted sets | A set with numeric scores | Leaderboard, top products |

A few commands as an example:

```bash
SET page:home "<html>..." EX 300   # cache for 5 minutes
GET page:home
INCR views:article:15              # atomic counter
HSET user:42 name "Aliya" city "Tashkent"
LPUSH queue:emails "order-1001"
SADD visitors:2026-03-01 "user:42"
ZADD leaderboard 1500 "player:7"
ZRANGE leaderboard 0 -1 WITHSCORES
```

The **`EX`** option sets a key's time to live (TTL): when it expires, Redis deletes the key on its own. This is the core mechanism for caches and sessions.

## Persistence to disk

Although Redis runs in memory, it can save data to survive a restart:

- **RDB (snapshots).** Periodically writes the whole dataset to a file. Compact and fast to restore, but changes since the last snapshot are lost on a crash.
- **AOF (append-only file).** Logs every write operation. Less data loss, with a configurable disk sync frequency, but the file is larger.
- **RDB and AOF together** — a common choice when the data must be kept.
- **No persistence** — for a pure cache that can always be rebuilt from the main database.

## The limits of keeping data in RAM

- **Size.** All data must fit in the server's memory, and memory costs more than disk.
- **Running out of memory.** When the `maxmemory` limit is reached, Redis follows the configured **eviction policy**: for example, it removes least recently used keys or rejects writes. That is fine for a cache and dangerous for important data.
- **Risk of data loss.** Even with persistence, the latest changes may be lost on a crash, depending on configuration.
- **No complex queries.** Redis cannot answer "all users from Tashkent over 30" the way SQL can.

## Typical use cases

- Caching database and API responses.
- User sessions and tokens.
- Rate limiting.
- Background job queues.
- Counters, leaderboards, online status.
- Pub/Sub for simple notifications between services.

## Common mistakes

- Keeping the only copy of important data in Redis without persistence configured.
- Not setting a TTL on cache keys, so memory slowly fills up.
- Running `KEYS *` on a production server instead of `SCAN`.
- Exposing Redis to the internet without a password and network restrictions.

## FAQ

### Can Redis be my main database?

Technically yes, but for most projects it is risky: size is limited by memory, complex queries are not available, and durability depends on persistence settings. Redis usually complements a relational database.

### How is Redis different from Memcached?

Both are fast in-memory stores for caching. Memcached is simpler and only handles strings. Redis supports multiple data structures, persistence, replication and Pub/Sub, so it covers more use cases.

### How much memory does Redis need?

It depends on the number of keys and the size of values. Estimate your data volume, add headroom for internal overhead and growth, then configure `maxmemory` and an eviction policy. Track actual usage with the `INFO memory` command.
