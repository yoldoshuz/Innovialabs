---
title: What Is C# and .NET: Overview for Beginners
description: How C# and the .NET platform relate, why .NET went cross-platform, and what is built with it: web APIs, desktop apps, Unity games, enterprise systems.
summary: C# is a programming language and .NET is the platform that compiles and runs C# code; today it runs on Windows, Linux and macOS and is used for web, desktop, games and enterprise systems.
---

## C# and .NET: the short answer

**C#** (pronounced "C sharp") is a statically typed, object-oriented language created at Microsoft. **.NET** is the platform your code lives in: the compiler, the runtime, the standard library and the tooling.

Put simply: C# is *what* you write in, and .NET is *where and how* it runs. Other languages target .NET too (F#, Visual Basic), but C# is the main one.

## How C# code becomes a running program

Your code goes through a few steps:

1. You write a `.cs` file.
2. The compiler turns it not into machine code but into **Intermediate Language (IL)**, a portable bytecode.
3. At startup the **CLR** (Common Language Runtime) uses a **JIT compiler** to translate IL into machine code for the actual CPU.
4. The CLR also manages memory with a **garbage collector**, so you do not free memory by hand.

There is also **AOT compilation** (ahead of time, straight to machine code): faster startup and fewer dependencies, with some limitations.

A minimal program looks like this:

```csharp
Console.WriteLine("Hello, .NET!");

var prices = new List<decimal> { 120m, 80m, 45m };
Console.WriteLine($"Total: {prices.Sum()}");
```

## From Windows-only to cross-platform

The platform has a long history, which is why beginners get confused by the names:

| Name | What it is |
|---|---|
| **.NET Framework** | The original version, Windows only. Still supported, but no longer gets major new features |
| **.NET Core** | A rewritten, open-source, cross-platform version |
| **.NET (5 and later)** | The unified line that continues .NET Core. This is what new projects use |

The practical takeaway: modern .NET is **open source**, runs on **Windows, Linux and macOS**, and works well in Docker containers and the cloud.

## What people build with C# and .NET

- **Web APIs and backends.** **ASP.NET Core** handles REST APIs, microservices, websites and real-time features via SignalR.
- **Enterprise systems.** Banking, logistics, ERP, internal portals — places that value strict typing, long-term support and mature tooling.
- **Games.** The **Unity** engine uses C# for scripting, one of the most common routes into game development.
- **Desktop.** WPF and WinForms on Windows; cross-platform options include .NET MAUI and Avalonia.
- **Mobile apps.** .NET MAUI lets you target iOS and Android from one codebase.
- **Cloud and background jobs.** Worker services, queues, serverless functions.

## Strengths and weaknesses

**Pros:**
- strict typing catches many errors before the program runs;
- a rich standard library and the **NuGet** package manager;
- **LINQ** for expressive queries over collections and data;
- `async/await` for asynchronous code;
- strong IDEs: Visual Studio, Rider, VS Code.

**Cons:**
- a steeper start than Python or JavaScript;
- the "Windows-only language" reputation still lingers, even though it is long outdated;
- can feel heavy for small scripts and quick prototypes.

## How to get started

1. Install the **.NET SDK** from the official site.
2. Create a project with `dotnet new console` and run it with `dotnet run`.
3. Learn the basics: types, classes, collections, LINQ, `async/await`.
4. Pick a direction — web (ASP.NET Core), games (Unity) or desktop — and build one small project.

Full documentation lives at [learn.microsoft.com/dotnet](https://learn.microsoft.com/dotnet/).

## FAQ

### Are C# and .NET the same thing?

No. C# is a language; .NET is the platform that runs it. They are mentioned together because C# is the primary .NET language.

### Can .NET run on Linux?

Yes. Modern .NET is cross-platform: apps run on Linux, macOS and Windows, including in Docker and Kubernetes. Only the legacy .NET Framework is Windows-only.

### How is C# different from Java?

They are similar in syntax and ideas: both are typed, compile to bytecode and use garbage collection. The ecosystems, frameworks and some language features differ; the choice usually depends on the team and the project.
