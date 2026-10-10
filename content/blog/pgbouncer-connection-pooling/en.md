---
title: Connection Pooling with PgBouncer: Setup and Pitfalls
description: Why PostgreSQL connections are expensive, how session and transaction pooling differ, and how to set up PgBouncer for prepared statements and serverless.
summary: PgBouncer lets thousands of clients share a small number of real PostgreSQL connections; use transaction mode for most web and serverless apps, but avoid session-level state and handle prepared statements explicitly.
---
## Why you need a pooler at all

PostgreSQL creates a **separate server process for every connection**. Each one costs a fork, authentication (often with TLS) and its own memory. Even idle connections occupy slots under `max_connections` and add internal overhead.

A typical web app does not need many connections at the same moment — it needs many clients that each hold a connection for a few milliseconds. **PgBouncer** sits between the app and PostgreSQL, accepts a large number of cheap client connections and multiplexes them onto a small pool of real server connections.

## Session vs transaction pooling

Of the three modes, two matter.

| | Session | Transaction |
|---|---|---|
| Server connection is held | for the whole client session | only during a transaction |
| Connection reuse | low | high |
| `SET`, temp tables, `LISTEN` | work | break or leak between clients |
| Session advisory locks | work | unsafe |
| Typical use | legacy apps, admin tools | web APIs, workers, serverless |

**Session mode** is safe but gives little benefit: an idle client still pins a server connection.

**Transaction mode** is where pooling pays off. After `COMMIT` or `ROLLBACK`, the server connection goes back to the pool and the next query from the same client may land on a different backend. Anything tied to the session — `SET search_path`, `SET timezone`, temporary tables, `LISTEN/NOTIFY`, `pg_advisory_lock` — can no longer be trusted.

**Statement mode** forbids multi-statement transactions and is rarely the right choice.

## A minimal working config

```ini
[databases]
app = host=127.0.0.1 port=5432 dbname=app

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 2000
default_pool_size = 20
reserve_pool_size = 5
server_idle_timeout = 300
```

Key parameters:

- **max_client_conn** — how many clients PgBouncer accepts; client connections are cheap.
- **default_pool_size** — real connections per user/database pair. This is the number that loads PostgreSQL.
- **reserve_pool_size** — extra connections allowed when clients wait too long.
- The sum of all pools across all PgBouncer instances must stay below PostgreSQL `max_connections`, with room left for admin and migration sessions.

Point the app at port 6432 instead of 5432. Then check the admin console:

```bash
psql -h 127.0.0.1 -p 6432 -U pgbouncer pgbouncer -c "SHOW POOLS;"
```

Watch `cl_waiting` and `maxwait`. Clients constantly waiting means the pool is too small **or** transactions are too long — usually the second.

## Prepared statements

Many drivers and ORMs use protocol-level **prepared statements**: the statement is prepared on one backend and executed later by name. In transaction mode the next execute can hit a different backend, and you get errors like `prepared statement "s1" does not exist`.

Options, from simplest:

- **Recent PgBouncer versions** can track protocol-level prepared statements in transaction mode via `max_prepared_statements`. Check that your version supports it before relying on it.
- **Disable named prepared statements in the driver**: for example `prepareThreshold=0` in the PostgreSQL JDBC driver, `statement_cache_size=0` in asyncpg, `pgbouncer=true` in the Prisma connection string.
- **SQL-level `PREPARE`** is never safe in transaction mode — it lives in the session.

## Serverless and many small instances

Serverless functions and autoscaled containers are the classic case for pooling. Each instance opens its own connections, and a traffic spike turns into a **connection storm** that hits `max_connections` long before CPU runs out.

What works:

- Put PgBouncer (or your provider's managed pooler) in front of the database and use **transaction mode**.
- Keep the **app-side pool tiny** — often one connection per function instance.
- Run **migrations, `pg_dump` and long admin jobs through a direct connection**, not the pooler. Prisma, for example, supports a separate `directUrl` for this.
- Set session parameters per role or database (`ALTER ROLE app SET search_path = ...`) instead of `SET` in application code.

## Common mistakes

- **Long transactions.** A transaction waiting on an external HTTP call holds a server connection throughout. Do network calls outside transactions.
- **`idle in transaction` sessions.** Forgotten `BEGIN` without a commit blocks a pool slot. Set `idle_in_transaction_session_timeout` in PostgreSQL.
- **Oversized pools.** More server connections do not mean more throughput; past a point they compete for CPU and locks. Start small and grow while measuring latency.
- **A single PgBouncer as a single point of failure.** Plan for at least two instances or a managed option in production.
- **Assuming session features still work.** Audit the code for `SET`, temp tables, `LISTEN` and advisory locks before switching to transaction mode.

Full parameter reference: [PgBouncer configuration](https://www.pgbouncer.org/config.html).

## FAQ

### Do I need PgBouncer if my framework already has a connection pool?

An in-app pool limits connections from one process. Once you run several processes, containers or functions, their pools add up. PgBouncer caps the total for the whole fleet, so with horizontal scaling you usually need both, with a small in-app pool.

### Which pool mode should I choose?

Transaction mode for most web APIs, background workers and serverless apps, provided you do not rely on session state. Session mode when the app depends on `LISTEN/NOTIFY`, temp tables or session locks and cannot be changed easily.

### How do I pick default_pool_size?

There is no universal number: it depends on CPU, disks and query profile. Start with a modest pool, watch `SHOW POOLS`, query latency and database CPU, and increase only while throughput keeps improving.
