---
title: Error Handling Best Practices: Exceptions vs Return Values
description: Comparing exceptions in Python and Java, error values in Go and Result in Rust, plus rules for clear messages, custom error types and never swallowing failures.
summary: Exceptions are convenient when an error must travel far up the stack, while error values and Result make every failure explicit in the signature. More important than the approach: never lose errors, add context and handle them where a decision can be made.
---
## The short answer

There is no universally better approach, and the language usually decides for you. **Exceptions** (Python, Java, C#, JavaScript) interrupt execution and bubble up the stack until something catches them. **Error values** (Go) and the **Result type** (Rust) are returned like any other result, and the caller has to deal with them.

Good error handling rests on three rules: **never swallow failures**, **add context**, and **handle the error where a decision can be made**.

## What it looks like in different languages

**Python, exceptions:**

```python
def load_config(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError as e:
        raise ConfigError(f"config not found: {path}") from e
```

**Go, error as a value:**

```go
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }
    // ...
}
```

**Rust, Result and the `?` operator:**

```rust
fn load_config(path: &str) -> Result<Config, ConfigError> {
    let data = std::fs::read_to_string(path)?;
    let config = parse(&data)?;
    Ok(config)
}
```

## Comparing the approaches

| | Exceptions | Error values (Go) | Result (Rust) |
|---|---|---|---|
| Visible in the signature | partly (checked exceptions in Java) | yes | yes |
| Easy to forget handling | very | `err` can be ignored | compiler warns |
| Amount of code | less | more `if err != nil` | compact with `?` |
| Passing far up | automatic | manual | via `?` |

Exceptions fit truly exceptional situations. Error values work well where failure is a normal scenario: the file is missing, the user entered invalid data, a service is down.

## Rules that work in any language

1. **Do not swallow errors.** An empty `except: pass` or `_ = err` hides the problem, and it surfaces later somewhere confusing.
2. **Catch specific types.** `except Exception` also catches your own bugs. Catch `FileNotFoundError` or `TimeoutError`, the things you can actually handle.
3. **Add context.** "file not found" is useless without the file name and the operation. Keep the original cause: `raise ... from e` in Python, `%w` in Go, `cause` in Java and JavaScript.
4. **Create custom error types** for business cases: `InsufficientFundsError`, `OrderNotFound`. Callers can then tell them apart from technical failures.
5. **Handle at the right level.** A low-level function passes the error up with context. The decision to retry, show a message or return HTTP 404 belongs to the layer that knows the scenario.
6. **Log once.** If every layer logs the error and rethrows it, you get five copies of one failure in the logs.
7. **Separate audiences.** The user gets a clear message without implementation details. The log gets the stack trace, parameters and request id.

## Common mistakes

- Returning `null` or `-1` instead of an error, so the caller never learns the reason.
- Using exceptions for normal control flow, such as breaking out of a loop.
- Showing the user a stack trace or raw SQL error text, which is also a security risk.
- Retrying forever with no delay and no attempt limit.

## FAQ

### For a new project, exceptions or Result?

Follow the idioms of your language. Use exceptions in Python and Java, error values in Go and Result in Rust. Mixing styles in one project is worse than consistently using either one.

### Should I catch all exceptions at the top level?

Yes, you need one general handler at the application boundary: it logs the failure and returns a clean response to the user. It does not replace handling expected errors inside the code.

### How do I write good error messages?

Answer three questions: what you were trying to do, with which data, and what went wrong. "Could not charge order 1024: insufficient funds" is far clearer than "operation failed".
