---
title: Notion’da loyihalarni boshqarishni qanday yuritish kerak
description: Notion’da loyiha boshqaruvi sxemasi: loyihalar, vazifalar va sprintlar bazalari, statuslar, mas’ullar, timeline, dashboardlar va cheklovlar.
summary: Notion’da loyiha boshqaruvi uchta bog‘langan bazaga tayanadi — Loyihalar, Vazifalar va Sprintlar — aniq statuslar, mas’ullar va sanalar bilan; ularning ustida timeline va dashboardlar quriladi, murakkab dasturlash jarayonlari uchun esa maxsus treker yaxshiroq.
---
## Qisqa javob

Notion’da loyihalarni boshqarish uchun **uchta bog‘langan baza** yetarli:

- **Loyihalar** — sanalari va egasi bor yirik maqsadlar.
- **Vazifalar** — ijrochisi, muddati va statusi bor aniq ish.
- **Sprintlar** — jamoa vazifalarni oladigan qisqa davrlar.

Bazalar **relations** orqali bog‘lanadi, ularning ustida ko‘rinishlar quriladi: vazifalar doskasi, loyihalar timeline’i va har bir ishtirokchi uchun dashboard. Notion Projects shabloni va ichki sprint sozlamasi tayyor holda shunga o‘xshash sxemani beradi — quyida uni yig‘ish yoki tekshirish mantig‘i.

## “Loyihalar” bazasi

| Xususiyat | Tur | Izoh |
|---|---|---|
| Nomi | Title | “Sayt redizayni” |
| Status | Status | Rejalashtirish, Jarayonda, Pauzada, Yakunlangan |
| Egasi | Person | Natija uchun bitta odam javob beradi |
| Muddatlar | Date (oraliq) | Timeline uchun boshlanish va tugash |
| Ustuvorlik | Select | Yuqori, O‘rta, Past |
| Vazifalar | Relation | “Vazifalar” bilan ikki tomonlama bog‘lanish |
| Progress | Rollup | Complete guruhidagi vazifalar foizi |

## “Vazifalar” bazasi

| Xususiyat | Tur | Izoh |
|---|---|---|
| Nomi | Title | Fe’l + natija: “Ariza formasini yig‘ish” |
| Status | Status | Backlog, Navbatda, Jarayonda, Ko‘rib chiqishda, Tayyor |
| Ijrochi | Person | Bitta mas’ul |
| Muddat | Date | Deadline |
| Loyiha | Relation | “Loyihalar” bilan bog‘lanish |
| Sprint | Relation | “Sprintlar” bilan bog‘lanish |
| Baho | Number yoki Select | Soatlar yoki story points |
| ID | ID | Chatlarda havola berish uchun vazifa raqami |

Qoida: har bir vazifaga **bitta ijrochi**. Agar ikki kishi ishlasa, vazifani bo‘lish kerak.

## “Sprintlar” bazasi

| Xususiyat | Tur | Izoh |
|---|---|---|
| Nomi | Title | “Sprint 12” |
| Sanalar | Date (oraliq) | Odatda bir-ikki hafta |
| Vazifalar | Relation | “Vazifalar” bilan bog‘lanish |
| Joriy | Formula | Faol sprintni belgilaydi |
| Bajarildi | Rollup | Bajarilgan vazifalar foizi |

“Joriy” xususiyati uchun formula:

```js
dateStart(prop("Sanalar")) <= today() and dateEnd(prop("Sanalar")) >= today()
```

Keyin “Vazifalar”dagi quyidagi formula faol sprint vazifalarini belgilaydi va doskani u bo‘yicha filtrlash qulay bo‘ladi:

```js
prop("Sprint").filter(current.prop("Joriy")).length() > 0
```

## Har kuni kerak bo‘ladigan ko‘rinishlar

