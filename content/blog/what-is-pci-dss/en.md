---
title: What Is PCI DSS and What It Means for Your Online Store
description: Why the PCI DSS card data security standard exists, what the compliance levels are, and how hosted payment pages and tokenization shrink an online store's obligations.
summary: PCI DSS is the mandatory card data security standard for anyone who accepts cards; a store that sends card entry to its payment provider's page and only works with tokens keeps its obligations to a minimum.
---
## The short answer

**PCI DSS** (Payment Card Industry Data Security Standard) is the security standard for payment card data. It is maintained by the **PCI SSC**, a council founded by the major international card brands, including Visa and Mastercard.

It applies to everyone who **accepts, processes, stores or transmits** cardholder data from those brands: stores, payment providers, hosting companies and processors. Compliance is enforced not by governments but by the card brands through your **acquiring bank**. Breaches and violations can lead to fines and, in the worst case, losing the ability to accept cards.

## Why it exists

A card number, expiry date and CVV are all a fraudster needs to pay online. A breach at a single store can affect thousands of cardholders. PCI DSS sets a common baseline of protection:

- a secured network with firewalls;
- encryption of card data at rest and in transit;
- a ban on storing **CVV and magnetic stripe data** after authorization;
- access control and activity logging;
- regular software updates, vulnerability scans and penetration tests;
- a security policy and staff training.

## Compliance levels

A store's merchant level depends on its **annual number of card transactions**. Visa's classification as an example:

| Level | Transactions per year | How compliance is validated |
|---|---|---|
| **1** | Over 6 million, or any merchant after a breach | Audit by a Qualified Security Assessor (QSA) |
| **2** | 1 to 6 million | Self-Assessment Questionnaire (SAQ), sometimes an audit |
| **3** | 20,000 to 1 million online transactions | Self-Assessment Questionnaire |
| **4** | Under 20,000 online transactions | Self-Assessment Questionnaire, as required by the acquirer |

Other card brands use similar but not identical thresholds. Your acquirer or payment provider will tell you your exact level and reporting requirements.

Beyond the level, the **SAQ type** matters. It depends on how you take payments:

- **SAQ A**: card details are entered only on the provider's page (redirect or iframe). The shortest list of requirements.
- **SAQ A-EP**: the form is on your site but data goes straight to the provider. Your site affects payment security, so there are more requirements.
- **SAQ D**: you receive and process card data on your own servers. The full scope of the standard.

## How to reduce your obligations

The core principle: **don't touch card data**. What isn't on your servers can't leak from them.

**Hosted payment page.** The customer clicks "Pay" and lands on the payment provider's page, such as Stripe Checkout or a local provider's checkout. The card number is entered there, and your site only receives the result: paid or not.

**Embedded provider fields (iframe).** The form looks like part of your site, but the card fields are technically loaded from the provider's servers.

**Tokenization.** After the first payment, the provider keeps the card and gives you a **token**: a random string that is useless outside its system. For subscriptions and repeat purchases, you charge the token without ever seeing the card number.

```json
{
  "customer_id": "c_1042",
  "payment_token": "tok_8f3a91c2",
  "card_last4": "4242",
  "card_brand": "visa"
}
```

This is what's fine to keep in your database: the token, the last four digits and the card brand. Never the full number or the CVV.

## Common mistakes

- Logging requests that contain card data in debug logs.
- Asking customers to send their card number by chat or email.
- Assuming site security doesn't matter because the provider takes the payment: a compromised page can swap the payment link.
- Not updating the CMS and plugins on a site with a payment form.

## FAQ

### Do I need PCI DSS if I accept payments through Payme or Click?

PCI DSS covers cards from the international card brands. If you redirect customers to the provider's page and never handle card data yourself, most of the burden sits with the provider. Check your contract and the provider's documentation for what's required on your side, including for local cards.

### Can I store a card number for repeat payments?

You shouldn't. Use the provider's tokenization: repeat charges work just the same, and the full card number never sits with you.

### Where can I find the official requirements?

The standard and the SAQ forms are published on the [PCI Security Standards Council website](https://www.pcisecuritystandards.org/).
