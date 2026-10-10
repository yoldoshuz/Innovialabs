---
title: Ma’lumotlar bazasi replikatsiyasi nima va u nega kerak
description: Replikatsiya bazaning jonli nusxalarini boshqa serverlarda saqlaydi. Primary-replica sxemasi, sinxron va asinxron rejimlar va nega bu zaxira emas.
summary: Replikatsiya asosiy bazadagi o‘zgarishlarni bir yoki bir nechta replikaga uzluksiz nusxalaydi: shunda o‘qish yuklamasini taqsimlash va asosiy server ishdan chiqsa replikaga o‘tish mumkin. U server nosozligidan himoya qiladi, lekin xatolardan emas: o‘chirilgan jadval barcha replikalarda ham o‘chadi, shuning uchun zaxira nusxalar baribir kerak.
---

## Replikatsiya oddiy so‘zlar bilan

**Ma’lumotlar bazasi replikatsiyasi** — bazaning bir yoki bir nechta **jonli nusxasini** boshqa serverlarda saqlash va ma’lumotlar o‘zgarganda ularni avtomatik yangilab borish.

Eng keng tarqalgan sxema — **primary-replica** (uni leader-follower, eski hujjatlarda esa master-slave deb ham atashadi):

- **Primary** barcha yozuvlarni qabul qiladi.
- **Replikalar** primary dan o‘zgarishlar oqimini oladi va ularni qo‘llaydi.
- Ilova replikalardan **o‘qishi** mumkin, yozish esa faqat primary ga.

PostgreSQL replikalarga oldindan yozish jurnalini (WAL), MySQL esa binar logni (binlog) uzatadi. Mohiyat bitta: primary dagi har bir o‘zgarish nusxalarda takrorlanadi.

## U nega kerak

- **Yuqori mavjudlik.** Asosiy server ishdan chiqsa, replikada deyarli barcha ma’lumotlar allaqachon bor va u yuklamani soatlab tiklash o‘rniga soniyalar yoki daqiqalarda o‘z zimmasiga oladi.
- **O‘qishni masshtablash.** Hisobotlar, qidiruv va analitika replikalarda ishlaydi va asosiy yuklamani sekinlashtirmaydi.
- **Geografiya.** Foydalanuvchilarga yaqinroq yoki boshqa data-markazdagi replika kechikishni kamaytiradi va maydonchadagi avariyadan omon qoladi.
- **Og‘ir amallarni xavfsiz bajarish.** Uzoq eksportlar va analitik so‘rovlarni replikada ishga tushirish mumkin.

## Sinxron va asinxron replikatsiya

| | Asinxron | Sinxron |
|---|---|---|
| Yozuv qachon tasdiqlanadi | Primary uni saqlashi bilanoq | Kamida bitta replika tasdiqlagandan keyin |
| Yozuv kechikishi | Pastroq | Yuqoriroq, replikagacha bo‘lgan tarmoqqa bog‘liq |
| Primary ishdan chiqqandagi xavf | Oxirgi tranzaksiyalar yo‘qolishi mumkin | Tasdiqlangan tranzaksiyalar yo‘qolmaydi |
| Replika ishdan chiqqandagi xavf | Yozuv uchun yo‘q | Ishlaydigan sinxron replikasiz yozuv to‘xtab qolishi mumkin |

**Asinxron** replikatsiya ko‘pchilik sxemalarda standart variant: tez, lekin replikalar biroz orqada qoladi. **Sinxron** esa tezlik va mavjudlik hisobiga tasdiqlangan ma’lumotlar ikki joyda borligini kafolatlaydi. Ko‘pincha ikkalasi birlashtiriladi: yaqinda bitta sinxron replika, qolganlari asinxron. MySQL da oraliq **yarim sinxron** rejim ham bor.

## O‘qishni masshtablash va replikalarning orqada qolishi

O‘qishni replikalarga yuborish qulay, lekin **orqada qolish (replication lag)** haqida unutmang: replika primary dan millisekundlarga, yuklama ostida esa sezilarli darajada ko‘proq orqada qolishi mumkin.

Klassik xato: foydalanuvchi profilini saqladi, keyingi sahifa replikadan o‘qiydi va eski ma’lumotlarni ko‘rsatadi. Yechimlar:

- O‘zgarishdan keyin bir muddat **«o‘z yozuvlaringizni»** primary dan o‘qish.
- Muhim o‘qishlarni (balanslar, to‘lovlar, qoldiqlar) primary da qoldirish.
- **Orqada qolishni kuzatish** va juda orqada qolgan replikalarni o‘qish pulidan chiqarish.

## Nosozlikda almashtirish (failover)

**Failover** — asosiy server ishdan chiqqanda primary rolini replikaga o‘tkazish.

- **Qo‘lda failover**: muhandis replikani ko‘taradi va ilovani qayta sozlaydi. Oddiy, lekin sekin, ayniqsa tunda.
- **Avtomatik failover**: PostgreSQL uchun Patroni kabi vositalar yoki bulutdagi boshqariladigan bazalarning o‘rnatilgan mexanizmlari nosozlikni o‘zi aniqlaydi va replikani ko‘taradi.

Asosiy xavf — **split-brain**, ya’ni ikki server bir vaqtda o‘zini primary deb hisoblab, yozuvlarni qabul qilishi. To‘g‘ri avtomatik failover konsensus yoki kvorumga tayanadi va eski primary ni ajratib qo‘yadi. Almashtirishni muntazam sinab ko‘ring: tekshirilmagan failover odatda aynan kerak bo‘lganda ishlamay qoladi.

## Replikatsiya — bu zaxira nusxa emas

Replikatsiya **har bir** o‘zgarishni, jumladan xatolarni ham sidqidildan nusxalaydi:

- `DROP TABLE` yoki `WHERE` siz noto‘g‘ri `UPDATE` bir zumda barcha replikalarga yetib boradi.
- Ma’lumotlarni buzadigan ilova xatolari ham replikatsiya qilinadi.
- Shifrlovchi virus yoki buzilgan hisob qaydnomasi barcha nusxalarga ta’sir qiladi.

Alohida saqlanadigan **zaxira nusxalar** kerak, ideal holda xatodan oldingi holatni qaytarish uchun **vaqt nuqtasiga tiklash (PITR)** imkoniyati bilan. O‘zgarishlarni belgilangan kechikish bilan qo‘llaydigan **kechiktirilgan replika** xatoni ushlashga yordam beradi, lekin zaxira nusxalar o‘rnini bosmaydi.

## FAQ

### Nechta replika kerak?

Yuqori mavjudlik uchun kamida bitta replika, kvorumli avtomatik failover uchun esa klasterda odatda kamida uchta tugun kerak. Ko‘proq replikani faqat o‘qish yuklamasi yoki geografiya talab qilganda qo‘shing.

### Replikaga yozish mumkinmi?

Standart primary-replica sxemasida — yo‘q, replikalar faqat o‘qish uchun. Bir nechta tugunda yozishga ruxsat beruvchi multi-primary sxemalar mavjud, lekin ular ziddiyatlarni hal qilishda murakkablik qo‘shadi va aniq vazifalar uchun qo‘llaniladi.

### Bulutdagi boshqariladigan baza replikatsiyani o‘zi sozlaydimi?

Odatda u replikalar va avtomatik failover ni yoqish kerak bo‘lgan opsiyalar sifatida taklif qiladi. Baribir sxemani tanlash, orqada qolishni kuzatish, ilovaning qayta ulanishini o‘ylab chiqish va zaxira nusxalarni unutmaslik sizning vazifangiz.
