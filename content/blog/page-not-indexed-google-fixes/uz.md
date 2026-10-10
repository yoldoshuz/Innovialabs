---
title: Nega sahifalar Google’da indekslanmaydi va buni qanday tuzatish
description: Search Console’dagi "Discovered" va "Crawled - currently not indexed" statuslarini tushuntiramiz, sabablarni topib tuzatamiz, Yandex uchun IndexNow ham.
summary: Sahifa indeksga yoki texnik taqiq (noindex, robots, canonical, xatolar) tufayli, yoki qidiruv tizimi uni yetarlicha qimmatli deb hisoblamagani uchun tushmaydi; birinchisi sozlamalar bilan, ikkinchisi kontent sifati va ichki havolalar bilan tuzatiladi.
---

## Qisqa javob

Sabablar ikki guruhga bo‘linadi. **Texnik**: sahifa yopiq, mavjud emas yoki canonical boshqa manzilga ishora qiladi. **Sifat**: Google sahifani ko‘radi, lekin u indeksda joy egallashga arzimaydi deb qaror qiladi. Avvalo Google Search Console’dagi **URL tekshirish vositasi**ni oching: u aniq status va sababni ko‘rsatadi.

## Search Console statuslari nimani anglatadi

| Status | Nima bo‘lyapti | Qayerga qarash kerak |
|---|---|---|
| Discovered - currently not indexed | Google URL’ni biladi, lekin hali skanerlamagan | krauling byudjeti, ichki havolalar, server tezligi |
| Crawled - currently not indexed | Google sahifani o‘qidi va keyinga qoldirdi | kontent sifati va noyobligi |
| noindex tegi bilan chiqarilgan | sahifada taqiq turibdi | meta robots, `X-Robots-Tag` |
| robots.txt’da bloklangan | robot kira olmaydi | `Disallow` qoidalari |
| Redirectli sahifa | URL boshqasiga yo‘naltiradi | redirect atayin bo‘lsa, bu normal |
| Dublikat, Google boshqa kanonikni tanlagan | Google boshqa sahifani asosiy deb hisoblaydi | canonical, dublikatlar, parametrlar |
| Server xatosi (5xx) / Topilmadi (404) | sahifa berilmaydi | server, o‘chirilgan URL’lar |

## Texnik sabablar va tuzatishlar

Tartib bilan tekshiring:

1. HTML yoki HTTP sarlavhasidagi **noindex**. Ko‘pincha ishlab chiqishdan keyin qolib ketadi yoki plagin tomonidan yoqiladi.
2. **robots.txt** bo‘limni yopadi. Yodda tuting: robots’dagi taqiq skanerlashga xalaqit beradi, lekin indeksdan chiqarilishini kafolatlamaydi.
3. **Canonical** boshqa sahifaga yoki boshqa protokol va domen bilan o‘ziga ishora qiladi.
4. **Javob kodlari**: sahifa 3xx, 404 yoki 5xx emas, 200 qaytarishi kerak.
5. **JavaScript renderingi**: asosiy matn faqat skriptlar bajarilgandan keyin paydo bo‘lsa, URL tekshirish vositasida Google uni render qilingan HTML’da ko‘rishini tekshiring.
6. **Sitemap’da yo‘q va ichki havolalar yo‘q** — topish qiyin bo‘lgan yetim sahifa.

## Sifat bilan bog‘liq sabablar

"Crawled - currently not indexed" statusi ko‘pincha sahifaning qimmati haqida:

- **Yupqa kontent**: bir-ikki abzats yoki tavsifsiz kartochka.
- **Dublikatlar**: deyarli bir xil ko‘plab sahifalar, masalan filtrlar yoki teglar.
- Allaqachon indekslangan sahifalarga nisbatan **noyob foyda yo‘q**.
- **Kuchsiz ichki perelinkovka**: sahifaga sayt chuqurligidan bitta havola olib boradi.

Nima yordam beradi:

- o‘xshash sahifalarni bitta kuchli sahifaga birlashtirish;
- real savolga javob beradigan mazmunni to‘ldirish;
- allaqachon indeksdagi bo‘limlardan sahifaga havolalar qo‘yish;
- robot vaqtini muhim narsalarga sarflashi uchun xizmat va keraksiz URL’larni indeksatsiyadan yopish.

## Tuzatishlardan keyin indeksatsiyani qanday tezlashtirish

- **Google**: URL tekshirish vositasida "Request indexing" tugmasini bosing. Bu kafolat emas, signal, va funksiyaning kunlik limiti bor.
- **sitemap.xml**ni dolzarb `lastmod` sanasi bilan yangilab, qayta yuboring.
- **Yandex va Bing**: **IndexNow** protokolidan foydalaning — sayt o‘zi qidiruv tizimlariga o‘zgargan URL’lar haqida xabar beradi. Google bu protokolni qo‘llab-quvvatlamaydi.

IndexNow so‘rovi misoli:

```bash
curl -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "example.com",
    "key": "your-key",
    "keyLocation": "https://example.com/your-key.txt",
    "urlList": ["https://example.com/new-page"]
  }'
```

Kalit — siz o‘zingiz generatsiya qilib, saytdagi matn faylida joylashtiradigan qator. Batafsil ma’lumot indexnow.org’dagi protokol hujjatlarida.

## Odatiy xatolar

- Sababni qidirish o‘rniga "Request indexing"ni qayta-qayta bosish.
- Sahifani robots.txt’da yopib, bir vaqtda qidiruv tizimi undagi noindex’ni ko‘rishini kutish.
- Minglab avtomatik sahifalar generatsiya qilib, ularning kichik qismi indekslanayotganidan hayron bo‘lish.

## FAQ

### Yangi sahifa indekslanishini qancha kutish kerak?

Belgilangan muddat yo‘q. Yaxshi perelinkovkaga ega va muntazam yangilanadigan saytlardagi sahifalar odatda indeksga tezroq tushadi. Status uzoq vaqt o‘zgarmasa, texnik sabab yoki kontent qimmati bilan bog‘liq muammoni qidiring.

### Sayt sahifalarining bir qismi indeksda bo‘lmasligi normalmi?

Ha. Redirectlar, canonical’li dublikatlar, xizmat va parametrli URL’lar indekslanmasligi ham kerak. Faqat muhim sahifalar indeksdan tashqarida qolsa, xavotirlanish kerak.

### IndexNow Google uchun ishlaydimi?

Yo‘q. Google IndexNow’dan foydalanmaydi, u uchun sitemap, ichki havolalar va Search Console’dagi indekslash so‘rovi qoladi. IndexNow Yandex, Bing va uni qo‘llab-quvvatlaydigan boshqa qidiruv tizimlari uchun foydali.
