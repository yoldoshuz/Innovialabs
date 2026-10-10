---
title: Saytni SEO-trafikni yo‘qotmasdan ko‘chirish: chek-list
description: Yangi domen, CMS, HTTPS yoki tuzilmaga trafikni yo‘qotmasdan qanday o‘tish: URL xaritasi, 301-redirektlar, metama’lumotlar, monitoring va qaytarish mezonlari.
summary: Har bir eski URL bitta 301-redirekt bilan aniq muqobiliga yo‘naltirilsa, metama’lumotlar va kontent to‘liq ko‘chirilsa va ishga tushirishdan keyin indeksatsiya hamda xatolar har kuni kuzatilsa, trafik saqlanadi.
---

## Ko‘chishning asosiy qoidasi

Qidiruv tizimlari eski manzillaringizni va ularning qiymatini allaqachon biladi. Migratsiyaning vazifasi — **bu qiymatni yangi manzillarga uzilishsiz o‘tkazish**. Buning uchun uch narsa kerak: to‘liq URL xaritasi, to‘g‘ri 301-redirektlar va ishga tushirishdan keyingi monitoring.

Bir vaqtda qancha kam narsa o‘zgartirsangiz, pasayish sababini topish shuncha oson. Imkon bo‘lsa, domen, CMS va tuzilmani almashtirishni bitta relizda birlashtirmang.

## Ko‘chish turlari va ularning xavflari

| Tur | Nima o‘zgaradi | Asosiy xavf |
|---|---|---|
| HTTP → HTTPS | Protokol | Aralash kontent, unutilgan redirektlar |
| Domenni almashtirish | Butun manzil | Redirektlarsiz havola vaznini yo‘qotish |
| CMS’ni almashtirish | Shablonlar, URL, razmetka | Yo‘qolgan meta-teglar, sahifalarning yangi manzillari |
| Tuzilmani almashtirish | Yo‘llar va ichma-ichlik | Minglab 404, buzilgan ichki havolalar |

## Ishga tushirishdan oldingi chek-list

1. **Barcha eski URL’larni yig‘ing**: krauler, sitemap, analitikadagi trafikli sahifalar, vebmasterlardagi tashqi havolali sahifalar.
2. **URL xaritasini tuzing**: eski manzil → yangi manzil, birga-bir. Hammasini bosh sahifaga yo‘naltirmang.
3. **Metama’lumotlarni ko‘chiring**: title, description, H1, canonical, hreflang, mikrorazmetka.
4. **Kontentni saqlang**: matnlar, alt atributli rasmlar, ichki havolalar.
5. **Test serverni** faqat robots.txt bilan emas, parol bilan yoping.
6. **Solishtirish uchun bazani qayd eting**: trafik, asosiy so‘rovlar bo‘yicha pozitsiyalar, indeksdagi sahifalar soni.

## Redirektlarni to‘g‘ri qilish

- Doimiy ko‘chish uchun **301** dan foydalaning.
- Zanjirsiz: eski URL to‘g‘ridan-to‘g‘ri yakuniy manzilga olib boradi.
- Muqobili yo‘q o‘chirilgan sahifalar uchun — tegishli bo‘lim yoki halol 404/410, bosh sahifa emas.
- Ishga tushirishdan oldin redirektlarni butun xarita bo‘yicha skript bilan sinab ko‘ring.

Domen almashtirishda nginx uchun misol:

```nginx
server {
    listen 443 ssl;
    server_name old-domain.uz www.old-domain.uz;
    return 301 https://new-domain.uz$request_uri;
}
```

## Ishga tushirish kunidagi chek-list

- Redirektlarni yoqing va yangi saytdan indeksatsiya taqiqini olib tashlang.
- robots.txt, yangi URL’li sitemap.xml va yangi manzillarga yo‘naltirilgan canonical’ni tekshiring.
- Yangi saytni Google Search Console va Yandex Vebmaster’ga qo‘shing.
- Domen almashtirishda Search Console’dagi **manzilni o‘zgartirish** vositasidan va Yandex Vebmaster’dagi ko‘chish sozlamasidan foydalaning.
- Ichki havolalarni redirektlar orqali o‘tmaydigan qilib yangilang.

## Ishga tushirishdan keyingi monitoring

Dastlabki haftalarda har kuni tekshiring:

- loglar va vebmaster hisobotlaridagi 404 va 5xx xatolar;
- eski va yangi sayt bo‘yicha indeksdagi sahifalar soni;
- bazaga nisbatan trafik va pozitsiyalar;
- yangi versiyaning Core Web Vitals ko‘rsatkichlari.

Eski redirektlarni uzoq saqlang — ularni bir-ikki oydan keyin o‘chirib tashlamang.

## Qaytarish mezonlari

Qaysi holatda eski versiyaga qaytishni oldindan kelishib oling:

- ommaviy 5xx xatolar yoki asosiy bo‘limlarning ochilmasligi;
- muhim sahifalar indeksdan tushib ketishi va sababini tez bartaraf etib bo‘lmasligi;
- to‘lov yoki formalarda jiddiy nosozliklar.

Ko‘chishdan keyin pozitsiyalarning kichik vaqtinchalik tebranishi — odatiy hol. Qaytarish birinchi pasayishda emas, texnik buzilishlarda kerak.

## FAQ

### Ko‘chishdan keyin trafik qancha vaqtda tiklanadi?

Muddat sayt hajmi va redirektlar sifatiga bog‘liq. Qidiruv tizimlari manzillarni qayta skanerlayotganda kichik tebranishlar normal. Agar pasayish davom etib, kuchaysa, texnik xatolarni qidiring.

### Barcha eski sahifalarni bosh sahifaga yo‘naltirsa bo‘ladimi?

Yo‘q. Qidiruv tizimlari bunday redirektlarni yumshoq 404 deb qabul qiladi va sahifalar vazni yo‘qoladi. Har bir sahifani ma’nosi bo‘yicha eng yaqin muqobiliga yo‘naltiring.

### Eski domenni saqlab qolish kerakmi?

Ha. Eski manzillarga odamlar va havolalar kelib turgan ekan, domenni uzaytirib boring va redirektlarni saqlang.
