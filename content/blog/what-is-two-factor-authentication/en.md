---
title: What Is Two-Factor Authentication (2FA) and Why Turn It On
description: What authentication factors are, how 2FA stops account takeovers after a password leak, which accounts to protect first and how to store backup codes.
summary: Two-factor authentication asks for a second proof of identity, such as a code from your phone, on top of the password, so a stolen password alone no longer opens the account; turn it on first for email, Google or Apple, banking and Telegram.
---
## The short answer

**Two-factor authentication (2FA)** means that to sign in you need two different kinds of proof: usually your **password** and something only you have, such as a **code from your phone** or a **security key**. If your password leaks or is guessed, the attacker still cannot get in without the second factor.

It takes a few minutes to set up and blocks the most common way accounts are stolen.

## The three types of factors

| Factor | What it is | Examples |
|---|---|---|
| **Knowledge** | Something you know | Password, PIN, answer to a question |
| **Possession** | Something you have | Phone with an authenticator app, SMS code, hardware key |
| **Inherence** | Something you are | Fingerprint, face recognition |

2FA requires factors from **two different groups**. A password plus a secret question is not 2FA — both are "something you know" and can leak together.

Many services call this **multi-factor authentication (MFA)** or **two-step verification**. For a user the idea is the same.

## Why it stops most account takeovers

Accounts are usually taken over in bulk, not one by one:

- passwords from old breaches are tried on other sites (credential stuffing);
- phishing pages collect logins and passwords;
- malware steals passwords saved on a computer.

In all these cases the attacker has your password, but not your phone or key. With 2FA turned on, an automated attack stops at the second step. 2FA is not absolute — a sophisticated phishing page can ask you for the code in real time — but it removes the easy, mass attacks.

## Where to turn it on first

1. **Main email.** Password resets for almost everything else go there. Whoever controls your email controls your other accounts.
2. **Google or Apple account.** They hold email, backups, photos, saved passwords and access to your phone.
3. **Banking and payment apps.** Most already require a second factor; check that notifications and limits are on too.
4. **Telegram.** Login normally uses an SMS code, so enable **Two-Step Verification** in Privacy and Security settings: it adds a cloud password that is required on every new device. Do the same with the PIN in WhatsApp.
5. **Work accounts:** corporate email, cloud services, hosting, domain registrar, GitHub, CRM, admin panels of your website.
6. **Social networks**, especially if they are linked to a business page or advertising account.

## How to turn it on

- Open the account's security settings and find "Two-factor authentication", "2-Step Verification" or "Two-step verification".
- Choose the method. An **authenticator app** (TOTP) or a **security key** is better than SMS; SMS is still far better than nothing.
- Scan the QR code with the app and enter the code to confirm.
- **Save the backup codes** before closing the page.

## How to keep backup codes

Backup codes are one-time codes that let you in if you lose your phone. Each code works once.

- Store them in a **password manager** or **printed** in a safe place at home.
- Do not keep them only in the email account they protect, or only on the phone that is the second factor.
- After using a code, cross it out; when only a few are left, generate a new set.
- Add a **second method** where possible: a spare key, another device with the authenticator, or a trusted phone number.

## FAQ

### What happens if I lose my phone?

Sign in with a backup code or your second method, then remove the lost device from the account and set up 2FA on the new phone. Without backup codes, recovery goes through the service's support and can take a long time.

### Does 2FA protect against phishing?

Partly. SMS and app codes can be stolen by a fake page that forwards them to the real site. Security keys and passkeys are tied to the real domain and do not work on fake sites, so they protect much better.

### Is 2FA via SMS good enough?

It is better than a password alone, but SMS can be intercepted or redirected through a SIM swap. For email and work accounts, an authenticator app or a hardware key is a safer choice.
