---
title: Jira’da o‘z workflow’ingizni qanday yaratish kerak
description: Jira’da o‘z workflow’ingiz: statuslar, o‘tishlar, shartlar, validatorlar va post-funksiyalar — ishlab chiqish, QA va reliz jarayoni misolida.
summary: Jira’dagi workflow — o‘tishlar bilan bog‘langan statuslar; shartlar vazifani kim siljita olishini hal qiladi, validatorlar o‘tishdan oldin ma’lumotni tekshiradi, post-funksiyalar undan keyin ishlaydi, yaxshi workflow esa real jarayonni eng kam statuslar bilan aks ettiradi.
---
## Workflow nimalardan iborat

**Workflow** — vazifaning yaratilishdan yakunigacha bo‘lgan yo‘li. Unda beshta element bor:

| Element | Nima qiladi | Misol |
|---|---|---|
| **Status** | Vazifa hozir qayerda | In Progress, QA |
| **O‘tish (transition)** | Statuslar orasidagi ruxsat etilgan harakat | «QA’ga yuborish»: In Progress’dan QA’ga |
| **Shart (condition)** | O‘tishni kim ko‘radi va ishlata oladi | Testdan o‘tganini faqat QA guruhi belgilaydi |
| **Validator** | O‘tishdan oldin nima bajarilgan bo‘lishi kerak | Fix version maydoni to‘ldirilgan |
| **Post-funksiya** | O‘tishdan keyin avtomatik nima sodir bo‘ladi | Rezolyutsiya qo‘yish, ijrochi tayinlash |

Har bir status **toifaga** tegishli: To Do, In Progress yoki Done. Doskalar, hisobotlar va qidiruv shu toifalarga tayanadi, shuning uchun ularni diqqat bilan tanlang.

## Workflow qayerda tahrirlanadi

- **Company-managed loyihalar**: administrator workflow’ni Jira’ning global sozlamalarida, vazifalar va workflow bo‘limida tahrirlaydi. Workflow loyihaga **workflow sxemasi** orqali ulanadi, u vazifa turlarini workflow’lar bilan bog‘laydi. O‘zgarishlar qoralama sifatida saqlanadi va keyin e’lon qilinadi.
- **Team-managed loyihalar**: loyiha sozlamalarini oching, vazifa turini tanlang va uning workflow’ini tahrirlang. Klassik uch turdagi qoidalar o‘rniga bu yerda soddaroqlari bor: vazifani kim siljitishini cheklash, maydonlarni tekshirish va o‘tishdan keyin amallarni bajarish.

Mantiq bir xil, faqat sozlash chuqurligi farq qiladi.

## Real ishlab chiqish, QA va reliz jarayonini ko‘chiramiz

Jira imkoniyatlaridan emas, ish aslida qanday harakatlanishidan boshlang. Odatiy mahsulot jamoasi:

```text
To Do -> In Progress -> Code Review -> QA -> Ready for Release -> Done
             ^              |           |
             +--------------+-----------+
          (changes requested / QA failed)
```

Endi sxemani qoidali o‘tishlarga aylantiramiz:

| O‘tish | Qayerdan qayerga | Qoidalar |
|---|---|---|
| **Ishga olish** | To Do’dan In Progress’ga | Post-funksiya: joriy foydalanuvchiga tayinlash |
| **Ko‘rib chiqishga yuborish** | In Progress’dan Code Review’ga | Qoidasiz, o‘tish tez bo‘lishi kerak |
| **Qayta ishlashga qaytarish** | Code Review’dan In Progress’ga | Validator: izoh majburiy |
| **Tasdiqlash** | Code Review’dan QA’ga | Shart: dasturchi roliga ega foydalanuvchilar |
| **QA’dan o‘tmadi** | QA’dan In Progress’ga | Validator: muammo tavsifi bilan izoh |
| **QA’dan o‘tdi** | QA’dan Ready for Release’ga | Shart: faqat QA guruhi. Validator: Fix version to‘ldirilgan |
| **Reliz** | Ready for Release’dan Done’ga | Shart: reliz-menejer roli. Post-funksiya: Done rezolyutsiyasi |

