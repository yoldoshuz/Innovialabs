---
title: What Is TypeScript and Why Teams Switch to It
description: TypeScript explained simply: how static types work on top of JavaScript, which bugs get caught before runtime and what migrating a project costs.
summary: TypeScript is JavaScript with types: your editor and compiler catch bugs before the code runs, and the output is plain JavaScript. Teams switch for reliability and safe refactoring, usually migrating step by step.
---

## TypeScript in short

**TypeScript** is a language from Microsoft that adds **static typing** to JavaScript. Almost any valid JavaScript is valid TypeScript, and TypeScript is turned into plain JavaScript before it runs. Browsers and Node.js execute that JavaScript.

The core idea: you describe what data you expect, and the tools check it **before runtime**, right in the editor.

```typescript
function formatPrice(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

formatPrice("100", "UZS");
// Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

In JavaScript this call would only fail at runtime — a string has no `toFixed` method.

## Which bugs TypeScript catches before runtime

- **Property typos.** `user.emial` instead of `user.email` is highlighted immediately.
- **Wrong arguments.** A string instead of a number, a missing required parameter.
- **Possible `undefined`.** With `strict` on, TypeScript forces you to check a value that may be missing.
- **Unhandled cases.** If an order status gets a new value, the compiler points to places that do not handle it.
- **Refactoring breakage.** Rename a field in an API response and you see every place to fix.

```typescript
type Order = { id: number; status: "new" | "paid" | "shipped" };

function label(order: Order) {
  switch (order.status) {
    case "new": return "New";
    case "paid": return "Paid";
    case "shipped": return "Shipped";
  }
}
```

Keep in mind: types exist only at development time. TypeScript does not validate data coming from the network — use runtime validation for that (for example, the **Zod** library).

## How compilation works

1. You write `.ts` / `.tsx` files.
2. The `tsc` compiler checks types using settings from `tsconfig.json`.
3. Types are stripped and JavaScript comes out.

In practice the two jobs are often split: **bundlers** (Vite, esbuild, SWC, the Next.js build) quickly strip types without checking, while `tsc --noEmit` runs separately in the editor and CI to check types.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "noEmit": true
  }
}
```

## Why teams switch to TypeScript

- **Fewer production bugs** caused by wrong data and typos.
- **Hints and autocomplete** in the editor — code is faster to write and read.
- **Safe refactoring** in a large codebase.
- **Types as documentation**: a function signature shows what it accepts and returns.
- **Easier onboarding** for new developers.

The price: more code up front, time to learn types and to set up tooling.

## What migrating a JS project costs

You cannot give an exact estimate without an audit — it depends on several factors:

- **Codebase size** and how tightly modules are connected.
- **Current code quality**: the more dynamic "magic", the harder it is to type.
- **Dependencies**: whether libraries ship types (`@types/...`).
- **Target strictness**: enable `strict` right away or gradually.
- **Test coverage**: tests protect against regressions during the rewrite.

A proven approach is **incremental migration**:

1. Add a `tsconfig.json` with `allowJs: true` so JS and TS live side by side.
2. Write new files in TypeScript.
3. Convert existing modules one by one, starting with shared utilities and API data types.
4. Turn on stricter checks as the code is ready.

Rewriting the whole project in one go is almost always riskier.

## Common mistakes

- **`any` everywhere.** It switches checking off and removes the benefit.
- **Trusting external data.** A type on an API response is a promise, not a check.
- **Overly clever types.** If a type is harder to read than the code, simplify it.

## FAQ

### Does TypeScript slow down a website?

No. Types are removed at build time, and the browser receives plain JavaScript. It only affects build and type-check time.

### Does a small project need TypeScript?

Not necessarily. For a small script or prototype, JavaScript is enough. The value of TypeScript grows with code size, team size and project lifetime.

### Can TypeScript be used on the backend?

Yes. Node.js projects, NestJS, Express and other server stacks widely use TypeScript, and shared types can be reused between client and server.
