---
title: What Are Passkeys and Will They Replace Passwords
description: How passkeys use public-key cryptography, why phishing does not work against them, how they sync between devices and what developers need to add passkey login.
summary: A passkey is a pair of cryptographic keys that replaces a password: the private key stays on your device and unlocks with a fingerprint, face or PIN, the site keeps only the public key, and a fake site cannot use it, so phishing and password leaks stop working.
---
## The short answer

A **passkey** is a way to sign in without a password. Instead of a secret you type, your device creates a **pair of keys** for each site: a private key that stays with you and a public key that the site stores. You confirm sign-in with the same thing that unlocks your phone or laptop — fingerprint, face or PIN.

Passkeys will not make passwords disappear overnight, but for major services they are already becoming the main way to sign in.

## How it works

Passkeys are built on the **FIDO2 / WebAuthn** standards and public-key cryptography:

1. **Registration.** Your device generates a key pair for the site. The **private key** stays in secure storage on the device or in your password manager. The site receives only the **public key**.
2. **Sign-in.** The site sends a random **challenge**. Your device asks you to confirm with biometrics or PIN, then signs the challenge with the private key.
3. **Verification.** The site checks the signature with the stored public key. If it matches, you are in.

Your fingerprint or face **never leaves the device** — it only unlocks the local key. And the site never has anything that would let someone log in as you.

## Why phishing does not work

A password can be typed into any page that looks right. A passkey cannot:

- Each passkey is **bound to the site's domain**. The browser will not offer a passkey for `example.com` on `examp1e-login.com`.
- There is **nothing to type or retype**, so there is no code to trick out of you.
- If the site's database leaks, attackers get only **public keys**, which are useless for signing in.
- Every site gets its own key pair, so there is no reuse and no credential stuffing.

## Sync and devices

- **Synced passkeys** are stored in iCloud Keychain, Google Password Manager or a third-party password manager and appear on all your devices with that account.
- **Device-bound passkeys** live on one device, for example a hardware security key, and never get copied. Companies use them for high-risk accounts.
- **Signing in on another device:** if a computer has no passkey, it can show a QR code; you scan it with your phone, which confirms the login over a short-range Bluetooth check that the phone is physically nearby.

## Current support

Passkeys work in current versions of the main operating systems and browsers, and many large services — email providers, marketplaces, payment and developer platforms — already offer them. Support differs in details: some services use passkeys as a second factor, others as a full password replacement.

What still needs care:

- **Account recovery** — if you lose all devices, the service still needs a safe way back in.
- **Moving between ecosystems** — passkeys sync well inside one platform; moving them between providers is still being standardized.
- **Shared accounts** — sharing passkeys is possible in some password managers, but it is less straightforward than sharing a password.

## What developers need to add passkey login

1. **Use a maintained server library** for WebAuthn in your language instead of verifying signatures yourself.
2. **Registration endpoint:** generate options (challenge, your relying party ID — your domain, user handle), call `navigator.credentials.create()` in the browser, verify the response on the server.
3. **Store per credential:** credential ID, public key, signature counter, user ID, creation date and a readable name. Allow **several passkeys per account**.
4. **Sign-in endpoint:** issue a fresh challenge, call `navigator.credentials.get()`, verify the signature and the challenge.
5. **Autofill UI:** let the browser suggest passkeys right in the login field.

```html
<input type="text" name="username" autocomplete="username webauthn">
```

```js
const credential = await navigator.credentials.get({
  publicKey: optionsFromServer, // challenge, rpId, etc.
  mediation: "conditional",
});
```

6. **Keep a fallback** — password plus 2FA or email login — and a clear recovery flow. Offer passkey creation after a successful sign-in, when the user is already verified.
7. On mobile apps, link the app to your domain (associated domains on iOS, Digital Asset Links on Android) so the same passkeys work on web and in the app.

The [passkeys.dev](https://passkeys.dev) developer guide collects up-to-date support details and implementation patterns.

## FAQ

### Is a passkey safe if someone steals my phone?

The passkey cannot be used without unlocking the device with your biometrics or PIN. Protect the phone with a strong screen lock and make sure you can remove the device from your accounts remotely.

### Do I still need 2FA with passkeys?

A passkey already combines two factors: something you have (the device) and something you know or are (PIN or biometrics). Services usually do not ask for an extra code after a passkey sign-in.

### Will passwords disappear completely?

Not soon. Old systems, shared accounts and recovery flows still depend on passwords. Expect a long period where passkeys are the main option and passwords remain as a fallback.