Toifalar: To Do — **To Do**’da, o‘rtadagi to‘rtta status — **In Progress**’da, Done — **Done**’da.

## Bosqichma-bosqich

1. **Jarayonni chizing** — jamoa bilan qog‘ozda yoki doskada. Har bir status nimani anglatishi va unga kim mas’ulligini kelishib oling.
2. **Mavjud workflow’dan nusxa oling**, standartini to‘g‘ridan-to‘g‘ri tahrirlamang. Shunda zaxira variant qoladi.
3. **Statuslar qo‘shing** va har biriga to‘g‘ri toifani bering.
4. **O‘tishlarni yarating**, nomlari tushunarli fe’l bo‘lsin: «QA’ga yuborish», shunchaki «Keyingi» emas.
5. **Qoidalarni** faqat ular haqiqiy xatolarning oldini oladigan joyga qo‘shing.
6. **Workflow’ni** sxema orqali vazifa turlariga ulang va e’lon qiling. Mavjud vazifalar yo‘qoladigan statuslarda bo‘lsa, Jira ularni yangilari bilan moslashtirishni so‘raydi.
7. **Doska ustunlarini yangilang**, har bir yangi status kerakli ustunga tushsin.
8. **Sinab ko‘ring** — bir nechta vazifa va turli rollarga ega akkauntlar bilan.

## Workflow’ni qanday murakkablashtirmaslik kerak

- **Statuslar kamroq.** Status faqat unda kimdir boshqacha harakat qilsa qo‘shiladi. «Anvar ko‘rib chiqishini kutyapti» — status emas, bu ijrochi.
- **Har bir bo‘lim uchun status yo‘q.** Statuslar tashkiliy tuzilmani emas, ish holatini tasvirlaydi.
- **«Istalgan statusdan istalganiga» o‘tishlarga ehtiyotkorlik.** Ular qulay, lekin jarayonni ko‘rinmas qiladi.
- **Har bir validatorning sababi bor.** Har bir majburiy maydon o‘tishni sekinlashtiradi. Relizlar va hisobotlarni himoya qiladiganlarini qoldiring.
- **Rezolyutsiyani unutmang.** Company-managed loyihalarda Done’ga yo‘lda rezolyutsiya qo‘yilmasa, vazifalar «Unresolved» bo‘lib qoladi, filtrlar va hisobotlar esa noto‘g‘ri ko‘rsata boshlaydi.
- **Bir nechta loyiha uchun bitta workflow.** Umumiy workflow’ni qo‘llab-quvvatlash har bir jamoa uchun alohidasidan osonroq.

## FAQ

### Shart validatordan nimasi bilan farq qiladi?

Shart o‘tish foydalanuvchiga umuman mavjudmi yoki yo‘qligini hal qiladi — tugma shunchaki ko‘rinmasligi mumkin. Validator esa urinib ko‘rishga imkon beradi, lekin ma’lumot to‘liq bo‘lmasa, o‘tishni xato bilan to‘xtatadi.

### Allaqachon ishlatilayotgan loyihada workflow’ni o‘zgartirsa bo‘ladimi?

Ha. O‘zgarishlarni e’lon qilganda yoki workflow’ni almashtirganda Jira o‘chirilgan statuslardagi vazifalarni yangilari bilan moslashtirishni so‘raydi. Buni tinch paytda qiling va jamoani oldindan ogohlantiring.

### Code Review uchun alohida status kerakmi?

Agar ko‘rib chiqish muntazam vaqt olsa va bu navbatni doskada ko‘rishni istasangiz — ha. Ko‘rib chiqish tez va darhol bajarilsa, alohida status faqat ortiqcha bosishlar qo‘shadi.
