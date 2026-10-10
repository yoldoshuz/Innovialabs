---
title: How to Register Apple and Google Developer Accounts from Uzbekistan
description: Individual vs organization accounts, the D-U-N-S number, paying fees with local cards, identity verification and the usual pitfalls for developers in the CIS.
summary: Decide early who owns the account: an individual needs a passport and an international card, a company needs a D-U-N-S number whose data matches the official registry; most problems come from mismatched names, addresses and card details.
---

## The short answer: what you need

To publish apps you need two accounts:

- **Apple Developer Program**: a paid membership renewed every year.
- **Google Play Console**: a one-time registration fee.

For both you will need:

- an identity document (usually an international passport with a Latin-script name);
- an **international Visa or Mastercard** that works for online payments in foreign currency;
- for a company: a **D-U-N-S number**, a website and a work email on the company domain.

Local Uzcard and Humo cards do not work for these payments. Ask your bank whether your international card is enabled for online purchases abroad.

## Individual or organization

| | Individual | Organization |
|---|---|---|
| Seller name in the store | Your first and last name | The company's legal name |
| Documents | Passport | D-U-N-S, legal entity data, signing authority |
| Speed | Faster | Slower due to company verification |
| Team access | Limited | Roles and permissions for staff |
| Best for | Personal projects, freelancing | Company products and client apps |

If the app is built for a business, register as an **organization** from the start. Transferring an app from a personal account to a company one is possible but adds paperwork.

## The D-U-N-S number

**D-U-N-S** is a nine-digit company identifier issued by Dun & Bradstreet. Apple and Google use it to confirm that an organization exists.

- Check whether your company already has one with the D-U-N-S lookup tool on the Apple Developer site. For Apple developers, getting a number is free.
- The name and address must **match exactly** across the government registry and your application: transliteration, legal form, building number.
- Issuing a new number or updating data takes time, so build it into your release plan.

## Enrolling in the Apple Developer Program

1. Create an **Apple ID** and turn on **two-factor authentication**.
2. Enter your name **in Latin script exactly as in your passport**. Changing it later is difficult.
3. Start enrollment on the Apple Developer website or in the Apple Developer app; in some countries the app verifies identity with a document scan.
4. For an organization, provide the D-U-N-S number, the company website and a person with signing authority. Apple may call to verify.
5. Pay for the membership. If payment fails, contact Apple Developer Support instead of creating a new Apple ID.

For paid apps and in-app purchases, also accept the **Paid Applications Agreement** in App Store Connect and fill in tax and banking details for payouts.

## Registering in Google Play Console

1. Sign in with the Google account that will be the **owner**, ideally a dedicated one rather than a personal account.
2. Choose the type: **personal** or **organization**.
3. Pay the registration fee and complete **identity verification** with a document; organizations also go through D-U-N-S verification.
4. Confirm your contact phone number and email.

Note: **new personal accounts** must run a **closed test** with a minimum number of testers for a set period before releasing to production. Check Play Console for the current requirements.

To sell apps or subscriptions you need a **payments profile with a merchant account**. Check whether your country is on Google Play's list of supported merchant locations.

## Common pitfalls

- The **name does not match** the passport or the cardholder.
- Paying with **someone else's card**, which often fails payment or verification.
- Registering through a VPN from a different country than your documents.
- Company data in D-U-N-S is **outdated** or written differently than in the application.
- The account is registered to a freelancer instead of the client, which makes handover hard.
- Losing access to the phone number used for two-factor authentication.

## FAQ

### Can I register as a sole proprietor?

Apple and Google usually expect a legal entity with a D-U-N-S number for organization accounts, and a sole proprietor often enrolls as an individual. Check each platform's help for your business type before applying.

### How long does approval take?

Individuals are usually approved faster; organizations take longer because of D-U-N-S and company checks. Neither platform guarantees exact timelines, so start well before your release.

### Who should own the account if a contractor builds the app?

The client should. Register the account to the client's company and give the contractor access through roles. That way the app and its revenue stay with the business if the team changes.
