---
title: Pure Functions and Immutability: Writing Predictable Code
description: How side effects and shared mutable state cause bugs, how to isolate them, and practical immutability techniques in JavaScript, Python and Kotlin.
summary: A pure function returns the same result for the same input and changes nothing outside itself. Combine pure functions with data you never mutate, push side effects to the edges, and most "it changed somewhere" bugs disappear.
---

## The short answer

A **pure function** has two properties:

1. **Same input, same output** — it depends only on its arguments.
2. **No side effects** — it does not change arguments, globals, files, databases or the screen.

**Immutability** means that once data is created, it is not changed; you create a new version instead. Together they make code predictable: you can read a function in isolation, test it without setup and call it from anywhere without fear.

## How mutable shared state causes bugs

```javascript
function applyDiscount(cart) {
  cart.items.forEach((item) => {
    item.price = item.price * 0.9;
  });
  return cart;
}

const preview = applyDiscount(cart);
// cart is now discounted too — and calling it twice discounts twice
```

The caller wanted a preview, but the original cart changed. Any other component holding a reference to `cart` now shows wrong prices. Bugs like this are hard to find because the place where data changes is far from the place where the error shows up.

Typical sources of such problems:

- functions that **modify their arguments**;
- **global or module-level variables** changed from several places;
- objects shared between threads or async tasks;
- caches and singletons that return the same mutable object to every caller.

## The pure version

```javascript
function applyDiscount(cart, rate) {
  return {
    ...cart,
    items: cart.items.map((item) => ({ ...item, price: item.price * (1 - rate) })),
  };
}
```

The original stays untouched, the result depends only on `cart` and `rate`, and calling it twice gives the same answer.

## Isolating side effects

Programs must have side effects — saving orders, sending emails, writing logs. The goal is not to remove them but to **push them to the edges**: a thin layer that reads input and writes output, and a pure core that makes decisions.

```python
# pure core: easy to test
def calculate_invoice(order, tax_rate):
    subtotal = sum(i["price"] * i["qty"] for i in order["items"])
    return {"subtotal": subtotal, "tax": subtotal * tax_rate}

# impure shell: I/O only
def handle_order(order_id, repo, mailer):
    order = repo.get(order_id)
    invoice = calculate_invoice(order, tax_rate=0.12)
    repo.save_invoice(order_id, invoice)
    mailer.send(order["email"], invoice)
```

The tax rate here is just an example argument. Business logic in `calculate_invoice` is tested with plain data; only the small shell needs mocks.

Hidden inputs also break purity: **current time, random numbers, environment variables**. Pass them as arguments (`now`, `seed`, `config`) so the function stays deterministic.

## Immutability techniques by language

### JavaScript / TypeScript

- Use `const` for bindings (note: it does not freeze the object).
- Copy with spread: `{ ...obj, field: value }`, `[...arr, item]`.
- Prefer non-mutating methods: `map`, `filter`, `concat`, `slice`, and newer `toSorted`, `toReversed`, `with` where your runtime supports them. Remember that `sort`, `reverse` and `splice` mutate.
- `Object.freeze` for constants (it is shallow).
- In TypeScript, `readonly` and `Readonly<T>` catch mutations at compile time.

### Python

- Use tuples and `frozenset` instead of lists and sets for fixed data.
- `@dataclass(frozen=True)` creates immutable records; `dataclasses.replace(obj, field=value)` makes a modified copy.
- Avoid mutable default arguments like `def f(items=[])` — the list is shared between calls.

```python
from dataclasses import dataclass, replace

@dataclass(frozen=True)
class Item:
    name: str
    price: float

cheaper = replace(Item("Pen", 10.0), price=9.0)
```

### Kotlin

- `val` instead of `var`.
- `List`, `Map`, `Set` are read-only interfaces; use `MutableList` only where needed.
- `data class` with `val` properties plus `copy()` for updates.

```kotlin
data class Item(val name: String, val price: Double)

val item = Item("Pen", 10.0)
val cheaper = item.copy(price = 9.0)
```

Note that a read-only `List` in Kotlin may still be backed by a mutable list somewhere else; treat it as "you cannot change it", not "nobody can".

## Common mistakes

- **Shallow copies**: spreading the top level but mutating a nested object.
- Hiding `Date.now()` or `Math.random()` inside "pure" logic.
- Copying huge structures in hot loops without measuring the cost.
- Making everything immutable by force when a local mutable variable inside one function is simpler and harmless — local mutation that never escapes keeps the function pure.

## FAQ

### Is copying data slow?

Copying small objects is cheap, and structural sharing means only the changed path is new. For very large data or hot loops, measure first; persistent data structure libraries can help.

### Can a whole application be pure?

No, and it should not be. Real programs talk to databases, users and networks. The aim is a large pure core and a small, clearly marked layer of side effects.

### Does a pure function have to avoid local variables?

No. Changing a local variable that never leaves the function does not affect anything outside, so the function is still pure.
