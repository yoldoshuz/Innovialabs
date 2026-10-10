---
title: SMS vs Authenticator App vs Security Key: Which 2FA to Use
description: How SMS codes, TOTP apps, push prompts and FIDO2 security keys differ in real risks, and which 2FA method to choose for personal and business accounts.
summary: SMS is the weakest 2FA because of SIM swaps and interception, an authenticator app is a solid default, and FIDO2 security keys or passkeys are the only common option that resists phishing, so use them for email, admins and finance.
---
## The short answer

All 2FA methods are better than a password alone, but they are not equal:

- **SMS** — the weakest: codes can be redirected or intercepted.
- **Authenticator app (TOTP)** — a good default for most accounts.
- **Push confirmation** — convenient, but vulnerable to "approve" spam unless it shows a number to match.
- **Hardware security key (FIDO2)** and **passkeys** — the strongest: they do not work on phishing sites at all.

## SMS codes

**How it works:** the service sends a one-time code to your phone number.

**Risks:**

- **SIM swap** — an attacker convinces or bribes a mobile operator to issue a new SIM card for your number. From that moment all codes go to them.
- **Interception** — weaknesses in mobile network protocols and malware on the phone that reads incoming SMS.
- **Phishing** — a fake login page asks for the code and immediately uses it on the real site.
- Practical issues: no signal when travelling, a changed number locks you out.

SMS is acceptable where nothing else is offered. If a service supports a better method, switch and, if possible, **remove the phone number as a recovery option**, otherwise the attacker just picks the weakest path.

## Authenticator apps (TOTP)

**How it works:** during setup the service and the app share a secret key (the QR code). The app then generates a new 6-digit code every 30 seconds from that secret and the current time. The standard is called **TOTP**, and it works offline.

**Strengths:** no dependency on the mobile operator, no SIM swap risk, works in any app that supports the standard.

**Weaknesses:**

- Codes are still **phishable**: a fake page can relay them in real time.
- The secret must be protected. Choose an app with **encrypted backup** or export, or you lose everything with the phone.
- If someone sees the QR code during setup, they can clone your codes.

## Push confirmations

**How it works:** the service sends a prompt to your app — "Is this you signing in?" — and you tap Approve.

**Main risk — push fatigue (MFA bombing):** an attacker with your password triggers dozens of prompts, often at night, until you tap Approve by mistake or just to make them stop. Sometimes they add a call pretending to be IT support.

Protection: **number matching** (you type a number shown on the login screen into the app), showing location and app details, limiting the number of prompts. Never approve a request you did not start.

## Hardware keys and passkeys (FIDO2)

**How it works:** the key stores a private key that never leaves the device. When you sign in, the browser tells the key which **domain** is asking, and the key signs a challenge only for the domain it was registered with. A look-alike phishing domain gets nothing.

**Strengths:** **phishing-resistant**, nothing to type or relay, no secret stored on the server that could leak. Keys connect by USB, NFC or Bluetooth. **Passkeys** use the same standard, with the key stored in your phone or password manager.

**Weaknesses:** a hardware key has to be bought, and if you lose your only key you need a recovery path. Not every service supports it yet.

## Comparison

| Method | Phishing | SIM swap | Works without phone signal | Convenience |
|---|---|---|---|---|
| SMS | Vulnerable | Vulnerable | No | High |
| TOTP app | Vulnerable | Protected | Yes | Medium |
| Push | Vulnerable to fatigue | Protected | No | High |
| FIDO2 key / passkey | **Protected** | Protected | Yes | High once set up |

## What to choose

**Personal accounts**

- Main email, Google or Apple account, password manager: **passkey or security key** if supported, otherwise a TOTP app.
- Banking: whatever the bank offers, plus notifications on all transactions.
- Everything else: TOTP app with encrypted backup.
- Register **two keys** — one for daily use, one stored safely.

**Business accounts**

- Admins, finance, domain registrar, hosting, code repositories: **FIDO2 keys or passkeys only**.
- Everyone else: at least TOTP or push with number matching; turn off SMS where the platform allows.
- Enforce 2FA through policies in your identity provider, not by asking people.
- Write a recovery procedure: who verifies identity and how, when an employee loses their key.

## FAQ

### Is SMS 2FA worse than no 2FA?

No. Even SMS stops attacks that rely only on leaked passwords. It is just the first method to replace when a better one is available.

### Can I use one security key for all my accounts?

Yes, one key can be registered on many services. But always register a second, backup key, so losing one does not lock you out.

### Are passkeys the same as security keys?

They use the same FIDO2 standard and are equally phishing-resistant. The difference is where the private key lives: in a separate hardware device, or synced across your devices by a password manager or the operating system.
