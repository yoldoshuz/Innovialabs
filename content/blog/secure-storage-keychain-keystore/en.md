---
title: Storing Sensitive Data in Mobile Apps: Keychain and Android Keystore
description: Where to keep tokens and keys in a mobile app, why SharedPreferences and AsyncStorage are unsafe for secrets, and the basics of biometrics and pinning.
summary: Keep tokens and keys in the iOS Keychain and under Android Keystore protection, not in SharedPreferences, UserDefaults or AsyncStorage. Tie biometrics to a cryptographic key rather than a yes/no check, and remember that a secret shipped inside the app is not a secret.
---

## Where secrets belong

The short answer:

- **iOS**: the **Keychain**, the system's encrypted store with access controls.
- **Android**: encrypt data with a key from the **Android Keystore**. The key itself never leaves the protected environment (the TEE, or a dedicated StrongBox chip when the device has one), while the encrypted data sits in a file or database.
- **Cross-platform**: use wrappers such as `flutter_secure_storage`, `react-native-keychain` or `expo-secure-store`. Under the hood they use the same Keychain and Keystore.

```dart
const storage = FlutterSecureStorage();
await storage.write(key: "refresh_token", value: token);
final saved = await storage.read(key: "refresh_token");
```

## Why SharedPreferences and AsyncStorage are not enough

`SharedPreferences`, `UserDefaults` and `AsyncStorage` are plain files in the app's folder, **not encrypted**. The OS sandbox keeps other apps out, but that is not much:

- on a rooted or jailbroken device the files can be read directly;
- data can end up in device **backups** unless you exclude it;
- in debug or poorly protected builds the contents are easy to extract;
- malicious code inside your own process, such as a compromised library, sees everything.

These stores are fine for settings: theme, language, an "onboarding done" flag. Not for tokens or keys.

## What to store and how

| Data | Recommendation |
|---|---|
| Access token | Short-lived; in memory or secure storage |
| Refresh token | Keychain / Keystore, deleted on logout |
| Local database encryption key | Generate on the device, store in Keychain / Keystore |
| User password | Do not store it; exchange it for a token |
| Server-side API secret | Do not ship it; keep it on the backend |

The last row matters. Anything compiled into the binary can be extracted by decompiling it. Third-party keys that unlock paid or private operations belong on your server, and the app should go through your backend.

## Keychain accessibility settings

Each Keychain item has an accessibility attribute:

- `WhenUnlocked`: readable only while the device is unlocked;
- `AfterFirstUnlock`: readable after the first unlock since boot, needed for background tasks;
- `ThisDeviceOnly` variants are not carried over to another device through backups.

For tokens, pick the strictest option that does not break background work. Note that on iOS, Keychain items can **survive app deletion**, so check for stale data on first launch and clear it.

## Biometrics: the wrong way and the right way

**Wrong:** show Face ID or a fingerprint prompt, get `true`, then read the token from ordinary storage. On a compromised device that boolean can be faked.

**Right:** bind the key itself to biometrics.

- **iOS**: a Keychain item with access control (`biometryCurrentSet`). The system releases the data only after successful biometric authentication.
- **Android**: a Keystore key with `setUserAuthenticationRequired(true)`, used through `BiometricPrompt` with a `CryptoObject`. Decryption only works after the user confirms.

`biometryCurrentSet` invalidates the key when a new fingerprint or face is enrolled, which protects against someone adding their own biometrics.

## Certificate pinning basics

Pinning checks that the server presents a **specific key or certificate**, not just any certificate the device trusts. It protects against traffic interception through a rogue root certificate.

Rules that keep pinning from backfiring:

- pin the **public key hash**, not the whole certificate;
- always include a **backup pin** for the key you will rotate to;
- plan updates: if the certificate changes and the app only knows the old pin, it stops working for every user.

On Android, pinning goes into the Network Security Config:

```xml
<network-security-config>
  <domain-config>
    <domain includeSubdomains="true">api.example.com</domain>
    <pin-set expiration="2027-01-01">
      <pin digest="SHA-256">PRIMARY_KEY_HASH_BASE64=</pin>
      <pin digest="SHA-256">BACKUP_KEY_HASH_BASE64=</pin>
    </pin-set>
  </domain-config>
</network-security-config>
```

On iOS, use the `NSPinnedDomains` key in Info.plist or a check in your `URLSession` delegate.

## Common mistakes

- Tokens in `AsyncStorage` "temporarily, we'll move them later".
- Secrets in an `.env` file that gets bundled into the build.
- Tokens printed to the console or sent to analytics.
- Storage not cleared on logout.
- Pinning without a backup key.

## FAQ

### Are Keychain and Keystore enough on their own?

No, they are one layer. You also need short-lived tokens, server-side session revocation, HTTPS everywhere and authorization checks on the backend. Secure storage lowers the risk of data theft from the device but does not replace server security.

### Can obfuscation hide an API key?

It makes extraction harder, not impossible. If a key grants access to valuable operations, it belongs on the server.

### Does every app need certificate pinning?

Not always. It makes sense for finance, health and other sensitive apps. For many others, standard TLS validation is enough, and pinning without a rotation process creates more risk than it removes.
