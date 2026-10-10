---
title: Onlayn to‘lovlar qanday ishlaydi: shlyuz, ekvayer va protsessing
description: Karta to‘lovining «To‘lash» tugmasidan hisobga pul tushguncha yo‘li: ishtirokchilar, avtorizatsiya, yechib olish, hisob-kitob, komissiyalar va qaytarishlar.
summary: To‘lov «do‘kon → to‘lov shlyuzi → ekvayer va protsessing → to‘lov tizimi → xaridor banki» zanjiridan o‘tadi, bank uni tasdiqlab summani bloklaydi; keyinroq pul yechib olinadi, banklar o‘rtasida hisob-kitob qilinadi va komissiyalar chegirilib do‘kon hisobiga tushadi.
---
## Qisqa javob

Xaridor «To‘lash» tugmasini bosganda soniyalar ichida **avtorizatsiya** sodir bo‘ladi: xaridor banki karta va balansni tekshiradi va summani bloklaydi. Lekin bu paytda pul hali do‘konda emas. U keyinroq — **yechib olish (capture)**, **kliring** va **hisob-kitoblardan** so‘ng, komissiyalar chegirilgan holda keladi.

Kechikishlar, komissiyalar va to‘lov holatlari qayerdan kelishini tushunish uchun ishtirokchilarni bilish kerak.

## To‘lovda kimlar ishtirok etadi

| Ishtirokchi | Roli |
|---|---|
| **Xaridor** (karta egasi) | Karta ma’lumotlarini kiritadi va to‘lovni tasdiqlaydi |
| **Do‘kon** (merchant) | Buyurtma yaratadi va to‘lovni boshlaydi |
| **To‘lov shlyuzi** (gateway) | Karta ma’lumotlarini xavfsiz qabul qilib, so‘rovni uzatadi. Do‘konga API va to‘lov sahifasini beradi |
| **Ekvayer** | Do‘kon banki: uning foydasiga karta to‘lovlarini qabul qiladi va pulni hisobiga o‘tkazadi |
| **Protsessing** (processor) | Tranzaksiyalarni yo‘naltiruvchi va qayta ishlovchi texnik markaz. Ko‘pincha ekvayerga tegishli yoki u bilan shartnoma asosida ishlaydi |
| **To‘lov tizimi** (card network) | Visa, Mastercard, O‘zbekistonda esa milliy Uzcard va Humo. Ekvayer va emitentlarni bog‘laydi, qoidalarni belgilaydi |
| **Emitent** | Kartani chiqargan xaridor banki. Operatsiyani tasdiqlaydi yoki rad etadi |

Amalda bitta kompaniya bir nechta rolni bajarishi mumkin. Masalan, to‘lov servisi ham shlyuz, ham agregator, bank esa bir vaqtda ham ekvayer, ham protsessing bo‘lishi mumkin.

## To‘lov yo‘li qadamma-qadam

1. **Checkout.** Xaridor «To‘lash» tugmasini bosadi. Do‘kon serveri buyurtma va summa hamda buyurtma ID si bilan to‘lov so‘rovini yaratadi.
2. **Karta ma’lumotlarini kiritish.** Xaridor kartani shlyuzning to‘lov sahifasida yoki himoyalangan formasida kiritadi. Karta ma’lumotlari do‘kon serveri orqali o‘tmasligi kerak — bu xavfsizlik talablarini (PCI DSS) keskin kamaytiradi.
3. **Autentifikatsiya.** Emitent to‘layotgan odam karta egasi ekanini **3-D Secure** yoki bir martalik SMS-kod orqali tekshiradi.
4. **Avtorizatsiya.** So‘rov shlyuz → ekvayer/protsessing → to‘lov tizimi → emitent zanjiri bo‘ylab o‘tadi. Emitent karta, limitlar va balansni tekshiradi, tasdiqlaydi va **summani bloklaydi** (hold). Javob o‘sha yo‘l bilan qaytadi.
5. **Do‘konni xabardor qilish.** Shlyuz natijani do‘kon serveriga callback (webhook) orqali xabar qiladi. Buyurtma faqat shu server tasdig‘idan keyin to‘langan hisoblanadi, xaridor «Rahmat» sahifasiga o‘tgani bilan emas.
6. **Yechib olish (capture).** Do‘kon bloklangan summani yechib olishni tasdiqlaydi. Ko‘pincha bu avtorizatsiyadan so‘ng darhol avtomatik bo‘ladi (bir bosqichli to‘lov). Ikki bosqichli sxemada do‘kon pulni keyinroq, masalan tovar borligini tekshirgach yechadi.
7. **Kliring va hisob-kitob (settlement).** To‘lov tizimi davr bo‘yicha operatsiyalarni jamlaydi, emitent pulni o‘tkazadi, ekvayer uni oladi va shartnomadagi jadval bo‘yicha **komissiyalarni chegirib** do‘konga o‘tkazadi.

