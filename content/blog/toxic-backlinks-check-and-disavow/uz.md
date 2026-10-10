---
title: Toksik havolalarni topish va Disavow orqali rad etish
description: Havola profilini audit qilish, spam havolalarni aniqlash, Disavow qachon haqiqatan kerakligini tushunish va faylni to‘g‘ri tayyorlash bo‘yicha qo‘llanma.
summary: Aksariyat saytlarga Disavow kerak emas — Google spam havolalarni o‘zi e’tiborsiz qoldiradi; faqat o‘zingiz sotib olgan yoki yaratgan havolalarni, shuningdek noto‘g‘ri havolalar uchun qo‘lda sanksiya bo‘lganda rad etish kerak.
---
## Havolalarni rad etish umuman kerakmi

To‘g‘ridan-to‘g‘ri javob: **ko‘p hollarda — yo‘q**. Google tasodifiy spam havolalarni e’tiborsiz qoldira olishini ochiq aytadi va g‘alati saytlardagi axlat odatda o‘z-o‘zidan zarar keltirmaydi. Disavow vositasi — oxirgi chora.

Havolalarni rad etish quyidagi hollarda ma’noga ega:

- Search Console’da noto‘g‘ri kiruvchi havolalar uchun **qo‘lda ko‘rilgan chora** (manual action) kelgan;
- siz yoki oldingi pudratchi **havolalar sotib olgan** yoki almashinuv sxemalarida qatnashgan va ularni o‘chirib bo‘lmaydi;
- past sifatli havolalar bilan ommaviy hujumni va bir vaqtda boshqa tushunarli sababsiz pozitsiyalar tushishini ko‘ryapsiz.

Xato Disavow zarar keltirishi mumkin: yaxshi havolalarni rad etsangiz, sayt ularning og‘irligini yo‘qotadi.

## Havola profilini qanday audit qilish

1. **Havolalarni eksport qiling.** Google Search Console’da «Havolalar» hisobotini oching va tashqi havolalarni eksport qiling. To‘liqlik uchun uchinchi tomon SEO-vositalaridan ma’lumot qo‘shing — har birining o‘z bazasi bor.
2. **Domenlar bo‘yicha guruhlang.** Alohida URL emas, domenlarni tahlil qilish qulayroq.
3. **Aniq yaxshilarini belgilang** — OAV, hamkorlar, sohaviy kataloglar, taniqli saytlar — va ularni darhol tekshiruvdan chiqaring.
4. **Qolganlarini** quyidagi spam belgilari bo‘yicha tekshiring.
5. **Tarixni eslang.** Havolalar sotib olinganmi, progonlar bo‘lganmi, avval SEO bilan kim shug‘ullangan.

## Toksik havolalar belgilari

| Belgi | Qanday ko‘rinadi |
|---|---|
| Mavzuga aloqasiz | kazino, farmatsevtika, kattalar kontenti qahvaxonaga havola beradi |
| Saytlar tarmog‘i | bir xil shablon va matnli o‘nlab domenlar |
| Tijoriy ankor | tasodifiy saytlardan aniq «Toshkentda deraza sotib olish» |
| Generatsiya qilingan kontent | bog‘lanmagan matn, avtomatik tarjimalar |
| Axlat sahifalar | bitta sahifada yuzlab chiquvchi havolalar |
| Buzilgan saytlar | begona sahifalar kodidagi yashirin havolalar |

Bitta belgi hali sabab emas. Bir nechta belgi **birga kelganda** va havola sotib olish bilan aniq bog‘liqlik bo‘lganda e’tibor berish kerak.

Uchinchi tomon xizmatlaridagi «toksiklik» — Google fikri emas, balki aniq bir vositaning bahosi. Havolalarni faqat hisobotdagi yuqori raqam tufayli rad etmang.

## Avval — o‘chirishga urinish

Agar havola sotib olish yoki kelishuv tufayli paydo bo‘lgan bo‘lsa, avval sayt egasidan uni o‘chirishni so‘rang. Bu qo‘lda ko‘rilgan choralar uchun ayniqsa muhim: qayta tekshirish so‘rovida faqat rad etmasdan, profilni tozalashga harakat qilganingizni ko‘rsatish foydali.

## Disavow faylini qanday tayyorlash

Fayl — UTF-8 kodlashdagi oddiy `.txt`, har qatorda bitta yozuv:

```text
# Sotib olingan havolalar, o‘chirib bo‘lmadi
domain:spam-example.com
domain:another-spam.net

# Alohida sahifa
https://forum-example.org/thread/123
```

Qoidalar:

- `domain:` domendagi barcha havolalarni rad etadi — bu URL’larni sanab chiqishdan ishonchliroq;
- `#` bilan boshlanadigan qatorlar — izohlar, ular e’tiborga olinmaydi;
- **har bir resurs uchun bitta fayl** — yangi yuklash oldingisini almashtiradi, shuning uchun faqat yangi qatorlarni emas, mavjud faylni to‘ldirib yuklang.

Faylni Search Console’da kerakli resurs uchun Google havolalarni rad etish vositasi orqali yuklash mumkin. Batafsil — [Google ma’lumotnomasida](https://support.google.com/webmasters/answer/2648487). Natija darhol bo‘lmaydi: havolalar sahifalar qayta skanerlangan sari hisobga olinadi.

Yandex Webmaster’da bunday vosita yo‘q — Yandex qaysi havolalarni hisobga olishni o‘zi hal qiladi.

## Ko‘p uchraydigan xatolar

- Uchinchi tomon xizmatida «toksikligi» yuqori bo‘lgan barcha havolalarni rad etish.
- Eski yozuvlarsiz yangi fayl yuklash — oldingi rad etishlar yo‘qoladi.
- Noto‘g‘ri format: ortiqcha belgilar, UTF-8 bo‘lmagan fayl.
- Yuklashdan keyin pozitsiyalar darhol o‘sishini kutish.
- Sababni bartaraf etmasdan Disavow qilish — havola sotib olishni davom ettirish.

## FAQ

### Raqobatchi spam havolalar bilan menga zarar yetkaza oladimi?

Google tizimlari odatda bunday havolalarni e’tiborsiz qoldirishini aytadi. Agar hujum ommaviy bo‘lsa va qo‘lda ko‘rilgan chorani yoki pozitsiyalar tushishi bilan aniq bog‘liqlikni ko‘rsangiz, Disavow tayyorlash ma’noga ega.

### Havolalar auditini qanchalik tez-tez o‘tkazish kerak?

Aksariyat saytlar uchun profilni davriy, masalan, chorakda bir marta tekshirish va qo‘shimcha ravishda trafik keskin tushganda yoki SEO-pudratchi almashganda tekshirish yetarli.

### Disavow’ni bekor qilish mumkinmi?

Ha, keraksiz qatorlarsiz yangilangan faylni yuklang yoki faylni o‘chiring. Havolalar qidiruv tizimi sahifalarni qayta qayta ishlagandan keyingina yana hisobga olinadi, bu vaqt talab qiladi.
