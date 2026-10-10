---
title: SaaS metrikalari: MRR, Churn, LTV va CAC oddiy tilda
description: MRR, churn, LTV va CAC nima, ularni formulalar va oddiy misollar bilan qanday hisoblash va ular SaaS biznes salomatligini qanday ko‘rsatishi haqida.
summary: MRR — oylik takroriy daromad, churn — qancha mijoz yoki pul yo‘qotayotganingiz, LTV — mijoz butun davr mobaynida keltiradigan foyda, CAC — uni jalb qilish narxi. LTV CAC dan sezilarli katta va xarajat tez qoplansa, biznes sog‘lom.
---

## Qisqacha: SaaS ni tavsiflovchi to‘rtta raqam

SaaS obunalar hisobiga yashaydi, shuning uchun bir martalik daromad ko‘p narsani aytmaydi. Muhimi boshqa: **har oy** qancha pul kelmoqda, qancha mijoz ketmoqda, bitta mijoz qancha keltiradi va uni topish qanchaga tushadi. Bu to‘rt savolga **MRR**, **Churn**, **LTV** va **CAC** javob beradi.

Quyidagi misollardagi barcha raqamlar shartli va faqat hisoblash usulini ko‘rsatish uchun keltirilgan.

## MRR — oylik takroriy daromad

**MRR (Monthly Recurring Revenue)** — faol obunalar bo‘yicha barcha oylik to‘lovlar yig‘indisi. Bir martalik to‘lovlar (joriy etish, sozlash) bunga kirmaydi.

**Formula:** MRR = barcha faol mijozlarning oylik to‘lovlari yig‘indisi.

Agar mijoz bir yil uchun oldindan to‘lasa, to‘lov 12 ga bo‘linadi. Misol: 50 $ dan 40 mijoz va 120 $ dan 10 mijoz MRR = 2 000 + 1 200 = 3 200 $ beradi.

MRR o‘zgarishini qismlarga ajratish foydali:

- **New MRR** — yangi mijozlardan;
- **Expansion MRR** — tarifni oshirish va qo‘shimcha sotuvlardan;
- **Churned MRR** — voz kechishlar va tarifni pasaytirish tufayli yo‘qotilgan.

**ARR** — xuddi shu ko‘rsatkich yillik hisobda: MRR × 12.

## Churn — mijoz va pul oqib ketishi

**Churn rate** ma’lum davrda qancha ulushni yo‘qotayotganingizni ko‘rsatadi. Ikki turi bor:

- **Customer churn** — ketgan mijozlar ulushi: oy davomida ketganlar / oy boshidagi mijozlar.
- **Revenue churn** — yo‘qotilgan daromad ulushi: yo‘qotilgan MRR / oy boshidagi MRR.

Misol: oy boshida 200 mijoz bor edi, 6 tasi ketdi. Customer churn = 6 / 200 = 3%.

Tariflar bir-biridan keskin farq qilsa, revenue churn muhimroq: bitta yirik mijozning ketishi o‘nta kichik mijozdan qimmatroq tushishi mumkin. Mavjud mijozlarga qo‘shimcha sotuvlar yo‘qotishlarni qoplasa, **manfiy net churn** yuzaga keladi — yangi sotuvlarsiz ham joriy bazadan daromad o‘sadi.

## LTV — mijoz butun davrda qancha keltiradi

**LTV (Lifetime Value)** — mijoz butun obuna muddatida keltiradigan yalpi foyda.

**Oddiy formula:** LTV = ARPA × yalpi marja / churn rate.

- **ARPA** — bir akkauntga oylik o‘rtacha daromad (MRR / mijozlar soni).
- **Yalpi marja** — to‘g‘ridan-to‘g‘ri xarajatlardan keyin qolgan daromad ulushi: serverlar, qo‘llab-quvvatlash, tashqi servislar.

Misol: ARPA = 50 $, marja 80%, oylik churn 2%. LTV = 50 × 0,8 / 0,02 = 2 000 $.

Yodda tuting: formula churn barqaror deb faraz qiladi. Tarixi kam yosh mahsulotda LTV taxminiy baho bo‘ladi.

## CAC — mijozni jalb qilish narxi

**CAC (Customer Acquisition Cost)** — bitta to‘lovchi mijozni olishga ketgan o‘rtacha xarajat.

**Formula:** CAC = davr uchun marketing va sotuv xarajatlari / shu davrdagi yangi mijozlar.

Misol: bir oyda reklama va sotuv bo‘limi maoshiga 6 000 $ sarflandi, 20 mijoz keldi. CAC = 300 $.

Ko‘p uchraydigan xato — faqat reklama byudjetini hisoblash. CAC ga sotuvchilar maoshi, vositalar, agentliklar va kontent ham kiradi.

## Metrikalar bir-biri bilan qanday bog‘liq

| Ko‘rsatkich | Nima solishtiriladi | Nimani ko‘rsatadi |
|---|---|---|
| **LTV / CAC** | mijoz qiymati va jalb qilish narxi | o‘sish o‘zini oqlaydimi |
| **CAC payback** | CAC / (ARPA × marja) | xarajat necha oyda qaytadi |
| **Net MRR growth** | new + expansion − churned | daromad haqiqatan o‘syaptimi |

Yuqoridagi misolda LTV / CAC = 2 000 / 300 ≈ 6,7, CAC payback esa 300 / (50 × 0,8) = 7,5 oy. Ko‘pincha LTV / CAC uchun taxminan 3:1 nisbat mo‘ljal sifatida tilga olinadi, lekin to‘g‘ri daraja bozor, sotuv modeli va pul zaxirasiga bog‘liq.

Mantiq oddiy: agar mijozlar o‘zini jalb qilish xarajatini qoplamasdan ketsa, har bir yangi sotuv zarar keltiradi, masshtablash esa muammoni faqat tezlashtiradi.

## Keng tarqalgan xatolar

- MRR da **bir martalik va takroriy daromadni aralashtirish**.
- Churn ni tarif va kogortalarga ajratmasdan **butun baza bo‘yicha hisoblash**.
- LTV da **marja o‘rniga daromadni olish** — baho oshib ketadi.
- CAC da **maoshlarni hisobga olmaslik**.
- **Faqat o‘rtacha raqamlarga qarash**: kanallar va tariflar butunlay boshqacha bo‘lishi mumkin.

## FAQ

### Mahsulot endigina ishga tushgan bo‘lsa, qaysi metrikadan boshlash kerak?

MRR va customer churn dan: ularni birinchi oydan hisoblash oson. LTV va CAC bir necha oylik tarix va aniq jalb qilish kanallari paydo bo‘lgach ishonchliroq bo‘ladi.

### Nima yaxshiroq: CAC ni kamaytirishmi yoki churn nimi?

Hozir qaysi biri zaifroq ekaniga bog‘liq. Lekin churn ni kamaytirish odatda LTV ni ham, joriy bazadan daromadni ham yaxshilaydi, shuning uchun uni birinchi tekshirish kerak.

### Hisoblash uchun alohida analitika tizimi kerakmi?

Boshida to‘lov tizimi va CRM ma’lumotlari bilan oddiy jadval yetarli. Mijozlar va tariflar ko‘payib, qo‘lda hisoblashda xatolar chiqa boshlaganda maxsus vositalar foydali bo‘ladi.
