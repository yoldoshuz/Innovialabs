---
title: How Hash Tables Work: Hashing, Collisions and Lookups
description: Hash functions, buckets, chaining vs open addressing, load factor and resizing, and how dict, Map and HashMap work under the hood in Python, JS and Java.
summary: A hash table turns a key into an array slot using a hash function, so lookup, insertion and deletion take constant time on average, while collisions are handled by chaining or open addressing.
---
## The idea in one paragraph

A hash table is an array of slots (**buckets**) plus a **hash function** that turns a key into a number. That number is mapped to a slot index, for example by taking the remainder after dividing by the array size. To find a value you do not scan every element: compute the hash and go straight to the right slot. That is why operations take **O(1)** on average.

## The hash function

A good hash function for a table should be:

- **deterministic** — the same key always yields the same hash;
- **evenly distributed** across slots;
- **fast** to compute.

This leads to a key rule: **if two keys are equal, their hashes must be equal**. That is why in Java overriding `equals` requires overriding `hashCode`, and why in Python mutable objects like `list` cannot be dictionary keys — their contents could change and the hash would become wrong.

Table hash functions do not need to be cryptographic. Passwords and signatures use different algorithms.

## Collisions

There are fewer slots than possible keys, so two different keys sometimes land in the same slot. That is a **collision**, and there are two main ways to handle it.

| Approach | How it works | Pros | Cons |
|---|---|---|---|
| Chaining | Each slot holds a list of every item with that index | Simple, tolerates high load | Extra memory for nodes, less cache-friendly |
| Open addressing | If a slot is taken, probe for the next free one by a fixed rule | Compact storage, faster thanks to cache | Harder deletion, degrades badly at high load |

With open addressing you cannot simply erase a deleted item — a lookup would stop at the empty slot and miss keys stored further along. Instead the slot gets a special "deleted" marker.

## Load factor and resizing

The **load factor** is the number of items divided by the number of slots. The higher it is, the more collisions and the slower the operations. When it crosses a threshold, the table **resizes**: it allocates a bigger array and redistributes every item.

A single resize costs O(n), but it happens rarely, so per operation insertion stays O(1) — this is called **amortized** complexity. If you know the item count in advance, many languages let you set an initial capacity to avoid repeated rebuilds.

## How popular languages do it

**Python `dict` and `set`.** They use open addressing. Since Python 3.7, dictionaries are guaranteed to preserve key insertion order. Keys must be hashable: strings, numbers, tuples of immutable values.

**JavaScript `Map` and `Set`.** The specification requires insertion order to be preserved, and engines implement them with hash tables. Unlike a plain object, a `Map` accepts keys of any type and compares objects by reference, not by contents.

```javascript
const m = new Map();
const key = { id: 1 };
m.set(key, "a");
m.get({ id: 1 }); // undefined: a different object
m.get(key);       // "a"
```

**Java `HashMap`.** It uses chaining. The default load factor is 0.75. When a chain in one bucket grows too long, it is converted into a balanced tree to keep the worst case reasonable. Order is not guaranteed — use `LinkedHashMap` for insertion order and `TreeMap` for key order.

## When O(1) turns into O(n)

- A poor hash function that sends many keys to the same slot.
- Keys crafted by an attacker to collide (hash flooding). This is why some languages add randomness to string hashing.
- Mutating a key after insertion: the item stays in the old slot and gets "lost".

## Common mistakes

- Using a mutable object as a key.
- Relying on an order the language does not guarantee.
- Overriding equality but forgetting the hash.
- Storing data in a hash table when you need range queries — a tree is a better fit.

## FAQ

### Why is a hash table lookup faster than a list search?

A list compares the key with each item until it finds a match. In a hash table the hash points straight to the right slot, and you only compare against the items inside it — usually one or two.

### How is a hash table different from a search tree?

A hash table is faster on average for exact-key lookups but does not keep keys sorted. A tree gives O(log n) but supports ordering, min, max and range queries.

### Should I choose the table size myself?

Usually not: standard implementations grow automatically. Setting an initial capacity makes sense when you know up front there will be a very large number of items.
