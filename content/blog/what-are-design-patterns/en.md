---
title: What Are Design Patterns and Why They Matter
description: A plain explanation of design patterns: the three classic groups, how to spot a pattern in existing code and when patterns turn into needless complexity.
summary: A design pattern is a proven way to solve a recurring code design problem, not a ready-made library. It gives a team a shared vocabulary but hurts when used without a real problem.
---

## The short answer

A **design pattern** is a description of a typical solution to a recurring problem in code structure. It is not code to copy and not a library. It is an idea: which objects you need, how they relate and who is responsible for what.

The concept went mainstream with the 1994 book "Design Patterns" by four authors often called the Gang of Four (GoF). They described 23 patterns for object-oriented languages. Many more have appeared since: architectural patterns, patterns for distributed systems, patterns for frontend code.

Why patterns are valuable:

- **Shared vocabulary.** "This is a Strategy" replaces five minutes of explanation.
- **Known trade-offs.** You know the pros and cons of a solution in advance.
- **Predictability.** New developers understand code faster when they recognize a familiar structure.

## The three classic groups

| Group | Problem it solves | Examples |
|---|---|---|
| **Creational** | How to create objects without tying code to concrete classes | Factory Method, Abstract Factory, Builder, Singleton |
| **Structural** | How to compose objects and classes into larger structures | Adapter, Decorator, Facade, Proxy, Composite |
| **Behavioral** | How objects interact and share responsibilities | Strategy, Observer, Command, State, Iterator |

A simple hint: if the question is "how do I create it", look at creational; "how do I connect it", structural; "who does what and when", behavioral.

## How to recognize a pattern in existing code

Patterns often live in code without explicit labels. Signals to look for:

- **Class and function names**: `PaymentFactory`, `LoggerAdapter`, `OrderBuilder`, `onChange`, `subscribe` are near-direct hints.
- **An interface with several interchangeable implementations** is most likely Strategy.
- **Subscribing to events and broadcasting notifications** is Observer. You meet it in `addEventListener`, in Node.js EventEmitter and in many state managers.
- **A wrapper that adds behavior without changing the original object** is Decorator. Middleware in web frameworks works in a similar spirit.
- **A class that hides a complex subsystem behind a few simple methods** is Facade.
- **An object that translates someone else's API into the format you need** is Adapter.

Frameworks are themselves built on patterns. Knowing them helps you read documentation and source code faster.

## The over-engineering risk

Patterns are medicine for specific problems. Applied "just in case", they add layers nobody needs. Typical symptoms:

- A factory that creates objects of exactly one type.
- An interface with a single implementation and no second one planned.
- Five files and three levels of abstraction for a twenty-line task.
- A Singleton acting as a disguised global variable that makes code hard to test.

A good rule: **write the simple solution first and introduce a pattern when real pain appears** — duplication, growing `if/else` chains by type, difficulty testing. This is closer to KISS and YAGNI than to "proper architecture by the book".

## How to start learning patterns

1. Start with the 5-6 most common: Strategy, Observer, Factory, Adapter, Decorator, Facade.
2. For each, state in one sentence **what problem it solves**, not what its diagram looks like.
3. Find the pattern in code you already work with: a framework, a library, your own project.
4. Refactor a small piece with and without the pattern and compare readability.
5. Consider your language: where functions are first-class values, many patterns reduce to passing a function.

## FAQ

### Do I need to know all 23 GoF patterns?

No. In practice a smaller subset is used regularly. Understanding what problem each pattern solves matters more than memorizing every diagram.

### Are patterns only relevant to OOP?

The classic patterns were described for OOP, but the ideas carry over to functional style. There they often look simpler: a Strategy is just a function passed as an argument.

### How do I know a pattern is unnecessary?

If the code without it is shorter, clearer and just as easy to test and change, you do not need the pattern. Introduce it when you see a concrete recurring problem.
