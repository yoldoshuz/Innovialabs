---
title: "Clean Code: Rules for Naming Variables and Writing Functions"
description: Concrete clean code rules for naming, function size, arguments, comments and early returns, each shown as a before-and-after TypeScript snippet.
summary: Clean code reads like prose: names say what is stored and what is done, functions are short and do one thing, arguments are few and early returns remove nesting. Comments explain why, not what.
---

## The core rule

Code is read far more often than it is written. The goal is for another developer, or you six months from now, to understand a piece of code **without extra effort**. Below are the rules, each with a before-and-after example.

## Names reveal intent

A name should answer "what is this and why" without decoding.

```typescript
// Before
const d = 30;
const arr = users.filter(u => u.a);

// After
const trialPeriodDays = 30;
const activeUsers = users.filter(user => user.isActive);
```

Practical rules:

- **Variables are nouns**: `invoice`, `totalAmount`.
- **Functions are verbs**: `calculateTotal`, `sendInvoice`.
- **Booleans are questions**: `isPaid`, `hasAccess`, `canEdit`.
- **No magic numbers**: move them into named constants.
- **One vocabulary**: if the project uses `fetch`, do not mix in `get`, `load` and `retrieve` for the same thing.
- Name length matches scope: `i` in a three-line loop is fine; at module level it is not.

## A function does one thing

If you need the word "and" to describe a function, it probably should be split.

```typescript
// Before
function processOrder(order: Order) {
  if (!order.items.length) throw new Error("Empty order");
  let total = 0;
  for (const item of order.items) total += item.price * item.qty;
  db.save({ ...order, total });
  mailer.send(order.email, `Total: ${total}`);
}

// After
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order.items);
  saveOrder(order, total);
  notifyCustomer(order.email, total);
}
```

The top-level function now reads like a table of contents, and each part can be tested separately. There is no strict line limit, but if you have to scroll through a function, that is a reason to rethink it.

## Few arguments

The more parameters, the easier it is to mix up their order. Boolean flags are especially tricky: you cannot tell from the call what `true` means.

```typescript
// Before
createUser("Ali", "ali@example.com", true, false, "en");

// After
createUser({
  name: "Ali",
  email: "ali@example.com",
  isAdmin: true,
  sendWelcomeEmail: false,
  locale: "en",
});
```

Aim for two or three arguments at most. Beyond that, pass an object with named fields. A flag that changes a function's behavior often means it is really two functions.

## Early returns instead of nesting

Deep `if` blocks force you to keep every condition in your head at once. Handle special cases first and exit.

```typescript
// Before
function getDiscount(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.orders > 10) {
        return 0.1;
      }
    }
  }
  return 0;
}

// After
function getDiscount(user: User | null) {
  if (!user || !user.isActive) return 0;
  if (user.orders <= 10) return 0;
  return 0.1;
}
```

The main path stays at the top indentation level, and guard checks sit at the beginning.

## Comments explain why

A comment that restates the code goes stale and gets in the way. A useful comment explains a non-obvious reason.

```typescript
// Before
// increment counter by 1
retries++;

// After
// The provider API sometimes returns 503 under peak load,
// so we retry instead of showing an error right away
retries++;
```

If you feel like writing "what this block does", first try extracting the block into a function with a clear name.

## Pre-commit checklist

- Does each name make clear what a variable holds and what a function does?
- Does every function do one thing?
- Are there functions with three or more arguments or boolean flags?
- Can nesting be removed with an early return?
- Do comments restate the code?
- Is there commented-out code left? Git keeps the history.

## FAQ

### How short should a function be?

There is no universal number. A good guide: the function does one thing at one level of abstraction and fits on a screen without scrolling.

### Are long names bad?

Not if they are precise. `calculateMonthlyRevenue` beats `calc`. Long names are bad when the length comes from repetition or filler words like `Data`, `Info` or `Manager`.

### Can I apply these rules to a legacy project?

Yes, gradually: improve the code you are already changing as part of a task. Mass refactoring without tests is risky.
