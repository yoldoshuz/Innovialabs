---
title: Recursion Explained: Base Cases, Call Stack and Examples
description: How to think recursively with factorial, tree traversal and permutations, what the call stack looks like, why stack overflow happens and what tail recursion is.
summary: Recursion is a function solving a problem by calling itself on a smaller subproblem; it needs a base case where the calls stop, otherwise the call stack overflows.
---
## What recursion is

A **recursive function** calls itself to solve a smaller version of the same problem. Every correct recursion has two parts:

- **Base case** — the simplest input whose answer is known immediately. This is where the calls stop.
- **Recursive step** — reduce the problem to a smaller one and call the function on it.

If there is no base case, or the step does not move toward it, the function calls itself forever.

## How to think recursively

A useful trick is to **trust the function**. Do not try to unroll every call in your head. Ask yourself:

1. What is the simplest input, and what is its answer?
2. If the function already solves size n − 1 (or half, or a subtree), how do I get the answer for n?
3. Does every call definitely move closer to the base case?

## Example 1: factorial

n! = n × (n − 1)!, and 0! = 1.

```python
def factorial(n):
    if n == 0:          # base case
        return 1
    return n * factorial(n - 1)  # recursive step
```

## The call stack, visually

Every function call pushes a frame onto the **call stack**: arguments, local variables and the return point. For `factorial(3)`:

```text
factorial(3)  waits for 3 * factorial(2)
  factorial(2)  waits for 2 * factorial(1)
    factorial(1)  waits for 1 * factorial(0)
      factorial(0)  returns 1
    factorial(1)  returns 1
  factorial(2)  returns 2
factorial(3)  returns 6
```

First the stack grows down to the base case, then it unwinds, and each frame finishes its multiplication.

## Example 2: tree traversal

Trees are recursive by nature: a node has children that are trees themselves. So recursion fits more naturally than loops.

```python
def tree_sum(node):
    if node is None:
        return 0
    return node.value + sum(tree_sum(child) for child in node.children)
```

The same pattern walks a file system, a DOM tree, nested comments and menus.

## Example 3: permutations

Task: list all permutations of a list. Recursive thinking: choose the first element in every possible way, then permute the rest recursively.

```python
def permutations(items):
    if len(items) <= 1:
        return [items]
    result = []
    for i, first in enumerate(items):
        rest = items[:i] + items[i + 1:]
        for perm in permutations(rest):
            result.append([first] + perm)
    return result
```

This is an example of **backtracking**: the same ideas solve sudoku, the N-queens problem and combination generation.

## Stack overflow

The call stack is limited. If recursion goes too deep, the program crashes with a **stack overflow** (in Python, a `RecursionError`).

Causes:

- **No base case**, or it is unreachable, e.g. `factorial(-1)`.
- **Too much depth** — recursion thousands or millions of levels deep, such as walking a long linked list.

What to do:

- Validate input and the base case.
- Rewrite the algorithm as a **loop** or with an explicit stack (a list you push tasks onto yourself).
- Use a divide-in-half approach so depth is O(log n) rather than O(n).

## Tail recursion

A recursion is **tail recursive** when the recursive call is the last action and its result is returned as is:

```python
def factorial_tail(n, acc=1):
    if n == 0:
        return acc
    return factorial_tail(n - 1, acc * n)
```

Some compilers and languages (Scheme, and many functional languages) turn such a call into a loop, so the stack does not grow. **Python and most JavaScript engines do not**, so the tail form will not save you from overflow there — use a loop.

## Recursion or loop

| Situation | Better choice |
|---|---|
| Trees, graphs, nested structures | Recursion |
| Exploring options (backtracking) | Recursion |
| A simple pass over a list | Loop |
| Very large depth | Loop or explicit stack |

## FAQ

### Is recursion slower than a loop?

Usually a little, because each call creates a stack frame. But for trees and backtracking the code becomes much clearer, and the speed difference is rarely critical.

### How do I debug a recursive function?

Check the base case on the smallest input, then on an input one step larger. Printing arguments indented by call depth helps a lot.

### Why does recursion sometimes take very long?

It often solves the same subproblems many times, as in naive Fibonacci. Memoization — storing already computed results — fixes this.
