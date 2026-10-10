---
title: What Is 3D Secure and How It Affects Checkout Conversion
description: How 3D Secure and 3DS2 verify the cardholder, shift fraud liability to the bank, and how frictionless flows keep checkout fast for honest buyers.
summary: 3D Secure is an extra check by the card-issuing bank that confirms the buyer really owns the card; it shifts fraud liability from the store to the bank, and with 3DS2 most honest buyers pass it silently without any extra step.
---
## The short answer

**3D Secure (3DS)** is a protocol that lets the bank that issued a card confirm that the person paying online is its real owner. The card networks brand it differently — Visa Secure, Mastercard Identity Check and others — but the idea is the same: before the payment is authorised, the issuer gets a chance to verify the buyer.

For a store it brings two things:

- **Less fraud.** Stolen card details alone are not enough to pay.
- **Liability shift.** If a payment was successfully authenticated with 3DS and later turns out to be fraudulent, the chargeback cost usually moves from the merchant to the issuing bank.

The price is a possible extra step at checkout. Whether that step hurts conversion depends mostly on which version of 3DS is used and how well it is implemented.

## Who takes part

Three "domains" give the protocol its name:

- **Acquirer domain** — the store, its payment provider and the **3DS Server** that starts authentication (usually provided by the gateway, so you do not build it yourself).
- **Interoperability domain** — the card network's **Directory Server**, which routes the request to the right bank.
- **Issuer domain** — the bank's **ACS (Access Control Server)**, which decides whether to trust the buyer.

## 3DS1 vs 3DS2

The first version always sent the buyer to a bank page to type a static password or an SMS code. It was often poorly adapted to phones, and buyers abandoned it.

**3DS2 (EMV 3-D Secure)** changed the logic:

- The store sends the bank **much more context**: device data, billing and shipping address, email, phone, purchase history with the merchant.
- The bank runs **risk-based authentication** on that data.
- If the risk is low, the payment goes through the **frictionless flow** — the buyer sees nothing extra.
- If the risk is higher, the bank triggers a **challenge flow**: a one-time code, a confirmation in the banking app or biometrics.
- It supports **native mobile SDKs**, so the challenge can appear inside the app instead of a clumsy web redirect.

| | 3DS1 | 3DS2 |
|---|---|---|
| Extra step for buyer | Almost always | Only when risk is higher |
| Data sent to bank | Minimal | Rich device and order context |
| Mobile apps | Web redirect | Native SDK |
| Confirmation methods | Password, SMS | OTP, banking app, biometrics |

## How 3DS affects checkout conversion

Lost payments usually come not from the idea of verification, but from implementation details:

- The SMS code does not arrive or arrives late, and the session times out.
- The challenge page opens in a broken iframe or a new tab the buyer does not notice.
- The store sends minimal data, so the bank challenges almost everyone.
- After a failed check the buyer sees a vague "payment error" with no hint about what to do next.

## How to keep friction low

1. **Use a gateway that supports 3DS2** and enable it fully, not in a "legacy fallback" mode.
2. **Pass all available data**: email, phone, billing address, shipping address. The more context the bank has, the more payments go frictionless.
3. **Use the mobile SDK** in native apps instead of opening a web view.
4. **Explain the step**: a short line like "Your bank may ask you to confirm the payment" reduces surprise.
5. **Handle failures clearly**: show the reason when possible, offer to retry or choose another card.
6. **Track metrics separately**: share of frictionless payments, challenge success rate, drop-off during the challenge, results by issuing bank.
7. **Test with test cards** from your provider for both frictionless and challenge scenarios before launch.

In some regions regulation requires strong customer authentication and defines **exemptions** — for example, for low-value payments or recurring charges initiated by the merchant. Whether you can request an exemption depends on your region and your payment provider.

## Local cards and 3DS

3DS is a mechanism of international card networks. In Uzbekistan, payments with local **Uzcard** and **Humo** cards through Payme, Click and similar services are, as a rule, confirmed with their own one-time SMS code. If you accept Visa and Mastercard as well, for example through Stripe or an international acquirer, 3DS will apply to those payments.

## FAQ

### Can I turn 3D Secure off to increase conversion?

Sometimes technically possible, but then fraud chargebacks remain your cost, and many issuers decline unauthenticated payments anyway. A better path is a proper 3DS2 implementation with full data so most buyers pass without a challenge.

### Does liability shift protect against all chargebacks?

No. It covers disputes about fraud — "I did not make this payment". Disputes about non-delivery, product quality or refunds are not covered by 3DS.

### Do I need to build a 3DS Server myself?

Almost never. Payment gateways provide 3DS as part of their service; your job is to integrate it correctly, pass the data and handle all outcomes in the interface.
