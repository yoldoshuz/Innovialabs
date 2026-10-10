---
title: React Native nima va u qanday ishlaydi
description: React Native’da JavaScript kodi native komponentlarni qanday boshqaradi, Expo nima uchun kerak, veb-jamoa bilan kodni bo‘lishish va kuchli-zaif tomonlar.
summary: React Native — Meta’ning freymvorki bo‘lib, unda interfeys React uslubida JavaScript yoki TypeScript’da yoziladi, ekranda esa iOS va Android’ning haqiqiy native komponentlari ko‘rinadi. U ayniqsa vebni allaqachon React’da yozayotgan jamoalar uchun foydali.
---

## React Native haqida qisqacha

**React Native** — Meta’ning bitta kod bazasidan iOS va Android uchun mobil ilovalar yaratishga mo‘ljallangan ochiq freymvorki. Kod **JavaScript**’da yoki hozir standart bo‘lgan **TypeScript**’da, **React** yondashuvlari asosida yoziladi: komponentlar, holat, hooklar.

Veb-o‘ramdan asosiy farqi: React Native ilova ichida veb-sahifani ko‘rsatmaydi. U **haqiqiy native interfeys elementlarini** yaratadi — Swift va Kotlin dasturchilari ishlatadigan xuddi o‘sha elementlarni.

## JavaScript native interfeysni qanday boshqaradi

Soddalashtirib aytganda, ilova ikki qismdan iborat:

1. **JavaScript qismi** — mantiqingiz va interfeys tavsifi. U ilovaga o‘rnatilgan JS-dvigatel tomonidan bajariladi.
2. **Native qism** — haqiqiy ekranlar, tugmalar, ro‘yxatlar va qurilma funksiyalariga kirish.

Interfeysni komponentlar bilan tasvirlaysiz:

```tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={{ padding: 24 }}>
      <Text>Count: {count}</Text>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}
```

Holat o‘zgarganda React aynan nima o‘zgarganini hisoblaydi, React Native esa tegishli native elementlarni yangilaydi. `View` native konteynerga, `Text` esa native matn elementiga aylanadi.

React Native’ning zamonaviy arxitekturasida JavaScript native kod bilan to‘g‘ridan-to‘g‘ri muloqot qiladi, oldingi versiyalardagi sekin asinxron «ko‘prik»siz. Bu interfeysni tezroq javob beradigan qildi va native modullar yozishni osonlashtirdi.

## Expo’ning roli

**Expo** — React Native ustidagi vositalar va servislar to‘plami. React Native rasmiy hujjatlari yangi loyihalarni aynan Expo kabi freymvork bilan boshlashni tavsiya qiladi.

Expo nima beradi:

- birinchi qadamlarda Xcode va Android Studio’ni qo‘lda sozlamasdan **tez boshlash**;
- kamera, bildirishnomalar, fayllar, geolokatsiya va boshqa funksiyalar uchun **tayyor modullar**;
- ekranlar uchun **fayl asosidagi marshrutlash** (Expo Router);
- **bulutli yig‘malar** va do‘konlarga yuborish (EAS);
- JavaScript qismini qayta chop etmasdan **«havo orqali» yangilash** — do‘kon qoidalari doirasida.

Loyihani bitta buyruq bilan yaratish mumkin:

```bash
npx create-expo-app@latest my-app
```

Shu bilan birga Expo cheklamaydi: o‘z native kodingiz kerak bo‘lsa, uni loyihaga qo‘shish mumkin.

## React veb-jamoasi bilan umumiy kod

Bu React Native’ni tanlashning asosiy sabablaridan biri.

**Odatda qayta ishlatish mumkin bo‘lgan narsalar:**

- TypeScript’dagi tiplar va ma’lumotlar modellari;
- API klienti, validatsiya, biznes-mantiq;
- holatni boshqarish va so‘rovlar bilan ishlash;
- jamoa bilimlari: yondashuvlar, vositalar, kod-revyu.

**To‘g‘ridan-to‘g‘ri ko‘chirib bo‘lmaydigan narsa:** veb-belgilash. Vebda `div` va CSS, React Native’da esa `View`, `Text` va JavaScript’dagi uslublar ishlatiladi. Umumiy UI komponentlar mumkin, lekin alohida arxitektura talab qiladi.

Qulay sxema — **monorepozitoriy**, unda veb, mobil ilova va mantiqli umumiy paket yonma-yon turadi.

## Kuchli tomonlari

- JavaScript va React’ning ulkan ekotizimi.
- Ayniqsa vebdan kelgan dasturchilarni topish va o‘qitish osonroq.
- Native komponentlar: ilova har bir platformada «o‘ziniki» kabi tuyuladi.
- Tez iteratsiya: o‘zgarishlar deyarli darhol ko‘rinadi (Fast Refresh).
- Do‘kon tekshiruvini kutmasdan JavaScript qismini yangilash.

## Zaif tomonlari

- **Uchinchi tomon kutubxonalari sifati** juda xilma-xil; tashlab qo‘yilgan paket yangilanishlarni to‘sib qo‘yishi mumkin.
- **Freymvork versiyalarini yangilash** katta loyihalarda vaqt va testlash talab qiladi.
- **Og‘ir ssenariylar** — murakkab animatsiyalar, video ishlov, AR — maxsus kutubxonalar yoki native kod talab qiladi.
- Native komponentlardagi **iOS va Android farqlarini** ikkala platformada tekshirish kerak.
- **Veb tajribasi mobil tajriba bilan teng emas:** chop etish, unumdorlik va qurilma bilan ishlash alohida bilim talab qiladi.

## FAQ

### Expo’dan darhol foydalanish kerakmi?

Ko‘pchilik yangi loyihalar uchun — ha, bu eng tez va tavsiya etilgan yo‘l. Keyinchalik nostandart native kod kerak bo‘lsa, uni Expo’dan voz kechmasdan qo‘shish mumkin.

### Ilova va saytni bitta koddan yaratsa bo‘ladimi?

Qisman. Mantiq, tiplar va API bilan ishlashni bo‘lishish oson. Umumiy interfeys ham mumkin, lekin odatda veb va mobil ilova platformaga moslashtirilgan o‘z ekranlariga ega bo‘ladi.

### React Native Flutter’dan nimasi bilan farq qiladi?

React Native native komponentlar va JavaScript/TypeScript tilidan foydalanadi, Flutter esa interfeysni o‘zi chizadi va Dart’dan foydalanadi. Batafsil — bu freymvorklarning alohida solishtiruvida.
