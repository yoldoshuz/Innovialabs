---
title: How Push Notifications Work on iOS and Android
description: How a push travels from your server to the screen: APNs and Firebase Cloud Messaging, device tokens, silent vs visible pushes and permission rules.
summary: Your server never sends a push straight to the phone: it hands the message and a device token to the platform service — Apple's APNs or Google's Firebase Cloud Messaging — which delivers it to the device. Showing a notification requires the user's permission.
---

## The essentials

A push notification goes through a middleman. The app does not keep a permanent connection to your server — that would drain the battery. Instead, the operating system maintains **one shared connection** to the platform service:

- **APNs (Apple Push Notification service)** — for iOS, iPadOS, macOS and watchOS;
- **FCM (Firebase Cloud Messaging)** — for Android, and also as a single entry point that can deliver to iOS through APNs.

Your server sends a message to APNs or FCM, and they deliver it to the right device.

## The path from server to screen

1. **The app registers** for push notifications on launch.
2. **The platform issues a token** — a unique address for this app install on this device.
3. **The app sends the token** to your backend, which stores it alongside the user ID.
4. **Your server builds a message** and sends it to APNs or FCM with the token.
5. **The service delivers** the message once the device is online.
6. **The OS shows the notification** or wakes the app to process data.

## Device tokens

A token is not a permanent ID. It can change after reinstalling the app, restoring the device from a backup or simply at the platform's discretion. So:

- send the token to your server on every launch if it changed;
- delete tokens that APNs or FCM report as invalid;
- store several tokens per user — people have phones and tablets.

## How the server sends a push

For **APNs**, the server authenticates with a `.p8` key from your Apple Developer account (or a certificate) and sends an HTTP/2 request. A minimal payload looks like this:

```json
{
  "aps": {
    "alert": { "title": "Your order is on its way", "body": "The courier arrives in 15 minutes" },
    "sound": "default"
  },
  "order_id": "4821"
}
```

For **FCM**, you use the HTTP v1 API with an OAuth token from a service account:

```json
{
  "message": {
    "token": "DEVICE_TOKEN",
    "notification": { "title": "Your order is on its way", "body": "The courier arrives in 15 minutes" },
    "data": { "order_id": "4821" }
  }
}
```

Details are in the official [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) documentation.

## Visible vs silent notifications

| Type | What it does | Needs permission | Delivery guarantee |
|---|---|---|---|
| Visible | Shows a banner, sound, badge | Yes | High |
| Silent | Wakes the app in the background, nothing shown | No | Not guaranteed |

On iOS, **silent pushes** are sent with `content-available: 1` and used for background sync. The system throttles them and may delay or drop them when the battery is low or the user force-quit the app. On Android, the equivalent is a **data message** without a `notification` block; your app code handles it.

Do not build critical logic on silent pushes alone: treat them as a hint to refresh, not a reliable channel.

## Permission rules

- **iOS**: showing notifications always requires explicit user permission through a system dialog. There is also **provisional** authorization: notifications arrive quietly in Notification Center without a prompt, and the user decides whether to keep them.
- **Android**: on recent versions of the OS, apps must also request the `POST_NOTIFICATIONS` permission. Notifications are grouped into **channels**, and users can turn each channel off separately.

The iOS system dialog appears only once. If the user declines, the only way back is through Settings.

## How not to lose permission

- Do not ask on first launch without context.
- Explain the benefit on your own screen first: "We will tell you when the courier is close."
- Ask when the value is obvious, for example right after an order is placed.
- Offer in-app settings so users choose which topics they receive.

## FAQ

### Can I send pushes to iOS without Firebase?

Yes. Your server can talk to APNs directly. Firebase is convenient when you want one sending point for both platforms.

### Why do notifications sometimes not arrive?

Common causes: a stale token, notifications disabled by the user, Low Power or Do Not Disturb mode, a malformed payload and, for silent pushes, system throttling.

### Do I need a server for push notifications?

For personalized notifications, yes — you need to store tokens and send messages. For simple broadcasts you can use the Firebase console or a third-party service.
