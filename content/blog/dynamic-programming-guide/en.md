---
title: Dynamic Programming: How to Recognize and Solve DP Problems
description: A repeatable method for DP problems: state, transition, base case. Memoization vs tabulation, plus the knapsack and longest common subsequence problems.
summary: Dynamic programming applies when a problem splits into overlapping subproblems with optimal substructure; you solve it by defining state, transition and base case, and storing subproblem answers instead of recomputing them.
---
## When a problem is DP

**Dynamic programming (DP)** solves problems by breaking them into subproblems and storing their answers. It fits when two conditions hold:

- **Overlapping subproblems** — naive recursion solves the same thing many times.
- **Optimal substructure** — the optimal answer is built from optimal answers to subproblems.

Signals in the problem statement: "minimum cost", "maximum sum", "how many ways", "is it possible", and constraints like "choose items so that…". If brute force is exponential but the number of distinct subproblems is small, it is almost certainly DP.

## A three-step method

1. **State.** What describes a subproblem? Usually one or two indexes: "the first i items", "prefixes of length i and j", "capacity w". Put it in words: `dp[i][w]` is the best result for the first i items with capacity w.
2. **Transition.** How do you express a state through smaller ones? List the choices at the last step (take / skip, characters match / do not) and pick the best.
3. **Base case.** Answers for the smallest states: an empty prefix, zero capacity.

Then decide the **evaluation order** (so dependencies are ready) and **where the answer lives**.

## Memoization vs tabulation

| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| How it is written | Recursion + cache | Loops over a table |
| What it computes | Only needed states | All states |
| Risk | Deep recursion | Order must be planned |
| Memory optimisation | Harder | Often easy to reduce to one row |

A Fibonacci example:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n < 2:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)

def fib_tab(n):
    if n < 2:
        return n
    prev, cur = 0, 1
    for _ in range(n - 1):
        prev, cur = cur, prev + cur
    return cur
```

Memoization is a convenient start because it follows directly from the recursive formula. Switch to tabulation when recursion depth is large or memory matters.

## The 0/1 knapsack problem

You have items with a weight and a value, and a knapsack of capacity W. Each item can be taken at most once. Maximise total value.

- **State:** `dp[w]` is the maximum value with capacity w using the items considered so far.
- **Transition:** for an item (weight `wt`, value `val`), `dp[w] = max(dp[w], dp[w - wt] + val)`.
- **Base:** `dp[w] = 0` for every w — no items, no value.

```python
def knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):  # iterate backwards
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]
```

Iterating capacity **backwards** matters: it ensures each item is used only once. Going forwards gives the unbounded variant where items can repeat. Complexity is O(n·W) time and O(W) memory.

## Longest common subsequence (LCS)

Given strings A and B, find the length of the longest sequence of characters that appears in both in the same order (not necessarily contiguous).

- **State:** `dp[i][j]` is the LCS length of the first i characters of A and the first j characters of B.
- **Transition:** if `A[i-1] == B[j-1]`, then `dp[i][j] = dp[i-1][j-1] + 1`; otherwise `max(dp[i-1][j], dp[i][j-1])`.
- **Base:** `dp[0][j] = dp[i][0] = 0`.

```python
def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
```

Complexity is O(n·m). You can reconstruct the subsequence itself by walking back from `dp[n][m]`. The same idea powers file comparison tools (diff) and edit distance.

## Common mistakes

- **A vague state.** If you cannot describe `dp[i]` in one sentence, the transition will be a mess.
- **An incomplete transition** — one of the choices is missing.
- **Wrong iteration order** — a value is read before it is computed.
- **Index shifts** between the string and a table of size n + 1.
- **Greedy instead of DP** — the locally best choice does not always give the global optimum.

## FAQ

### How is DP different from divide and conquer?

In divide and conquer the subproblems are independent, like the halves in merge sort. In DP they overlap, so storing their answers pays off.

### Where do I start if I am stuck?

Write a brute-force recursion and note which parameters change between calls — that is your state. Then add a cache.

### How can I reduce memory in tabular DP?

If row `dp[i]` depends only on `dp[i-1]`, keep two rows, or a single row traversed in the right direction, as in the knapsack problem.
