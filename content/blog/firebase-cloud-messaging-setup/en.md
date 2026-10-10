---
title: How to Set Up Push Notifications with Firebase Cloud Messaging
description: A step-by-step FCM setup for Android and iOS: the APNs key, getting and storing tokens, sending from a server via HTTP v1, topics and testing delivery.
summary: Connect Firebase to your Android and iOS apps, upload an APNs key, store device FCM tokens on your server and send messages through the Firebase Admin SDK; topics handle interest-based broadcasts and a test send from the console verifies delivery fast.
---

## The short answer: how FCM works

**Firebase Cloud Messaging (FCM)** is Google's free service for delivering push notifications to Android, iOS and the web. The flow is simple:

1. The app gets a **device token** from FCM.
2. The app sends the token to **your server**.
3. The server asks FCM to deliver a message to a token or a **topic**.
4. On Android FCM delivers it directly; on iOS it goes through Apple's **APNs**.

## Step 1. Firebase project and Android

1. Create a project in the Firebase Console.
2. Add an Android app with the same **package name** as your project.
3. Download `google-services.json` and place it in the `app` module.
4. Add the Google Services Gradle plugin and the `firebase-messaging` dependency.
5. From Android 13 on, request the **POST_NOTIFICATIONS** runtime permission.

A service for receiving tokens and messages:

```kotlin
class PushService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        // send the token to your server
    }

    override fun onMessageReceived(message: RemoteMessage) {
        // handle messages while the app is in the foreground
    }
}
```

Register the service in `AndroidManifest.xml` with the `com.google.firebase.MESSAGING_EVENT` intent filter.

## Step 2. iOS and the APNs key

1. Add an iOS app to Firebase with your **Bundle ID** and download `GoogleService-Info.plist`.
2. In Apple Developer, create an **APNs Authentication Key** (a `.p8` file). Store it safely; it cannot be downloaded again.
3. In Firebase, go to **Project settings → Cloud Messaging → Apple app configuration**, upload the key and enter the **Key ID** and **Team ID**.
4. In Xcode, enable the **Push Notifications** capability and **Background Modes → Remote notifications**.
5. In code, request permission from the user and register for remote notifications; the Firebase SDK maps the APNs token to an FCM token.

One `.p8` key works for all of your team's apps and both APNs environments, unlike the older certificates that had to be renewed.

## Step 3. Handle tokens

- Store each token on the server with the **user ID**, platform and last update time.
- Update it whenever `onNewToken` (or its iOS equivalent) fires.
- A user can have **several devices**, so keep a list of tokens.
- Delete tokens for which FCM reports an unregistered device.
- On logout, unlink the token from the user.

## Step 4. Send from a server

Use the **FCM HTTP v1 API**; the old legacy API has been shut down. The easiest way is the Firebase Admin SDK with a service account:

```js
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

initializeApp({ credential: applicationDefault() });

await getMessaging().send({
  token: deviceToken,
  notification: { title: "Order shipped", body: "Track the delivery in the app" },
  data: { screen: "order", orderId: "1042" },
});
```

- **notification**: the title and body the system displays itself.
- **data**: your own keys for app logic, such as the screen to open.

Keep the service account key in your server's secrets, never in the repository or the app.

## Step 5. Topics

A topic broadcasts to everyone subscribed to it, with no token storage on your side:

- the client calls `subscribeToTopic("news")`;
- the server sends a message with `topic: "news"` instead of `token`.

Topics suit public categories such as news or promotions. Use tokens for personal notifications.

## Step 6. Test delivery

1. Copy the device token from the logs.
2. In the Firebase Console open **Messaging**, create a notification and click **Send test message**, pasting the token.
3. Check three states: app open, in background and closed.
4. Test iOS on a real device.

If nothing arrives, check the notification permission, the uploaded APNs key, matching Bundle ID and package name, and battery optimization settings on Android.

## FAQ

### Why do notifications arrive on Android but not on iOS?

Most often the APNs key is missing, the Key ID or Team ID is wrong, the Push Notifications capability is off, or the user denied permission. Check these in order.

### Do I need my own server for push?

For simple broadcasts the Firebase Console is enough. Personal and triggered notifications such as orders, messages or payments need a backend that stores tokens and sends messages through the API.

### What is the difference between notification and data messages?

The system displays notification messages itself when the app is in the background. Data messages carry only your payload, and the app decides what to do with it. Many apps use both fields together.
