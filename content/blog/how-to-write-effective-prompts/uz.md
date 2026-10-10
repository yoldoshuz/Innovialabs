---
title: Samarali promptlar yozish: tuzilma, misollar va shablonlar
description: Promptning besh qismli universal tuzilmasi — rol, kontekst, vazifa, cheklovlar, format — odatiy biznes vazifalari uchun «oldin va keyin» misollari bilan.
summary: Yaxshi prompt besh qismdan iborat: rol, kontekst, vazifa, cheklovlar va javob formati. Vaziyat va kutilgan natijani qanchalik aniq tasvirlasangiz, keyin shunchalik kam tuzatish kerak bo‘ladi.
---

## Qisqa javob

Siz aytmaguningizcha model kompaniyangiz, mijozlaringiz va maqsadingiz haqida hech narsa bilmaydi. Shuning uchun zaif prompt deyarli har doim «noto‘g‘ri so‘zlar» emas, balki **kontekst yetishmasligi**dir. Ishlaydigan tuzilma:

1. **Rol** — model kim sifatida ishlaydi.
2. **Kontekst** — nima bo‘lyapti, kim uchun, qanday ma’lumotlar bor.
3. **Vazifa** — aynan nima qilish kerak, bitta aniq harakat bilan.
4. **Cheklovlar** — nimadan qochish, hajm, ohang, til.
5. **Format** — javob qanday ko‘rinishda bo‘lishi kerak.

## Nusxa olish mumkin bo‘lgan shablon

```text
Rol: sen — [nima bilan shug‘ullanadigan] [mutaxassis]san.
Kontekst: [kompaniya, auditoriya, vaziyat, boshlang‘ich ma’lumotlar].
Vazifa: [bitta aniq harakat].
Cheklovlar: [hajm, ohang, nima qilish mumkin emas, qaysi tilda].
Format: [ro‘yxat, jadval, JSON, mavzuli xat va h.k.].
```

Qismlarni «Rol», «Kontekst» deb belgilash shart emas. Muhimi — ma’lumot promptda bo‘lsin.

## 1-misol: mijozga xat

**Oldin:**

> Mijozga kechikish haqida xat yoz.

**Keyin:**

> Sen — maishiy texnika internet-do‘konining mijozlar bilan ishlash bo‘yicha menejerisan. Mijoz muzlatgich buyurtma qilgan, yetkazib berish yetkazib beruvchi sababli 3 kunga kechikmoqda. Mijoz allaqachon qo‘llab-quvvatlashga yozgan va asabiylashgan. Qisqa uzr xati yoz: aybni boshqalarga ag‘darmasdan sababini tushuntir, yangi sanani ayt, qavatga bepul ko‘tarib berishni taklif qil. Ohang — xotirjam va hurmatli, rasmiyatchiliksiz. 120 so‘zgacha, xat mavzusi bilan.

Ikkinchi variantda model vaziyat, ohang va kompensatsiyani taxmin qilishi shart emas.

## 2-misol: ma’lumotlar tahlili

**Oldin:**

> Sotuvlarni tahlil qil.

**Keyin:**

> Sen — chakana savdo tarmog‘i tahlilchisisan. Quyida do‘konlar bo‘yicha choraklik sotuvlar eksporti (CSV). O‘tgan chorakka nisbatan tushumi eng ko‘p tushgan 3 do‘konni top va faqat jadval ma’lumotlariga tayanib sabablar bo‘yicha farazlarni taklif qil. Agar xulosa uchun ma’lumot yetarli bo‘lmasa — shunday deb yoz. Javob — jadval: do‘kon, o‘zgarish, faraz, nimani tekshirish kerak.

«Ma’lumot yetarli bo‘lmasa — shunday deb yoz» iborasi to‘qib chiqarilgan xulosalar xavfini kamaytiradi.

## 3-misol: mahsulot tavsifi

**Oldin:**

> Mahsulotni tasvirla: ryukzak.

**Keyin:**

> Sen — marketpleys kopirayterisan. Mahsulot: shahar ryukzagi, 20 l, suv o‘tkazmaydigan mato, 15,6 dyuymli noutbuk bo‘limi. Auditoriya — talabalar va ofis xodimlari. 60 belgigacha sarlavha va 5 banddan iborat tavsif yoz, har bir band xususiyat emas, foyda bo‘lsin. «Ideal» va «eng yaxshi» so‘zlarini ishlatma.

## Natijani yaqqol yaxshilaydigan usullar

- **Kerakli javob namunasini bering.** Bitta namuna ko‘pincha uzun tavsifdan yaxshiroq ishlaydi.
- **Ko‘rsatmalar va ma’lumotlarni ajrating.** Qayta ishlanadigan matnni qo‘shtirnoq, teglar yoki blokka joylang, model uni ko‘rsatma bilan adashtirmasin.
- **Katta vazifalarni bo‘ling.** Avval reja, keyin har bir qism alohida.
- **Faqat nima qilmaslikni emas, nima qilishni ayting.** «Qisqa gaplar bilan yoz» — «murakkab yozma»dan tushunarliroq.
- **Aniqlashtiruvchi savollar so‘rang.** «Biror narsa yetishmasa — avval so‘ra» iteratsiyalarni tejaydi.
- **Takrorlang.** Birinchi javob — qoralama. Nimani tuzatish kerakligini aniq ayting.

## Ko‘p uchraydigan xatolar

| Xato | Qanday tuzatish |
|---|---|
| Kontekst yo‘q | Auditoriya, maqsad va boshlang‘ich ma’lumotlarni tasvirlang |
| Bitta gapda bir nechta vazifa | Qadamlarni raqamlangan ro‘yxat qilib yozing |
| Noaniq format | Javob hajmi va tuzilmasini ko‘rsating |
| «Yaxshiroq qil» degan so‘rov | Aynan nima yoqmayotganini ayting |
| Maxfiy ma’lumotlarni joylashtirish | Yuborishdan oldin anonimlashtiring |

## Promptlarni jamoa vositasiga aylantirish

Muvaffaqiyatli promptlarni umumiy hujjat yoki bilimlar bazasida **to‘ldiriladigan maydonli shablonlar** sifatida saqlang. Shunda xodimlar so‘rovni qaytadan o‘ylab topmaydi, natija esa oldindan aytib bo‘ladigan bo‘ladi. Agar shablon doimiy ishlatilsa, uni API orqali CRM, bot yoki ichki xizmatga qo‘shish mumkin.

## FAQ

### Rolni yozish shartmi?

Yo‘q, lekin u ekspertiza darajasi va uslubni belgilashga yordam beradi. Roldan ko‘ra kontekst va aniq tasvirlangan natija muhimroq.

### Uzun prompt yomonmi?

Yo‘q, agar har bir qismi o‘rinli bo‘lsa. Foydali kontekstli uzun prompt odatda qisqasidan yaxshiroq ishlaydi, ortiqcha takrorlar va ziddiyatlar esa yomonlashtiradi.

### Bir xil promptlar ChatGPT, Claude va Gemini’da ishlaydimi?

«Rol — kontekst — vazifa — cheklovlar — format» tuzilmasi universal. Modellarning xatti-harakati tafsilotlarda farq qiladi, shuning uchun muhim shablonlarni o‘zingiz foydalanadigan modelda tekshirib ko‘ring.
