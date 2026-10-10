---
title: Stack trace’ni qanday o‘qish va xatoni topish
description: Python, JavaScript va Java’dagi stack trace’ni tahlil qilamiz: xato turi qayerda, kutubxona freymlari orasidan o‘z kodingizni qanday topish va xatoni qidirish.
summary: Stack trace — dastur yiqilgan joygacha bo‘lgan chaqiruvlar zanjiri: xato turi va matnini, so‘ng o‘z kodingizdagi birinchi freymni toping — tuzatish deyarli doim o‘sha yerda.
---
## Stack trace nima va nimadan boshlash kerak

**Stack trace** — xato yuz bergan paytda faol bo‘lgan funksiya chaqiruvlari ro‘yxati. Har bir qator — **freym**: fayl, qator raqami va funksiya nomi. Uni ikki qadamda o‘qing:

1. **Xato turi va xabarini** toping — bu «nima bo‘ldi» degan savolga javob.
2. **O‘z kodingizdagi birinchi freymni** toping — bu «qayerni tuzatish kerak» degan savolga javob.

Asosiy qiyinchilik shundaki, tillar stekni turli tartibda chiqaradi. Uchta misolni ko‘rib chiqamiz.

## Python: pastdan yuqoriga o‘qiladi

```text
Traceback (most recent call last):
  File "/app/main.py", line 12, in <module>
    total = calculate_total(order)
  File "/app/billing.py", line 8, in calculate_total
    return sum(item["price"] * item["qty"] for item in order["items"])
  File "/app/billing.py", line 8, in <genexpr>
    return sum(item["price"] * item["qty"] for item in order["items"])
KeyError: 'qty'
```

- **most recent call last** — eng so‘nggi chaqiruv pastda degani.
- Oxirgi qator — xatoning o‘zi: `KeyError: 'qty'`, lug‘atda `qty` kaliti yo‘q.
- Uning ustidagi qator — aniq joy: `billing.py`, 8-qator.
- Yuqoridagilar — dastur u yerga qanday kelgani: `main.py` `calculate_total`ni chaqirgan.

Xulosa: buyurtmadagi mahsulotlardan birida `qty` maydoni yo‘q. Yoki ma’lumotni, yoki funksiyani tuzating (masalan, mantiqqa to‘g‘ri kelsa, `item.get("qty", 1)`).

Agar trace’da **During handling of the above exception, another exception occurred** iborasi bo‘lsa, xatolar ikkita: birinchisi — asl sabab, ikkinchisi uni qayta ishlash paytida paydo bo‘lgan. Birinchisidan boshlang.

## JavaScript (Node.js): yuqoridan pastga o‘qiladi

```text
TypeError: Cannot read properties of undefined (reading 'map')
    at renderList (/app/src/list.js:14:22)
    at handleRequest (/app/src/server.js:31:10)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
```

- Birinchi qator — tur va xabar: `undefined` ustida `.map` chaqirilgan.
- Darhol pastida — yiqilish joyi: `list.js`, 14-qator, 22-ustun.
- Undan pastda — chaqirganlar. `node_modules` ichidagi freymlar kutubxonaga tegishli (bu yerda Express), odatda ularni o‘tkazib yuborish mumkin.

Xulosa: `renderList`ga mavjud bo‘lmagan massiv kelgan. `handleRequest` 31-qatorda nima uzatayotganini tekshiring.

Brauzerda stek `main.3f2a.js:1:48213` kabi minifikatsiya qilingan bundle’ga ishora qilishi mumkin. Asl fayllarni ko‘rish uchun build’da va DevTools’da **source maps**ni yoqing.

## Java: yuqoridan pastga va albatta «Caused by»

```text
Exception in thread "main" java.lang.IllegalStateException: Failed to load config
	at com.example.App.loadConfig(App.java:42)
	at com.example.App.main(App.java:15)
Caused by: java.lang.NumberFormatException: For input string: "abc"
	at java.base/java.lang.Integer.parseInt(Integer.java)
	at com.example.Config.port(Config.java:27)
	at com.example.App.loadConfig(App.java:40)
	... 1 more
```

