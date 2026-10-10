---
title: SwiftUI vs UIKit: Which to Use for a New iOS App
description: SwiftUI vs UIKit compared: declarative and imperative UI, minimum iOS version, maturity, interoperability and migration paths for existing UIKit code.
summary: For a new iOS app, start with SwiftUI in most cases and use UIKit where you need more control; an existing UIKit project is not rewritten — new screens are added in SwiftUI instead.
---

## The short answer

For a new app, a sensible default is **SwiftUI as the foundation and UIKit where needed** — wherever SwiftUI lacks capabilities or control.

UIKit as the main framework makes sense if:

- you must support old iOS versions;
- the interface relies on highly non-standard components: complex text editors, unusual transitions, heavy lists with custom layouts;
- the team is strong in UIKit and the deadline leaves no room to retrain.

If the app is already written in UIKit, **do not rewrite it**: build new screens in SwiftUI and embed them in the existing code.

## Declarative vs imperative

In **UIKit** you create views, keep references to them and update them manually whenever data changes:

```swift
final class CounterViewController: UIViewController {
    private var count = 0
    private let button = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        button.addTarget(self, action: #selector(didTap), for: .touchUpInside)
        view.addSubview(button)
        updateTitle()
        // plus Auto Layout constraints for the button
    }

    @objc private func didTap() {
        count += 1
        updateTitle()
    }

    private func updateTitle() {
        button.setTitle("Tapped: \(count)", for: .normal)
    }
}
```

In **SwiftUI** you describe what the interface looks like for a given state, and the framework handles updates:

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        Button("Tapped: \(count)") {
            count += 1
        }
    }
}
```

There is less code, and data and UI fall out of sync less often. The price is less direct control: sometimes it is hard to tell why a view re-rendered or behaved unexpectedly.

## Key criteria compared

| Criterion | SwiftUI | UIKit |
|---|---|---|
| Approach | declarative | imperative |
| Amount of code | less | more |
| Maturity | evolving fast, behavior may change between iOS versions | long-established, predictable, many ready solutions |
| Fine-grained control | limited | full |
| Apple platforms | shared code for iOS, iPadOS, macOS, watchOS with adaptation | iOS and iPadOS |
| Dependence on iOS version | strong: new APIs are tied to new iOS releases | weak |

## The minimum iOS version decides a lot

SwiftUI capabilities depend on **the iOS version on the user's device**, not on your Xcode version. New APIs arrive with new iOS releases and are not backported. So:

- the higher your minimum iOS version, the fewer workarounds you need and the nicer SwiftUI is to work with;
- with a low minimum version, many convenient tools need `if #available` checks or UIKit replacements.

iPhone users usually update quickly, but older models hit the end of their support, and used devices are popular in some regions. Check your audience analytics before fixing the minimum version.

## How SwiftUI and UIKit work together

Mixing the frameworks is a normal, officially supported practice:

- **UIKit inside SwiftUI** — via `UIViewRepresentable` and `UIViewControllerRepresentable`. This is how you embed a camera, complex text fields or third-party SDK views.
- **SwiftUI inside UIKit** — via `UIHostingController`:

```swift
let profile = UIHostingController(rootView: ProfileView(user: user))
navigationController?.pushViewController(profile, animated: true)
```

## How to migrate a UIKit project

1. **Do not rewrite everything at once.** A full rewrite means months without new features.
2. **Build new screens in SwiftUI** and present them via `UIHostingController`. Keep navigation in UIKit at first.
3. **Move bottom-up**: cells, small components, settings screens, then complex screens.
4. **Separate business logic from UI**: models and services should not depend on which framework draws the screen.
5. **Move navigation to SwiftUI last,** once most screens have been migrated.

## Common mistakes

- **SwiftUI with too low a minimum iOS** — workarounds appear on every screen.
- **Fighting SwiftUI for pixel-perfect control** instead of wrapping an existing UIKit component.
- **Business logic inside views** — it becomes hard to test and move.
- **Rewriting a working app** just to follow a trend.

## FAQ

### Is UIKit outdated?

No. Apple keeps developing UIKit, and SwiftUI on iOS relies on it in many places. Both frameworks are supported, and most large apps use them together.

### Can I mix SwiftUI and UIKit in one app?

Yes, it is a standard scenario. Apple provides `UIHostingController` and the `Representable` protocols for exactly this.

### What should a beginner iOS developer learn?

Start with SwiftUI to build working screens faster, then learn UIKit basics: many existing projects and third-party SDKs are built on it.
