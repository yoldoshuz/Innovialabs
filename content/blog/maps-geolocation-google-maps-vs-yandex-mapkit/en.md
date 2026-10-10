---
title: Maps in Mobile Apps: Google Maps SDK vs Yandex MapKit
description: Google Maps SDK vs Yandex MapKit: coverage in Uzbekistan and the CIS, pricing and limits, geocoding and routing, background location rules and battery use.
summary: For apps used in Uzbekistan and the CIS, Yandex MapKit often has more detailed addresses and places, while Google Maps SDK suits international products and the Google ecosystem. Decide after testing real user addresses and factoring in geocoding and routing costs.
---

## The short answer

If most of your users are in Uzbekistan, Kazakhstan or other CIS countries and the product depends on addresses (delivery, ride-hailing, home services), start by testing **Yandex MapKit**: Yandex usually has more detailed address data and business listings in the region. If the product is international or you already rely on Firebase and Google services, **Google Maps SDK** is the more convenient choice.

Data should decide, not reputation: take 30-50 real customer addresses and check how each provider finds them.

## Coverage in Uzbekistan and the CIS

What to check in your own city:

- **House-level addresses**: does a street and number resolve to a building or only to the street?
- **Landmarks**: in Tashkent and the regions people often describe an address by mahalla or a nearby landmark. See how search handles such queries.
- **Places (POI)**: how current the shops, cafes and offices are.
- **Languages**: how names display and search in Uzbek Latin, Uzbek Cyrillic and Russian.
- **New districts and suburbs**: how quickly data gets updated.

Outside the CIS, Google's coverage is generally broader and more even, so apps with users in many regions often choose Google or combine providers.

## Pricing and limits

Exact prices change, so compare the structure and check the current pricing pages.

| | Google Maps Platform | Yandex MapKit |
|---|---|---|
| Showing a map in the mobile SDK | No separate charge for map loads in the native SDKs | Free use with limits and conditions, then a commercial license |
| Geocoding, search, routing | Separate APIs billed per request with a monthly free allowance | Included in the full SDK, terms depend on the license |
| Keys and restrictions | API key restricted by package name and bundle ID | API key, limits set by the terms of use |

The main cost driver is **how often you call geocoding and routing**, not how often you show the map. Cache geocoding results, do not look up an address on every map movement, and debounce requests while the user is typing.

## Geocoding and routing

- **Google**: Geocoding API, Places API for address autocomplete and Routes API for routes and travel times. These are web services and are often called from your backend so the key stays off the device.
- **Yandex MapKit**: comes as a lite SDK (map only) and a full SDK with search, geocoding, routing for cars, pedestrians and public transport, and offline maps. The full version noticeably increases app size.

For **Flutter**, Google has the official `google_maps_flutter` plugin; for MapKit you rely on community plugins or your own wrapper over the native SDK, so plan time for that.

## Background location: store rules

Background tracking is the most scrutinized part.

**Android:**
- `ACCESS_BACKGROUND_LOCATION` is requested separately, after fine or coarse location is granted;
- Google Play Console requires a declaration explaining why the app needs background location, with a video showing it;
- long-running tracking needs a foreground service of type `location` with a visible notification.

**iOS:**
- `Info.plist` needs clear `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription` texts;
- add the `location` mode to `UIBackgroundModes` only if the feature cannot work without it;
- ask for "While Using" first, and for "Always" only when the user turns on a feature that needs it.

If background location is not a core feature, the store may reject the app. Often location while the app is in use is enough.

## Battery impact

- Pick **accuracy that fits the task**: approximate location is enough for a city; GPS is for navigation and courier tracking.
- Increase the **interval and minimum distance** between updates.
- Use the **Fused Location Provider** on Android and significant location changes or geofences on iOS instead of constant GPS.
- Stop updates when the map screen is closed.
- Send coordinates to the server in batches, not one request per point.

## FAQ

### Can I use both map providers in one app?

Yes. For example, show one provider's map and use another for geocoding, or switch providers by country. Check the terms of use: some services require their results to be shown only on their own map.

### What should I use for an iOS app that needs a simple map without routing?

Consider Apple's built-in MapKit: it is free within Apple's terms and adds no third-party SDK. Check data quality in your region before deciding.

### Do I need to hide the maps API key?

A mobile SDK key ends up inside the app anyway, so restrict it by package name and bundle ID. Keys for geocoding and routing web services are better kept on the server.
