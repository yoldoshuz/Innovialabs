---
title: PCI DSS: What Businesses Accepting Card Payments Must Know
description: PCI DSS for merchants: compliance levels, SAQ types, how hosted payment pages and tokenization shrink your scope, and mistakes to avoid.
summary: PCI DSS is the card industry security standard for anyone handling card data; the easiest way to comply is to never let card numbers touch your servers by using a hosted payment page or tokenization.
---
## Short answer

**PCI DSS** (Payment Card Industry Data Security Standard) is a set of security requirements from the international card brands: Visa, Mastercard and others. It applies to every business that stores, processes or transmits card data, regardless of size.

The workload depends on **how close card data gets to your systems**. If customers enter card details on your payment provider's page and you only receive a token or a payment status, your obligations shrink to a short questionnaire. If card numbers pass through your servers, you inherit hundreds of controls, audits and scans.

## Compliance levels

Card brands assign merchant levels by annual transaction volume. Thresholds differ by brand; your acquirer or payment provider confirms your level. Visa as an example:

| Level | Transactions per year | How you validate |
|---|---|---|
| 1 | Over 6 million | On-site audit by a QSA, Report on Compliance |
| 2 | 1 to 6 million | Self-Assessment Questionnaire (SAQ) |
| 3 | 20,000 to 1 million e-commerce | SAQ |
| 4 | Under 20,000 e-commerce | SAQ |

Most small and medium businesses are level 3 or 4. For them compliance means completing the right **SAQ** every year, signing an **Attestation of Compliance (AOC)** and, for some SAQ types, passing quarterly external scans by an approved scanning vendor (ASV).

## SAQ types: which one is yours

The SAQ type depends on how you accept payments, not on your size.

- **SAQ A** — e-commerce where the payment page is fully hosted by a PCI-compliant provider (redirect or iframe). The shortest questionnaire.
- **SAQ A-EP** — your site never receives card data but controls the payment page, for example your JavaScript renders the form and posts straight to the provider. Noticeably more requirements.
- **SAQ B / B-IP** — physical stores with standalone terminals.
- **SAQ C-VT** — staff type card details into the provider's virtual terminal.
- **SAQ P2PE** — terminals from a validated point-to-point encryption solution.
- **SAQ D** — everything else, including any setup where card data reaches your servers. In practice, the full standard.

SAQ A is a few dozen questions; SAQ D is hundreds of controls over your network, servers, logs and development process.

## Why hosted pages and tokenization shrink scope

**Scope** is every system that stores, processes or transmits card data, plus everything connected to it. Fewer systems in scope means less to protect and prove.

- **Hosted payment page.** Stripe Checkout, Payme or Click checkout: the customer enters the card on the provider's page or iframe, and you get back a payment status. Your servers never see the number.
- **Tokenization.** A provider's frontend component (Stripe Elements, a card-binding form) sends the card straight to the provider and returns a **token**. Your backend stores and charges only the token, which is worthless outside your account with that provider.
- **Recurring payments** work the same way: you keep a token, not the card.

PCI DSS is formally a standard of the international card brands. For national systems such as Uzcard and Humo, rules come from the processing centers and your provider contract, but the principle is the same: keep card data out of your systems.

## Mistakes that pull card data onto your servers

- **Your own card form posting to your backend**, which forwards the number to the provider's API. Even if nothing is stored, the data passed through you, and you land in SAQ D.
- **Logging request bodies.** Debug logs, API gateways and error trackers quietly record card numbers. Mask fields or disable body logging on payment routes.
- **Storing CVV/CVC.** Security codes must never be stored after authorization, not even encrypted.
- **Third-party scripts on the payment page.** Analytics, chat widgets and session replay tools can read form fields. Keep checkout minimal and control every script on it.
- **Cards through support channels.** Customers send card photos to Telegram, managers write down numbers dictated by phone, and the data settles in chat history and the CRM.
- **Full card numbers "for convenience"** for refunds or repeat orders instead of tokens and the provider's refund API.
- **Ignoring the page that leads to payment.** Even with SAQ A, if your site is hacked an attacker can swap the redirect or iframe for a fake form.

## Practical checklist

1. Confirm your level and SAQ type with your acquirer or provider.
2. Use a hosted page, iframe or tokenization to qualify for SAQ A.
3. Search logs, databases, backups and the CRM for card numbers and delete them.
4. Protect the site: HTTPS, updates, 2FA for admins, minimal scripts on checkout.
5. Ask the provider for its own AOC.
6. Repeat the SAQ yearly and whenever the payment flow changes.

The standard and SAQ forms are in the official [PCI SSC document library](https://www.pcisecuritystandards.org/document_library/).

## FAQ

### Does a small online store need PCI DSS?

Yes, it applies to every business that accepts cards, whatever the turnover. With a hosted payment page, compliance usually comes down to SAQ A, a short annual questionnaire.

### Can we store card numbers if we encrypt them?

The standard allows storing the card number if it is rendered unreadable, but then encryption, key management and the surrounding infrastructure fall into scope. CVV can never be stored. Provider tokens do the same job without that burden.

### What happens if we ignore PCI DSS?

Consequences are set by the card brands and your acquirer through the contract: fines, higher fees or losing the ability to accept cards. After a breach you may also be liable for investigation costs and fraud losses.
