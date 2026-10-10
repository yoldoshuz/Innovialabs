---
title: TypeScript with React: Typing Props, State, Events and Hooks
description: Ready TypeScript patterns for React: props and children, useState, events, refs, generic components and safely typed API responses.
summary: Describe props with a type, let hooks infer what they can, take event types from React and validate API data at the boundary — that covers most real cases.
---
## The short answer

In a React codebase with TypeScript, almost everything comes down to five things: **props**, **state**, **events**, **refs** and **server data**. The rule is simple: explicitly type what comes from outside (props, APIs) and let TypeScript infer the rest.

## Props and children

Describe props with a plain `type` and annotate the function argument. `React.FC` is optional — direct typing is easier to read.

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Button({ label, variant = "primary", onClick, children }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children ?? label}</button>;
}
```

- **`React.ReactNode`** accepts any renderable content: text, elements, arrays, `null`.
- **Literal unions** (`"primary" | "ghost"`) beat `string`: the editor suggests options and typos fail immediately.
- To accept every native button attribute, extend the type: `React.ComponentProps<"button"> & { variant?: ... }`.

## State: useState and useReducer

If the initial value is self-explanatory, skip the type: `useState(0)` is already a `number`. Add a type when the value can be empty or complex.

```tsx
type User = { id: number; name: string };
const [user, setUser] = useState<User | null>(null);
```

For `useReducer`, describe actions as a **discriminated union** — TypeScript narrows the type inside each `switch` branch:

```tsx
type Action =
  | { type: "add"; item: string }
  | { type: "remove"; index: number };
```

## Events

Event types come from React. The most common ones:

| Situation | Type |
|---|---|
| Input change | `React.ChangeEvent<HTMLInputElement>` |
| Form submit | `React.FormEvent<HTMLFormElement>` |
| Click | `React.MouseEvent<HTMLButtonElement>` |
| Keyboard | `React.KeyboardEvent<HTMLInputElement>` |

When the handler is written inline in JSX (`onChange={(e) => ...}`), the type is inferred. You only need to spell it out when the function is declared separately.

## Refs

For a DOM element, pass the element type and `null` as the initial value:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
```

For a mutable value unrelated to the DOM (a timer id, for example), type the stored value: `useRef<number | null>(null)`.

## Generic components

When a component works with any data — lists, tables, selects — make it generic. The item type is then inferred from the array you pass in.

```tsx
type ListProps<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
};

export function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>;
}
```

## API responses

`res.json()` returns `any`, and a cast like `as User` checks nothing — it is just a promise to the compiler. The reliable option is to **validate data at the boundary** with a schema (Zod, for example) and derive the type from it:

```ts
import { z } from "zod";

const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;

const user: User = UserSchema.parse(await res.json());
```

This way the static type and the runtime check never drift apart.

## Common mistakes

- **`any` wherever it gets hard.** Prefer `unknown` plus explicit narrowing.
- **Duplicated types.** Derive them: `z.infer`, `ReturnType`, `ComponentProps`.
- **Redundant annotations.** Do not write a type TypeScript already knows.
- **`!` instead of a check.** The non-null assertion hides real `null` values.
- **`strict` turned off.** Without it you lose half of what TypeScript offers.

## FAQ

### Should I use React.FC?

Not necessarily. Typing props directly in the function argument is shorter and works just as well with generic components, which is why many teams prefer it.

### type or interface for props?

Both work. `type` is handier for unions and intersections, `interface` for extending with `extends`. What matters is picking one style and sticking to it across the project.

### How do I type a custom hook?

Usually typing the arguments is enough; TypeScript infers the return value. If the hook returns a tuple, add `as const` so the items do not widen into an array of a union type.
