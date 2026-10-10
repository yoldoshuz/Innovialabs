---
title: Issiqlik xaritalari va sessiya yozuvlari: foydalanuvchi xulqini tahlil
description: Klik, skroll va e’tibor xaritalari nimani ko‘rsatadi, Webvisor va Clarity’da sessiya yozuvlarini qanday ko‘rish va topilmalarni tuzatishga aylantirish.
summary: Issiqlik xaritalari foydalanuvchilar qayerni bosishi, qayergacha aylantirishi va qayerda to‘xtab qolishini, sessiya yozuvlari esa aniq bir odam sahifada qanday harakatlanganini ko‘rsatadi. Birgalikda ular analitikadagi raqamlar nega aynan shunday ekanini tushuntiradi va nimani tuzatishni ko‘rsatadi.
---

## Bu nima va nima uchun kerak

Oddiy analitika **«nima bo‘ldi»** degan savolga javob beradi: qancha odam keldi, qanchasi ketdi, konversiya qanday. Issiqlik xaritalari va sessiya yozuvlari **«nega»** degan savolga javob beradi: odam nimani ko‘rdi, qayerni bosishga urindi va qayerda qotib qoldi.

- **Issiqlik xaritasi** — ko‘plab foydalanuvchilar xulqining sahifa ustidagi umumlashgan manzarasi: rang qanchalik «issiq» bo‘lsa, faollik shunchalik ko‘p.
- **Sessiya yozuvi (session replay)** — bitta odam tashrifining takrorlanishi: kursor harakati, kliklar, aylantirish, formalarga kiritish (ma’lumotlar yashirilgan holda).

Mashhur vositalar — Yandex Metrica’dagi **Webvisor** va xaritalar, **Microsoft Clarity** va Hotjar. Metrica va Clarity bepul va ko‘pincha GA4 bilan birga ishlatiladi.

## Issiqlik xaritalari turlari

| Xarita | Nimani ko‘rsatadi | Qaysi savolni hal qiladi |
|---|---|---|
| **Kliklar xaritasi** | Qayerni bosishadi, bosilmaydigan elementlarni ham | Tugmani ko‘rishadimi, matnni havola deb adashtirishmayaptimi |
| **Havolalar xaritasi** (Metrica’da) | Havola va tugmalar bo‘yicha o‘tishlar | Menyuning qaysi bandlari va CTA’lar haqiqatan ishlatiladi |
| **Skroll xaritasi** | Tashrifchilarning qancha qismi sahifaning har bir qismigacha yetadi | E’tibor qayerda yo‘qoladi, muhim blokni ko‘rishadimi |
| **E’tibor xaritasi** | Odamlar ekranda qayerda uzoqroq to‘xtaydi | Qaysi bloklar o‘qiladi, qaysilari o‘tkazib yuboriladi |

E’tibor xaritasi ko‘zning haqiqiy harakati bo‘yicha emas, sahifa qismi ko‘rinish zonasida qancha vaqt turgani bo‘yicha tuziladi. Bu taxminiy, lekin foydali.

## Qanday ulash kerak

Yandex Metrica’da sessiya yozuvi va kliklar xaritasi hisoblagich parametrlari orqali yoqiladi:

```js
ym(COUNTER_ID, 'init', {
  webvisor: true,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true
});
```

