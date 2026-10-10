---
title: Notion bazalari: xususiyatlar, ko‘rinishlar va bog‘lanishlar
description: Notion’da baza yaratish, xususiyat turlarini tanlash, filtrli jadval, doska va kalendar ko‘rinishlari hamda bazalarni relations bilan bog‘lash.
summary: Notion’dagi ma’lumotlar bazasi — turlangan xususiyatlarga ega sahifalar to‘plami; to‘g‘ri xususiyatlar filtr va saralashni beradi, ko‘rinishlar bir xil ma’lumotni turli vazifalar uchun ko‘rsatadi, relations esa bazalarni takrorlashsiz bog‘laydi.
---
## Bir daqiqada mohiyati

Notion’dagi ma’lumotlar bazasi — har birida bir xil **xususiyatlar** (properties) to‘plami bo‘lgan sahifalar majmuasi. Bir xil yozuvlarni turli **ko‘rinishlarda** (views) ko‘rsatish mumkin: hisob uchun jadval, statuslar uchun doska, muddatlar uchun kalendar. **Relations** turli bazalardagi yozuvlarni bog‘laydi, masalan vazifalarni loyihalar bilan, shunda ma’lumotni nusxalash kerak bo‘lmaydi.

Qoida oddiy: avval xususiyatlarni o‘ylab chiqing, keyin ko‘rinishlarni quring.

## 1-qadam. Baza yarating

1. Bo‘sh sahifada `/database` deb yozing va **Database – Full page** yoki **Database – Inline**’ni tanlang.
2. To‘liq sahifali baza alohida bo‘lim sifatida qulay (“Vazifalar”, “Mijozlar”). Ichki baza — jadval hujjat ichida yashaganda.
3. Bazaga tushunarli ko‘plikdagi nom bering: “Vazifalar”, “Loyihalar”, “Xodimlar”.

Bazaning har bir qatori to‘liq sahifa: ichida matn yozish, chek-list va fayllar qo‘shish mumkin.

## 2-qadam. Xususiyat turlarini tanlang

Xususiyat turi qanday filtrlash va saralash mumkinligini belgilaydi. Asosiy turlar:

| Tur | Nima uchun | Misol |
|---|---|---|
| **Title** | Yozuv nomi, doim bor | “Lendingni yig‘ish” |
| **Status** | To-do / In progress / Complete guruhli ish bosqichlari | Backlog, Jarayonda, Tayyor |
| **Select** | Ro‘yxatdan bitta qiymat | Ustuvorlik: Yuqori |
| **Multi-select** | Bir nechta teg | Frontend, Dizayn |
| **Person** | Ish maydoni a’zosi | Ijrochi |
| **Date** | Sana yoki sanalar oralig‘i | Muddat, Sprint davri |
| **Number** | Valyuta, foiz formatidagi raqamlar | Byudjet |
| **Checkbox** | Ha/yo‘q | To‘langan |
| **Files & media** | Biriktirmalar | PDF shartnoma |
| **URL / Email / Phone** | Havolalar va kontaktlar | Mijoz sayti |
| **Relation / Rollup / Formula** | Bog‘lanish va hisob-kitob | Loyiha, Progress |

Tizim xususiyatlari ham bor: **Created time**, **Created by**, **Last edited time** va noyob raqamlar uchun **ID**.

Amaliy qoidalar:

- Ish bosqichlari uchun Select emas, **Status** ishlating: u qiymatlarni guruhlaydi va doskalar bilan yaxshiroq ishlaydi.
- Ijrochini matn sifatida saqlamang — faqat **Person**, aks holda “Mening vazifalarim” filtri bo‘lmaydi.
- Agar qiymatlar o‘ndan ortiq bo‘lsa va doim qo‘shilib tursa, bu Select emas, balki alohida baza va relation bo‘lishi kerak.

## 3-qadam. Ko‘rinishlarni sozlang

Joriy ko‘rinish nomi yonidagi **+** tugmasini bosing va turini tanlang. Har bir ko‘rinishning o‘z filtrlari, saralashi, guruhlashi va ko‘rinadigan xususiyatlari bor, ma’lumotlar esa umumiy qoladi.

