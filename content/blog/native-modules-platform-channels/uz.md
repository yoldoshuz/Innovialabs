---
title: Flutter va React Native’dan nativ kodni qanday chaqirish mumkin
description: Flutter’da platform channels va React Native’da nativ modullar: ilovaga qachon nativ kod kerak va bu qatlamni qanday qo‘llab-quvvatlanadigan qilish.
summary: Flutter nativ kod bilan platform channels orqali (yaxshisi Pigeon generatsiyasi bilan), React Native esa nativ modullar orqali (TurboModules yoki Expo Modules API) bog‘lanadi. Nativ kod SDK’lar, sensorlar va fon vazifalari uchun kerak; uni yupqa, tiplangan va alohida paketda saqlang.
---

## Bu qanday ishlaydi

Kross-platforma freymvork ko‘p vazifalarni qamrab oladi, ammo iOS va Android’ning barcha API’larini emas. Kerakli paket bo‘lmasa, Swift/Kotlin’da kichik qism yozib, uni umumiy koddan chaqirasiz.

- **Flutter** — **platform channels**. Dart nomlangan kanal orqali xabar yuboradi, nativ tomon uni qayta ishlaydi va natijani qaytaradi.
  - `MethodChannel` — javob qaytaradigan metod chaqiruvi;
  - `EventChannel` — nativdan keladigan hodisalar oqimi (sensorlar, ulanish holati);
  - **Pigeon** — qo‘lda yozilgan satrlar o‘rniga kanallar uchun tiplangan kod generatori.
  - C-kutubxonalar uchun `dart:ffi` bor — kanalsiz to‘g‘ridan-to‘g‘ri chaqiruv.
- **React Native** — **nativ modullar**. Yangi arxitekturada bu TypeScript spetsifikatsiyasi va Codegen’ga ega **TurboModules**. Muqobil — **Expo Modules API**: modul Swift va Kotlin’da deklarativ uslubda yoziladi va Expo’da ham, oddiy loyihalarda ham ishlaydi. Nativ UI elementlari uchun nativ komponentlar mavjud.

## Misol: Flutter MethodChannel

Dart:

```dart
const _channel = MethodChannel("com.example.app/battery");

Future<int> getBatteryLevel() async {
  final level = await _channel.invokeMethod<int>("getBatteryLevel");
  return level ?? -1;
}
```

Kotlin:

```kotlin
class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/battery")
      .setMethodCallHandler { call, result ->
        if (call.method == "getBatteryLevel") {
          val manager = getSystemService(BATTERY_SERVICE) as BatteryManager
          result.success(manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY))
        } else {
          result.notImplemented()
        }
      }
  }
}
```

Kanal va metod nomlari — satrlar, imlo xatosi faqat ishlash vaqtida aniqlanadi. Shuning uchun bir-ikki metoddan kattaroq narsa uchun **Pigeon**’dan foydalaning: siz interfeysni Dart’da tavsiflaysiz, u esa Dart, Kotlin va Swift uchun kod generatsiya qiladi.

```dart
@HostApi()
abstract class BatteryApi {
  int getBatteryLevel();
}
```

## Misol: Expo Modules API’dagi modul

```kotlin
class BatteryModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Battery")

    Function("getLevel") {
      val manager = appContext.reactContext
        ?.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
      manager?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: -1
    }
  }
}
```

```ts
import { requireNativeModule } from "expo-modules-core";

const Battery = requireNativeModule("Battery");
const level: number = Battery.getLevel();
```

iOS uchun shunga o‘xshash amalga oshirish Swift’da yoziladi.

## Nativ kod qachon haqiqatan kerak

