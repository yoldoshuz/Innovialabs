---
title: In-App Purchases vs Payme and Click: When Each Is Allowed
description: Which mobile app payments must go through In-App Purchase and Google Play Billing, and when you can use Payme, Click or regular bank cards instead.
summary: Digital things used inside the app (subscriptions, premium features, game currency) must be sold through the store's in-app purchases; physical goods and real-world services can be paid with Payme, Click or cards.
---

## The short answer

The App Store and Google Play share one basic rule: **digital goes through in-app purchases, physical goods and real-world services can use any payment system**.

- If the user pays for something consumed **inside the app** — premium features, a subscription, game currency, digital content — you must use **In-App Purchase** (Apple) and **Google Play Billing** (Google).
- If the payment is for **physical goods** or **real-world services** — delivery, taxi, bookings, repairs, bill payments — in-app purchases are not required, and Apple explicitly does not allow them for these cases. Here you connect Payme, Click, bank acquiring, or Apple Pay and Google Pay through a payment provider.

Some countries have exceptions such as alternative billing or permitted external links. They are not universal and come with conditions, so for an app aimed at Uzbekistan, build around the basic rule.

## Where the line is

| What you sell | How to accept payment |
|---|---|
| Subscription to premium app features | IAP / Google Play Billing |
| Game currency, boosts, skins | IAP / Google Play Billing |
| Video course watched in the app | IAP / Google Play Billing |
| Online store goods with delivery | Payme, Click, cards |
| Taxi, food delivery, doctor appointments, hotel bookings | Payme, Click, cards |
| Bill payments, transfers, balance top-ups | Payme, Click, cards |

For borderline cases ask one question: **where is the purchased thing consumed?** If the result exists only in the app, it is a digital good. If it is delivered by a courier, performed by a person offline or fulfilled outside the app, it is a real-world service.

Some categories sit in between. Apple, for example, describes real-time one-to-one services (a tutor, a medical consultation) separately: they may use external payment methods, while group online classes usually require IAP. Google words its rules differently, so check both policies for such cases: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#payments) and [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738).

## What gets apps rejected

- **Digital features sold through Payme, Click or a card form** inside the app.
- **A "pay less on our website" button or text** for digital content. Some regions have relaxed this, but it is not the general case.
- **Payments hidden during review** and switched on after approval. This risks not just a rejection but termination of the developer account.
- **Physical goods sold through IAP.** In-app purchases are not meant for real products, and Apple will reject this.
- **Unlock codes bought on a website** while the same features cannot be bought through IAP. Apple allows access to purchases made on other platforms, but generally only if those items are also available as in-app purchases.

## How Payme and Click fit into an app

Technically, the flow is the same for most local providers:

1. Your company signs a contract with the payment system as a **merchant** and receives integration credentials.
2. The order is created on **your server**: amount, items, user.
3. The app opens the provider's checkout page (in a browser or WebView) or uses its mobile SDK if one exists.
4. The provider sends a payment notification to your server, which verifies the signature and updates the order status.
5. The app reads the status from the server instead of trusting a "payment successful" screen.

Merchant secret keys live **only on the server**, never in the app code.

Legally, your company is the seller: a contract with the provider, a public offer, refund terms and fiscal receipts as required by Uzbek law. Confirm fiscalization details and product codes with the provider and your accountant. The app store is not part of these transactions and takes no commission on them.

## Common mistakes

- **A mixed model with no separation.** An online store that also sells e-books or video lessons through Payme. The digital part has to move to IAP.
- **Empty reviewer notes.** Explain that you sell physical goods or services and provide a test account.
- **Setting up IAP too late.** Agreements, tax and banking details in App Store Connect and Play Console take time, so start early.
- **No cancellation and refund flows.** Reviewers and users will check them first.

## FAQ

### Can I sell a subscription through Payme if it is cheaper there?

Not if the subscription unlocks digital features of the app. You can sell it on your website, but you cannot direct users there from the app, except in regions where the rules explicitly allow it.

### Does an online store need in-app purchases?

No. Physical goods use regular payment systems: Payme, Click, bank acquiring, or Apple Pay and Google Pay through a payment provider.

### What if the product combines digital and physical?

Split payments by type: digital through IAP and Play Billing, goods and real-world services through Payme or Click. Describe this setup in the review notes to answer questions in advance.
