---
title: How to Store Passwords Securely: bcrypt, scrypt and Argon2
description: Why MD5 and SHA-256 fail for passwords, what salts and work factors do, how to tune Argon2 and bcrypt, and how to migrate legacy hashes safely.
summary: Store passwords only as a slow, salted hash made with Argon2id, scrypt or bcrypt, never as plain MD5 or SHA. Move legacy hashes to the new algorithm gradually, each time a user logs in.
---

## The short answer

Never store passwords in plain text, and do not encrypt them either. Run them through a **dedicated password hashing function** (**Argon2id**, **scrypt** or **bcrypt**) and store the result. At login, hash the submitted password again and compare.

For a new project, choose **Argon2id**. If your stack lacks good support for it, scrypt or bcrypt are fine. MD5, SHA-1 and even plain SHA-256 are not suitable for passwords.

## Why MD5 and SHA fail

MD5 and SHA were designed for integrity checks, and their key property is **speed**. For passwords that is a weakness: once a database leaks, attackers can test guesses on GPUs at enormous rates.

What goes wrong with a plain hash:

- **Identical passwords produce identical hashes.** You can see who shares a password, and cracking one exposes all of them.
- **Rainbow tables.** Hashes of common passwords are precomputed, so cracking becomes a lookup.
- **Fast guessing.** Wordlists with mutation rules ("Password1!", "qwerty2024") run through in minutes.

Double hashing (`md5(sha1(p))`) or a "secret" salt hardcoded in the app does not fix this, because the speed stays the same.

## What salt and work factor do

A **salt** is a random value, unique per password. It is stored next to the hash and is not a secret. Salts make identical passwords hash differently and defeat rainbow tables.

A **work factor** (cost) makes each hash computation deliberately slow. A user will not notice the delay, but every guess becomes expensive for an attacker.

Modern libraries generate the salt for you and encode it, together with the parameters, in the hash string itself, such as `$argon2id$v=19$m=19456,t=2,p=1$...`. You do not need a separate salt column.

## Comparing the algorithms

| Algorithm | Tunable | Notes |
|---|---|---|
| **Argon2id** | memory, iterations, parallelism | Memory-hard, resists GPU cracking. The default choice |
| **scrypt** | N (memory and time), r, p | Also memory-hard, widely available |
| **bcrypt** | cost (log2 of rounds) | Battle-tested and everywhere. Only uses the first 72 bytes of input |
| PBKDF2 | iterations | Use when FIPS compliance is required. CPU-bound only |

## How to pick parameters

1. Start from the **OWASP Password Storage Cheat Sheet**, which lists current minimum settings for each algorithm.
2. Benchmark on your production hardware. Aim for a fraction of a second per hash so logins stay fast and the server survives peak load.
3. Watch memory: Argon2 with a high memory setting can exhaust RAM under many concurrent logins.
4. Revisit parameters when hardware changes and raise them over time.

Python example with `argon2-cffi`:

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()  # safe defaults

stored = ph.hash("user-password")

try:
    ph.verify(stored, "user-password")
    if ph.check_needs_rehash(stored):
        stored = ph.hash("user-password")  # parameters outdated, re-save
except VerifyMismatchError:
    pass  # wrong password
```

In Node.js with bcrypt: `await bcrypt.hash(password, 12)` and `await bcrypt.compare(password, hash)`. In PHP: `password_hash()`, `password_verify()` and `password_needs_rehash()`.

## Migrating legacy hashes on login

You do not know users' passwords, so you cannot recompute the whole table at once. A proven approach:

1. Add a field for the hash algorithm, or detect it from the hash prefix.
2. At login, verify the password the old way.
3. If it matches, immediately compute an Argon2id hash and overwrite the record.
4. Protect inactive users right away by wrapping the old hash (`argon2(md5(password))`), then replace it with pure Argon2id on their next login.
5. After a reasonable period, delete any remaining legacy hashes and ask those users to reset their password.

## Common mistakes

- Comparing hashes with `==` instead of the library's verify function (timing attacks).
- Lowering the cost "because it is slow". Rate-limit login attempts instead.
- Logging passwords in request or error logs.
- Truncating passwords or banning long passwords and special characters.
- No rate limiting or 2FA. Even a perfect hash will not stop guessing through the login form.

## FAQ

### Can I just encrypt passwords with AES?

No. Encryption is reversible: if the key is stolen along with the database, every password is exposed. A hash is one-way, and you never need the original to verify a login.

### Do I need a pepper?

A pepper is an extra secret stored outside the database, for example in a secrets manager. It helps if only the database leaks, but makes rotation harder. It complements Argon2 or bcrypt rather than replacing them.

### What about bcrypt's 72-byte limit?

It is enough for most passwords. If you allow very long passphrases, choose Argon2id, which has no such limit.
