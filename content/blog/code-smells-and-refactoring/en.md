---
title: Code Smells and How to Refactor Them
description: A catalog of common code smells — long methods, duplication, god objects, magic numbers, feature envy — with the safe refactoring step for each.
summary: A code smell is a sign that structure is getting in the way of change; you fix it with small refactoring steps, each one protected by tests.
---

## What a code smell is and when to fix it

A **code smell** is not a bug. It is a sign that code is hard to read and change. The program works, but every edit takes longer and breaks neighboring code more often.

Refactoring means changing structure without changing behavior. The main rule: **tests first, then the change**. If behavior is not pinned down by tests, you will not know when you broke something.

Fix a smell when you are touching that code anyway: adding a feature or fixing a bug. Rewriting a module nobody changes "just in case" rarely pays off.

## The safe refactoring loop

1. Write or find tests that cover current behavior.
2. Make one small change.
3. Run the tests.
4. Commit.
5. Repeat.

Small commits are easy to revert and easy to review. Do not mix refactoring and new features in one commit.

## Catalog of smells and the cure

| Smell | Symptom | Refactoring step |
|---|---|---|
| Long method | Function does not fit on a screen, divider comments inside | Extract Method |
| Duplicated logic | The same block in several places | Extract a shared function |
| God object | One class knows and does everything | Extract Class by responsibility |
| Magic numbers | `if (status === 3)` | Named constant or enum |
| Feature envy | Method uses another object's data more than its own | Move Method to the data |

### Long method

Comments like `// validation`, `// calculation`, `// save` are ready-made names for new functions. Extract each block into its own well-named method. The main function becomes a short script of calls.

### Duplicated logic

Before merging, make sure the code is **the same in meaning**, not just in shape. If two blocks match by coincidence and will change for different reasons, merging them creates a false coupling. If they express one business rule, extract one function.

### God object

Symptoms: hundreds of lines, dozens of dependencies, a name like `Manager` or `Helper`. Group fields and methods by responsibility and move each group into its own class. At first the original class can simply delegate calls, so outside code does not have to change at once.

### Magic numbers and strings

```ts
// before
if (order.status === 3) refund(order);

// after
const OrderStatus = { Paid: 1, Shipped: 2, Cancelled: 3 } as const;
if (order.status === OrderStatus.Cancelled) refund(order);
```

The name explains the meaning and gives you a single place to change it.

### Feature envy

If a method on `Invoice` keeps reading `Customer` fields to compute a discount, the discount logic probably belongs to `Customer`. Move the method to where the data lives.

## Common mistakes

- **Refactoring without tests.** Start with at least characterization tests that capture current output.
- **Big bang rewrites.** Rewriting a whole module in one branch is risky and hard to review.
- **Abstractions for the future.** Do not extract an interface until a second real use exists.
- **Manual renaming.** Use your IDE's automated refactorings — they are safer than find and replace.

## FAQ

### Should we set aside dedicated time for refactoring?

It is usually more effective to refactor a little as part of regular tasks. Dedicated time makes sense when a smell clearly slows the team down and you can show it on concrete tasks.

### What if there are no tests at all?

Start with high-level tests that capture the module's current behavior, even if that behavior looks odd. Then you can safely change the internal structure.

### Can code smells be found automatically?

Linters and static analyzers flag long functions, complexity and duplication. The final call is still human: not every analyzer warning is worth fixing.
