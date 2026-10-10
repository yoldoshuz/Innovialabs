---
title: How to Read a Stack Trace and Find the Bug
description: A line-by-line look at Python, JavaScript and Java stack traces: where the error type is, how to find your code among library frames, how to search errors.
summary: A stack trace is the chain of calls that led to a crash: find the error type and message, then the first frame from your own code — that is almost always where the fix goes.
---
## What a stack trace is and where to start

A **stack trace** is the list of function calls that were active when the error happened. Each line is a **frame**: a file, a line number and a function name. Read it in two steps:

1. Find the **error type and message** — this tells you *what* happened.
2. Find the **first frame from your own code** — this tells you *where* to fix it.

The tricky part is that languages print the stack in different orders. Let's go through three examples.

## Python: read from the bottom up

```text
Traceback (most recent call last):
  File "/app/main.py", line 12, in <module>
    total = calculate_total(order)
  File "/app/billing.py", line 8, in calculate_total
    return sum(item["price"] * item["qty"] for item in order["items"])
  File "/app/billing.py", line 8, in <genexpr>
    return sum(item["price"] * item["qty"] for item in order["items"])
KeyError: 'qty'
```

- **most recent call last** means the newest call is at the bottom.
- The last line is the error itself: `KeyError: 'qty'` — a dictionary has no `qty` key.
- The line above it is the exact spot: `billing.py`, line 8.
- Everything higher is the path that led there: `main.py` called `calculate_total`.

Conclusion: one of the order items has no `qty` field. Fix either the data or the function (for example `item.get("qty", 1)` if that is acceptable for your logic).

If you see **During handling of the above exception, another exception occurred**, there are two errors: the first is the original cause, the second happened while handling it. Start with the first.

## JavaScript (Node.js): read from the top down

```text
TypeError: Cannot read properties of undefined (reading 'map')
    at renderList (/app/src/list.js:14:22)
    at handleRequest (/app/src/server.js:31:10)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
```

- The first line is the type and message: `.map` was called on `undefined`.
- Right below is the crash location: `list.js`, line 14, column 22.
- Further down are the callers. Frames from `node_modules` belong to a library (Express here) and can usually be skipped.

Conclusion: `renderList` received an array that does not exist. Check what `handleRequest` passes on line 31.

In the browser the stack may point to a minified bundle like `main.3f2a.js:1:48213`. To see the original files, enable **source maps** in your build and in DevTools.

## Java: top down, and always check "Caused by"

```text
Exception in thread "main" java.lang.IllegalStateException: Failed to load config
	at com.example.App.loadConfig(App.java:42)
	at com.example.App.main(App.java:15)
Caused by: java.lang.NumberFormatException: For input string: "abc"
	at java.base/java.lang.Integer.parseInt(Integer.java)
	at com.example.Config.port(Config.java:27)
	at com.example.App.loadConfig(App.java:40)
	... 1 more
```

(Simplified example.)

- The top exception is a wrapper: the config failed to load.
- The real cause is in the **Caused by** block, and the lowest such block is usually the most important one.
- Its first frame, `java.base`, is the standard library; your first frame is `Config.java:27`, which received the string `"abc"` instead of a number.
- `... 1 more` means the remaining frames are the same as those already shown above.

## Finding your code among other frames

- Look for your project paths: `/app/src`, `com.yourcompany`, the repository name.
- Skip `node_modules`, `site-packages`, `java.base`, `org.springframework` and similar. A bug inside a library is far less common than bad data passed into it.
- If there are no frames from your code at all, the problem is likely configuration or environment: package versions, environment variables, file permissions.
- Many IDEs highlight project frames and make them clickable — use that.

## How to search for an error effectively

1. Copy the **type and message**, not the whole trace: `TypeError: Cannot read properties of undefined`.
2. Remove anything unique: paths, IDs, your variable names, dates.
3. Add the library or framework name and its major version.
4. Put the exact phrase in quotes.
5. Check the library's GitHub **issues** — they often contain both the cause and a workaround.
6. If an answer is old, check it against your version.

## Common mistakes when reading traces

- Looking only at the last line and ignoring "Caused by".
- Fixing the crash location instead of the place where bad data appeared.
- Dropping the trace from logs or logging only `error.message` without the stack.
- Swallowing exceptions with an empty `catch`/`except` — the stack is lost for good.

## FAQ

### Why does the trace point to a line that looks fine?

The crash happens where bad data is **used**, not where it was **created**. Walk up the stack through the callers and find where the wrong value came from.

### What if the stack is truncated?

Raise the depth limit or log the full stack: in Node.js you can increase `Error.stackTraceLimit`, in Java read the `... N more` line together with the outer exception. In production, error-tracking tools that store the whole stack help a lot.

### Should users see the stack trace?

No. Show users a clear message and send the stack to logs. A full trace can expose paths, library versions and infrastructure details.
