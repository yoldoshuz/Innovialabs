---
title: Mobile App Architecture: MVVM and Clean Architecture in Practice
description: How to split a mobile app into presentation, domain and data layers, wire them with dependency injection and decide when Clean Architecture is overkill.
summary: MVVM keeps screen logic in a ViewModel that exposes state, and Clean Architecture adds a domain layer of use cases and repository interfaces so business rules never depend on UI, network or database; for small apps, MVVM with repositories is usually enough.
---

## The short answer

**MVVM** and **Clean Architecture** solve different problems and work well together:

- **MVVM** organizes the screen: the View only renders state and forwards user events, the **ViewModel** holds screen logic and exposes state.
- **Clean Architecture** organizes the whole app: business rules live in a **domain layer** that knows nothing about the UI framework, HTTP client or database.

In practice this gives three layers: **presentation** (Views and ViewModels), **domain** (use cases, entities, repository interfaces) and **data** (API, local database, repository implementations). Dependencies point inward: presentation and data depend on domain, domain depends on nothing.

## What goes into each layer

| Layer | Contains | Must not contain |
|---|---|---|
| Presentation | Screens, ViewModels, UI state, navigation | SQL, HTTP calls, business rules |
| Domain | Entities, use cases, repository interfaces | Framework imports (Android, UIKit, Flutter) |
| Data | API clients, DTOs, database, caches, repository implementations | UI state, screen logic |

A quick test for the domain layer: it should compile and be unit-tested as **plain Kotlin, Swift or Dart**, without an emulator.

## How it looks in code

A minimal Kotlin example. The domain declares what it needs, the data layer provides it, the ViewModel only turns results into state.

```kotlin
// domain: no Android imports
interface OrderRepository {
    suspend fun getOrders(): List<Order>
}

class GetActiveOrders(private val repo: OrderRepository) {
    suspend operator fun invoke(): List<Order> =
        repo.getOrders().filter { it.isActive }
}

// presentation
class OrdersViewModel(
    private val getActiveOrders: GetActiveOrders
) : ViewModel() {
    private val _state = MutableStateFlow<OrdersState>(OrdersState.Loading)
    val state: StateFlow<OrdersState> = _state

    fun load() {
        viewModelScope.launch {
            _state.value = try {
                OrdersState.Content(getActiveOrders())
            } catch (e: IOException) {
                OrdersState.Error
            }
        }
    }
}
```

In the data layer, `OrderRepositoryImpl` takes an API client and a DAO, decides whether to return cached data, and **maps DTOs into domain entities**. The ViewModel never sees JSON or database rows.

The same shape works in Swift (a protocol instead of an interface, an `ObservableObject` or `@Observable` view model) and in Flutter (an abstract class plus a Bloc, Cubit or Riverpod notifier).

## Dependency injection

Layers should receive dependencies through constructors instead of creating them. **Dependency injection (DI)** is just the place where the graph is assembled.

- **Android:** Hilt (built on Dagger) or Koin.
- **iOS:** often plain constructor injection with a composition root; libraries such as Factory or Swinject exist if you need them.
- **Flutter:** get_it, injectable or Riverpod providers.

Rules that keep DI healthy:

- Bind **interfaces to implementations** in one place (`OrderRepository` to `OrderRepositoryImpl`).
- Inject only into constructors; avoid service locators called from deep inside classes.
- In tests, replace real implementations with fakes. If that is hard, the boundaries are wrong.

## Module structure

Group by **feature first**, then by layer inside the feature:

```text
app/
core/
  network/
  database/
  ui/
feature/
  orders/
    presentation/
    domain/
    data/
  profile/
```

Start with packages or folders. Move to separate Gradle modules, Swift packages or Dart packages when build times grow or when several teams work in parallel: modules enforce boundaries by compiler, not by discipline.

## When this is overkill

Full Clean Architecture costs extra files, mappings and indirection. It may not pay off when:

- the app is a prototype or MVP that may be rewritten;
- screens mostly display API data with no rules of their own;
- one developer maintains it and the lifetime is short.

In those cases use **MVVM plus repositories**: ViewModels talk to a repository directly, no use cases. Add a domain layer later, feature by feature, when real business rules appear.

Signs you do need the full approach: complex rules (pricing, permissions, statuses), offline mode with sync, several data sources, multiple teams, or logic shared across platforms.

## Common mistakes

- **Pass-through use cases** that only call one repository method. Skip them unless they add rules.
- **Framework types in the domain**: `Context`, `UIImage`, `BuildContext` or JSON annotations.
- **ViewModel holding references to Views** or doing navigation through UI objects.
- **A giant BaseViewModel** that every screen inherits and nobody dares to change.
- **Too many modules too early**: build configuration grows faster than the product.
- **One model for everything**: a DTO that leaks into the UI ties screens to the backend format.

## FAQ

### Do I need a use case for every action?

No. A use case is worth creating when it contains a rule, combines several repositories or is reused across screens. Simple reads can go straight from the ViewModel to the repository.

### MVVM or MVI?

MVI is a stricter form of the same idea: a single immutable state and explicit user intents. It suits complex screens with many states. Both fit inside Clean Architecture because they only affect the presentation layer.

### Does this apply to Flutter, SwiftUI and Compose?

Yes. Declarative UI frameworks change how the View renders state, not where business rules and data access live. The layers and the dependency rule stay the same.
