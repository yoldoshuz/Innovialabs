---
title: What Is OOP? The Four Principles with Code Examples
description: Encapsulation, inheritance, polymorphism and abstraction shown on one running example in Python and Java, plus where OOP gets overused.
summary: OOP builds a program from objects that bundle data and behavior; its four principles (encapsulation, inheritance, polymorphism, abstraction) help you hide details and swap one implementation for another.
---
## The short answer

**Object-oriented programming (OOP)** is an approach where a program is made of **objects**: each object holds its own data (fields) and knows how to work with it (methods). The blueprint for an object is a **class**.

The point of OOP is not classes as such, but **splitting a system into parts with clear boundaries**: from the outside you see what an object can do, and how it does it is its own business.

Below, all four principles are shown on one example: a service that sends notifications by email and SMS.

## The running example in Python

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    def __init__(self, recipient: str):
        self._recipient = recipient
        self._sent = 0

    @property
    def sent(self) -> int:
        return self._sent

    def notify(self, text: str) -> None:
        self._deliver(text)
        self._sent += 1

    @abstractmethod
    def _deliver(self, text: str) -> None: ...

class EmailNotifier(Notifier):
    def _deliver(self, text: str) -> None:
        print(f"Email to {self._recipient}: {text}")

class SmsNotifier(Notifier):
    def _deliver(self, text: str) -> None:
        print(f"SMS to {self._recipient}: {text}")

for n in [EmailNotifier("user@example.com"), SmsNotifier("+998000000000")]:
    n.notify("Your order has shipped")
```

## The same example in Java

```java
abstract class Notifier {
    private final String recipient;
    private int sent = 0;

    Notifier(String recipient) { this.recipient = recipient; }

    public int getSent() { return sent; }
    protected String recipient() { return recipient; }

    public void notify(String text) {
        deliver(text);
        sent++;
    }

    protected abstract void deliver(String text);
}

class EmailNotifier extends Notifier {
    EmailNotifier(String r) { super(r); }
    protected void deliver(String text) {
        System.out.println("Email to " + recipient() + ": " + text);
    }
}

class SmsNotifier extends Notifier {
    SmsNotifier(String r) { super(r); }
    protected void deliver(String text) {
        System.out.println("SMS to " + recipient() + ": " + text);
    }
}
```

Note: Java's `Object` already has a `notify()` method, so in real code you would pick another name such as `send`. The name is kept the same here for easy comparison.

## The four principles in this example

### Encapsulation

The `sent` counter cannot be changed from outside: in Java it is `private`, in Python it is `_sent` with read-only access through `@property`. It only grows inside `notify`. **Encapsulation protects data from invalid changes** and gives you one place where state is modified.

In Python privacy is a convention (the underscore), not a hard rule. In Java the compiler really does block access to a `private` field.

### Inheritance

`EmailNotifier` and `SmsNotifier` **inherit** the shared logic from `Notifier`: storing the recipient, counting sends, the `notify` method. Each only has to implement its own part — `deliver`.

### Polymorphism

The loop calls `notify` on each object without knowing its concrete class. **One interface, different behavior.** You can add Telegram notifications with a new class without touching the loop or any other code.

### Abstraction

`Notifier` is an abstract class: it describes **what** a notifier does and hides **how**. You cannot create a plain `Notifier`, only a concrete implementation. Code that sends notifications depends on the abstraction, not on the details of an SMS gateway.

## Where OOP is overused

- **Deep inheritance hierarchies.** Five levels of classes are hard to understand and change. **Composition** is usually better: an object contains another object instead of inheriting from it.
- **Classes for the sake of classes.** If a class has one method and no state, a plain function is simpler.
- **Anemic models.** Classes with only getters and setters and no behavior carry OOP overhead without its benefits.
- **Data processing.** List transformations, reports and pipelines often read better in a functional style.
- **Abstractions "for the future".** An interface with a single implementation and no plans for a second one makes the code harder today.

A good rule: introduce an abstraction when you have a **second real implementation** or need a substitute in tests.

## FAQ

### Is Python an object-oriented language?

Yes, everything in Python is an object and classes are fully supported. But the language does not force an OOP style: functions and modules are equally first-class tools.

### How is abstraction different from encapsulation?

Abstraction defines which interface the users of an object see. Encapsulation hides and protects the internal state that implements that interface.

### Should I choose inheritance or composition?

Composition by default. Inheritance is justified when the subclass truly is a special case of the parent and can replace it everywhere the parent is used.
