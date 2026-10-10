---
title: Composition vs Inheritance: When to Use Which
description: Why deep class hierarchies break, how the fragile base class problem appears, and practical rules for choosing composition or inheritance.
summary: Prefer composition by default: build objects from small, replaceable parts. Use inheritance only for a true, stable "is-a" relationship with a shallow hierarchy.
---

## The short answer

**Composition** means an object *has* other objects and delegates work to them. **Inheritance** means a class *is* a specialized version of another class and reuses its code.

The common rule "favor composition over inheritance" exists for a reason: inheritance couples a subclass to the internal behavior of its parent, while composition couples objects only through small interfaces. Inheritance is still a good tool, but for a narrower set of cases than most codebases use it for.

## The fragile base class problem

A subclass depends not only on the public API of its parent, but often on *how* the parent implements it. Change the parent, and subclasses break without any change in their own code.

```python
class Collection:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def add_all(self, items):
        for item in items:
            self.add(item)


class CountingCollection(Collection):
    def __init__(self):
        super().__init__()
        self.count = 0

    def add(self, item):
        self.count += 1
        super().add(item)

    def add_all(self, items):
        self.count += len(items)
        super().add_all(items)
```

`add_all` in the parent calls `add`, which is overridden, so every item is counted **twice**. Worse: if the parent author later changes `add_all` to append directly, the bug disappears — or a different bug appears. The subclass is coupled to an implementation detail it cannot see.

## Deep hierarchies and the combination explosion

The second typical problem is a hierarchy that tries to model several independent dimensions:

- `Notification` → `EmailNotification`, `SmsNotification`
- then `UrgentEmailNotification`, `UrgentSmsNotification`
- then `ScheduledUrgentEmailNotification`...

Every new dimension (channel, priority, schedule) multiplies the number of classes. Behavior is spread across five levels, and to understand one method you read the whole chain of `super()` calls.

## Refactoring to composition

Split each dimension into a separate component and assemble them:

```typescript
interface Channel {
  send(to: string, text: string): Promise<void>;
}

interface Formatter {
  format(text: string): string;
}

class EmailChannel implements Channel {
  async send(to: string, text: string) { /* SMTP call */ }
}

class UrgentFormatter implements Formatter {
  format(text: string) { return `[URGENT] ${text}`; }
}

class Notifier {
  constructor(private channel: Channel, private formatter: Formatter) {}

  notify(to: string, text: string) {
    return this.channel.send(to, this.formatter.format(text));
  }
}

const notifier = new Notifier(new EmailChannel(), new UrgentFormatter());
```

What you gain:

- **N + M classes instead of N × M**: adding a channel does not require new priority variants.
- **Replaceable at runtime**: switch the channel from config.
- **Easy testing**: pass a fake `Channel` instead of mocking a parent class.
- **Clear contracts**: `Notifier` depends only on two small interfaces.

The counting collection from the previous section is fixed the same way: wrap a collection and delegate to it instead of extending it. Then your `add_all` does not depend on how the inner collection implements its own methods.

## Step-by-step refactoring plan

1. **Find the varying dimensions** in the hierarchy (channel, storage, format, policy).
2. **Extract an interface** for each dimension with the minimum methods needed.
3. **Move behavior** from subclasses into small implementations of those interfaces.
4. **Inject the parts** through the constructor of one class.
5. **Delete empty subclasses** that only combined parts.
6. **Cover with tests** before and after, so behavior stays the same.

## When inheritance is still the right tool

| Situation | Inheritance fits? |
|---|---|
| True "is-a" relationship that will not change | Yes |
| Framework requires extending a base class (UI components, exceptions, test cases) | Yes |
| Template method: parent defines the algorithm, child fills one or two steps | Often yes |
| Reusing a few helper methods | No — use composition or functions |
| Several independent variations | No — use composition |
| Parent class is from a third-party library and not designed for extension | No — wrap it |

Rules of thumb:

- **Keep hierarchies shallow** — one or two levels is usually enough.
- **Design for inheritance or forbid it**: mark classes `final` (Java, Kotlin by default, `sealed` in C#) unless they are documented for extension.
- **Do not override methods that the parent calls internally** unless the parent documents that this is allowed.
- **Liskov substitution check**: a subclass must work anywhere the parent works. If it throws "not supported" in an inherited method, the hierarchy is wrong.

## Common mistakes

- Using inheritance only to **reuse code**, not to express a type relationship.
- Creating `BaseService`, `BaseController`, `BaseManager` that collect unrelated helpers.
- Going to the other extreme: wrapping everything in layers of delegation where a simple subclass would be clearer.
- Exposing internal state as `protected` fields that subclasses mutate directly.

## FAQ

### Is inheritance an anti-pattern?

No. It is a strong coupling tool that is often overused. For a stable "is-a" relationship, a framework extension point or a template method, inheritance is simple and readable.

### Does composition mean more code?

Sometimes a little more at the start: interfaces and constructor wiring. In return, adding new variations stays cheap, and tests do not depend on parent class internals.

### How do mixins and traits fit in?

They reuse behavior without a deep chain, but they still mix code into a class and can conflict. Use them for small, independent capabilities, and prefer plain composition when the behavior has its own state.
