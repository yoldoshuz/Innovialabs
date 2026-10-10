---
title: What Is SQLite and When Is It Enough
description: SQLite stores a whole database in one file inside your app. Learn where it shines, where its concurrency limits begin and when to move to a server DB.
summary: SQLite is a full SQL database packed into a library that keeps everything in a single file, with no separate server. It is enough while one machine accesses the data and writes are moderate; when many processes or servers need to write at once, move to PostgreSQL or MySQL.
---

## SQLite in one paragraph

**SQLite** is a relational database that runs inside your application as a library instead of as a separate server. The whole database — tables, indexes, data — lives in **one ordinary file** on disk. There is no installation, no daemon, no users or ports to configure: the app opens the file and runs SQL against it.

Despite the small footprint, it is a serious engine: it supports transactions with **ACID** guarantees, indexes, views, triggers, JSON functions and most of standard SQL.

## How the embedded model works

With PostgreSQL or MySQL, your app sends queries over the network to a server process that owns the data. With SQLite, the **query engine is compiled into your app**, and it reads and writes the file directly.

What this gives you:

- **Zero administration** — nothing to start, update or monitor separately.
- **Very fast local reads** — no network round trip per query.
- **Easy portability** — copy the file and you have copied the database.
- **Simple testing** — a fresh database per test is just a new file or an in-memory DB.

What it costs you:

- Access is limited to processes on **the same machine** as the file.
- There are **no built-in user accounts or roles** — whoever can read the file can read the data.
- **Only one writer at a time.** Writes lock the database; other writers wait.

## Where SQLite is the right choice

| Use case | Why it fits |
|---|---|
| **Mobile apps** (Android, iOS) | Built into the platforms; stores offline data, caches, settings |
| **Desktop tools** | Browsers, editors and many desktop apps keep their data in SQLite files |
| **Small and medium websites** | One server, mostly reads: blogs, catalogs, internal tools |
| **Prototypes and MVPs** | Start in minutes, migrate later if needed |
| **Embedded devices, IoT** | Small, reliable, no server process |
| **Data exchange** | One file is a convenient format to ship a dataset |

## Settings worth enabling

A few `PRAGMA` statements make SQLite much more comfortable in a real app:

```sql
PRAGMA journal_mode = WAL;    -- readers no longer block the writer
PRAGMA busy_timeout = 5000;   -- wait up to 5 s for a lock instead of failing at once
PRAGMA foreign_keys = ON;     -- foreign keys are off by default, per connection
```

**WAL mode** (write-ahead logging) is the key one: readers and the single writer can work at the same time, which removes most "database is locked" errors in web apps. Also consider `STRICT` tables if you want type checks — by default SQLite is flexible about column types.

## Signals that it is time for a server database

SQLite is not "for toys", but it has real limits. Consider PostgreSQL or MySQL when you see:

- **Several app servers** need the same data. A database file on a network share (NFS, SMB) is a known source of locking problems and corruption.
- **Frequent "database is locked" errors** even with WAL and a busy timeout — write concurrency has outgrown one writer.
- **Many simultaneous writers**: chats, order processing, high-traffic APIs with constant inserts.
- You need **access control**: separate users, roles, read-only accounts for analysts.
- You need **replication and failover** out of the box.
- Heavy analytics queries start slowing down the main app.

## Common mistakes

- Keeping the database file on a network drive shared by several machines.
- Opening a new connection for every small query and never enabling WAL.
- Copying the file while the app is writing — use `.backup` in the `sqlite3` shell or `VACUUM INTO` for a consistent copy.
- Forgetting that `foreign_keys` is off by default.

## FAQ

### Can SQLite handle a production website?

Yes, if the site runs on a single server and the load is mostly reads. Many content sites and internal tools work on SQLite for years. Problems start with many concurrent writes or several servers sharing one file.

### Is it hard to move from SQLite to PostgreSQL later?

It is quite doable, especially if you use an ORM or migration tool from the start. Expect to adjust data types, date handling and a few SQL dialect differences, and test the migration on a copy first.

### Is SQLite data secure?

The file itself has no passwords or roles, so security relies on file permissions and disk encryption. If you need encryption of the database file, there are extensions and builds for that, but access control in the server-database sense is not available.
