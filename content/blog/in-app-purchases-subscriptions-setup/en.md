---
title: How to Implement In-App Purchases and Subscriptions
description: StoreKit and Google Play Billing, product types, server-side purchase validation, free trials, restoring purchases and when a tool like RevenueCat makes sense.
summary: Create products in App Store Connect and Play Console, run purchases through StoreKit and Google Play Billing, validate them and store access status on your server, and set up free trials and purchase restoration per each store's rules or through RevenueCat.
---

## The short answer: the building blocks

In-app purchases (IAP) sell digital content and features through the store's payment system. A working setup includes:

1. **Products** in App Store Connect and Google Play Console.
2. **Client code** using StoreKit (iOS) and the Google Play Billing Library (Android).
3. **A server** that validates purchases and tracks who has access to what.
4. **Store notifications** about renewals, cancellations and refunds.

## Product types

| Apple | Google Play | Example |
|---|---|---|
| Consumable | One-time consumable | Coins, credits |
| Non-consumable | One-time non-consumable | Remove ads forever |
| Auto-renewable subscription | Subscription (base plan + offers) | Premium monthly or yearly |
| Non-renewing subscription | None (build it yourself) | Access to a course season |

In Google Play a subscription consists of **base plans** (period and price) and **offers** (discounts and trials). Apple groups subscriptions into a **subscription group**, and a user can hold only one active subscription per group.

## iOS: StoreKit

Modern **StoreKit 2** uses async/await and returns signed transactions:

```swift
let products = try await Product.products(for: ["premium_monthly"])
if let product = products.first {
    let result = try await product.purchase()
    if case .success(let verification) = result,
       case .verified(let transaction) = verification {
        // grant access and notify your server
        await transaction.finish()
    }
}
```

- Listen to `Transaction.updates` from app launch, since purchases can complete outside the current session.
- For local debugging use a **StoreKit Configuration File** in Xcode, then Sandbox accounts.

## Android: Google Play Billing

- Add the **Google Play Billing Library** and connect a `BillingClient`.
- Load products with `queryProductDetailsAsync` and start a purchase with `launchBillingFlow`.
- **Acknowledge** the purchase or consume it. Google automatically refunds purchases that are not acknowledged within a few days.
- Test with **license testers** in Play Console.

## Server-side validation

Never trust the client; the server grants access.

- **Apple**: verify transactions with the **App Store Server API** and receive **App Store Server Notifications** for renewals, cancellations and refunds.
- **Google**: verify the purchase token with the **Google Play Developer API** and subscribe to **Real-time developer notifications** through Cloud Pub/Sub.
- Store the subscription status, expiry date and original transaction ID in your database, linked to the user account.

## Free trials

- **Apple**: introductory offers come as a free trial, pay as you go or pay up front. Eligibility is usually once per subscription group.
- **Google**: trials and discounts are configured as **offers** inside a base plan, with eligibility rules.
- On the paywall, show **when billing starts** and the price after the trial. Hidden terms are a common rejection reason.

## Restoring purchases

- Apple requires a **Restore Purchases** option for non-consumables and subscriptions. StoreKit 2 provides `AppStore.sync()` and `Transaction.currentEntitlements`.
- On Android, call `queryPurchasesAsync` at launch to pick up active purchases.
- If you have your own accounts, tie purchases to them so access carries over to a new device.

## When to use RevenueCat and similar tools

**RevenueCat**, Adapty and Qonversion handle server-side validation, webhooks, a single entitlement status across iOS and Android, and subscription analytics.

- **A good fit** when you need to launch quickly and lack resources for your own subscription backend.
- **Your own server** when you need full control over data and logic or already run a mature billing system.

These services have their own pricing models, so compare them with the cost of building and maintaining it yourself.

## FAQ

### Can I charge for digital features through my own payment provider?

Generally not: stores require their own billing systems for digital content used in the app. Exceptions depend on the app category and region and change regularly, so check the current rules.

### Do I need a server if purchases are verified on the device?

A small app without user accounts can start with on-device verification. Subscriptions, multiple platforms and fraud protection call for a server or a service such as RevenueCat.

### How do I test purchases without paying real money?

On iOS use a StoreKit Configuration File in Xcode and Sandbox accounts; on Android use license testers in Play Console. Test accounts are not charged.