(Misol soddalashtirilgan.)

- Yuqoridagi xato — «o‘ram»: konfiguratsiya yuklanmadi.
- Haqiqiy sabab **Caused by** blokida, eng pastdagi shunday blok odatda eng muhimi.
- Undagi birinchi `java.base` freymi — standart kutubxona, sizning birinchi freymingiz esa `Config.java:27`: u yerga son o‘rniga `"abc"` satri kelgan.
- `... 1 more` qolgan freymlar yuqorida ko‘rsatilganlar bilan bir xil ekanini bildiradi.

## Begona freymlar orasidan o‘z kodingizni qanday topish

- Loyihangiz yo‘llarini qidiring: `/app/src`, `com.yourcompany`, repozitoriy nomi.
- `node_modules`, `site-packages`, `java.base`, `org.springframework` va shunga o‘xshashlarni o‘tkazib yuboring — kutubxonaning o‘zidagi xato unga noto‘g‘ri ma’lumot uzatishdan ancha kam uchraydi.
- Agar sizning freymlaringiz umuman bo‘lmasa, muammo konfiguratsiya yoki muhitda bo‘lishi ehtimoli katta: paket versiyalari, muhit o‘zgaruvchilari, fayllarga ruxsatlar.
- Ko‘p IDE’lar loyiha freymlarini ajratib ko‘rsatadi va ularni bosiladigan qiladi — bundan foydalaning.

## Xatoni internetda samarali qidirish

1. Butun trace’ni emas, **tur va xabarni** nusxalang: `TypeError: Cannot read properties of undefined`.
2. Noyob narsalarni olib tashlang: yo‘llar, ID’lar, o‘zgaruvchilaringiz nomlari, sanalar.
3. Kutubxona yoki framework nomini va uning asosiy versiyasini qo‘shing.
4. Aniq iborani qo‘shtirnoqqa oling.
5. Kutubxonaning GitHub’dagi **issues** bo‘limini ko‘ring — u yerda ko‘pincha sabab ham, aylanib o‘tish yo‘li ham bor.
6. Javob eski bo‘lsa, uni o‘z versiyangiz bilan solishtiring.

## Trace o‘qishdagi keng tarqalgan xatolar

- Faqat oxirgi qatorga qarab, «Caused by»ni e’tiborsiz qoldirish.
- Yomon ma’lumot paydo bo‘lgan joyni emas, yiqilish joyini tuzatish.
- Trace’ni loglardan olib tashlash yoki stek o‘rniga faqat `error.message`ni yozish.
- Istisnoni bo‘sh `catch`/`except` bilan bostirish — stek butunlay yo‘qoladi.

## FAQ

### Nega trace xatosi yo‘qdek ko‘rinadigan qatorni ko‘rsatadi?

Yiqilish yomon ma’lumot **ishlatilgan** joyda bo‘ladi, u **paydo bo‘lgan** joyda emas. Stek bo‘ylab chaqiruvchilar tomon yuqoriga chiqing va noto‘g‘ri qiymat qayerdan kelganini toping.

### Stek kesilgan bo‘lsa nima qilish kerak?

Chuqurlik chegarasini oshiring yoki to‘liq stekni loglang: Node.js’da `Error.stackTraceLimit`ni oshirish mumkin, Java’da `... N more` qatorini tashqi istisno bilan birga o‘qing. Production’da stekni to‘liq saqlaydigan xatolarni yig‘ish tizimlari yordam beradi.

### Foydalanuvchiga stack trace ko‘rsatish kerakmi?

Yo‘q. Foydalanuvchiga tushunarli xabar, stek esa loglarga. To‘liq trace yo‘llar, kutubxona versiyalari va infratuzilma tafsilotlarini oshkor qilishi mumkin.