- **Table** — to‘liq hisob, ommaviy tahrirlash.
- **Board** — Status yoki Select bo‘yicha guruhlangan Kanban doska. Kartochkani ustunlar orasida sudrasangiz, status o‘zi o‘zgaradi.
- **Calendar** — Date xususiyati bo‘yicha yozuvlar. Muddatlar va kontent-reja uchun mos.
- **Timeline** — sanalar oralig‘idagi chiziqlar, roadmap uchun qulay.
- **List** va **Gallery** — ixcham ro‘yxat va muqovali kartochkalar.

### Darhol yaratish kerak bo‘lgan filtrlar

- “Mening vazifalarim”: `Ijrochi` → `contains` → `Me`. Har bir a’zo o‘zinikini ko‘radi.
- “Muddati o‘tgan”: `Muddat` → `is before` → `Today` va `Status` → `is not` → `Tayyor`.
- “Shu hafta”: `Muddat` → `is within` → `This week`.

Shartlarni advanced filter orqali **AND / OR** guruhlariga birlashtirish mumkin. Ko‘rinishlarni ma’nosiga qarab nomlang: “Mening vazifalarim”, “Jamoa doskasi”, “Muddatlar”.

## 4-qadam. Bazalarni relations bilan bog‘lang

Misol: “Loyihalar” va “Vazifalar” bazalari.

1. “Vazifalar” bazasida **Relation** xususiyatini qo‘shing va “Loyihalar” bazasini tanlang.
2. Bog‘lanishni bog‘langan bazada ham ko‘rsatish opsiyasini yoqing, shunda u **ikki tomonlama** bo‘ladi: har bir loyihada uning vazifalari ro‘yxati paydo bo‘ladi.
3. Agar jarayon shunday bo‘lsa, limit qo‘ying: bitta vazifa — bitta loyiha.

Relation asosida “Loyihalar”ga **Rollup** qo‘shish mumkin: masalan, vazifalar soni yoki bajarilganlar foizi.

### Bog‘langan ko‘rinishlar

Loyiha sahifasida `/linked view of database` ni kiriting, “Vazifalar”ni tanlang va joriy loyiha bo‘yicha filtrlang. Shunda loyiha ichida uning o‘z vazifalar doskasi paydo bo‘ladi.

## Ko‘p uchraydigan xatolar

- **Hamma narsa uchun bitta baza.** Vazifalar, mijozlar va qaydlar bitta jadvalda tezda boshqarib bo‘lmaydigan holga keladi.
- **Har bir jamoa uchun bazaning nusxasi.** Yaxshisi, bitta baza va filtrlangan turli ko‘rinishlar.
- **Juda ko‘p xususiyat.** Har bir ko‘rinishda faqat keraklisini ko‘rsating, qolganini yashiring.
- **Tur o‘rniga matn.** Matn ko‘rinishidagi sanalar va ismlar bilan yozilgan odamlarni filtrlab bo‘lmaydi.

## FAQ

### Status Select’dan nimasi bilan farq qiladi?

Status — ish bosqichlari uchun maxsus tur: qiymatlari To-do, In progress va Complete guruhlariga ajratilgan, doskalar, shablonlar va avtomatlashtirishlar shu guruhlarga tayanadi. Select esa ro‘yxatdan bitta qiymat, masalan ustuvorlik.

### Turli teamspace’lardagi bazalarni bog‘lash mumkinmi?

Ha, relation bitta ish maydonidagi istalgan bazalar o‘rtasida ishlaydi. Lekin a’zo bog‘langan yozuvlarni faqat ularga kirish huquqi bo‘lsa ko‘radi.

### Ko‘rinishni o‘chirsam, ma’lumotlar ham o‘chadimi?

Yo‘q. Ko‘rinish — faqat ko‘rsatish usuli. Ma’lumotlar faqat yozuvlarning o‘zi yoki butun baza o‘chirilganda yo‘qoladi.
