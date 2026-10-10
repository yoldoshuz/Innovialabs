---
title: PWA (progressiv veb-ilova) nima va u nimalarga qodir
description: PWA oddiy tilda: ekranga o‘rnatish, oflayn rejim, push-bildirishnomalar, iOS va Android’dagi cheklovlar hamda bu format qaysi bizneslarga mos kelishi.
summary: PWA — telefon yoki kompyuterga ilova kabi o‘rnatiladigan, manzil satrisiz ochiladigan va qisman oflayn ishlaydigan sayt; u ikkita nativ ilovadan arzonroq, lekin qurilma imkoniyatlariga to‘liq kirish bermaydi.
---

## Qisqa javob

**PWA (Progressive Web App)** — oddiy sayt, unga uchta narsa qo‘shilgan:

- **manifest** (`manifest.json`) — brauzer o‘rnatishni taklif qilishi uchun nom, ikonkalar, ranglar va ko‘rinish rejimi;
- **service worker** — tarmoq so‘rovlarini ushlab qoluvchi, fayllarni keshlovchi va internetsiz ishlash imkonini beruvchi skript;
- **HTTPS** — service worker uchun majburiy shart.

O‘rnatilgandan keyin PWA asosiy ekranda paydo bo‘ladi, brauzer interfeysisiz alohida oynada ochiladi va keyingi ishga tushirishda o‘zi yangilanadi — ilovalar do‘konisiz.

## PWA nimalarga qodir

| Imkoniyat | Qanday ishlaydi |
|---|---|
| O‘rnatish | Ish stolida ikonka, alohida oyna |
| Oflayn rejim | Service worker saqlangan sahifa va ma’lumotlarni beradi |
| Push-bildirishnomalar | Push API orqali, foydalanuvchi ruxsati bilan |
| Fon rejimida ishlash | Cheklangan: sinxronizatsiya brauzerga bog‘liq |
| Qurilmaga kirish | Kamera, geolokatsiya, bufer, ulashish — veb-API orqali |
| Yangilanishlar | Bir zumda, do‘kon moderatsiyasisiz |

## Amaliyotda oflayn rejim

Service worker javobni qayerdan olishni hal qiladi: tarmoqdanmi yoki keshdan. Odatiy strategiyalar:

- **Cache first** — statik fayllar uchun: shriftlar, ikonkalar, skriptlar.
- **Network first** — yangi bo‘lishi kerak bo‘lgan ma’lumotlar uchun, keshdan zaxira variant bilan.
- **Stale-while-revalidate** — darhol keshni ko‘rsatish va fonda uni yangilash.

Minimal ro‘yxatdan o‘tkazish:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

Oflayn rejimni loyihalash kerak: tarmoqsiz nima ko‘rsatiladi, buyurtma yoki formani qanday saqlab, keyinroq yuborish mumkin. «PWA qilish»ning o‘zi butun ilova internetsiz ishlaydi degani emas.

## iOS va Android’dagi cheklovlar

**Android (Chrome va Chromium asosidagi boshqa brauzerlar)** PWA’ni eng yaxshi qo‘llab-quvvatlaydi: o‘rnatish taklifi, push-bildirishnomalar, tizim bilan integratsiya. PWA’ni Trusted Web Activity o‘ramasi orqali Google Play’da ham chop etish mumkin.

**iOS va iPadOS** PWA’ni shartlar bilan qo‘llab-quvvatlaydi:

- o‘rnatish faqat qo‘lda, «Ulashish» → «Asosiy ekranga» menyusi orqali, avtomatik taklif yo‘q;
- push-bildirishnomalar faqat ekranga o‘rnatilgan PWA’lar uchun va iOS’ning nisbatan yangi versiyalarida ishlaydi;
- xotira va fon rejimida ishlash qattiqroq cheklangan, uzoq ishlatilmaganda tizim ma’lumotlarni tozalashi mumkin;
- Chrome’da mavjud API’larning bir qismi Safari’da yo‘q.

Platformalar siyosati o‘zgarib turadi, shuning uchun boshlashdan oldin kerakli funksiyalarning maqsadli qurilmalarda joriy qo‘llab-quvvatlanishini tekshiring.

## PWA qaysi bizneslarga mos keladi

- **Internet-do‘konlar va kataloglar** — tez qayta yuklanish va do‘kondan o‘rnatmasdan ekranda ikonka.
- **Yetkazib berish va yozilish servislari** — bir-ikki bosishda buyurtma, status haqida bildirishnomalar.
- **Kompaniyaning ichki vositalari** — CRM, ombor hisobi, aloqa yomon joyda ishlashi kerak bo‘lgan kuryerlar va sayyor xodimlar uchun ilovalar.
- **Media va kontent** — saqlangan materiallarni oflayn o‘qish.
- **MVP** — nativ ilovalarga sarmoya kiritishdan oldin g‘oyani bitta kod bazasida sinab ko‘rish.

Agar Bluetooth va qurilmalar bilan murakkab ishlash, og‘ir grafika, doimiy fon rejimi yoki jalb qilish kanali sifatida App Store’da bo‘lish kerak bo‘lsa, PWA kamroq mos keladi.

## Ko‘p uchraydigan xatolar

- **Hamma narsani keshlash** va keyin foydalanuvchilarga yangilanishni yetkaza olmaslik.
- **Service worker versiyasini o‘ylamaslik** — foydalanuvchilar eski yig‘ishda qolib ketadi.
- **iOS’dan Android xatti-harakatini kutish** va cheklovlarni ishga tushirgandan keyin bilish.
- **Bildirishnomalarga ruxsatni kirish bilanoq so‘rash** — foydalanuvchilar ko‘proq rad etadi.

## FAQ

### Mavjud saytni PWA’ga aylantirish mumkinmi?

Ha, agar u HTTPS orqali ishlasa. Manifest, ikonkalar va service worker qo‘shish, so‘ng oflayn ssenariylarni o‘ylab chiqish kerak. Ish hajmi saytning qanchalik dinamik ekaniga bog‘liq.

### PWA nativ ilovani almashtiradimi?

Ko‘p vazifalar uchun — ha: kataloglar, buyurtmalar, shaxsiy kabinetlar, ichki servislar. Qurilma bilan chuqur integratsiya yoki App Store’da bo‘lish kerak bo‘lsa, nativ yoki kross-platforma ilova ishonchliroq bo‘lib qoladi.

### PWA qidiruv tizimlari tomonidan indekslanadimi?

Ha, bu sahifa manzillariga ega oddiy sayt. Har qanday zamonaviy saytdagi kabi kontent JavaScript xatolarisiz ochilishi va kerak bo‘lsa server tomonidan berilishi muhim.
