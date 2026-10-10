---
title: TypeScript type vs interface: When to Use Each
description: The real differences between type and interface in TypeScript: declaration merging, unions, extends vs intersections, error messages and a team rule.
summary: For object shapes, type and interface are almost interchangeable. Use interface when extends and declaration merging matter, and type for unions, tuples and computed types. Most importantly, agree on one team rule.
---

## The short answer

For a plain object there is almost no difference:

```typescript
type UserT = { id: number; name: string };
interface UserI { id: number; name: string }
```

Both work the same in functions, classes and component props. The differences show up in four places: **declaration merging**, **unions and other non-object types**, **extends vs intersections** and **error messages**.

## Difference 1: declaration merging

Two `interface` declarations with the same name merge automatically:

```typescript
interface Config { apiUrl: string }
interface Config { timeout: number }

const c: Config = { apiUrl: "/api", timeout: 5000 }; // both fields required
```

You cannot do this with `type` — a second declaration fails with `Duplicate identifier`.

When it helps: **extending third-party types** — for example, adding a field to the global `Window` or to a library's types. When it hurts: an accidental name clash across files silently changes the type.

## Difference 2: unions and non-object types

An `interface` only describes an object shape. A `type` can do everything else:

```typescript
type Status = "idle" | "loading" | "error";
type Id = string | number;
type Point = [number, number];
type Handler = (event: MouseEvent) => void;
type ReadonlyUser = Readonly<UserT>;
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };
```

Unions, tuples, mapped and conditional types belong to `type`.

## Difference 3: extends vs intersections

Inheritance can be written two ways:

```typescript
interface Base { id: number }
interface Admin extends Base { role: "admin" }

type BaseT = { id: number };
type AdminT = BaseT & { role: "admin" };
```

The difference shows up on a **property conflict**:

```typescript
interface A { value: string }
interface B extends A { value: number }
// Immediate error: Interface 'B' incorrectly extends interface 'A'

type C = { value: string } & { value: number };
// No error, but value is never — the problem surfaces later
```

`extends` checks compatibility at declaration time, while the `&` intersection silently produces an impossible type. The TypeScript docs also note that the compiler handles `interface extends` hierarchies more efficiently than large intersections.

## Difference 4: error messages

In hovers and errors, an `interface` is usually shown **by name**, while a complex `type` built from intersections and utilities may expand into a long structure. In a large project this noticeably affects error readability. Not a fundamental difference, but a nice point for `interface` on objects.

## What both can do

- Describe objects, methods, optional and `readonly` fields.
- Be used in a class `implements` clause (as long as the `type` is an object, not a union).
- An `interface` can extend a `type`, and a `type` can intersect an `interface`.
- Support generics: `interface Box<T> { value: T }` and `type Box<T> = { value: T }`.

## Comparison table

| Capability | type | interface |
|---|---|---|
| Object shape | Yes | Yes |
| Unions, tuples, primitives | Yes | No |
| Mapped / conditional types | Yes | No |
| Declaration merging | No | Yes |
| Conflict check on inheritance | No (`&` gives `never`) | Yes (`extends`) |
| Name shown in errors | Not always | Usually |

## A simple team rule

A convention that is easy to follow:

1. **`interface`** for object shapes: data models, component props, API contracts, public library types.
2. **`type`** for unions, tuples, functions and anything composed from utilities (`Pick`, `Omit`, `Partial`).
3. **Inheritance** through `extends` rather than `&` where possible.
4. **Declaration merging** only on purpose, to extend external types.

The alternative "`type` everywhere, `interface` only to extend external types" is fine too. What matters is picking one and enforcing it with a linter: **typescript-eslint** has the `consistent-type-definitions` rule.

## FAQ

### Is there a runtime performance difference?

No. Types are erased during compilation and do not affect how the code runs. A difference is only possible in type-checking speed on very large projects.

### Can I mix type and interface in one project?

Yes, and that is normal: each has its role. The problem is not mixing them, but having no rule for when to use which.

### Which should I use for React component props?

Either works. If your team's rule is "objects via interface", follow it; if props are built from unions or utility types, use `type`.
