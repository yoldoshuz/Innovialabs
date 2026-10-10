---
title: Rassilkalar nega spamga tushadi va buni qanday tuzatish mumkin
description: Xatlar nega spamga tushadi: SPF, DKIM va DMARC, jo‘natuvchi obro‘si, domenni qizdirish, bazani tozalash, Gmail va Yahoo talablari va matndagi xavflar.
summary: Pochta xizmati jo‘natuvchini tasdiqlay olmasa (SPF, DKIM, DMARC yo‘q) yoki shikoyatlar, o‘lik manzillar va hajmning keskin oshishi sababli unga ishonmasa, xatlar spamga tushadi; yechim — domen autentifikatsiyasi, bosqichma-bosqich qizdirish va toza baza.
---
## Qisqa javob

Pochta xizmatlari xat taqdirini uchta savol orqali hal qiladi:

1. **Bu haqiqatan sizmisiz?** SPF, DKIM va DMARC orqali tekshiriladi.
2. **Sizga ishonsa bo‘ladimi?** Bu domen va IP obro‘si: shikoyatlar, qaytgan xatlar, yuborish tarixi.
3. **Bu odamlarga kerakmi?** Xatlarni ochishadimi, javob berishadimi, «spam»ni bosishadimi.

Xat matni ham ta’sir qiladi, lekin odatda birinchi ikki banddan kamroq. Agar rassilka to‘satdan spamga tusha boshlagan bo‘lsa, mavzuni qayta yozishdan emas, autentifikatsiya va bazadan boshlang.

## SPF, DKIM va DMARC oddiy so‘zlar bilan

- **SPF** — domeningiz nomidan pochta yuborishga ruxsat berilgan serverlar ro‘yxati.
- **DKIM** — xatning raqamli imzosi: qabul qiluvchi xat o‘zgartirilmaganini va uni domen egasi yuborganini tekshiradi.
- **DMARC** — tekshiruvdan o‘tmagan xatlar bilan nima qilish kerakligi haqidagi qoida va hisobotlar uchun manzil. **Moslik** muhim: «Kimdan» maydonidagi domen SPF yoki DKIM’dan o‘tgan domen bilan bir xil bo‘lishi kerak.

Uchalasi ham DNS’dagi TXT yozuvlar. Rassilka servisi orqali yuboradigan domen uchun misol:

```dns
example.com.                 TXT  "v=spf1 include:_spf.esp-example.com ~all"
s1._domainkey.example.com.   TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkq..."
_dmarc.example.com.          TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

SPF va DKIM’ning aniq qiymatlarini rassilka servisingiz beradi. Muhim tafsilotlar:

- Domenda SPF yozuvi **bitta** bo‘lishi kerak; bir nechta servis unda bir nechta `include` orqali birlashtiriladi.
- SPF’da DNS so‘rovlari soniga cheklov bor, shuning uchun ortiqcha servislarni qo‘shmang.
- DMARC `p=none` bilan boshlanadi, hisobotlar o‘qiladi, so‘ng `quarantine` va `reject`gacha kuchaytiriladi.

## Gmail va Yahoo’ning ommaviy jo‘natuvchilarga talablari

2024-yildan boshlab Gmail va Yahoo ko‘p xat yuboradiganlar uchun majburiy talablar qo‘ydi (Google’da bu Gmail manzillariga kuniga taxminan 5000 ta xat):

- **SPF va DKIM** sozlangan, domen mosligi bilan **DMARC** e’lon qilingan (kamida `p=none`);
- `List-Unsubscribe` va `List-Unsubscribe-Post` sarlavhalari orqali **bir klikda obunadan chiqish** bor va so‘rovlar tez bajariladi;
- **spam shikoyatlari ulushi** past: Google 0,3% chegarasini belgilaydi va 0,1% dan past bo‘lishni tavsiya qiladi;
- yuboruvchi IP’larda to‘g‘ri va teskari DNS yozuvlari, TLS orqali ulanish.

Kamroq yuborsangiz ham bu talablarni bajaring: ular asosiy standartga aylandi.

## Obro‘ va domenni qizdirish

Yangi domen yoki yangi IP’ni pochta xizmatlari tanimaydi va katta rassilka bilan keskin boshlash spamga o‘xshaydi. **Qizdirish** — hajmni asta-sekin oshirish:

- yaqinda xat ochgan va bosgan eng faol obunachilardan boshlang;
- qaytgan xatlar va shikoyatlarni kuzatgan holda hajmni bosqichma-bosqich oshiring;
- shikoyatlar ko‘paysa, joriy darajada to‘xtang.

Marketing uchun **subdomen** (masalan, `news.example.com`) ishlatish qulay, shunda rassilka muammolari ish pochtasiga ta’sir qilmaydi. Gmail’dagi obro‘ni kuzatishda **Google Postmaster Tools** yordam beradi.

## Baza gigiyenasi

- **Qattiq qaytishlarni** darhol o‘chiring: mavjud bo‘lmagan manzil kuchli salbiy signal.
- Xato yozilgan va begona manzillarni yig‘maslik uchun **double opt-in**’dan foydalaning.
- Faol bo‘lmaganlarga **reaktivatsiya** xatini yuboring, javob bermaganlarni olib tashlang.
- Hech qachon baza sotib olmang: ularda **spam tuzoqlari** — qoidabuzarlarni ushlash uchun maxsus yaratilgan manzillar bo‘lishi mumkin.

## Mazmundagi xavfli belgilar

- Aldovchi yoki baqiruvchi mavzu: katta harflar, ko‘p undov belgilari.
- Matnsiz, bitta rasmdan iborat xat.
- Qisqartirilgan havolalar va obro‘si yomon domenlarga havolalar.
- Havola o‘rniga og‘ir ilovalar.
- Aniq jo‘natuvchi, kompaniyaning pochta manzili va obunadan chiqish havolasi yo‘q.

## FAQ

### SPF, DKIM va DMARC sozlanganini qanday tekshirish mumkin?

Gmail qutingizga xat yuboring va «Asl nusxani ko‘rsatish»ni oching: u yerda SPF, DKIM va DMARC’dan o‘tgan-o‘tmagani ko‘rinadi. DNS yozuvlarini istalgan onlayn DNS tekshiruv vositasi bilan ham ko‘rish mumkin.

### Hammasi sozlangan bo‘lsa ham xatlar nega spamga tushadi?

Autentifikatsiya faqat xat sizdan ekanini tasdiqlaydi. Agar qabul qiluvchilar shikoyat qilsa, xatlarni ochmasa yoki bazada o‘lik manzillar ko‘p bo‘lsa, obro‘ tushadi. Faol bo‘lmaganlarga yuborishni kamaytiring va odamlar xatlaringizni kutayotganini tekshiring.

### DMARC’ni darhol reject siyosati bilan qo‘yish kerakmi?

Yo‘q. Avval `p=none` va hisobotlarni yig‘ish: shunda domeningiz nomidan yuboradigan barcha servislarni ko‘rasiz. Qonuniy pochta tekshiruvdan o‘tishiga ishonch hosil qilgach, siyosatni kuchaytiring.
