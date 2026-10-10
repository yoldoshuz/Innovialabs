---
title: Static vs Dynamic Typing: Pros, Cons and Examples
description: How static typing differs from dynamic and strong from weak, what the same bug looks like in different languages, and why gradual typing is a middle ground.
summary: Static typing checks types before the program runs, dynamic typing checks them at runtime; strong versus weak is a separate question about implicit conversions, and gradual typing (TypeScript, Python type hints) lets you combine the best of both.
---

## The short version: two separate axes

Typing is described by two independent questions.

**When are types checked?**
- **Static**: before running, at compile or analysis time. Examples: Java, C#, Go, Rust, TypeScript.
- **Dynamic**: at runtime, when execution reaches a particular line. Examples: Python, JavaScript, Ruby, PHP.

**How tolerant is the language of mixing types?**
- **Strong**: few implicit conversions; you cannot add a string and a number without an explicit cast. Example: Python.
- **Weak**: the language happily converts types for you. Example: JavaScript, where `"5" * 2` evaluates to `10`.

These are different axes: Python is **dynamic and strong**, JavaScript is **dynamic and weak**, Java is **static and mostly strong**. "Strong" and "weak" have no strict definition, so talk about concrete behavior rather than labels.

## One bug, three languages

A function calculates an order total, and the price arrives from a form as a string.

**JavaScript (dynamic, weak):**

```javascript
function total(price, qty) {
  return price + qty;
}
total("100", 2); // "1002" — no error, just a wrong result
```

The bug is silent: the program keeps going with garbage data.

**Python (dynamic, strong):**

```python
def total(price, qty):
    return price + qty

total("100", 2)  # TypeError: can only concatenate str (not "int") to str
```

You get an error, but only **when that code runs** — possibly in front of a user.

**TypeScript (static):**

```typescript
function total(price: number, qty: number): number {
  return price + qty;
}
total("100", 2);
// Compile error: Argument of type 'string'
// is not assignable to parameter of type 'number'.
```

The bug shows up **in the editor before anything runs**.

## Pros and cons

| | Static | Dynamic |
|---|---|---|
| When type errors are found | before running | at runtime |
| IDE hints and autocomplete | precise | limited |
| Refactoring | safer: the compiler shows what broke | needs tests to catch everything |
| Getting started | more code to describe types | faster to prototype |
| Flexibility | lower; sometimes you fight the type system | high |
| Types as documentation | built into the code | read the implementation or comments |

Neither replaces **tests**: types catch mismatched data shapes, not wrong business logic.

## Gradual typing: the middle ground

**Gradual typing** lets you add types step by step, only where they help.

- **TypeScript** is a layer over JavaScript. You can start with loose code and tighten checks via the `strict` setting.
- **Python type hints** are annotations the interpreter does not enforce, but **mypy**, **pyright** and IDEs check them.

```python
def total(price: float, qty: int) -> float:
    return price * qty

total("100", 2)  # mypy: Argument 1 has incompatible type "str"
```

Many teams work this way: the prototype is written quickly, and as the project grows, types are added to key modules — APIs, data models, shared utilities.

## How to choose

- **A small script, an experiment, a one-off task**: a dynamic language without annotations is perfectly fine.
- **A project several people will evolve for years**: static or gradual typing makes maintenance and refactoring noticeably easier.
- **An existing large JS or Python codebase**: do not rewrite everything; introduce types gradually, starting at the system's boundaries.

## Common mistakes

- Turning on TypeScript and writing `any` everywhere: checking exists on paper, not in practice.
- Assuming that code which compiles is code that works correctly.
- Adding Python annotations but never running a type checker in CI, so they quickly go stale.

## FAQ

### Does static typing make programs faster?

Sometimes: knowing the types lets a compiler optimize better. But the main benefits are catching errors early and easier maintenance, not speed.

### Does TypeScript check types at runtime?

No. TypeScript checks types at build time and then becomes plain JavaScript with no types. Data from external sources (APIs, forms) must be validated separately, for example with validation schemas.

### Is Python a strongly typed language?

Python is dynamically and strongly typed: it does not implicitly mix strings and numbers. You can add static checking through annotations and external tools such as mypy.
