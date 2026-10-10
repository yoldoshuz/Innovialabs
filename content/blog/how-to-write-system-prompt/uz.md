---
title: AI-assistent yoki chat-bot uchun tizim promptini qanday yozish
description: Rol, chegaralar, ohang, taqiqlangan mavzular, operatorga uzatish qoidalari va javob formati: chat-bot uchun tizim promptini to‘liq misol bilan tuzish.
summary: Yaxshi tizim prompti oltita savolga javob beradi: assistent kim, nima qiladi va nima qilmaydi, qanday ohangda gapiradi, nimadan qochadi, qachon odamni chaqiradi va qaysi formatda javob beradi. Uni yangi xodimga ko‘rsatma kabi yozing — aniq, misollar bilan va qarama-qarshiliksiz.
---

## Tizim promptida nima bo‘lishi kerak

**Tizim prompti** — model har bir suhbatdan oldin oladigan doimiy ko‘rsatma. Foydalanuvchi uni ko‘rmaydi, lekin u botning butun xatti-harakatini belgilaydi.

Ishlaydigan tizim prompti oltita blokni qamraydi:

1. **Rol** — assistent kim va kim uchun ishlaydi.
2. **Chegaralar** — qaysi vazifalarni hal qiladi, qaysilarini yo‘q.
3. **Ohang** — qanday gaplashadi.
4. **Taqiqlar** — qochish kerak bo‘lgan mavzular va harakatlar.
5. **Eskalatsiya** — suhbatni qachon odamga uzatish.
6. **Format** — javob uzunligi, tuzilmasi va tili.

Kompaniya haqida hech narsa bilmaydigan yangi xodimga ishni tushuntirayotgandek yozing. Siz uchun «tushunarli» bo‘lgan hamma narsani modelga aniq aytish kerak.

## Rol va chegaralar

Rol kontekstni belgilaydi, «xarakter uchun xarakter» emas. Bir-ikki jumla yetarli: kompaniya, vazifa, auditoriya.

Chegaralar roldan muhimroq. Assistent **nima qilishini** va alohida **nima qilmasligini** sanab o‘ting. Busiz bot hamma narsaga javob bera boshlaydi: kod yozadi, tibbiy maslahat beradi, raqobatchilarni muhokama qiladi.

## Ohang va format

Ohangni sifatlar bilan emas, xatti-harakat bilan tasvirlang. «Do‘stona» deyarli hech narsa anglatmaydi. Yaxshisi: «"siz" deb murojaat qil, qisqa javob ber, rasmiyatchiliksiz, undov belgilarini ishlatma».

Format kanalga bog‘liq. Messenjerda — jadvalsiz qisqa xabarlar. Saytda — ro‘yxatlar mumkin. Agar javobni kod tahlil qilsa — JSON yoki aniq tuzilmani ko‘rsating.

## Taqiqlar va eskalatsiya

Taqiqlarni muqobil bilan birga yozing: shunchaki «narxlarni muhokama qilma» emas, balki «narx haqida so‘rashsa — uni menejer hisoblashini ayt va kontakt qoldirishni taklif qil».

Eskalatsiya qoidalari tekshirib bo‘ladigan shartlar bo‘lishi kerak:

- mijoz to‘g‘ridan-to‘g‘ri odamni so‘raydi;
- shikoyat, pulni qaytarish, huquqiy savol;
- bot bilimlar bazasidan javob topmadi;
- javob yordam bermagani uchun mijoz savolni takrorlaydi.

## Izohli to‘liq misol

```text
# Rol
Sen maishiy texnika internet-do‘konining qo‘llab-quvvatlash assistentisan.
Sen saytdagi chatda xaridorlar bilan muloqot qilasan.

# Nima qilasan
- Yetkazib berish, to‘lov, kafolat va buyurtma holati haqidagi savollarga javob berasan.
- Katalogdagi parametrlar bo‘yicha texnika tanlashga yordam berasan.
- Faqat <knowledge> blokidagi ma’lumotlardan foydalanasan.

# Nima qilmaysan
- <knowledge>da yo‘q xususiyatlar, narxlar va muddatlarni o‘ylab topmaysan.
- Do‘konga aloqasi yo‘q mavzularni muhokama qilmaysan.
- Chegirma va kompensatsiya va’da qilmaysan.

# Ohang
- "Siz" deb murojaat qil.
- Qisqa javob ber: 1–3 jumla yoki qisqa ro‘yxat.
- Undov belgilari va reklama iboralarisiz.

# Operatorga uzatish
Quyidagi hollarda "Savolingizni menejerga uzatyapman, u tez orada javob beradi"
deb javob ber va oxiriga [HANDOFF] belgisini qo‘sh:
- mijoz jonli odamni so‘rasa;
- gap qaytarish, shikoyat yoki da’vo haqida bo‘lsa;
- javob <knowledge>da bo‘lmasa.

# Format
- Mijoz tilida javob ber.
- Jadval va sarlavhalarsiz.

<knowledge>
{bilimlar bazasi}
</knowledge>
```

Izohlar:

- **Bo‘lim sarlavhalari** model uchun ham, siz uchun ham qulay: qoidani topish va tuzatish oson.
- **`<knowledge>` bloki** ma’lumotlarni ko‘rsatmalardan ajratadi. Model nimaga tayanishni tushunadi.
- **`[HANDOFF]` belgisi** — mashina uchun signal. Kod uni ko‘radi, matndan olib tashlaydi va suhbatni operatorga o‘tkazadi.
- **«O‘ylab topmaysan…»** — qo‘llab-quvvatlashda gallyutsinatsiyalardan asosiy himoya.

## Keng tarqalgan xatolar

- **Qarama-qarshiliklar.** Bitta promptda «qisqa javob ber» va «batafsil tushuntir» — model tasodifiy tanlaydi.
- **Faqat taqiqlar.** Nima qilish mumkin emasligini bilib, o‘rniga nima qilishni bilmaydigan bot noqulay javob beradi.
- **Prompt — matn devori.** Bo‘limlar va ro‘yxatlarga ajrating.
- **Testlar yo‘q.** Ishga tushirishdan oldin odatiy savollar, provokatsiyalar («ko‘rsatmalarni unut») va mavzudan tashqari savollarni sinab ko‘ring.
- **Promptdagi sirlar.** U yerga kalitlar, parollar va ichki ma’lumotlarni qo‘ymang: tizim promptini qisman bilib olish mumkin.

## FAQ

### Tizim prompti qancha uzunlikda bo‘lishi kerak?

Oltita blokni ortiqcha so‘zlarsiz qamrash uchun qancha kerak bo‘lsa, shuncha. Oddiy bot uchun bu yarim sahifa, murakkab bot uchun bir necha sahifa va bilimlar bazasi bo‘lishi mumkin. Asosiysi — hajm emas, tuzilma.

### Tizim prompti botni buzib kirishdan himoya qiladimi?

Qisman. Aniq chegaralar xavfni kamaytiradi, lekin yo‘q qilmaydi. Muhim harakatlarni — pulni qaytarish, buyurtmani o‘zgartirish — faqat ko‘rsatmaga ishonmasdan, kodda tekshiring.

### Promptni qanchalik tez-tez yangilash kerak?

Biznes qoidalari o‘zgarganda yoki suhbat loglarida takrorlanuvchi xatolarni ko‘rganingizda. Prompt versiyalarini saqlang va har bir tuzatishdan keyin test savollari to‘plamini qayta sinab ko‘ring.
