---
title: Python Type Hints: A Practical Guide with mypy
description: Basic and generic annotations, Optional and Union, TypedDict and Protocol in Python, plus how to add mypy checks gradually to an existing project.
summary: Type hints do not change how Python runs, but they let mypy catch bugs before execution; start with new and critical modules and tighten checks step by step.
---

## What type hints give you

**Type hints** describe what data code accepts and returns. Python does not check them at runtime, but **static analyzers** like mypy and code editors read them.

The practical benefits:

- bugs like "passed `None` where a string was expected" are found **before running**;
- autocompletion and go-to-definition become more accurate;
- a function signature doubles as documentation;
- refactoring is safer: the analyzer shows every place that broke.

## Basic annotations

```python
def greet(name: str, times: int = 1) -> str:
    return ", ".join([f"Hello, {name}"] * times)

scores: dict[str, int] = {"alice": 10}
tags: list[str] = []
```

In modern Python versions the built-in collections `list`, `dict`, `set` and `tuple` can be parameterized directly, with no import from `typing`.

## Optional and Union

If a value can be missing, say so explicitly:

```python
def find_user(user_id: int) -> User | None:
    ...

def parse(value: str | bytes) -> str:
    return value.decode() if isinstance(value, bytes) else value
```

`User | None` is the same as `Optional[User]`, and `str | bytes` is the same as `Union[str, bytes]`. With this annotation mypy forces you to check the result for `None` before using it — that is the core value.

## Generic functions

When the return type depends on the argument type, use `TypeVar`:

```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T | None:
    return items[0] if items else None
```

`first([1, 2])` returns `int | None`, and `first(["a"])` returns `str | None`.

## TypedDict: dictionaries with a known shape

JSON from an API often lives as dictionaries. `TypedDict` describes the keys and their types:

```python
from typing import TypedDict

class UserDTO(TypedDict):
    id: int
    name: str
    email: str | None
```

A typo in a key or a wrong value type becomes a type-check error.

## Protocol: duck typing with checks

`Protocol` describes **what an object can do**, without inheritance:

```python
from typing import Protocol

class Notifier(Protocol):
    def send(self, text: str) -> None: ...

def alert(notifier: Notifier) -> None:
    notifier.send("Server is down")
```

Any class with a `send(text: str)` method fits — handy for swapping dependencies in tests.

## Adding mypy to an existing project

Turning on strict mode for the whole codebase at once is pointless: you get hundreds of errors and the urge to disable everything. Go step by step.

1. **Install mypy** as a dev dependency and run it on the project. By default it only checks annotated functions, so the start is gentle.
2. **Add a base configuration** to `pyproject.toml`.
3. **Tighten checks per module**: new and critical packages strictly, legacy ones later.
4. **Add mypy to CI** so new errors do not reach the main branch.

```toml
[tool.mypy]
ignore_missing_imports = true

[[tool.mypy.overrides]]
module = "app.billing.*"
disallow_untyped_defs = true
```

For third-party libraries without types, look for stub packages, and treat `ignore_missing_imports` as a temporary measure.

## Common mistakes

- **`Any` everywhere.** It disables checking, and the annotation loses its point.
- **`# type: ignore` without a comment.** Six months later nobody remembers what it was hiding.
- **Expecting runtime checks.** Validating incoming data needs separate tools; annotations do not replace them.
- **Trying to type everything at once.** A gradual approach is more reliable.

## FAQ

### Do type hints slow the program down?

No, they have no noticeable effect on execution speed: the interpreter does not check them.

### How is mypy different from pyright?

Both are static type checkers. They treat some edge cases differently, but the core principles are the same. Pick one and use it both in your editor and in CI.

### Do small scripts need type hints?

Not necessarily. They pay off most in code that lives long and is edited by several people.
