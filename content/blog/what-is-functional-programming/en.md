---
title: What Is Functional Programming? Core Ideas for Beginners
description: First-class and higher-order functions, map, filter, reduce and declarative style explained with simple JavaScript and Python examples.
summary: Functional programming builds programs from small functions that take data and return new data, passing functions around like values. You describe what to compute, not how to loop step by step.
---

## The short answer

**Functional programming (FP)** is a style where a program is built from functions that take input and return output, ideally without changing anything outside themselves. Instead of writing loops that modify variables step by step, you combine small functions: "take the list, keep the paid orders, get their totals, add them up".

You do not need a special language. JavaScript, Python, Kotlin, C# and many others support the core FP ideas, and most modern code mixes FP with other styles.

## Idea 1: functions are values

In FP-friendly languages, functions are **first-class**: you can store them in variables, pass them as arguments and return them from other functions.

```javascript
const greet = (name) => `Hello, ${name}`;
const actions = { greet };
console.log(actions.greet("Aziza"));
```

```python
def greet(name):
    return f"Hello, {name}"

say = greet
print(say("Aziza"))
```

## Idea 2: higher-order functions

A **higher-order function** takes a function as an argument or returns one. This lets you separate *what to do* from *how to iterate*.

```javascript
const multiplier = (factor) => (x) => x * factor;
const double = multiplier(2);
double(5); // 10
```

The returned function remembers `factor` — this is called a **closure**.

## Idea 3: map, filter, reduce

These three higher-order functions cover most everyday list processing:

| Function | What it does | Result |
|---|---|---|
| `map` | transforms each element | list of the same length |
| `filter` | keeps elements that pass a check | shorter or equal list |
| `reduce` | combines all elements into one value | single value |

### Imperative version

```javascript
const orders = [
  { total: 120, paid: true },
  { total: 80, paid: false },
  { total: 50, paid: true },
];

let sum = 0;
for (let i = 0; i < orders.length; i++) {
  if (orders[i].paid) {
    sum += orders[i].total;
  }
}
```

### Functional version

```javascript
const sum = orders
  .filter((o) => o.paid)
  .map((o) => o.total)
  .reduce((acc, t) => acc + t, 0);
```

The same in Python, where comprehensions are often the idiomatic choice:

```python
orders = [
    {"total": 120, "paid": True},
    {"total": 80, "paid": False},
    {"total": 50, "paid": True},
]

total = sum(o["total"] for o in orders if o["paid"])
```

Python also has `map`, `filter` and `functools.reduce`, but generator expressions and built-ins like `sum` usually read better.

## Imperative vs declarative

- **Imperative** code describes *how*: create a counter, loop, check, update.
- **Declarative** code describes *what*: paid orders, their totals, the sum.

Declarative code is usually shorter, has fewer places for off-by-one errors and makes the intent visible in one line. Imperative code can be clearer for complex step-by-step algorithms or when performance tuning matters.

## Other core ideas worth knowing

- **Pure functions**: the same input always gives the same output, with no side effects. They are easy to test and reason about.
- **Immutability**: instead of changing data, create a new version. This prevents bugs where one part of the code silently changes data another part relies on.
- **Function composition**: build bigger functions by chaining small ones, where the output of one is the input of the next.

## How to start using FP in everyday code

1. Replace simple `for` loops that build new lists with `map` / `filter` or comprehensions.
2. Move calculations into small functions that only use their arguments.
3. Return new objects instead of mutating arguments.
4. Keep side effects (database, network, logging) at the edges of the program.
5. Do not force it: if a chain becomes hard to read, split it into named steps.

## Common mistakes

- Using `map` just to loop and cause side effects — use `forEach` or a plain loop for that.
- Building very long chains that no one can debug.
- Forgetting the initial value in `reduce`, which breaks on empty arrays in JavaScript.
- Assuming FP is all-or-nothing. Mixing styles is normal.

## FAQ

### Do I need Haskell or another functional language to learn FP?

No. You can learn the core ideas in JavaScript or Python, which you may already use. Purely functional languages are useful later if you want to go deeper.

### Is functional code slower?

Chains like `filter` and `map` create intermediate lists, which can matter on very large data. For typical application code the difference rarely matters, and readability wins. Measure before optimizing.

### Is FP better than OOP?

They solve different problems and work well together. Many codebases use objects for structure and functional techniques for data transformations.
