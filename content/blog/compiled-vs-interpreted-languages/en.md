---
title: Compiled vs Interpreted Languages: How Code Runs
description: Compilers, interpreters, bytecode and JIT explained with C, Python, Java and JavaScript, and what each model means for speed, portability and deployment.
summary: A compiler translates code into machine instructions before it runs, an interpreter executes it as it goes, and most modern languages mix both via bytecode and JIT — so the specific implementation matters more than the label.
---

## The short version

A CPU understands only **machine code**. Everything else must be translated; the only question is *when*.

- **Compilation** translates the whole program into machine code **before it runs**. You get a ready-to-run executable.
- **Interpretation** means an interpreter reads your code and executes it **while the program runs**, step by step.

One important caveat: it is not the language that is compiled or interpreted, but **its implementation**. Python has both interpreters and compilers; JavaScript has interpreters and JIT compilers. Still, each language has a main, typical way of running, and that is what we compare here.

## Four models by example

### C: classic compilation

```bash
gcc main.c -o app   # compile to machine code
./app               # run without the compiler
```

The compiler sees the whole program, optimizes it and produces a binary for a specific platform (OS plus CPU architecture). Linux on ARM and Windows on x86 need separate builds.

### Python: bytecode plus an interpreter

```bash
python main.py
```

The standard implementation, **CPython**, first compiles source into **bytecode** (the `.pyc` files), then a virtual machine interprets it instruction by instruction. To run on a server you need the right Python version and the dependencies installed.

### Java: bytecode plus JIT

```bash
javac Main.java   # source -> .class bytecode
java Main         # the JVM runs the bytecode
```

Java bytecode is not tied to a CPU: the same `.class` or `.jar` runs on any system with a JVM. Inside the JVM, code starts out interpreted, and "hot" paths that run often are turned into machine code by the **JIT compiler** while the program is running.

### JavaScript: an engine with JIT

The browser or Node.js receives source text. The engine (V8, for example) parses it, starts executing via an interpreter and meanwhile JIT-compiles frequently used functions, based on what it observes about the data types.

## The approaches compared

| | Ahead-of-time (C, Go, Rust) | Bytecode + interpreter (CPython) | Bytecode/source + JIT (Java, C#, JS) |
|---|---|---|---|
| When translation happens | before running | at runtime, step by step | at runtime, hot code to machine code |
| Startup | fast | fast | can be slower due to warm-up |
| Peak speed | high | usually lower | high after warm-up |
| Portability | a build per platform | needs an interpreter | needs a runtime (JVM, .NET, engine) |
| What you deploy | one binary | source + interpreter + dependencies | artifact + runtime |

## What it means in practice

**Speed.** For CPU-heavy work, compiled and JIT languages are usually faster. In a typical web service, though, the bottleneck is more often the database, the network or the algorithm, not the language. Measure first, then decide.

**Development speed.** Interpreted languages give a fast edit-and-run loop and a handy REPL. Compilation catches some errors earlier but adds a build step.

**Portability.** A C or Go binary has to be built for each target platform. Java or .NET bytecode is portable but needs a runtime.

**Deployment.** A single static binary drops neatly into a minimal Docker image. For Python and Node.js the image must include the interpreter and dependencies, and pinning their versions matters.

## Common misconceptions

- **"Interpreted means slow."** Modern JavaScript and JVM JIT engines are very fast, and Python often calls fast libraries written in C.
- **"Compiled means bug-free."** A compiler catches syntax and, in typed languages, type errors — not logic errors.
- **"A language is one or the other forever."** The line is blurry: there is AOT compilation for Java and C#, JIT for Python (PyPy, for example), and WebAssembly in the browser.

## FAQ

### Is Python compiled or interpreted?

Standard CPython compiles code to bytecode, which a virtual machine then interprets. That is why it is usually called interpreted, even though a compilation step exists.

### What is JIT in simple terms?

Just-in-time compilation: the runtime watches which code runs most often and translates exactly that code into machine code while the program is running, so repeated calls get faster.

### Does this choice affect the cost of maintaining a project?

Indirectly. Ecosystem maturity, the availability of developers and how easily it deploys on your infrastructure matter more than the execution model itself.
