---
title: Sorting Algorithms Compared: Bubble, Merge, Quick and More
description: How bubble, insertion, merge, quick and heap sort work, how they compare on complexity and stability, and what built-in sort functions actually use.
summary: Simple sorts (bubble, insertion) run in O(n²) and suit tiny arrays, while merge, quick and heap sort run in O(n log n); in real code your language's built-in sort is almost always the right choice.
---
## The short answer

Sorting means putting elements in order by a key. Algorithms differ in three properties:

- **Time complexity** — how running time grows as the number of elements n grows.
- **Memory** — whether it needs an extra array or works in place.
- **Stability** — whether equal elements keep their original order.

It is worth understanding each algorithm when learning. In day-to-day work, your language's built-in `sort` is nearly always enough.

## Bubble sort

Walk through the array and swap neighbours that are out of order. After each pass the largest element "bubbles" to the end.

1. Compare `a[0]` and `a[1]`, swap if needed.
2. Compare `a[1]` and `a[2]`, and so on to the end.
3. Repeat passes until a pass makes no swaps.

Complexity is **O(n²)** and it is stable. In practice it is a teaching example, not a tool.

## Insertion sort

Take elements one by one and insert each into the right spot in the already sorted left part, like arranging cards in your hand.

```python
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
```

Worst case is **O(n²)**, but on nearly sorted data it approaches **O(n)**. It is stable and in place, which is why hybrid algorithms use it for small chunks.

## Selection sort

At each step, find the minimum of the unsorted part and move it to the front. Always **O(n²)** comparisons, but few swaps. The usual implementation is **not stable**.

## Merge sort

Divide and conquer:

1. Split the array in half.
2. Recursively sort each half.
3. Merge the two sorted halves by repeatedly taking the smaller front element.

Always **O(n log n)** and stable. The downside is **O(n)** extra memory. It works well for linked lists and for external sorting of files that do not fit in memory.

## Quicksort

1. Pick a **pivot** element.
2. Partition: smaller elements go left, larger go right.
3. Recursively sort both parts.

Average case is **O(n log n)** and it is very fast in practice thanks to cache-friendly memory access. The worst case is **O(n²)** when the pivot is always an extreme value (for example, choosing the first element of an already sorted array). A random pivot or median-of-three fixes this. Not stable.

## Heapsort

Build a binary heap from the array, then repeatedly extract the maximum. Guaranteed **O(n log n)**, in place, but not stable and usually slower than quicksort in practice.

## Comparison table

| Algorithm | Average | Worst | Extra memory | Stable |
|---|---|---|---|---|
| Bubble | O(n²) | O(n²) | O(1) | Yes |
| Insertion | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(1) | No |
| Merge | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n²) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(1) | No |

## What built-in sorts actually use

Standard libraries rely on **hybrid** algorithms:

- **Timsort** — merge sort plus insertion sort, and it detects already ordered runs. Used in Python and for object sorting in Java. Stable.
- **Introsort** — starts as quicksort, switches to heapsort if recursion gets too deep, and finishes small pieces with insertion sort. Typical for C++ `std::sort`.
- In JavaScript, the specification requires `Array.prototype.sort` to be stable; engines commonly use Timsort.

## Common mistakes

- **Writing your own sort for production** — the built-in one is almost always faster and well tested.
- **Ignoring stability** when sorting by several fields.
- **A wrong comparator**: in JavaScript, `[10, 9, 1].sort()` compares elements as strings. Use `sort((a, b) => a - b)`.

## FAQ

### Which sorting algorithm is the fastest?

There is no universal winner. On average, quicksort and hybrids like Timsort and introsort perform best, which is why standard libraries use them.

### Why learn bubble sort if it is slow?

It teaches comparisons, swaps and complexity analysis. It is a stepping stone to more advanced algorithms, not something to ship.

### When does stability matter?

When you sort by several keys in sequence, for example first by name and then by city. A stable sort keeps the name order within each city.
