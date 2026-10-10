---
title: JQL: Jira’da kengaytirilgan qidiruv va filtrlar
description: JQL’ni o‘rganamiz: operatorlar, currentUser() va startOfWeek() funksiyalari, saqlangan filtrlar, dashbordlar, obunalar va menejerlar uchun tayyor so‘rovlar.
summary: JQL — Jira’ning so‘rovlar tili: siz maydonlar, operatorlar va funksiyalarni assignee = currentUser() AND resolution = Unresolved kabi shartlarga yig‘asiz, ularni filtr sifatida saqlaysiz va dashbordlar hamda xat orqali obunalarda qayta ishlatasiz.
---
## JQL nima

**JQL (Jira Query Language)** — Jira’dagi kengaytirilgan qidiruv tili. So‘rov — **maydon, operator, qiymat** ko‘rinishidagi shartlar to‘plami bo‘lib, ular `AND`, `OR`, `NOT` orqali birlashtiriladi va kerak bo‘lsa `ORDER BY` bilan tartiblanadi:

```text
project = APP AND type = Bug AND resolution = Unresolved ORDER BY priority DESC
```

Vazifalar qidiruvini oddiy rejimdan **JQL** rejimiga o‘tkazing — Jira yozish davomida maydonlar, qiymatlar va funksiyalarni taklif qiladi.

## Har kuni kerak bo‘ladigan operatorlar

| Operator | Ma’nosi | Misol |
|---|---|---|
| `=` `!=` | Teng, teng emas | `status = "In Progress"` |
| `>` `>=` `<` `<=` | Taqqoslash, ko‘pincha sanalar uchun | `created >= -7d` |
| `IN` `NOT IN` | Ro‘yxatdagilardan biri | `priority IN (Highest, High)` |
| `~` `!~` | Matnni o‘z ichiga oladi, olmaydi | `summary ~ "payment"` |
| `IS EMPTY` `IS NOT EMPTY` | Maydon bo‘sh yoki to‘ldirilgan | `assignee IS EMPTY` |
| `WAS` | Maydon qachondir shu qiymatga ega bo‘lgan | `status WAS "QA"` |
| `CHANGED` | Maydon o‘zgargan, qanday o‘zgarganini aniqlashtirish mumkin | `status CHANGED TO Done AFTER -14d` |

Maslahatlar:

- Bo‘sh joyli qiymatlarni qo‘sh qo‘shtirnoqqa oling: `"In Progress"`.
- Nisbiy sanalar birliklar bilan yoziladi: `-1d`, `-2w`, `-4h`.
- `AND` va `OR`ni aralashtirganda qavslardan foydalaning: `project = APP AND (priority = Highest OR labels = hotfix)`.
- `statusCategory` (To Do, In Progress, Done) barcha statuslarni nomma-nom sanashdan ishonchliroq.

## So‘rovni dinamik qiladigan funksiyalar

Funksiyalar qidiruv paytida hisoblanadi, shuning uchun bitta saqlangan so‘rov hamma uchun va har hafta ishlaydi.

| Funksiya | Nima qaytaradi |
|---|---|
| `currentUser()` | So‘rovni bajarayotgan odamni |
| `now()` | Joriy sana va vaqtni |
| `startOfDay()`, `startOfWeek()`, `startOfMonth()` | Joriy davr boshini; siljishni qabul qiladi, masalan `startOfWeek(-1)` |
| `endOfWeek()`, `endOfMonth()` | Joriy davr oxirini |
| `openSprints()`, `closedSprints()` | Faol yoki yakunlangan sprintlarni |
| `membersOf("group")` | Guruh foydalanuvchilarini |
| `unreleasedVersions()` | Hali chiqarilmagan versiyalarni |

E’tibor bering: hafta boshi Jira’dagi lokal va vaqt mintaqasi sozlamalariga bog‘liq.

## Menejerlar uchun tayyor so‘rovlar

`APP` o‘rniga loyihangiz kalitini yozing.

Joriy sprintda nima qoldi:

```text
project = APP AND sprint IN openSprints() AND statusCategory != Done ORDER BY Rank
```

Muddati o‘tgan vazifalar:

