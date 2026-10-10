---
title: Flutter nima va u qanday ishlaydi
description: Flutter oddiy tilda: Dart tili, vidjetlar daraxti, o‘z chizish dvigateli va hot reload, unda qanday ilovalar yaratish mumkin va uning cheklovlari.
summary: Flutter — Google’ning freymvorki bo‘lib, Dart tilidagi bitta koddan iOS, Android va boshqa platformalar uchun ilovalar yig‘ish imkonini beradi. U butun interfeysni o‘z dvigateli bilan chizadi, shuning uchun ilova hamma joyda bir xil ko‘rinadi.
---

## Flutter haqida qisqacha

**Flutter** — Google’ning bitta kod bazasidan ilovalar yaratish uchun ochiq freymvorki. Asosiy yo‘nalishi — iOS va Android uchun mobil ilovalar, lekin xuddi shu kodni veb va desktop (Windows, macOS, Linux) uchun ham yig‘ish mumkin.

Flutter’ning asosiy g‘oyalari:

- **Dart** tili;
- daraxt shaklida yig‘ilgan **vidjetlardan** iborat interfeys;
- tizim komponentlari o‘rniga **o‘z chizish dvigateli**;
- **hot reload** — koddagi o‘zgarishlar ishlab turgan ilovada deyarli darhol ko‘rinadi.

## Dart tili

Dart — Google’ning qat’iy tiplangan, tanish sintaksisli tili: Java, Kotlin, C# yoki TypeScript’ni biladigan dasturchilar uni bir necha kunda tushunib oladi.

Muhim xususiyati — ikki xil kompilyatsiya rejimi:

- **ishlab chiqish vaqtida** kod o‘zgarishlarni darhol yuklash mumkin bo‘ladigan tarzda bajariladi;
- **reliz versiyasida** kod oldindan (AOT) qurilmaning mashina kodiga kompilyatsiya qilinadi, shuning uchun ilova tez ishga tushadi va tez ishlaydi.

Dart’da **null safety** o‘rnatilgan: kompilyator bo‘sh qiymatga tasodifan murojaat qilishga yo‘l qo‘ymaydi, bu xatolarning butun bir sinfini yo‘q qiladi.

## Vidjetlar daraxti

Flutter’da hamma narsa vidjet: matn, tugma, chekinish, ekran va ilovaning o‘zi. Vidjetlar bir-birining ichiga joylashib, daraxt hosil qiladi. Mana minimal ilova:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Hello')),
        body: const Center(child: Text('Flutter')),
      ),
    );
  }
}
```

Interfeys **deklarativ** tasvirlanadi: siz joriy ma’lumotlarda ekran qanday ko‘rinishi kerakligini aytasiz, Flutter esa ular o‘zgarganda nimani qayta chizishni o‘zi hal qiladi. Ikki asosiy tur bor:

- **StatelessWidget** — o‘z holatisiz (sarlavha, ikonka);
- **StatefulWidget** — o‘zgaradigan holatli (hisoblagich, forma, yuklanadigan ro‘yxat).

Katta ilovalarda holat odatda holatni boshqarish kutubxonalari yordamida alohida qatlamga chiqariladi.

## O‘z chizish dvigateli

Ko‘pchilik freymvorklar tizim tugmalari va ro‘yxatlaridan foydalanadi. Flutter boshqacha yo‘l tutadi: u o‘z grafik dvigateli orqali **har bir pikselni o‘zi chizadi**.

Bu nima beradi:

- iOS va Android’da bir xil ko‘rinish, OT’ning turli versiyalaridan kutilmagan hodisalarsiz;
- dizayn va animatsiyalar ustidan to‘liq nazorat;
- murakkab interfeyslarning silliq chizilishi.

Buning narxi — agar «tizimga xos» ko‘rinish kerak bo‘lsa, uni ham qayta yaratish kerak. Buning uchun Flutter’da tayyor vidjetlar to‘plamlari bor: **Material** (Google uslubi) va **Cupertino** (iOS uslubi).

## Hot reload

Dasturchi kodni o‘zgartiradi, faylni saqlaydi va bir soniyada natijani ishlab turgan ilovada ko‘radi, **joriy holat yo‘qolmaydi**: ochiq ekran va kiritilgan ma’lumotlar joyida qoladi. Bu interfeys ustida ishlashni va dizayner izohlari bo‘yicha tuzatishlarni ancha tezlashtiradi.

Ilovani ishga tushirishga ta’sir qiladigan o‘zgarishlar uchun **hot restart** ishlatiladi — holatni tozalab tez qayta ishga tushirish.

## Flutter qanday ilovalar uchun mos

- Biznes-ilovalar: internet-do‘konlar, yetkazib berish, bron qilish, shaxsiy kabinetlar.
- Yorqin firma dizayni va boy animatsiyalarga ega ilovalar.
- iOS va Android’da tez chiqarilishi kerak bo‘lgan MVP’lar.
- Xodimlar uchun ichki korporativ ilovalar.

## Cheklovlar

- **Ilova hajmi.** Dvigatel yig‘maga kiradi, shuning uchun minimal ilova native analogidan og‘irroq.
- **OT’ning yangi funksiyalari** kechikish bilan keladi: ularni plaginlarda kutish yoki native kod (platform channels) orqali o‘zingiz ulashingiz kerak.
- **O‘ziga xos uskunalar** va noyob SDK’lar Swift yoki Kotlin’da native modul talab qilishi mumkin.
- **Veb versiya** ilovalar uchun mos, lekin SEO va tez birinchi yuklanish muhim bo‘lgan kontent saytlar uchun emas.
- **Dart** Flutter’dan tashqarida deyarli ishlatilmaydi, shuning uchun mutaxassislarni aynan shu stek uchun izlash kerak.

## FAQ

### Flutter’da yozish uchun Swift yoki Kotlin’ni bilish kerakmi?

Ko‘pchilik vazifalar uchun — yo‘q. Lekin chop etish, yig‘malarni sozlash va noyob native integratsiyalar uchun jamoada iOS va Android bo‘yicha asosiy bilim bo‘lishi juda maqsadga muvofiq.

### Flutter katta ilovalar uchun mosmi?

Ha, agar arxitektura boshidanoq o‘ylab chiqilsa: modullarga bo‘lish, holatni boshqarish, testlar. Katta loyihalardagi muammolar ko‘pincha freymvorkning o‘zi bilan emas, arxitektura bilan bog‘liq.

### Flutter’ni qayerdan o‘rganish kerak?

Eng yaxshi boshlang‘ich nuqta — [docs.flutter.dev](https://docs.flutter.dev) rasmiy hujjatlari: u yerda o‘rnatish, o‘quv misollari va chop etish bo‘yicha qo‘llanmalar bor.
