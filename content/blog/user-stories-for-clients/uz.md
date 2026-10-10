---
title: User stories: buyurtmachi mahsulot funksiyalarini qanday tasvirlaydi
description: Mahsulot funksiyasini qabul mezonlari bilan user story formatida qanday yozish kerak, toki jamoa vazifani bir xil tushunsin. Shablon, misollar va xatolar.
summary: User story — funksiyaning foydalanuvchi nigohidagi qisqa tavsifi: «[rol] sifatida men [harakat] qilmoqchiman, toki [maqsad]», hamda vazifa tayyorligini ko‘rsatuvchi qabul mezonlari.
---

## User story nima va u buyurtmachiga nega kerak

**User story** (foydalanuvchi hikoyasi) — bitta funksiyaning undan foydalanadigan inson nuqtai nazaridan tavsifi. U uchta savolga javob beradi: kim, nima qilmoqchi va nima uchun.

Klassik shablon:

> **[rol]** sifatida men **[harakat]** qilmoqchiman, toki **[maqsad yoki foyda]**.

Buyurtmachi uchun bu jamoaga texnik tafsilotlarsiz nima kerakligini tushuntirishning eng oddiy usuli. Siz muammo va natijani tasvirlaysiz, dasturchilar esa uni qanday amalga oshirishni o‘zlari tanlaydi.

## Yaxshi hikoyaning uch qismi

- **Rol.** Foydalanuvchining aniq turi: «xaridor», «ombor menejeri», «administrator». Agar rollar bir nechta bo‘lsa, shunchaki «foydalanuvchi» emas.
- **Harakat.** Inson mahsulotda nima qiladi. Bitta harakat — bitta hikoya.
- **Maqsad.** Bu unga nima uchun kerak. Aynan maqsad jamoaga siz o‘ylagandan soddaroq yoki yaxshiroq yechim taklif qilishga yordam beradi.

## Qabul mezonlari: ularsiz hikoya tugallanmagan

**Qabul mezonlari** (acceptance criteria) — funksiya tayyor deb hisoblanadigan tekshiriladigan shartlar. Ularsiz «tayyor» so‘zi siz va dasturchi uchun turli ma’noni anglatadi.

Qulay format — **Given / When / Then** (Berilgan / Qachon / Unda):

- **Berilgan:** boshlang‘ich vaziyat.
- **Qachon:** foydalanuvchi harakati.
- **Unda:** kutilgan natija.

Har bir mezonni «ha/yo‘q» bilan tekshirish mumkin bo‘lishi kerak.

## Yomon va yaxshi misol

**Yomon:**

> Katta do‘konlardagidek normal savatcha kerak, qulay bo‘lsin.

Foydalanuvchi kimligi, «normal» nimani anglatishi va natijani qanday tekshirish noaniq.

**Yaxshi:**

> **Xaridor** sifatida men **mahsulot sonini to‘g‘ridan-to‘g‘ri savatchada o‘zgartirmoqchiman**, toki **mahsulot sahifasiga qaytmasam**.

Qabul mezonlari:

1. Berilgan: savatchada mahsulot bor. Qachon xaridor «+» tugmasini bossa, unda son 1 ga oshadi va umumiy summa qayta hisoblanadi.
2. Qachon son 0 ga teng bo‘lsa, unda mahsulot savatchadan o‘chiriladi.
3. Qachon xaridor omborda borlidan ko‘proq qo‘shmoqchi bo‘lsa, unda qoldiq haqida xabar ko‘rsatiladi.

Bunday hikoyani qo‘shimcha qo‘ng‘iroqlarsiz baholash, amalga oshirish va tekshirish mumkin.

## Hikoyalarni qanday yozish: bosqichma-bosqich

1. **Rollarni sanab chiqing**: mahsulotdan kim foydalanadi va kim boshqaradi.
2. **Har bir rol uchun vazifalarni yozing**. Ekranlarni emas, aynan vazifalarni.
3. **Hikoyalarni shablon bo‘yicha shakllantiring** — har bir harakat uchun bittadan.
4. **Qabul mezonlarini qo‘shing**: oddiy ssenariy, xatolar, chegaraviy holatlar.
5. **Ustuvorlikni belgilang**: birinchi versiyaga nima kerak, nimani keyinroq qilish mumkin.
6. **Jamoa bilan muhokama qiling.** Hikoya — suhbat uchun asos, o‘zgartirib bo‘lmaydigan shartnoma emas.

## Buyurtmachilarning keng tarqalgan xatolari

- **Juda katta hikoya.** «Egasi sifatida men CRM xohlayman» — bu hikoya emas, butun mahsulot. Bir necha kunda bajariladigan vazifalarga bo‘ling.
- **Maqsad o‘rniga tayyor yechim.** «Ochiladigan ro‘yxat kerak» o‘rniga «shaharni tez tanlamoqchiman». Maqsadni yozing — jamoa qulayroq variant taklif qilishi mumkin.
- **Maqsad umuman yo‘q.** «Toki» qismisiz ustuvorlikni tushunish va funksiya muammoni hal qilishini tekshirish qiyin.
- **Noaniq mezonlar.** «Tez», «qulay», «chiroyli» ni tekshirib bo‘lmaydi. O‘lchanadigan qilib yozing yoki aniq xatti-harakatni tasvirlang.
- **Unutilgan xatolar.** Internet uzilsa, maydon bo‘sh bo‘lsa yoki to‘lov o‘tmasa nima bo‘ladi?

## Jamoaga yuborishdan oldin chek-list

- Rol aniqmi?
- Hikoyada bitta harakatmi?
- Aniq foydali «toki» bormi?
- Qabul mezonlari «ha/yo‘q» bilan tekshiriladimi?
- Xatolar va chegaraviy holatlar tasvirlanganmi?
- Ustuvorlik ko‘rsatilganmi?

## FAQ

### Buyurtmachi user story larni o‘zi yozishi shartmi?

Shart emas, lekin foydali. Sizdan kelgan qoralama hikoyalar ham jamoaga biznes mantiqini tushunishga yordam beradi. Keyin tahlilchi yoki loyiha menejeri ifodalar va mezonlarni takomillashtiradi.

### User story texnik topshiriqdan nimasi bilan farq qiladi?

Texnik topshiriq butun tizimni tasvirlaydi va ko‘pincha yechimlarni qat’iy belgilaydi. User story lar foydalanuvchilarning alohida ehtiyojlarini tasvirlaydi va jamoaga amalga oshirishda erkinlik qoldiradi. Amalda ular ko‘pincha birga ishlatiladi: hikoyalar texnik topshiriqning bir qismi bo‘lishi mumkin.

### Bitta hikoyaga nechta qabul mezoni kerak?

Natijani bir ma’noda tekshirish uchun qancha kerak bo‘lsa, shuncha. Odatda bu bir necha band: asosiy ssenariy va muhim istisnolar. Agar mezonlar juda ko‘p bo‘lsa, hikoyani bo‘lish kerak.