- **Sprint doskasi** — status bo‘yicha guruhlangan vazifalar, “joriy sprintda” filtri bilan.
- **Mening vazifalarim** — `Ijrochi contains Me` filtri, status “Tayyor” emas, muddat bo‘yicha saralangan.
- **Backlog** — sprintsiz vazifalar, ustuvorlik bo‘yicha saralangan. Rejalashtirishda ish shu yerdan olinadi.
- **Loyihalar timeline’i** — “Loyihalar” bazasi “Muddatlar” bo‘yicha Timeline ko‘rinishida. Timeline’da yozuvlar o‘rtasidagi bog‘liqliklarni yoqish mumkin.
- **Muddatlar kalendari** — vazifalar “Muddat” xususiyati bo‘yicha.

## Dashboardlar

Dashboard — **bog‘langan ko‘rinishlarga** (`/linked view of database`) ega oddiy sahifa. Rahbar uchun variant:

- progressi ko‘rsatilgan jarayondagi loyihalar;
- barcha loyihalar bo‘yicha muddati o‘tgan vazifalar;
- ko‘rib chiqishni kutayotgan vazifalar;
- ijrochilar bo‘yicha yuklama — joriy sprint vazifalari ijrochi bo‘yicha guruhlangan jadval.

Ishtirokchi uchun: “Mening vazifalarim”, “Bugun va muddati o‘tgan”, “Mening loyihalarim”. Agar tarifingizda diagramma (chart) ko‘rinishi bo‘lsa, u statuslar va yuklama uchun qulay.

## Ish ritmi

1. **Rejalashtirish**: vazifalar backlog’dan “Sprint” xususiyati orqali sprintga o‘tkaziladi.
2. **Har kuni**: har kim sprint doskasida statuslarni yangilaydi.
3. **Ko‘rib chiqish**: tugallanmagan vazifalar keyingi sprintga o‘tadi yoki backlog’ga qaytadi.
4. **Baza avtomatlashtirishlari** (pullik tariflarda) rutinani o‘z zimmasiga oladi: masalan, vazifa “Tayyor”ga o‘tganda sanani qo‘yadi yoki ijrochini xabardor qiladi.

## Trekerlarga nisbatan cheklovlar

Notion ko‘p vazifalarni qamraydi, lekin Jira, Linear yoki YouTrack kabi maxsus trekerlarda Notion’da yo‘q yoki aylanma yo‘l bilan qilinadigan narsalar bor:

- **Qat’iy workflow**: Notion’da vazifani “Backlog”dan to‘g‘ridan-to‘g‘ri “Tayyor”ga o‘tkazishni taqiqlab bo‘lmaydi.
- **Agile hisobotlari**: burndown, velocity va cycle time’ni qo‘lda yoki tashqi vositalarda yig‘ish kerak.
- **Kod bilan bog‘liqlik**: branch, commit va pull request’lar zaifroq integratsiyalangan.
- **Ko‘lam**: juda katta vazifalar bazalarida interfeys sekinlashadi.
- **Vazifa darajasidagi huquqlar** korporativ trekerlarga nisbatan cheklangan.

Notion kichik jamoalar, agentliklar, marketing va operatsion jarayonlar uchun yaxshi mos keladi. Dasturchilar ko‘p va jarayon qat’iy bo‘lsa, vazifalar uchun treker, hujjatlar uchun esa Notion’dan foydalaning.

## FAQ

### Jamoa Scrum bo‘yicha ishlamasa, sprintlar kerakmi?

Yo‘q. “Sprintlar” bazasini yaratmasdan Kanban bo‘yicha ishlash mumkin: backlog, statuslar doskasi va muddatlar. Sprintlar muntazam rejalashtirish ritmi kerak bo‘lganda foydali.

### Sozlashlarga botib qolmaslik uchun nima qilish kerak?

“Vazifalar” bazasi va bitta doskadan boshlang. Loyihalar va sprintlarni vazifalar ko‘payganda yoki parallel yo‘nalishlar paydo bo‘lganda qo‘shing. Har bir yangi xususiyat aniq bir savolga javob berishi kerak.

### Mijozlarni Notion’dagi loyihaga ulash mumkinmi?

Ha, loyihaning alohida sahifasiga mehmon sifatida kirish orqali. Butun vazifalar bazasini ochish o‘rniga, mijoz uchun uning loyihasi bo‘yicha filtrlangan bog‘langan ko‘rinishli alohida sahifa yaratgan ma’qul.
