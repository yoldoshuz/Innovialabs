---
title: "Dependency Injection Explained: Why and How to Use It"
description: Dependency injection shown on tightly coupled code refactored with constructor injection, plus how DI containers work and why DI makes code testable.
summary: Dependency injection means a class does not create its dependencies itself but receives them from outside, usually through the constructor. This makes code easier to test and change, and a DI container simply automates assembling objects.
---

## The idea in one minute

**Dependency injection (DI)** is a technique where an object receives the dependencies it needs from outside instead of creating them internally. Most often through the **constructor**.

What it gives you:

- **Loose coupling.** A class depends on an interface, not a concrete implementation.
- **Testability.** In a test you can pass a stub instead of a real database or mail service.
- **Flexibility.** Swapping an implementation means changing one assembly point.

DI is a specific case of the broader **dependency inversion principle**: high-level modules should not depend on low-level details; both depend on abstractions.

## What tightly coupled code looks like

```typescript
class OrderService {
  private db = new PostgresOrderRepository();
  private mailer = new SmtpMailer();

  async place(order: Order) {
    await this.db.save(order);
    await this.mailer.send(order.email, "Order received");
  }
}
```

Problems:

- You cannot test `place` without running a database and an SMTP server.
- Replacing the mail service means editing `OrderService`.
- Dependencies are hidden: the class signature does not show what it needs.

## Refactoring: constructor injection

```typescript
interface OrderRepository { save(order: Order): Promise<void>; }
interface Mailer { send(to: string, text: string): Promise<void>; }

class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly mailer: Mailer,
  ) {}

  async place(order: Order) {
    await this.repo.save(order);
    await this.mailer.send(order.email, "Order received");
  }
}

// Composition root
const service = new OrderService(new PostgresOrderRepository(), new SmtpMailer());
```

Now `OrderService` knows nothing about Postgres or SMTP. All concrete classes are created in one place, the **composition root**, usually at application startup.

## How DI makes testing easier

```typescript
test("saves the order and sends an email", async () => {
  const saved: Order[] = [];
  const sent: string[] = [];
  const service = new OrderService(
    { save: async o => { saved.push(o); } },
    { send: async to => { sent.push(to); } },
  );

  await service.place({ id: "1", email: "a@example.com" } as Order);

  expect(saved).toHaveLength(1);
  expect(sent).toEqual(["a@example.com"]);
});
```

No database, no network: the test is fast and stable.

## DI containers

With dozens of classes, wiring them by hand gets tedious. A **DI container** is a library that stores "interface to implementation" rules, builds objects with the right dependencies and manages their **lifetime**.

ASP.NET Core has a built-in container:

```csharp
builder.Services.AddScoped<IOrderRepository, PostgresOrderRepository>();
builder.Services.AddSingleton<IMailer, SmtpMailer>();
builder.Services.AddScoped<OrderService>();

public class OrderService
{
    private readonly IOrderRepository _repo;
    private readonly IMailer _mailer;

    public OrderService(IOrderRepository repo, IMailer mailer)
    {
        _repo = repo;
        _mailer = mailer;
    }
}
```

The main lifetimes in .NET:

| Lifetime | When an instance is created |
|---|---|
| **Transient** | A new instance every time the dependency is requested |
| **Scoped** | One instance per scope; in a web app, per HTTP request |
| **Singleton** | One instance for the whole application |

In the TypeScript world, containers come with frameworks (for example NestJS and Angular) and as standalone libraries. In a small project, manual wiring in a composition root is often enough.

## Common mistakes

- **Service Locator instead of DI**: the class pulls dependencies from the container itself, so they are hidden again.
- **A constructor with eight parameters** signals that the class does too much.
- **A scoped dependency inside a singleton** lives longer than it should.
- **An interface for every class** without need; introduce abstractions where substitution is actually required.

## FAQ

### Do I need a DI container to use DI?

No. DI is the principle of passing dependencies from outside. A container only automates the wiring, and manual wiring is fine for small projects.

### How is DI different from dependency inversion?

Dependency inversion is a design principle: depend on abstractions. DI is a concrete way to implement it by passing implementations in from outside.

### Can dependencies be injected other than through the constructor?

Yes, through properties or method parameters. But the constructor is preferred: dependencies are explicit and the object cannot be created in an incomplete state.
