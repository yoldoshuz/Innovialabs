---
title: Offline-First Mobile Apps: Local Storage and Data Sync
description: How to build an offline-first mobile app: SQLite, Room, Core Data and Realm, sync strategies, conflict resolution, request queues and testing poor networks.
summary: In an offline-first app the UI reads and writes only to a local database, while sync with the server runs in the background through a queue of changes. The hard part is not storage but resolving conflicts and retrying without duplicates.
---

## What offline-first means

**Offline-first** is an architecture where the source of truth for the UI is a **local database on the device**. Screens read and write locally and never wait for the network. A separate sync layer pushes changes to the server and pulls new ones in the background.

It pays off when people work with poor connectivity: couriers, sales reps, field staff, warehouses, notes and task apps. For a catalog that simply displays server data, a cache is usually enough.

## Choosing a local database

| Option | Platform | When it fits |
|---|---|---|
| **SQLite** | Everywhere | Full control over schema and queries; via wrappers such as GRDB, SQLDelight, drift, sqflite |
| **Room** | Android | The Android standard: SQLite with compile-time query checks and migrations |
| **Core Data / SwiftData** | iOS | Apple's native stack, integrated with SwiftUI and CloudKit |
| **Realm** | iOS, Android, Flutter, React Native | Object model without SQL. MongoDB announced the deprecation of Atlas Device Sync, so you will need to build sync for Realm yourself |

Flutter teams often choose **drift** (built on SQLite); React Native teams use SQLite wrappers or WatermelonDB.

Whatever the database:

- plan **schema migrations** from the first release — users will have old data versions;
- store a **server ID, local ID, modification time and sync status** on every record;
- use **soft deletes** (tombstones), otherwise the server never learns a record was deleted offline.

## Sync strategies

**Pulling changes:**

- **Delta sync**: the client sends a cursor or last-sync marker, and the server returns only what changed since. This is the main approach.
- **Full reload**: for small reference data, or as a fallback when local data is corrupted.
- **Push notification as a signal**: the server says "there are changes", and the app pulls.

**Pushing changes** goes through an **outbox**: every change is saved to the database together with an outbox entry, and a background worker sends the queue in order.

```sql
CREATE TABLE outbox (
  id TEXT PRIMARY KEY,        -- idempotency key (UUID)
  entity TEXT NOT NULL,
  operation TEXT NOT NULL,    -- create | update | delete
  payload TEXT NOT NULL,      -- JSON
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

## A request queue without duplicates

- Write the data and the outbox entry **in one transaction**.
- Every request carries an **idempotency key**: if a response is lost and the client retries, the server does not create a duplicate.
- Retry with **exponential backoff** and an attempt limit; after the limit, tell the user the change was not sent.
- Send in the background with **WorkManager** on Android and **BGTaskScheduler** on iOS. The system decides when tasks run, so also flush the queue when the app opens.
- Respect **dependencies**: an order cannot be sent before a customer created offline. Send in order, or send local IDs and map them on the server.

## Conflict resolution

A conflict happens when the same record is changed on two devices before sync.

| Strategy | How it works | Risk |
|---|---|---|
| **Last-write-wins** | The latest change by time wins | Silent data loss; device clocks can be wrong |
| **Record versions** | The client sends a version, the server rejects stale ones | You must decide what happens after a rejection |
| **Field-level merge** | Changed fields are combined; conflict only when the same field changed | Harder to implement |
| **CRDT** | Data structures that merge without conflicts | Complex; suited to collaborative editing |
| **User decides** | Show both versions | Good for important documents, tiring when conflicts are frequent |

For most business apps a working setup is **record versions plus field-level merge**, with last-write-wins only for unimportant data. Use server time for comparisons.

## Testing poor network conditions

- **Network Link Conditioner** on iOS and the Android emulator's network settings to simulate slow connections and packet loss.
- Proxies such as Charles or Proxyman to throttle speed and rewrite responses.
- Manual scenarios: airplane mode mid-upload, killing the app with a non-empty queue, two devices editing one record, updating the app with unsynced data.
- Automated tests for the sync layer with a fake network that returns errors, times out or duplicates responses.

## FAQ

### Should every app be offline-first?

No. It adds real complexity to the app and the backend. Do it when working without a network is a genuine user scenario; otherwise a cache and clear error messages are enough.

### Are there ready-made sync solutions?

Yes, there are services and libraries with built-in sync, such as Firebase Firestore with offline persistence. They save time but lock you into their data model and conflict rules, so check that they fit your logic.

### How do I show users that data is not synced yet?

Add an unobtrusive indicator on the record or in the screen header, plus a separate screen for failed uploads. Users should understand that changes are saved on the device but have not reached the server yet.
