---
title: Test-Driven Development (TDD): A Step-by-Step Guide
description: The red-green-refactor cycle on a real example, where TDD pays off, where it gets in the way and the mistakes beginners make most often.
summary: TDD is a short loop: write a failing test first, then the minimum code to make it pass, then improve the code while the tests keep you safe.
---

## TDD in a nutshell

**Test-Driven Development** means writing the test before the code. You work in short cycles of three steps:

1. **Red** — write a test for one small behavior, run it and watch it fail.
2. **Green** — write the minimum code that makes it pass. Simple, not pretty.
3. **Refactor** — improve the structure of code and tests without changing behavior. Tests must stay green.

One cycle takes minutes. The point is not "coverage" but that every piece of code exists in response to a concrete requirement.

## Example: cart total with a promo code

The task: calculate a cart total, and the promo code `SALE10` gives 10% off. We use Python and pytest.

**Cycle 1, red.** Start with the simplest case:

```python
# test_cart.py
from cart import cart_total

def test_empty_cart_costs_zero():
    assert cart_total([]) == 0
```

It fails because the `cart` module does not exist yet. That is a good red: it fails for the expected reason.

**Green.** Minimal code:

```python
# cart.py
def cart_total(items):
    return 0
```

Yes, it is "cheating". The next test will force real logic.

**Cycle 2.** Add a test for summing items:

```python
def test_sums_price_times_quantity():
    items = [{"price": 100, "qty": 2}, {"price": 50, "qty": 1}]
    assert cart_total(items) == 250
```

Red. Make it green:

```python
def cart_total(items):
    return sum(i["price"] * i["qty"] for i in items)
```

**Cycle 3.** The promo code:

```python
def test_sale10_gives_ten_percent_off():
    items = [{"price": 200, "qty": 1}]
    assert cart_total(items, promo="SALE10") == 180

def test_unknown_promo_is_ignored():
    items = [{"price": 200, "qty": 1}]
    assert cart_total(items, promo="WRONG") == 200
```

**Green and refactor.** Once the tests pass, move discounts into a dictionary so a new promo code is one line:

```python
DISCOUNTS = {"SALE10": 0.10}

def cart_total(items, promo=None):
    subtotal = sum(i["price"] * i["qty"] for i in items)
    return subtotal * (1 - DISCOUNTS.get(promo, 0))
```

All four tests are green, so the refactor is safe. In a real project, money should use `Decimal` or integer cents rather than floats — another rule worth pinning down with its own test.

## Where TDD pays off

- **Business logic** with clear rules: calculations, discounts, tariffs, validation, order statuses.
- **Bug fixes**: first a test that reproduces the bug, then the fix. The bug cannot quietly come back.
- **Code that changes often**: tests give you the confidence to refactor.
- **Public APIs and libraries**: the test makes you think about interface usability first.

## Where TDD gets in the way

- **Prototypes and experiments** that will be thrown away. Find out what to build first.
- **Layout and visuals**: the result is checked by eye, not by an assert.
- **Thin wrappers around external services**: integration tests are more useful there.
- **Unfamiliar technology**: do a short spike without tests, then use TDD on the real version.

TDD is a tool, not a religion. Many teams use it for core logic and write tests afterwards for the rest.

## Common beginner mistakes

- **Steps that are too big.** A test for the whole feature keeps you red for half an hour. Break it down to one behavior.
- **Skipping red.** If you never saw it fail, the test may check the wrong thing or not run at all.
- **Skipping refactor.** Without the third step, TDD quickly produces working but tangled code.
- **Testing implementation.** Check results and behavior, not which private methods were called.
- **Too many mocks.** If a test needs five dependencies replaced, that points to a design problem.

## How to start in a team

1. Pick one module with clear rules.
2. Agree that every bug is closed with a test first.
3. Run tests in CI so a red build blocks merging.
4. After a couple of weeks, discuss where it helped and where it was overkill.

## FAQ

### Does TDD slow development down?

At first, yes — the habit takes time. Later it usually saves time on manual checks and hunting regressions, but the gain depends on the kind of code.

### Do I need 100% coverage with TDD?

No. Coverage is a side effect, not the goal. What matters is that every meaningful behavior is pinned down by a test.

### Can I use TDD on legacy code?

Yes, but start with characterization tests that capture current behavior, then make new changes through the red-green-refactor cycle.
