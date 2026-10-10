---
title: Flutter State Management: Provider vs Riverpod vs BLoC
description: Provider, Riverpod and BLoC compared with code examples: testability, boilerplate, team scalability and which one to pick for your project size.
summary: Provider fits small apps, Riverpod is a sensible default for most new projects, and BLoC pays off in large teams that need strict rules and a traceable flow of events.
---

## The short answer

All three solve the same problem: keep data outside widgets and rebuild the UI when it changes. They differ in how strict they are and what that strictness costs.

- **Provider** is the simplest, a thin layer over `InheritedWidget`. Good for small apps and prototypes.
- **Riverpod** comes from the same author but does not depend on `BuildContext`, catches more mistakes at compile time and makes overrides in tests easy. A sensible default.
- **BLoC** only lets state change through events or Cubit methods. More code, but a predictable architecture for large teams.

State that belongs to a single widget (is a panel expanded, what is typed in a field) does not need any of them. `setState` is enough.

## What it looks like in code

The same feature, a shopping cart, three ways.

**Provider** with `ChangeNotifier`:

```dart
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];
  List<Item> get items => List.unmodifiable(_items);

  void add(Item item) {
    _items.add(item);
    notifyListeners();
  }
}

// app root
ChangeNotifierProvider(create: (_) => CartModel(), child: const App());

// in a widget
final count = context.watch<CartModel>().items.length;
```

**Riverpod** with `Notifier`:

```dart
final cartProvider =
    NotifierProvider<CartNotifier, List<Item>>(CartNotifier.new);

class CartNotifier extends Notifier<List<Item>> {
  @override
  List<Item> build() => [];

  void add(Item item) => state = [...state, item];
}

// in a ConsumerWidget
final items = ref.watch(cartProvider);
ref.read(cartProvider.notifier).add(item);
```

**BLoC** in its lighter form, a Cubit:

```dart
class CartCubit extends Cubit<List<Item>> {
  CartCubit() : super(const []);

  void add(Item item) => emit([...state, item]);
}

BlocBuilder<CartCubit, List<Item>>(
  builder: (context, items) => Text("${items.length}"),
);
```

A full Bloc adds event classes (`ItemAdded`, `ItemRemoved`) and `on<Event>` handlers. That is more code, but every state change has a name and is easy to trace in logs.

## Side-by-side comparison

| Criterion | Provider | Riverpod | BLoC |
|---|---|---|---|
| Learning curve | Low | Medium | Medium to high |
| Boilerplate | Minimal | Some | The most |
| Depends on `BuildContext` | Yes | No | Yes (to reach the bloc) |
| Missing provider errors | At runtime | Caught earlier | At runtime |
| Testing | Test the model class directly | `ProviderContainer` with overrides | `bloc_test`, assert state sequences |
| Async data | Manual | Built-in `FutureProvider`, `AsyncValue` | Loading states via events |
| Team size | 1 to 3 developers | Any, with conventions | Large teams, strict process |

## Testability

**Provider.** A `ChangeNotifier` is a plain Dart class, easy to unit test. Dependencies are the harder part: you pass them through the constructor yourself.

**Riverpod.** Overrides are its strength. You can swap a repository for a fake without touching production code:

```dart
final container = ProviderContainer(
  overrides: [repositoryProvider.overrideWithValue(FakeRepository())],
);
addTearDown(container.dispose);

container.read(cartProvider.notifier).add(item);
expect(container.read(cartProvider), [item]);
```

**BLoC.** The `bloc_test` package lets you write a test as "this event in, this list of states out". That shines for complex flows such as loading, error and retry.

## Teams and scale

In large projects the real problem is not the library, it is **inconsistency**. If everyone writes state differently, any approach turns into a mess.

- BLoC enforces structure: event, handler, state. A new developer knows where to look for logic.
- Riverpod is more flexible, so the team must agree on conventions: where providers live, how they are named, when to use a `Notifier` versus a `FutureProvider`.
- Provider in a big codebase often ends with bloated `ChangeNotifier` classes holding dozens of fields and triggering wide rebuilds.

## How to choose by project size

1. **Prototype, MVP, a handful of screens**: Provider or Riverpod. Speed of validating the idea matters most.
2. **Mid-sized product, small team**: Riverpod. Less code than BLoC, good testing story, async support out of the box.
3. **Large app, several teams, strict code review**: BLoC, or Riverpod with a firm style guide. What the team already knows well often decides it.
4. **Existing project**: do not rewrite everything to follow a trend. Build new modules with the new approach and migrate old ones gradually.

## Common mistakes

- **Business logic inside widgets.** API calls and validation belong in the model, notifier or bloc.
- **Making everything global.** Form state on one screen does not need to be app-wide.
- **Unnecessary rebuilds.** Use selectors (`context.select`, `ref.watch(provider.select(...))`, `BlocSelector`) so a widget reacts only to the field it shows.
- **Mixing all three** in one project without a clear reason.

## FAQ

### Can I use Riverpod and BLoC together?

Technically yes, but it makes maintenance harder: two ways to inject dependencies and two mental models. If you have a reason, such as a migration, write down which approach new code should use.

### Does Riverpod require code generation?

No, it is optional. Annotation-based generation shortens provider declarations but adds a `build_runner` step. Small projects are often fine with manual declarations.

### Is Provider outdated?

No, it is maintained and still a solid tool. For new mid-sized and large projects, Riverpod usually offers more while staying comparably simple.
