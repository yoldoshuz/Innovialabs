---
title: Mocks, Stubs and Fakes: How to Isolate Code in Tests
description: The difference between dummy, stub, spy, mock and fake, how to replace HTTP calls and databases in pytest and Jest, and why over-mocking breaks tests.
summary: A test double stands in for a real dependency: a stub returns canned data, a mock verifies calls, a fake is a simplified working implementation. Replace only what is slow or external.
---

## Why replace dependencies

A unit test should be **fast, stable and check one thing**. A real network, database or payment gateway gets in the way: they are slow, may be unavailable and return different data. So in tests they are replaced with **test doubles** — stand-ins, like stunt doubles in film.

## Five kinds of doubles

| Type | What it does | When you need it |
|---|---|---|
| **Dummy** | Fills an argument slot, never used | A parameter is required but irrelevant to the test |
| **Stub** | Returns a canned answer | You need to control input coming from a dependency |
| **Spy** | Acts like a stub and records calls | You want to inspect calls afterwards |
| **Mock** | Knows the expected calls and verifies them | The interaction itself matters: email sent, payment created |
| **Fake** | A simplified but working implementation | You need behavior: in-memory DB, local file storage |

In everyday speech all of these get called "mocks", and libraries like `unittest.mock` and Jest create objects that can play any of these roles. What matters is the **role** in a given test: are you supplying data (stub) or verifying behavior (mock)?

## Replacing an HTTP call in pytest

A function fetches temperature from an external API:

```python
# weather.py
import requests

def get_temp(city):
    r = requests.get("https://api.example.com/weather",
                     params={"q": city}, timeout=5)
    r.raise_for_status()
    return r.json()["temp"]
```

The test patches `requests.get` where it is **used** — in the `weather` module:

```python
from unittest.mock import Mock, patch
from weather import get_temp

def test_get_temp_reads_temp_field():
    response = Mock()
    response.json.return_value = {"temp": 21}
    with patch("weather.requests.get", return_value=response) as get:
        assert get_temp("Tashkent") == 21
        get.assert_called_once()
```

A common mistake is patching `requests.get` somewhere else instead of at the path the module under test imports it through.

## Replacing fetch in Jest

```js
// user.js
export async function getUserName(id) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return data.name;
}
```

```js
// user.test.js
import { getUserName } from './user';

test('returns user name', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'Aziz' }),
  });
  await expect(getUserName(1)).resolves.toBe('Aziz');
  expect(fetch).toHaveBeenCalledWith('/api/users/1');
});
```

For whole modules Jest offers `jest.mock('./db')`: every export becomes a controllable stub function.

## Databases: a fake instead of a mock

Mocking every SQL query leads to brittle tests. It is easier to hide the database behind a repository interface and use a **fake** in tests:

```python
class FakeUserRepo:
    def __init__(self):
        self.users = {}

    def save(self, user):
        self.users[user["email"]] = user

    def find_by_email(self, email):
        return self.users.get(email)
```

Registration logic is tested against `FakeUserRepo`, while real database access is covered by separate integration tests — for example, against a test database in Docker.

## The danger of over-mocking

Signs you have too many mocks:

- the test repeats the implementation line by line: "call A, then B with these arguments";
- any refactor that keeps behavior the same breaks tests;
- all tests are green but production fails because the mock did not behave like the real service;
- a single test sets up five or more replacements.

How to avoid it:

- **Replace only system boundaries**: network, DB, time, file system, third-party SDKs.
- **Do not mock** your own pure logic — call it for real.
- Check **results**, not the sequence of internal calls, unless the interaction itself is a requirement.
- Keep **integration tests** alongside that verify the real wiring.

## FAQ

### What is the difference between a mock and a stub?

A stub only supplies data, and the test checks the function's result. A mock takes part in verification: the test asserts it was called the right number of times with the right arguments.

### Should I mock the database in every test?

No. For unit tests of business logic a fake repository works well, and the queries themselves are better checked by integration tests against a real test database.

### How do I mock the current time?

Pass the time or a "clock" into the function as a dependency, or use fake timers: `jest.useFakeTimers()` in Jest, and in Python, patching the time function with `patch` or a dedicated library.
