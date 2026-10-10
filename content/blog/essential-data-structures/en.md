---
title: Data Structures Every Developer Should Know
description: Arrays, linked lists, stacks, queues, hash maps, sets, trees, heaps and graphs: what each operation costs and a simple rule for picking the right one.
summary: Pick a data structure by its main operation: index access means an array, key lookup a hash map, order and ranges a tree, "most urgent item" a heap, and relationships between objects a graph.
---
## The main rule

A data structure is a way of laying out data in memory so that **your most frequent operation is cheap**. First figure out what your code does most often: read by index, look up by key, append, take the smallest item, or follow connections. The answer drives the choice.

## Operation cost table

Figures are for a typical implementation in the average case.

| Structure | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array (dynamic) | O(1) | O(n) | O(1) at end, O(n) in middle | O(n) |
| Linked list | O(n) | O(n) | O(1) given the node | O(1) given the node |
| Stack | O(1) to top | — | O(1) | O(1) |
| Queue | O(1) to front | — | O(1) | O(1) |
| Hash map | — | O(1) | O(1) | O(1) |
| Balanced search tree | — | O(log n) | O(log n) | O(log n) |
| Heap | O(1) to min | O(n) | O(log n) | O(log n) for min |

## Array

Elements sit next to each other in memory, so index access is instant and iteration is fast thanks to the CPU cache. Inserting in the middle shifts every element after it. **Use it by default** — for most lists it is the best choice.

## Linked list

Each node stores a value and a pointer to the next node. Insertion and deletion are cheap once you hold a reference to the node, but index access means walking from the start. Rarely needed in practice: think LRU caches or queues with frequent removal from the middle.

## Stack and queue

- **Stack (LIFO)** — last in, first out. Undo history, bracket matching, depth-first search, the function call stack.
- **Queue (FIFO)** — first in, first out. Processing jobs in order, breadth-first search, message buffers.

In Python use `collections.deque` for queues. In JavaScript an array with `push`/`pop` works as a stack; for large queues prefer a dedicated implementation, since `shift` moves elements.

## Hash map and set

A **hash map** stores key-value pairs and finds a value by key in constant time on average. It is `dict` in Python, `Map` and plain objects in JavaScript, `HashMap` in Java. A **set** is the same idea without values: fast "is it there?" checks and deduplication.

A classic trick: replace a nested search loop with a dictionary built once up front, and a quadratic algorithm becomes linear.

## Trees

A tree is a hierarchy of nodes with a single root. A **binary search tree** keeps items ordered: smaller on the left, larger on the right. When balanced, search, insert and delete take O(log n), and you also get ordered iteration and range queries. Trees power database indexes (B-trees), the DOM and file systems.

## Heap

A heap hands out the smallest (or largest) item quickly and accepts new ones quickly. It is the backbone of a **priority queue**: task schedulers, Dijkstra's algorithm, top-K selection. In Python it is the `heapq` module, in Java `PriorityQueue`.

## Graph

A graph models objects and the links between them: roads, social connections, package dependencies. It is usually stored as an adjacency list — a map from each vertex to its neighbors. Core algorithms: breadth-first and depth-first traversal, shortest paths, topological sort.

## Cheat sheet

- Ordered list with access by position — **array**.
- Fast lookup by key or removing duplicates — **hash map / set**.
- Process in arrival order — **queue**; in reverse order — **stack**.
- Always need the most urgent item — **heap**.
- Need ordering, ranges, "next larger" — **search tree**.
- The data is about connections — **graph**.

## Common mistakes

- Searching an array inside a loop when you could build a dictionary once.
- Choosing a linked list "because insertion is O(1)" when you first have to find the spot in O(n).
- Assuming a hash map keeps keys sorted.
- Optimizing the structure before measuring where the real bottleneck is.

## FAQ

### Do I need to implement these structures myself?

In production code, almost never: standard libraries ship well-tested versions. But you should understand how they work to choose the right one and predict performance.

### What do O(1) and O(log n) mean in practice?

They describe how running time grows with data size. O(1) does not depend on size, O(log n) grows very slowly, O(n) grows in proportion to the number of items. Constants and the CPU cache matter too, so on small inputs the difference may be invisible.

### Where should I start learning?

With arrays, hash maps and queues — they cover most everyday tasks. Then trees and heaps, then graphs.
