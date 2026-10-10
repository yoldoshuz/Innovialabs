---
title: Binary Search: How It Works and How to Implement It
description: The idea behind binary search, iterative and recursive code, off-by-one pitfalls, finding the first occurrence and binary search on the answer.
summary: Binary search finds an element in sorted data in O(log n) by discarding half the range at each step; the key is to define your bounds and loop condition precisely to avoid off-by-one errors.
---
## The idea in a minute

Binary search only works on **sorted** data. Instead of scanning every element, you look at the middle of the range:

- if the middle equals the target, you are done;
- if the middle is smaller, the target is to the right, so drop the left half;
- if it is larger, the target is to the left, so drop the right half.

Every step halves the range, so the complexity is **O(log n)**. For a million elements that is about twenty comparisons instead of a million.

## Iterative implementation

This version uses a **closed interval** `[lo, hi]`: both bounds are part of the search.

```python
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

Key details:

- The condition is `lo <= hi`, because when `lo == hi` one candidate remains.
- Moves are `mid + 1` and `mid - 1`, because `mid` has already been checked.
- `lo + (hi - lo) // 2` instead of `(lo + hi) // 2` prevents overflow in languages with fixed-size integers (Java, C++). Python does not need it, but the habit is useful.

## Recursive implementation

```python
def binary_search_rec(a, target, lo, hi):
    if lo > hi:
        return -1
    mid = lo + (hi - lo) // 2
    if a[mid] == target:
        return mid
    if a[mid] < target:
        return binary_search_rec(a, target, mid + 1, hi)
    return binary_search_rec(a, target, lo, mid - 1)
```

Same logic, but each step is a new call. Recursion depth is only O(log n), so the stack will not overflow. Still, the iterative version is usually easier to debug and uses no stack memory.

## Off-by-one errors

Most binary search bugs are **off-by-one** errors. Pick one convention and stick to it:

| Convention | Start | Loop condition | Move right | Move left |
|---|---|---|---|---|
| Closed `[lo, hi]` | `hi = n - 1` | `lo <= hi` | `lo = mid + 1` | `hi = mid - 1` |
| Half-open `[lo, hi)` | `hi = n` | `lo < hi` | `lo = mid + 1` | `hi = mid` |

Typical problems:

- **Infinite loop**: mixing `lo < hi` with `lo = mid`. The range stops shrinking.
- **Skipped element**: using `lo < hi` with a closed interval.
- **Out of bounds**: `hi = n` while reading `a[hi]`.

Test with an empty array, a single-element array, the target at the start, at the end, and a missing value.

## Finding the first occurrence

With duplicates, the basic version returns any match. To find the **first** one (lower bound), do not stop on a match; keep moving left:

```python
def lower_bound(a, target):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo  # first index where a[i] >= target
```

If `lo < len(a)` and `a[lo] == target`, that is the first occurrence. Likewise, **upper bound** (condition `a[mid] <= target`) gives the index right after the last occurrence. The count of occurrences is the difference. Python has the `bisect` module for this; C++ has `std::lower_bound` and `std::upper_bound`.

## Binary search on the answer

The technique is not limited to arrays. If the answer is a number in a range and the check "does x work?" is **monotonic** (all values up to some point say no, all after say yes), you can binary search the answer itself.

Example: the minimum ship capacity needed to deliver packages within D days.

1. The lower bound is the heaviest package; the upper bound is the sum of all.
2. A function `can(capacity)` greedily checks whether D days are enough.
3. Find the smallest value where `can` returns yes, using the same lower-bound template.

The same approach solves integer square roots, minimum time problems and maximising the minimum distance.

## FAQ

### Can I use binary search on an unsorted array?

No, the result will be wrong. Either sort the data first (O(n log n)) or, for a one-off lookup, use a linear scan.

### Iterative or recursive — which should I choose?

Usually iterative: it uses no stack and is easier to debug. The recursive version is helpful for understanding the idea.

### How do I know a problem fits binary search on the answer?

Look for monotonicity: if the condition holds for x, it also holds for all larger (or all smaller) values. Then the boundary can be found with binary search.
