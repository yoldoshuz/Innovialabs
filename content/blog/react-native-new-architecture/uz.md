---
title: React Native’ning yangi arxitekturasi: Fabric, TurboModules va JSI
description: React Native’da bridge o‘rnini nima egalladi: JSI, TurboModules, Fabric va Codegen, unumdorlik qayerdan keladi, migratsiya bosqichlari va kutubxonalar xavfi.
summary: Yangi arxitektura JSON bilan ishlaydigan asinxron bridge’ni JSI orqali to‘g‘ridan-to‘g‘ri chaqiruvlar bilan almashtiradi: nativ modullar kerak bo‘lganda yuklanadi va Codegen orqali tiplanadi, Fabric esa React’ning konkurent imkoniyatlarini qo‘llab-quvvatlaydi. Migratsiya bog‘liqliklar auditidan boshlanadi.
---

## Nima o‘zgardi va nima uchun

Eski arxitekturada JavaScript va nativ kod **bridge** orqali muloqot qilardi: har bir xabar JSON’ga seriyalanar, navbatga qo‘yilar va asinxron yetkazilardi. Bu ishlardi, ammo cheklovlari bor edi:

- ma’lumot tez-tez almashilganda seriyalash xarajatlari;
- barcha chaqiruvlar asinxron — nativ tomondan biror narsani sinxron so‘rab bo‘lmaydi;
- barcha nativ modullar ishga tushishda yuklanardi, kerak bo‘lmasa ham;
- renderer React’ning konkurent imkoniyatlarini qo‘llab-quvvatlay olmasdi.

Yangi arxitektura bu cheklovlarni olib tashlaydigan uch qismdan iborat.

## Uchta tarkibiy qism

**JSI (JavaScript Interface)** — C++ API, uning orqali JavaScript dvigateli nativ obyektlarga to‘g‘ridan-to‘g‘ri havola saqlaydi va ularning metodlarini chaqiradi. JSON ham, navbat ham yo‘q. Asosli bo‘lsa, chaqiruvlar sinxron bo‘lishi mumkin.

**TurboModules** — JSI ustiga qurilgan yangi nativ modullar tizimi:

- modullar **dangasa (lazy)** yuklanadi — birinchi murojaatda;
- interfeys TypeScript yoki Flow’da yoziladi, **Codegen** esa nativ qoliplarni generatsiya qiladi — tiplar mos kelmasligi ishlash vaqtida emas, yig‘ishda aniqlanadi.

**Fabric** — yangi renderer, uning yadrosi C++’da yozilgan va iOS hamda Android uchun umumiy. U maketni sinxron o‘lchab yangilay oladi va React’ning konkurent renderini qo‘llab-quvvatlaydi: `Suspense`, transitions, to‘g‘ri ishlaydigan `useLayoutEffect`.

Ular bilan birga **bridgeless rejim** keldi — unda eski bridge umuman yaratilmaydi. React Native’ning yangi versiyalarida yangi arxitektura standart holatda yoqilgan, eskisi esa asta-sekin qo‘llab-quvvatlashdan chiqarilmoqda.

## Yutuq qayerda seziladi

Aniq raqamlar ilovaga bog‘liq, shuning uchun mexanizmlarga qarang:

- **Ilovaning ishga tushishi** — modullar bir vaqtda yuklanmaydi.
- **Nativ bilan tez-tez ma’lumot almashish** (imo-ishoralar, animatsiyalar, sensorlar, fayllar) — seriyalash xarajati yo‘q.
- **Interfeys sezgirligi** — konkurent render tufayli shoshilinch yangilanishlar og‘ir renderni kutmaydi.
- **Sinxron amallar**, masalan maslahat oynasini ko‘rsatishdan oldin elementni o‘lchash — miltillashsiz.

Agar ilova asosan API’dan kelgan ro‘yxatlarni ko‘rsatsa, farq sezilmasligi mumkin. Haqiqiy qurilmalarda va release-yig‘ilmalarda profiling qilib tekshiring.