- **Plaginsiz uchinchi tomon SDK’lari**: to‘lov terminallari, bank va identifikatsiya SDK’lari, uskunalar va IoT-qurilmalar SDK’lari.
- **Paketlar qamrab olmagan yoki to‘liq qamrab olmagan sensorlar va uskunalar**: Bluetooth profillari, nostandart protokolli NFC, kameraning maxsus rejimlari.
- **Fon vazifalari**: Android’da `WorkManager` va foreground-servislar, iOS’da `BGTaskScheduler`, fonda geolokatsiyani qayta ishlash.
- **Tizim integratsiyalari**: bosh ekran vidjetlari, Share Extension, CallKit, Live Activities, App Clips.
- **Unumdorlik**: tasvir va audioni qayta ishlash, kriptografiya — nativ yoki C-kutubxona orqali samaraliroq bajariladigan ishlar.

O‘z kodingizni yozishdan oldin pub.dev, npm va React Native Directory’ni tekshiring — ko‘pincha qo‘llab-quvvatlanadigan paket allaqachon mavjud.

## Nativ qatlamni qanday qo‘llab-quvvatlanadigan qilish

1. **Ajrating.** Nativ kodni `MainActivity` va `AppDelegate`’ga emas, repozitoriy ichidagi alohida plagin yoki paketga chiqaring.
2. **Kontraktni tiplang.** Satr nomlari va lug‘atlar o‘rniga Pigeon, Codegen yoki Expo Modules API.
3. **Qatlamni yupqa saqlang.** Nativ qism faqat SDK’ni chaqiradi va ma’lumotlarni o‘giradi. Biznes-mantiq Dart yoki TypeScript’da qoladi.
4. **Ikkala platforma uchun bitta kontrakt.** iOS va Android’da bir xil metod nomlari, tiplar va xato kodlari. Funksiya faqat bitta platformada bo‘lsa, aniq «qo‘llab-quvvatlanmaydi» deb qaytaring.
5. **Asosiy oqimni bloklamang.** Kanal va modul ishlovchilari ko‘pincha standart holatda asosiy oqimda bajariladi — og‘ir ishni fonga o‘tkazing.
6. **Xatolarni normallashtiring.** Nativ istisnolarni umumiy qism uchun tushunarli kod va xabarlarga aylantiring.
7. **Ikkala tomonni test qiling.** Dart/JS testlarida kanal yoki modul mock’i va amalga oshirishning o‘zi uchun nativ unit-testlar.
8. **Hujjatlashtiring:** nativ SDK versiyalari va sozlash bosqichlari (kalitlar, ruxsatlar, manifest yozuvlari).

## Ko‘p uchraydigan xatolar

- Mantiq Dart/JS va nativ o‘rtasida tarqalib ketgan — xatoni qayerdan izlashni tushunish qiyin.
- Amalga oshirish faqat bitta platforma uchun bor, ikkinchisi esa tushunarli xabarsiz yiqiladi.
- Nativ SDK yangilanishi yig‘ishni buzadi, chunki versiya qat’iy belgilanmagan.
- Nativ kodni jamoada faqat bitta odam biladi.

## FAQ

### Flutter yoki React Native’da yozish uchun Swift va Kotlin’ni bilish kerakmi?

Ko‘pchilik ekranlar uchun — yo‘q. Lekin SDK integratsiyalari, fon vazifalari va do‘konlar uchun yig‘ishda nativ platformalarni asosiy darajada tushunish juda yordam beradi, murakkab loyihalarda esa zarur bo‘lib qoladi.

### Flutter’da nimani tanlash kerak: MethodChannel yoki Pigeon?

Bir-ikki oddiy chaqiruv uchun `MethodChannel` yetarli. Metodlar ko‘proq bo‘lsa yoki murakkab tuzilmalar uzatilsa, Pigeon vaqtni tejaydi va nom hamda tiplardagi xatolardan xalos qiladi.

### Nativ kod ko‘p kerak bo‘lsa, nativ ilova yozish osonroq emasmi?

Ba’zan shunday. Ilova qiymatining katta qismi platforma funksiyalarida bo‘lsa, nativ ishlab chiqish soddaroq bo‘lishi mumkin. Nativ nuqtalar kam bo‘lsa, ajratilgan nativ qatlamli kross-platforma yondashuvi odatda foydaliroq.