Clarity’da loyiha yaratib, uning skriptini saytga qo‘shish yoki Google Tag Manager orqali ulash kifoya. Batafsil ma’lumot rasmiy [Clarity hujjatlarida](https://learn.microsoft.com/en-us/clarity/).

Maxfiylikni unutmang: parollar va shaxsiy ma’lumotlar maydonlari yashirilishi, maxfiylik siyosatida esa xulq-atvor haqidagi ma’lumotlar yig‘ilishi eslatilishi kerak.

## Qaysi patternlarni izlash kerak

- **Bosilmaydigan elementlarga kliklar.** Odamlar rasm, ikonka yoki tagiga chizilgan matnni bosadi va hech narsa bo‘lmaydi. Demak, element havolaga o‘xshaydi.
- **Rage clicks** — bir joyga ketma-ket tez kliklar. Odatda buzilgan tugma, sekin javob yoki yuklanish holati tushunarsizligi.
- **Dead clicks** — interfeysdan hech qanday javob bo‘lmagan klik.
- **Skroll xaritasida keskin uzilish.** Tashrifchilarning ko‘pchiligi asosiy blokkacha yetmaydi: u juda pastda yoki undan yuqorida «soxta tub» — sahifa oxiriga o‘xshagan blok bor.
- **Kursorning u yoqdan-bu yoqqa yurishi va qaytishlar.** Odam yuqoriga-pastga aylantirib, ma’lumot qidiradi — u yetishmaydi yoki yashiringan.
- **Tashlab ketilgan formalar.** Yozuvlarda odamlar qaysi maydonda to‘xtab, chiqib ketishi ko‘rinadi. Metrica’da buning uchun formalar bo‘yicha alohida hisobot bor.
- **Mobil qurilmalarda boshqacha xulq.** Xaritalarni har doim qurilmalar bo‘yicha alohida ko‘ring: telefonda tugma banner ostida yoki ekran chetidan tashqarida qolishi mumkin.

## Topilmalarni tuzatishlarga qanday aylantirish

1. **Hammasini ketma-ket ko‘rishdan emas, savoldan boshlang.** Masalan: «Nega tarif sahifasida mobil qurilmalardan rad etishlar ko‘p?»
2. **Kerakli sessiyalarni filtrlang**: sahifa, qurilma, manba bo‘yicha, maqsadga yetmaganlar bo‘yicha.
3. **15–20 ta yozuvni ko‘ring** va takrorlanadigan muammolarni yozib oling. Bitta g‘alati sessiya — qonuniyat emas.
4. **Issiqlik xaritasi** va analitika raqamlari bilan solishtiring, muammo ko‘lamini baholang.
5. **Gipoteza tuzing**: «Agar formani yuqoriroqqa ko‘tarib, ikkita maydonni olib tashlasak, ko‘proq odam ariza yuboradi».
6. **O‘zgartirishni kiriting va natijani tekshiring** — davrlarni solishtirish yoki A/B-test orqali.
7. O‘zgarishlardan keyin **xaritalarni qayta tekshiring**: pattern yo‘qoldimi.

## Ko‘p uchraydigan xatolar

- Bir-ikkita yozuv bo‘yicha xulosa chiqarish.
- Kichik tanlov bo‘yicha xaritaga qarash: bir necha o‘nlab tashrifda manzara tasodifiy bo‘ladi.
- Desktop va mobilni bitta xaritada aralashtirish.
- Dinamik elementlar (slayderlar, qalqib chiquvchi oynalar) kliklar xaritasini buzishi mumkinligini unutish.
- Yozuvlarni to‘plab, hech qachon tahlil qilmaslik.

## FAQ

### Webvisor yoki Clarity — qaysi birini tanlash kerak?

Agar Yandex Metrica’dan allaqachon foydalanayotgan bo‘lsangiz, Webvisor va xaritalar o‘sha hisoblagichda yoqiladi. Clarity GA4 bilan birga qulay va rage clicks hamda dead clicks’ni o‘zi ajratib ko‘rsatadi. Ikkalasi ham bepul, agar saytni sekinlashtirmasa, ularni bir vaqtda ishlatish mumkin.

### Bunday vositalar saytni sekinlashtiradimi?

Skriptlar asinxron yuklanadi va odatda sahifa ko‘rinishini to‘sib qo‘ymaydi, lekin har qanday tashqi kod yuklama qo‘shadi. Faqat haqiqatan foydalanadigan vositalarni ulang.

### Nechta yozuvni ko‘rish kerak?

Takrorlanadigan muammolarni ko‘rish uchun odatda bitta ssenariy bo‘yicha 15–20 ta sessiya yetarli. Agar o‘ninchi yozuvdan keyin yangi narsa chiqmasa, tuzatishlarga o‘ting.