## Komissiyalar nimalardan iborat

- **Emitent komissiyasi** (interchange) — xaridor bankiga ketadigan ulush.
- **To‘lov tizimi yig‘imlari** — tarmoqdan foydalanish uchun.
- **Ekvayer ustamasi** — uning xizmat uchun daromadi.
- **Shlyuz** yoki to‘lov servisi haqi, agar u alohida kompaniya bo‘lsa.

Do‘konga odatda to‘lov summasidan bitta yakuniy stavka (ko‘pincha MDR deb ataladi) yoki «foiz va qat’iy summa» tarifi ko‘rsatiladi. Aniq qiymatlar mamlakat, karta turi, biznes turi, aylanma hajmi va shartnomaga bog‘liq, shuning uchun shartlarni o‘zingizning real ma’lumotlaringiz asosida solishtiring.

## Bekor qilish, qaytarish va chargeback

- **Bekor qilish (void, reversal)** — yechib olishdan oldin: blok olib tashlanadi, pul aslida hech qayerga ketmagan. Odatda eng tez va arzon variant.
- **Qaytarish (refund)** — yechib olingandan keyin: do‘kon teskari o‘tkazmani boshlaydi. Pul kartaga banklarga bog‘liq muddatda qaytadi. Dastlabki to‘lov komissiyasi ko‘pincha qaytarilmaydi.
- **Chargeback** — xaridor o‘z banki orqali ochadigan nizo, masalan tovar olinmaganda. Pul do‘kondan majburan yechib olinishi mumkin va u hujjatlar bilan o‘z haqligini isbotlashi kerak.

## Integratsiyadagi ko‘p uchraydigan xatolar

- Buyurtmani server callback i o‘rniga redirect bo‘yicha to‘langan deb hisoblash.
- Callback imzosini va to‘lov servisidan kelgan summani tekshirmaslik.
- Qayta ishlashni idempotent qilmaslik: takroriy callback ikkinchi to‘lovni yaratadi.
- Karta ma’lumotlarini zaruratsiz va PCI DSS talablariga muvofiqliksiz o‘zida saqlash.
- Ikki bosqichli to‘lovdan foydalanib, bloklarni yechib olishni unutish — ularning muddati tugaydi va pul kelmaydi.

## FAQ

### To‘lov shlyuzi ekvayerdan nimasi bilan farq qiladi?

Shlyuz — texnik «quvur» va do‘kon uchun interfeys. Ekvayer — do‘kon foydasiga to‘lovlarni yuridik jihatdan qabul qiladigan va unga pul o‘tkazadigan bank. Ekvayersiz shlyuz pulni hisobingizgacha yetkaza olmaydi.

### Nega pul to‘lovdan keyin darhol kelmaydi?

Avtorizatsiya faqat summani bloklaydi. Pulning haqiqiy harakati banklar o‘rtasidagi kliring va hisob-kitob bosqichida sodir bo‘ladi, ekvayer esa uni shartnomada ko‘rsatilgan jadval bo‘yicha do‘konga o‘tkazadi.

### Qaysi biri foydaliroq: bekor qilishmi yoki qaytarishmi?

Agar tovar hali jo‘natilmagan va pul yechib olinmagan bo‘lsa, avtorizatsiyani bekor qilgan ma’qul: bu tezroq va odatda ortiqcha xarajatsiz. Yechib olingandan keyin faqat qaytarish qoladi.
