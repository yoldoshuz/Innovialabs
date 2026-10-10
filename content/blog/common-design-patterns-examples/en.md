---
title: "Singleton, Factory, Strategy, Observer: Patterns in Practice"
description: The four most common patterns applied to real tasks such as payment providers and notifications, with TypeScript examples and notes on when not to use them.
summary: Strategy swaps algorithms, Factory picks the right implementation, Observer broadcasts events to subscribers and Singleton guarantees one instance. Each helps only for a specific problem, and Singleton is often better replaced with dependency injection.
---

## The four patterns at a glance

| Pattern | What it solves | Typical task |
|---|---|---|
| **Strategy** | Interchangeable algorithms behind one interface | Several payment providers |
| **Factory** | Creating the right implementation without `if/else` everywhere | Picking a provider from config |
| **Observer** | Notifying many subscribers about one event | Notifications after an order is paid |
| **Singleton** | Exactly one instance for the whole app | Connection pool, configuration |

The examples below are in TypeScript, but the ideas apply to any language.

## Strategy: payment providers

A store accepts payments through several providers. Without the pattern, checkout code grows a branch per provider. With Strategy, every provider implements a shared interface:

```typescript
interface PaymentProvider {
  charge(orderId: string, amount: number): Promise<string>;
}

class CardProvider implements PaymentProvider {
  async charge(orderId: string, amount: number) {
    // call the provider's API
    return `card-${orderId}`;
  }
}

class WalletProvider implements PaymentProvider {
  async charge(orderId: string, amount: number) {
    return `wallet-${orderId}`;
  }
}

async function checkout(provider: PaymentProvider, orderId: string, amount: number) {
  return provider.charge(orderId, amount);
}
```

**Use it when:** there are two or more behaviors and the number may grow.
**Skip it when:** there is only one variant, or the difference fits in a single parameter.

## Factory: choosing the implementation

Something has to decide which provider to create. A factory keeps that decision in one place:

```typescript
type ProviderName = "card" | "wallet";

function createProvider(name: ProviderName): PaymentProvider {
  switch (name) {
    case "card": return new CardProvider();
    case "wallet": return new WalletProvider();
  }
}

const provider = createProvider(order.paymentMethod);
await checkout(provider, order.id, order.total);
```

Adding a provider means changing the factory and writing a new class; the rest of the code stays untouched.

**Use it when:** what you create depends on data or configuration, or setup is complex.
**Skip it when:** the type is always the same; a plain `new` is simpler and clearer.

## Observer: notifications after payment

After a successful payment you need to send an email, post to a messenger and update the CRM. If payment code calls all of that directly, it has to know about every channel. Observer inverts the dependency:

```typescript
type Listener<T> = (payload: T) => void | Promise<void>;

class EventBus<T> {
  private listeners: Listener<T>[] = [];

  subscribe(fn: Listener<T>) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  async emit(payload: T) {
    await Promise.all(this.listeners.map(l => l(payload)));
  }
}

const orderPaid = new EventBus<{ orderId: string }>();
orderPaid.subscribe(e => sendEmail(e.orderId));
orderPaid.subscribe(e => notifyMessenger(e.orderId));
```

Payment code only calls `orderPaid.emit(...)` and knows nothing about channels.

**Use it when:** one event matters to several independent parts of the system.
**Skip it when:** there is one subscriber and there will not be more; a direct call reads better. Remember to **unsubscribe** to avoid memory leaks, and handle errors inside subscribers.

## Singleton: one instance

The classic version is a class with a hidden constructor. In JavaScript/TypeScript it is simpler: a module runs once, so exporting an instance already gives you a single object.

```typescript
// db.ts
import { createPool } from "./driver";

export const db = createPool({ url: process.env.DATABASE_URL });
```

**Use it when:** a resource truly must exist once: a connection pool, a cache, a logger.
**Skip it when:** almost everywhere else. A Singleton is global state: code depends on it implicitly and it is hard to replace in tests. Usually it is better to create the object once at startup and **pass it through the constructor** (dependency injection).

## Common mistakes

- Introducing a pattern before the problem exists: a factory with one type, a Strategy with one strategy.
- Making everything a Singleton "for convenience".
- Ignoring errors in Observer: one failing subscriber should not silently break the others.
- Mixing Factory with business logic; a factory should only create objects.

## FAQ

### How is Strategy different from Factory?

Strategy describes how interchangeable algorithms plug in through a shared interface. Factory decides which one to create. They are often used together: the factory picks the strategy.

### Why is Singleton called an anti-pattern?

Because it introduces hidden global state and makes testing harder. It is not wrong in itself, but in most cases dependency injection solves the same problem more cleanly.

### Is Observer the same as a message queue?

The idea is similar, but Observer works inside one process. A message queue passes events between services and stores them if the receiver is unavailable.
