---
title: PWA yoki native ilova: qachon veb-ilova yetarli
description: PWA va native ilovani solishtiramiz: o‘rnatish, oflayn rejim, iOS va Android’da push, qurilmaga kirish, do‘konlar va narx. PWA qachon to‘g‘ri birinchi qadam.
summary: Mahsulotga tez ishga tushirish, havola orqali kirish, oddiy oflayn va chuqur qurilma imkoniyatlarisiz bildirishnomalar kerak bo‘lsa, PWA yetarli. Bluetooth, fon rejimida ishlash, murakkab grafika, App Store’da bo‘lish yoki maksimal ravonlik muhim bo‘lsa, native ilova kerak.
---

## Qisqa javob

**PWA (Progressive Web App)** — asosiy ekranga o‘rnatiladigan, internetsiz ishlay oladigan va bildirishnoma yubora oladigan sayt. **Native ilova** esa iOS va Android uchun yoziladi hamda App Store va Google Play orqali tarqatiladi.

G‘oyani tez sinab ko‘rish kerak bo‘lsa, foydalanuvchilar havola orqali kelsa va funksiyalar brauzer imkoniyatlari doirasida bo‘lsa, PWA yaxshi birinchi qadam. Mahsulot qurilma imkoniyatlariga, fon jarayonlariga yoki do‘kondagi ko‘rinishga tayansa, native ilova o‘zini oqlaydi.

## Bandma-band solishtirish

| Mezon | PWA | Native ilova |
|---|---|---|
| O‘rnatish | Brauzerdan, do‘konsiz | App Store va Google Play orqali |
| Yangilanish | Darhol, sayt kabi | Ko‘rikdan o‘tib, do‘kon orqali |
| Oflayn | Service Worker va kesh | Ma’lumotlar ustidan to‘liq nazorat |
| Android’da push | Bor | Bor |
| iOS’da push | Faqat asosiy ekranga qo‘shilgandan keyin | Bor |
| Qurilmaga kirish | Brauzer API bilan cheklangan | To‘liq |
| Do‘konlarda | Google Play — mumkin, App Store — qiyin | Ha |
| Kod bazasi | Bitta, veb | Ikkita native yoki bitta krossplatforma |

## O‘rnatish

**Android**’da sayt manifest va Service Worker’ga ega bo‘lsa, Chrome o‘zi PWA’ni o‘rnatishni taklif qiladi. Ekranda ikonka paydo bo‘ladi, ilova manzil satrisiz ochiladi.

**iOS**’da o‘rnatish unchalik ko‘rinmaydi: foydalanuvchi saytni Safari’da ochib, «Ulashish» tugmasini bosadi va «Asosiy ekranga qo‘shish»ni tanlaydi. Ko‘pchilik buni bilmaydi, shuning uchun iOS foydalanuvchilariga qisqa ko‘rsatma berish foydali.

## Oflayn rejim

**Service Worker** so‘rovlarni ushlab, ma’lumotni keshdan beradi. Bu orqali:

- ilovani internetsiz ochish;
- avval yuklangan ma’lumotlarni ko‘rish;
- harakatlarni navbatga qo‘yib, aloqa tiklanganda yuborish mumkin.

Cheklov shundaki, joy kam qolsa yoki sayt uzoq ishlatilmasa, brauzer xotirani tozalashi mumkin. Oflayn ma’lumotlar juda muhim bo‘lsa, native xotira ishonchliroq.

## Push-bildirishnomalar

Android’da veb-push ancha vaqtdan beri barqaror ishlaydi. iOS’da u keyinroq paydo bo‘lgan va **faqat asosiy ekranga qo‘shilgan PWA uchun** ishlaydi: oddiy Safari oynasidan obuna bo‘lib bo‘lmaydi. Ruxsat foydalanuvchi harakatiga javoban, masalan tugma bosilganda so‘ralishi kerak.

Bildirishnomalar mahsulotning yadrosi bo‘lsa (messenjer, yetkazib berish, taksi), native ilova ko‘proq nazorat beradi: kategoriyalar, bildirishnoma ichidagi tugmalar, fon sinxronizatsiyasi uchun «jim» pushlar.

## Qurilmaga kirish

PWA kamera, geolokatsiya, mikrofon, tebranish (hamma joyda emas) va bufer bilan ishlay oladi. Lekin **Web Bluetooth** va **Web NFC** kabi ko‘p API’lar hamma brauzerlarda yo‘q, Safari’da esa ularning bir qismi umuman mavjud emas. Fon rejimidagi geolokatsiya, HealthKit, vidjetlar, OS bilan chuqur integratsiya va kamerani nozik boshqarish native tomonda qoladi.

## Do‘konlar va narx

- **Google Play** Trusted Web Activity orqali o‘ralgan PWA’ni qabul qiladi.
- **App Store** ilova oddiy saytdan ortiq qiymat berishini talab qiladi, shuning uchun PWA ustidagi yupqa qobiq ko‘pincha ko‘rikdan o‘tmaydi.
- **Narx** odatda PWA’da pastroq: bitta kod bazasi, dasturchi akkauntlari va ko‘rik yo‘q, yangilanishlar darhol. Native ishlab chiqish ikki platforma, nashr va versiyalarni qo‘llab-quvvatlash sababli qimmatroq.

## PWA qachon oqilona birinchi qadam

- **G‘oyani tekshirish.** Mahsulot odamlarga kerakmi, tez bilish kerak.
- **Havola orqali ishlaydigan xizmat.** Foydalanuvchilar reklama, messenjer yoki QR-koddan keladi va hech narsa yuklab olishni xohlamaydi.
- **Ichki vositalar.** Xodimlar uchun panellar, hisob-kitob, arizalar.
- **Kontent mahsulotlari.** Kataloglar, media, bron qilish, shaxsiy kabinet.

Bluetooth qurilmalari, fon rejimida ishlash, murakkab animatsiya va grafika, OS bilan chuqur integratsiya kerak bo‘lsa yoki mahsulot do‘kondagi qidiruvga tayansa, native’ni tanlang.

## Ko‘p uchraydigan xatolar

- Talabni tekshirmay turib «jiddiyroq ko‘rinadi» deb native qilish.
- iOS’da PWA’ni qanday o‘rnatishni tushuntirmay, push’ga umid qilish.
- Sinxronizatsiya va ma’lumotlar to‘qnashuvini o‘ylamay, oflayn rejim va’da qilish.
- O‘tish yo‘lini unutish: PWA muvaffaqiyatli bo‘lsa, API va backend kelajakdagi native mijozga ham mos bo‘lishi kerak.

## FAQ

### PWA’dan boshlab, keyin native’ga o‘tsa bo‘ladimi?

Ha, bu ko‘p uchraydigan yo‘l. Backend to‘g‘ri API orqali qurilgan bo‘lsa, native ilova o‘sha mantiqqa ulanadi, PWA esa veb-versiya sifatida qoladi.

### iPhone’da PWA push-bildirishnomalari ishlaydimi?

Ishlaydi, lekin faqat foydalanuvchi PWA’ni asosiy ekranga qo‘shgan va ruxsat bergan bo‘lsa. Oddiy Safari oynasida bildirishnomalar ulanmaydi.

### PWA’ni App Store’da chiqarish mumkinmi?

Texnik jihatdan uni native qobiqqa o‘rash mumkin, lekin Apple saytni shunchaki takrorlaydigan ilovalarni ko‘pincha rad etadi. Aynan ilova ichida qiymat beradigan funksiyalar kerak.
