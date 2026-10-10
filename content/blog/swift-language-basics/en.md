---
title: Swift Language Basics: Syntax, Optionals and Structs
description: The Swift features beginners meet first: let and var, optionals and unwrapping, structs versus classes, enums and closures, each with a short runnable example.
summary: Start Swift with five things: let/var, optionals with safe unwrapping, the difference between struct (value) and class (reference), enums and closures — almost all iOS code is built on them.
---

## What to learn first

**Swift** is Apple's language for iOS, macOS, watchOS and server-side development. It is strictly typed, but types are usually inferred. Beginners almost immediately run into five topics: **constants and variables**, **optionals**, **structs and classes**, **enums** and **closures**. Here is each one with a short example you can run in an Xcode Playground or with the toolchain from swift.org.

## let and var

- `let` declares a constant; the value cannot change once set.
- `var` declares a variable.

```swift
let name = "Aziz"        // String type is inferred
var score = 10
score += 5               // fine
// name = "Bobur"        // compile error
let price: Double = 9.5  // explicit type annotation
```

Rule of thumb: **write `let` by default** and use `var` only when the value really changes. The compiler will warn you when a `var` is never mutated.

## Optionals and unwrapping

An **optional** (`String?`, `Int?`) means "there may be a value here, or there may be `nil`". A plain `String` can never be `nil`, which rules out a whole class of bugs.

```swift
let input = "42"
let number: Int? = Int(input)   // the string may not be a number

// 1. if let: unwrap when a value exists
if let n = number {
    print("Number: \(n)")
}

// 2. guard let: exit early when it does not
func double(_ value: Int?) -> Int {
    guard let v = value else { return 0 }
    return v * 2
}

// 3. ??: provide a default
let safe = number ?? 0

// 4. ?.: optional chaining
let length = Int("abc")?.description.count  // nil
```

There is also **force unwrapping**, `number!`. If the value is `nil`, the app crashes. Use it only when the value is guaranteed, and ideally avoid it altogether.

## Structs and classes

The key difference: **a struct is passed by value, a class by reference**.

```swift
struct Point { var x: Int; var y: Int }
class Counter { var value = 0 }

var a = Point(x: 1, y: 2)
var b = a          // a copy
b.x = 100          // a.x is still 1

let c1 = Counter()
let c2 = c1        // same reference
c2.value = 5       // c1.value is 5 too
```

| | struct | class |
|---|---|---|
| Passing | copy of the value | reference to the object |
| Inheritance | no | yes |
| Automatic initializer | yes (memberwise) | no |
| Changing state in a method | needs `mutating` | allowed |

Swift practice: **start with a struct** and reach for a class when you need shared mutable state, inheritance or compatibility with Objective-C APIs.

## Enums

A Swift `enum` is more than a list of constants. Cases can carry associated values, and `switch` must cover every case.

```swift
enum PaymentStatus {
    case pending
    case paid(amount: Double)
    case failed(reason: String)
}

let status = PaymentStatus.paid(amount: 250)

switch status {
case .pending:            print("Pending")
case .paid(let amount):   print("Paid: \(amount)")
case .failed(let reason): print("Failed: \(reason)")
}
```

Add a new case and the compiler points to every `switch` you need to update.

## Closures

A **closure** is an unnamed function you can pass around as a value. You will use them constantly for sorting, filtering and callbacks.

```swift
let prices = [120, 45, 80]

let sorted = prices.sorted { $0 < $1 }        // [45, 80, 120]
let expensive = prices.filter { $0 > 50 }     // [120, 80]
let labels = prices.map { "\($0) UZS" }

func load(completion: (String) -> Void) {
    completion("done")
}
load { result in print(result) }
```

`$0` and `$1` are shorthand argument names. Writing the closure after the parentheses is called a **trailing closure**.

## Common beginner mistakes

- Sprinkling `!` everywhere instead of `if let` / `guard let`.
- Making everything a class out of habit from other languages.
- Using `var` when `let` is enough.
- Adding `default` to a `switch` over an enum and losing the compiler's help when new cases appear.

The official language guide is [The Swift Programming Language](https://docs.swift.org/swift-book/).

## FAQ

### Do I need a Mac to learn Swift?

To build iOS apps, yes: you need Xcode, which runs only on macOS. The language itself can be learned on Linux or Windows by installing Swift from the official site.

### How is an optional different from null in other languages?

In Swift a regular type can never be `nil`. The possibility of a missing value is visible in the type (`String?`), and the compiler makes you handle it before use.

### When should I choose a class over a struct?

When an object must be shared across parts of the program and changes should be visible everywhere, when you need inheritance, or when the framework you use requires it.
