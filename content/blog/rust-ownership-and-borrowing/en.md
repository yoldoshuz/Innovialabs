---
title: Rust Ownership and Borrowing Explained
description: Ownership, moves, references, mutable borrows and lifetimes in Rust, explained through the compiler errors beginners actually hit and how to fix them.
summary: Every Rust value has one owner; it can be moved or borrowed — many times for reading or once for writing — and a reference can never outlive the value itself.
---

## The three rules everything rests on

Rust manages memory without a garbage collector thanks to **ownership**. The rules:

1. Every value has **exactly one owner** — a variable.
2. When the owner goes out of scope, the value is **dropped**.
3. A value can be **borrowed** through references: either any number of shared `&T` references, or one mutable `&mut T` — never both at once.

The compiler checks this at build time. Nearly every "mysterious" beginner error breaks one of these rules. Let us go through them by error code.

## E0382: use of a moved value

```rust
let s = String::from("hello");
let t = s;
println!("{}", s); // error[E0382]: borrow of moved value: `s`
```

`String` keeps its data on the heap, and assignment **moves** ownership into `t`. `s` is no longer valid.

How to fix it:

- Need a copy — `let t = s.clone();`. An explicit, potentially costly copy.
- Need only access — borrow: `let t = &s;`.
- Passing to a function — accept `&str` or `&String` instead of `String`.

Simple types like `i32`, `bool` and `char` implement `Copy` and are copied automatically, so they do not trigger this error.

## E0502: mutable and shared borrow at the same time

```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4); // error[E0502]
println!("{}", first);
```

`push` may reallocate the vector, leaving `first` pointing at freed memory. Rust forbids it.

How to fix it: finish using the reference before mutating, or copy the value:

```rust
let first = v[0]; // i32 is copied
v.push(4);
```

Key point: a borrow lasts until the reference's **last use**, not until the end of the block. Often reordering lines is enough.

## E0499: two mutable references at once

```rust
let mut s = String::new();
let a = &mut s;
let b = &mut s; // error[E0499]
a.push('x');
```

A single mutable reference guarantees there are no data races. Options:

- Use the references one after another, scoping them in separate `{ }` blocks.
- For different struct fields, borrow the fields, not the whole struct.
- For different parts of a slice, use `split_at_mut`.

## E0106 and E0597: lifetimes

```rust
fn longest(a: &str, b: &str) -> &str { // error[E0106]
    if a.len() > b.len() { a } else { b }
}
```

The compiler cannot tell which argument the result is tied to. State the **lifetime** explicitly:

```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
```

`'a` does not change how long data lives. It is a promise: the result lives no longer than the shorter of the arguments.

E0597 ("borrowed value does not live long enough") means a reference outlived its value — for example, you returned a reference to a local variable. Return the owned value (`String`) instead.

## When the rules are not enough

Sometimes ownership really is shared. The standard library covers it:

| Need | Tool |
|---|---|
| Several owners in one thread | `Rc<T>` |
| Several owners across threads | `Arc<T>` |
| Mutation through a shared reference | `RefCell<T>`, `Mutex<T>` |

`RefCell` moves borrow checking to runtime: a violation panics instead of failing compilation. Use it deliberately.

## How to read borrow checker errors

- Read the whole message: the compiler shows **where** the borrow starts, where it conflicts and where the reference is last used.
- `rustc --explain E0502` prints a detailed explanation with examples.
- Do not fix everything with `.clone()`: it works, but hides a problem in how your data is structured.

## FAQ

### Why does Rust not just copy the value for me?
Copying heap data costs resources, and Rust makes costly operations explicit. Only `Copy` types are copied automatically.

### How often do I need to write lifetimes by hand?
Rarely. Elision rules cover most functions. Explicit annotations are needed when a function returns a reference tied to several inputs, or a struct holds references.

### Does this really prevent memory bugs?
In safe Rust, ownership rules rule out dangling pointers, double frees and data races. `unsafe` blocks lift some checks, and there the responsibility is on the developer.
