---
title: How to Create a Strong Password You Can Actually Remember
description: How passwords get cracked, why length matters more than symbols, how to build a memorable passphrase and why reusing passwords is the biggest risk.
summary: A strong password is long and random, not clever: use a passphrase of four to six random words for the few passwords you must remember, keep every password unique, and let a password manager remember the rest.
---
## The short answer

A strong password is **long, random and used in only one place**. The easiest way to get there is a **passphrase** — several random words, for example `lantern-cactus-violin-harbor-pepper`. It is easy to remember, easy to type and much harder to guess than `P@ssw0rd2024!`.

## How passwords actually get cracked

Attackers rarely "guess" by hand. They use automated methods:

- **Brute force** — trying every possible combination. Hopeless against long passwords, fast against short ones.
- **Dictionary attacks** — trying real words, names, leaked passwords and their common variations. Cracking tools apply **rules**: capitalize the first letter, swap `a` for `@`, add a year or `!` at the end. That is why `Summer2024!` falls quickly despite "having everything".
- **Credential stuffing** — taking email and password pairs from old data breaches and trying them on other services. No cracking needed: if you reused the password, the attacker simply logs in.
- **Offline cracking** — when a service is breached and password hashes leak, attackers test guesses on their own hardware, with no login limits. This is where weak passwords fail the fastest.

## Why length beats complexity

Every extra character multiplies the number of combinations an attacker has to try. Adding length grows that number far faster than adding a few symbol types.

Simple math shows it:

| Password type | Possible combinations |
|---|---|
| 8 random characters from all keyboard symbols | about 6.6 × 10^15 |
| 4 random words from a 7,776-word list | about 3.7 × 10^15 |
| 6 random words from a 7,776-word list | about 2.2 × 10^23 |

Four random words are roughly as hard as eight random symbols, but far easier to remember. Six words are dramatically stronger. The key word is **random**: a phrase you invented, a famous quote or a song line is in attackers' dictionaries.

## How to build a passphrase

1. Pick **4–6 words at random** — roll dice with a word list (the Diceware method) or use the generator in a password manager. Do not choose words yourself: people pick predictable ones.
2. Join them with a separator: hyphens, spaces or dots.
3. If a site demands a digit or capital letter, add them in a fixed way you will remember, for example `Lantern-cactus-violin-harbor-7`.
4. Make a short mental picture of the words — a lantern on a cactus playing the violin in a harbor. It sticks after a few uses.

## Reuse is the biggest risk

A perfect password used on ten sites is only as safe as the weakest of those ten. When one of them leaks, credential stuffing opens the rest. That is why:

- **Every account gets its own password.** No exceptions for "unimportant" sites — they leak most often.
- Remember only a few passphrases: the **password manager** master password, your main email, and your device login.
- Let the password manager generate and store all other passwords — random strings of 16+ characters you never need to see.
- Turn on **two-factor authentication** for email, banking and messengers, so a leaked password alone is not enough.

## Common mistakes

- Personal data: names, birthdays, phone numbers, pet names.
- Keyboard patterns: `qwerty`, `1q2w3e4r`.
- Changing one digit when forced to update: `Password1` → `Password2`.
- Storing passwords in a note on your phone or a spreadsheet.
- Sending passwords in chats and email.

Current NIST guidance also recommends against forcing regular password changes without reason: change a password when there is a sign it has leaked.

## FAQ

### How long should my password be?

For passwords you remember, use at least four random words, and five or six for the master password of a password manager. For generated passwords stored in a manager, 16 or more random characters is a good default.

### How do I know if my password has leaked?

Check your email address in a breach notification service such as Have I Been Pwned, and enable leak alerts in your password manager or browser. If an account appears in a leak, change that password and every place it was reused.

### Is it safe to save passwords in the browser?

The built-in managers in modern browsers are much better than reusing passwords or keeping them in a notes app. Protect the browser profile with a strong account password and 2FA. A dedicated password manager adds easier sharing and works across different browsers.