```text
project = APP AND duedate < now() AND resolution = Unresolved ORDER BY duedate ASC
```

Besh kun va undan ortiq jarayonda qotib qolgan vazifalar:

```text
project = APP AND status = "In Progress" AND updated <= -5d
```

Ijrochisiz jiddiy baglar:

```text
project = APP AND type = Bug AND priority IN (Highest, High) AND assignee IS EMPTY AND resolution = Unresolved
```

Shu hafta yaratilgan va o‘tgan hafta hal qilinganlar:

```text
project = APP AND created >= startOfWeek()
project = APP AND resolved >= startOfWeek(-1) AND resolved < startOfWeek()
```

Oxirgi ikki haftada QA’dan qaytganlar:

```text
project = APP AND status CHANGED FROM QA TO "In Progress" AFTER -14d
```

Jamoa hozir nima ustida ishlayapti:

```text
assignee IN membersOf("dev-team") AND statusCategory = "In Progress" ORDER BY assignee
```

## Saqlangan filtrlar

**Save as**’ni bosib, nom berganingizda so‘rov **filtrga** aylanadi. Keyin:

- **Ulashing** — guruh, loyiha yoki aniq odamlar bilan; standart holatda filtr shaxsiy bo‘ladi.
- **Tushunarli nom bering**: «APP — muddati o‘tgan», «mening filtrim 3» emas.
- **Qayta ishlating** — doskalar, dashbordlar va obunalar uchun manba sifatida. Doskaning o‘zi ham filtrga qurilgan, shuning uchun o‘sha filtrni o‘zgartirish doska ko‘rsatadigan narsani o‘zgartiradi.

## Dashbordlar

**Dashbord** — gadjetlar sahifasi, va ko‘pchilik gadjetlar ma’lumotni saqlangan filtrdan oladi. Foydali birikmalar:

- **Filter Results** — filtrdagi vazifalar ro‘yxati, masalan muddati o‘tganlar.
- **Two Dimensional Filter Statistics** — «ijrochi va statuslar» kabi jadval.
- **Pie Chart** — ustuvorlik, tur yoki komponent bo‘yicha taqsimot.
- **Created vs Resolved** — jamoa kiruvchi oqimga ulguryaptimi.

Dashbordga uning filtrlari bilan bir xil auditoriyaga kirish bering, aks holda odamlar bo‘sh gadjetlarni ko‘radi.

## Obunalar

**Obuna** filtr natijalarini jadval bo‘yicha pochtaga yuboradi. Filtrni oching, obuna yarating, qabul qiluvchilar va chastotani tanlang — masalan, har dushanba ertalab muddati o‘tgan vazifalar. Obunalar kam va har biri maqsadli bo‘lsin: hech kim o‘qimaydigan kundalik xat — bu shovqin.

## Keng tarqalgan xatolar

- `currentUser()` va `startOfWeek()` o‘rniga qat’iy yozilgan ismlar va sanalar.
- Workflow’da bir nechta yakuniy status bo‘lsa ham `status != Done` ishlatish; `statusCategory != Done` ishonchliroq.
- `OR` atrofida qavslarni unutish.
- Dashbordga kirish ochilgan, lekin uning filtrlariga — yo‘q.

## FAQ

### Nega bitta filtr bo‘yicha hamkasblarda natijalar turlicha?

JQL kirish huquqlarini hisobga oladi, shuning uchun har kim faqat o‘zi kira oladigan loyihalardagi vazifalarni ko‘radi. Yana bir keng tarqalgan sabab — `currentUser()` kabi funksiyalar, u har bir foydalanuvchi uchun uning o‘zini qaytaradi.

### Rezolyutsiya statusdan nimasi bilan farq qiladi?

Status — vazifa workflow’ning qayerida turgani. Rezolyutsiya — u qanday yakunlangani. Agar workflow’ingiz yakunlashda rezolyutsiya qo‘ysa, `resolution = Unresolved` ochiq vazifalarni ishonchli topadi.

### Izohlardagi matn bo‘yicha qidirsa bo‘ladimi?

Ha. `comment ~ "so‘z"` sharti izohlar bo‘yicha, `text ~ "so‘z"` esa asosiy matn maydonlari bo‘yicha birdaniga qidiradi.
