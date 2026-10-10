---
title: Model Context Protocol (MCP) nima va u nima uchun kerak
description: MCP AI yordamchilarni vositalar va ma’lumotlarga ulashni qanday standartlashtiradi, mijoz va server qanday tuzilgan va biznesga qanday integratsiyalar beradi.
summary: MCP — AI yordamchilarni tashqi ma’lumotlar va vositalarga ulashning yagona usulini belgilaydigan ochiq protokol. Bir marta yozilgan MCP-server har qanday mos yordamchi bilan ishlaydi.
---

## MCP haqida qisqacha

**Model Context Protocol (MCP)** — AI ilovasi tashqi tizimlarga — ma’lumotlar bazalari, CRM, fayllar, APIlarga — qanday ulanishini tavsiflovchi ochiq standart. Uni ko‘pincha AI uchun USB-C bilan solishtirishadi: ko‘plab turli adapterlar o‘rniga bitta ulagich.

MCPsiz yordamchining har bir servisga ulanishi aniq model va aniq ilova uchun alohida integratsiya sifatida qilinadi. MCP bilan tizimga kirishni **bir marta** tavsiflaysiz va undan protokolni qo‘llab-quvvatlaydigan har qanday yordamchi foydalana oladi.

## U qanday muammoni hal qiladi

Til modeli o‘zi faqat nimada o‘qitilgan bo‘lsa, shuni biladi. Bugun nechta buyurtma kelganini aytishi yoki trekerda vazifa yaratishi uchun unga tizimlaringizga kirish kerak.

Umumiy standart paydo bo‘lgunga qadar holat shunday edi:

- har bir AI ilova vositalarni ulash uchun o‘z formatini o‘ylab topardi;
- bir xil integratsiyani turli yordamchilar uchun qayta yozishga to‘g‘ri kelardi;
- model yoki platformani almashtirish ulanishlarni qayta qurishni anglatardi.

MCP bu qismlarni ajratadi: integratsiya alohida yashaydi va unga qaysi yordamchi murojaat qilishiga bog‘liq emas.

## MCP qanday tuzilgan

Protokolda uchta rol bor:

| Rol | Bu nima | Misol |
|---|---|---|
| **Xost** | Foydalanuvchi ishlaydigan ilova | Chat-yordamchi, IDE, ichki bot |
| **Mijoz (client)** | Xost ichidagi komponent, bitta server bilan ulanishni ushlab turadi | Yordamchidagi ulanish moduli |
| **Server** | Ma’lumotlar yoki amallarga kirishni ochadigan dastur | CRM, ma’lumotlar bazasi yoki fayllar uchun MCP-server |

Server uch turdagi imkoniyatni taqdim etishi mumkin:

- **Tools (vositalar)** — model chaqira oladigan amallar: bitim yaratish, xabar yuborish, qidiruv bajarish.
- **Resources (resurslar)** — kontekst uchun ma’lumotlar: hujjatlar, yozuvlar, fayllar.
- **Prompts (shablonlar)** — foydalanuvchi tanlay oladigan tayyor so‘rov ssenariylari.

Xabar almashinuvi **JSON-RPC** asosida qurilgan. Server foydalanuvchi kompyuterida lokal yoki HTTP orqali masofadan ishlashi mumkin. Batafsil spetsifikatsiya rasmiy saytda: [modelcontextprotocol.io](https://modelcontextprotocol.io).

## Biznes uchun integratsiya misollari

- **CRM.** Menejer yordamchidan so‘raydi: «Qaysi bitimlar bir haftadan ortiq qotib qolgan?» — yordamchi CRMning MCP-serveri orqali ma’lumot oladi va javob beradi.
- **Bilimlar bazasi.** Xodimlar ichki hujjatlardan oddiy til bilan javob qidiradi.
- **Analitika.** Yordamchi ma’lumotlar bazasiga so‘rov tuzadi va natijani tushuntiradi.
- **Vazifa trekerlari va messenjerlar.** Vazifalar yaratish, loyiha bo‘yicha xulosa, bildirishnomalar yuborish.
- **O‘z tizimlaringiz.** Hisob yoki ombor tizimi o‘z MCP-serverini oladi va undan istalgan mos yordamchi orqali foydalanish mumkin bo‘ladi.

## Xavfsizlik: nimaga e’tibor berish kerak

MCP modelga haqiqiy tizimlarga kirish huquqini beradi, shuning uchun xavfsizlik birinchi o‘rinda:

- **Minimal huquqlar.** Server faqat kerakli amallarni ochishi kerak. O‘qish va yozishni ajratgan ma’qul.
- **Amallarni tasdiqlash.** O‘chirish, to‘lov, xat yuborish — faqat foydalanuvchining aniq roziligidan keyin.
- **Ishonchli serverlar.** Serverlarni tekshirilgan manbalardan ulang: uchinchi tomon serveri u orqali o‘tadigan ma’lumotlarni ko‘radi.
- **Ma’lumotlar orqali in’ektsiyalar.** Xat yoki hujjatdagi matn modelga qaratilgan ko‘rsatmalarni o‘z ichiga olishi mumkin. Xost va server bu xavfni hisobga olishi kerak.
- **Loglar.** Qaysi vositalar qanday parametrlar bilan chaqirilganini yozib boring.

## Nimadan boshlash kerak

1. Xodimlar ma’lumot uchun eng ko‘p murojaat qiladigan bitta tizimni tanlang.
2. U uchun tayyor MCP-server bor-yo‘qligini tekshiring.
3. Bo‘lmasa, 3–5 ta asosiy amalni tavsiflang va rasmiy SDK yordamida o‘z serveringizni yarating.
4. Faqat o‘qish amallaridan boshlang, keyin tasdiq talab qiladigan amallarni qo‘shing.

## FAQ

### MCP faqat bitta model bilan ishlaydimi?

Yo‘q. MCP — ochiq protokol va uni turli AI ilovalar qo‘llab-quvvatlaydi. Spetsifikatsiya bo‘yicha yozilgan server aniq bir modelga bog‘lanmagan.

### MCP oddiy APIdan nimasi bilan farq qiladi?

API — aniq bir servisning interfeysi. MCP — umumiy standart bo‘lib, u orqali AI ilova qanday vositalar va ma’lumotlar mavjudligini bilib oladi va ularni chaqiradi. Ko‘pincha MCP-server mavjud API ustidagi yupqa qobiq bo‘ladi.

### Joriy tizimlarni MCP uchun qayta yozish kerakmi?

Odatda yo‘q. Mavjud API yoki ma’lumotlar bazasiga murojaat qiladigan va yordamchiga kerakli amallarni ochadigan MCP-server yozish kifoya.