## Codegen bilan modul qanday ko‘rinadi

TypeScript’dagi TurboModule spetsifikatsiyasi:

```ts
// specs/NativeDeviceInfo.ts
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getDeviceName(): string;
  getBatteryLevel(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("DeviceInfo");
```

Codegen `package.json`’da sozlanadi:

```json
"codegenConfig": {
  "name": "AppSpecs",
  "type": "modules",
  "jsSrcsDir": "specs",
  "android": { "javaPackageName": "com.example.app" }
}
```

So‘ngra generatsiya qilingan interfeyslar Kotlin/Java va Objective-C++/Swift’da amalga oshiriladi.

## Mavjud ilovani ko‘chirish bosqichlari

1. **Bog‘liqliklar auditi.** Nativ kodli barcha kutubxonalar ro‘yxatini tuzing va ularning holatini React Native Directory yoki repozitoriylarida tekshiring.
2. **React Native’ni yangilash** — dolzarb versiyagacha. Bosqichma-bosqich, Upgrade Helper bilan solishtirib boring: ko‘p versiyadan bir sakrashda muammo manbasini topish qiyin.
3. **Arxitekturani yoqish**, agar versiyangizda u hali standart bo‘lmasa: `android/gradle.properties`’da `newArchEnabled=true`, iOS uchun pods’ni yangi arxitektura bilan qayta o‘rnatish, Expo’da esa ilova konfiguratsiyasidagi tegishli bayroq.
4. **O‘z kodingizni ko‘chirish**: nativ modullarni TurboModules’ga, nativ komponentlarni Fabric’ga (spetsifikatsiya, Codegen, amalga oshirish).
5. **Ikkala platformani release rejimida test qilish**: navigatsiya, imo-ishoralar, klaviatura, modal oynalar, uchinchi tomon SDK’lari.
6. **Bosqichma-bosqich chiqarish** — do‘konlarda staged rollout va crash’larni monitoring qilish.

## Kutubxonalar mosligi

Bu migratsiyaning asosiy xavfi.

- **Interop qatlami** ko‘plab eski modul va komponentlarga qayta yozmasdan ishlash imkonini beradi, lekin hammasiga emas va har doim ham mukammal emas.
- Bridge obyektiga to‘g‘ridan-to‘g‘ri murojaat qiladigan, `setNativeProps`’ga tayanadigan yoki `UIManager` bilan nostandart usullarda ishlaydigan kutubxonalar ko‘proq buziladi.
- **Tashlab ketilgan kutubxonalar** — ularni qo‘llab-quvvatlanadigan muqobilga almashtirish, fork qilish yoki kichik modulni o‘zingiz yozish uchun signal.
- Kutubxonalarni yangi arxitektura aniq qo‘llab-quvvatlanadigan versiyalarga o‘tishdan oldin yangilang, keyin emas.

## FAQ

### Hozirning o‘zida ko‘chish shartmi?

Ilova barqaror ishlasa, shoshilinch emas, lekin uzoq kechiktirish xavfli: React Native va kutubxonalarning yangi versiyalari yangi arxitekturaga yo‘naltirilgan, eskisi esa qo‘llab-quvvatlashni yo‘qotmoqda.

### Ilovaning JavaScript kodini qayta yozish kerakmi?

Odatda yo‘q. Asosiy ish bog‘liqliklar va o‘zingizning nativ kodingizda. JavaScript’dagi komponentlar va biznes-mantiq ko‘pincha o‘zgarmaydi.

### Kutubxona yangi arxitekturani qo‘llab-quvvatlamasa nima qilish kerak?

Avval u interop qatlami orqali ishlashini tekshiring. Ishlamasa, qo‘llab-quvvatlanadigan muqobil yoki tuzatilgan fork izlang yoki kerakli funksiyani alohida TurboModule sifatida yozing.
