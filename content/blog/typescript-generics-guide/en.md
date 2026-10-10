---
title: TypeScript Generics: How to Write Reusable Typed Code
description: TypeScript generics step by step: from a simple generic function to constraints, default types and utility types, with an API response wrapper.
summary: A generic is a type parameter that lets one function or type work with different data while keeping precise types, without falling back to any.
---
## Why generics exist

A **generic** is a parameter for a type. Just as a function takes values, a generic takes types. You write the code once and reuse it with different data, keeping accurate hints and checks.

Without generics you have two bad options: duplicate the function for every type, or use `any` and lose type safety.

```ts
function first(items: any[]): any {
  return items[0];
}

const x = first([1, 2, 3]); // any — TypeScript stops checking
```

With a generic, the type is preserved:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);      // number | undefined
const s = first(['a', 'b']);     // string | undefined
```

`T` is inferred from the argument, so you usually do not have to write it.

## Generic types and interfaces

The most common real example is an API response wrapper:

```ts
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

interface User {
  id: string;
  name: string;
}

async function getJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) return { data: null as T, error: `HTTP ${res.status}` };
  return { data: (await res.json()) as T, error: null };
}

const result = await getJson<User[]>('/api/users');
result.data[0].name; // string, autocomplete works
```

Here `T` is passed explicitly, because TypeScript cannot know what the server returns. Keep in mind this is **a promise to the compiler**, not a check. For external data in critical paths, add runtime validation (for example, with a schema).

## Constraints: extends

Sometimes you need the type to have a certain field. That is what a **constraint** with `extends` is for:

```ts
function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

The function accepts an array of any objects that have `id: string` and returns the same type, not a trimmed-down one.

A constraint with `keyof` lets you read a property safely:

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', name: 'Anna', age: 30 };
pick(user, 'name'); // string
pick(user, 'email'); // compile error
```

## Default types

Like function parameters, generics can have defaults:

```ts
interface Paginated<T = unknown> {
  items: T[];
  page: number;
  total: number;
}

const a: Paginated = { items: [], page: 1, total: 0 };        // T = unknown
const b: Paginated<User> = { items: [], page: 1, total: 0 };  // T = User
```

## Built-in utility types

TypeScript ships with ready-made generic types that cover most everyday needs:

| Utility | What it does |
|---|---|
| `Partial<T>` | makes every field optional — handy for update forms |
| `Required<T>` | makes every field required |
| `Pick<T, K>` | keeps only the chosen fields |
| `Omit<T, K>` | removes the chosen fields |
| `Record<K, V>` | object with keys `K` and values `V` |
| `ReturnType<F>` | a function's return type |
| `Awaited<T>` | the type you get after `await` |

```ts
type UserUpdate = Partial<Omit<User, 'id'>>;
// { name?: string }
```

The full list is in the [official documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Common mistakes

- **Generics for their own sake.** If `T` appears only once in a signature, you probably do not need it — a plain type will do.
- **Too many parameters.** `<T, U, V, W>` is hard to read. If you need them, use meaningful names like `TData` and `TError`.
- **Casting instead of checking.** `as T` hides data errors. External data needs validation.
- **A missing constraint.** Without `extends` you cannot access fields of `T` — the compiler does not know they exist.

## FAQ

### How is a generic different from any?

`any` turns type checking off. A generic keeps the concrete type and links input to output: what goes in comes out, with all hints and checks intact.

### When should I pass the type in angle brackets explicitly?

When TypeScript cannot infer it: API calls, empty collections such as `new Map<string, User>()`, or when the inferred type is too wide.

### Can I use generics in React components?

Yes. A list component can take `items: T[]` and `renderItem: (item: T) => ReactNode`, so the item type inside the render function stays precise.
