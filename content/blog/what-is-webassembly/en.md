---
title: What Is WebAssembly and When to Use It in the Browser
description: How WebAssembly runs alongside JavaScript, which languages compile to it, where it truly helps — media processing, editors, games — and what its limits are.
summary: WebAssembly is a compact binary format the browser runs at near-native speed next to JavaScript; use it for heavy computation and porting existing code, not for ordinary interfaces.
---

## WebAssembly in short

**WebAssembly (Wasm)** is a binary code format the browser runs in the same sandbox as JavaScript, but closer to native program speed. You rarely write it by hand: code in C, C++, Rust or another language compiles to a `.wasm` file that the page loads.

Wasm **does not replace JavaScript**. It works next to it: JavaScript handles the page, the DOM and events, while Wasm takes on heavy computation.

## How Wasm works alongside JavaScript

The interaction looks like this:

1. The browser downloads the `.wasm` module and compiles it.
2. JavaScript instantiates the module and gets its **exported functions**.
3. The module can call functions JavaScript passed to it (**imports**).
4. Data moves through **linear memory** — a shared byte buffer both sides can see.

```js
const { instance } = await WebAssembly.instantiateStreaming(
  fetch("/math.wasm"),
  {}
);

console.log(instance.exports.add(2, 3)); // 5
```

An important detail: Wasm has **no direct DOM access**. Any work with the page goes through JavaScript. Frequent JS-to-Wasm calls with tiny pieces of data can cancel out the gain — hand over work in large chunks.

## Languages that compile to Wasm

| Language | Tooling | Notes |
|---|---|---|
| **Rust** | wasm-pack, wasm-bindgen | Mature ecosystem, smooth JS bindings, compact output |
| **C / C++** | Emscripten | Lets you port existing libraries and engines |
| **Go** | Built-in support, TinyGo | The standard build ships a runtime; TinyGo produces smaller files |
| **AssemblyScript** | Its own compiler | TypeScript-like syntax, an easier start for JS developers |
| **C#, Kotlin and others** | Blazor, Kotlin/Wasm | Bring their own runtime, files are usually larger |

Garbage-collected languages historically shipped their GC inside the bundle. Native GC support in Wasm changes that, but check the status for your specific language and target browsers.

## Where Wasm genuinely helps

- **Image and video processing**: compression, format conversion and filters right in the browser, without uploading the file to a server.
- **Editors and complex apps**: graphics and CAD editors, office tools where speed matters and a large C++ or Rust codebase already exists.
- **Games and 3D**: engines compiled to Wasm work together with WebGL or WebGPU.
- **Porting existing libraries**: databases, codecs, parsers, cryptography — without rewriting them in JavaScript.
- **Client-side computation**: simulations, data analysis, running small ML models locally.

## When you do not need Wasm

- Ordinary websites, landing pages, forms, online stores — the bottleneck there is the network, images and rendering, not compute speed.
- Logic that mostly **touches the DOM**: the calls through JavaScript eat the gain.
- Small tasks where a modern JavaScript engine is already fast enough.

Before reaching for Wasm, **profile**: make sure the problem really is computation.

## Limits

- **File size**: a module with a language runtime can weigh noticeably more than equivalent JS.
- **Debugging** is harder, although DevTools support source maps and DWARF for some languages.
- **No direct access** to the DOM and most Web APIs — only through JavaScript wrappers.
- **Multithreading** requires SharedArrayBuffer and special cross-origin isolation headers.
- **Security**: Wasm is sandboxed, but bugs in C/C++ source code (such as buffer overflows) can still corrupt data inside the module's memory.

## FAQ

### Is WebAssembly faster than JavaScript?

For intensive computation, often yes — and, more importantly, more predictable. For ordinary UI logic the difference may be invisible, while the cost of passing data back and forth can be noticeable.

### Can I write a whole frontend in WebAssembly?

You can; there are Rust and C# frameworks for it. But DOM work still goes through JavaScript and the download is usually bigger. For most interfaces, JavaScript and TypeScript remain more practical.

### Is WebAssembly used outside the browser?

Yes. Thanks to WASI it runs on servers, edge platforms and in plugin systems as a safe, isolated executable format.
