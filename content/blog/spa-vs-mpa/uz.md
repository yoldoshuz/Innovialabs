---
title: SPA yoki MPA: bir sahifali yoki ko‘p sahifali ilova
description: SPA va MPA navigatsiya, tezlik, SEO, murakkablik va oflayn rejim bo‘yicha qanday farqlanadi va gibrid freymvorklar ular orasidagi chegarani qanday o‘chiradi.
summary: MPA har bir o‘tishda yangi HTML sahifa yuklaydi va SEO hamda kontent saytlar uchun soddaroq; SPA bir marta yuklanib, ekranlarni klientda almashtiradi va murakkab ilovalar uchun qulayroq. Bugun ko‘pincha gibrid tanlanadi.
---
## Qisqa javob

- **MPA (multi-page application)** — har bir o‘tish serverdan yangi HTML sahifa yuklaydi. Klassik saytlar, internet-do‘konlar, bloglar, media.
- **SPA (single-page application)** — brauzer ilovani bir marta yuklaydi, keyin JavaScript ekranlarni o‘zi almashtiradi va ma’lumotlarni API orqali oladi. Pochta, CRM, dashboardlar, muharrirlar.

Agar sayt asosan **kontent ko‘rsatsa** va qidiruv muhim bo‘lsa — MPA tomonga og‘ing. Agar foydalanuvchi **interfeys ichida uzoq ishlasa** — SPA tomonga. Ko‘pchilik yangi loyihalar uchun oqilona javob — **gibrid**, u haqda quyida.

## Navigatsiya qanday ishlaydi

**MPA:** havolaga bosish, brauzer yangi sahifani so‘raydi, server tayyor HTML qaytaradi, sahifa to‘liq qayta chiziladi. Oddiy va ishonchli, «orqaga» tugmasi va havolalar o‘zi ishlaydi.

**SPA:** bosishni klient routeri ushlab oladi, History API orqali manzilni o‘zgartiradi, ma’lumotlarni (odatda JSON) so‘raydi va faqat kerakli qismni qayta chizadi. O‘tishlar bir zumda bo‘lgandek tuyuladi, lekin routing, yuklanish, xatolar va aylantirishni tiklashni kodda amalga oshirish kerak.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | MPA | SPA |
|---|---|---|
| Birinchi yuklanish | tez, HTML darhol | sekinroq, JS yuklanib ishga tushishi kerak |
| Keyingi o‘tishlar | sahifani to‘liq qayta yuklash | tez, qayta yuklashsiz |
| SEO | tabiiy ravishda yaxshi | SSR yoki prerendering talab qiladi |
| Ishlab chiqish murakkabligi | pastroq | yuqoriroq: routing, holat, API |
| Ekranlar orasidagi holat | o‘tishda yo‘qoladi | xotirada saqlanadi |
| Oflayn rejim | cheklangan | Service Worker orqali mumkin |
| Qurilmaga yuklama | past | kuchsiz telefonlarda yuqoriroq |
| Analitika | darhol ishlaydi | virtual o‘tishlarni kuzatish kerak |

## Unumdorlik

**MPA** **birinchi ekranda** yutadi: brauzer tayyor HTML oladi va uni darhol ko‘rsata oladi. Bu qidiruv va reklamadan kelinadigan sahifalar uchun muhim.

**SPA** **uzoq sessiyalarda** yutadi: ilova yuklangandan keyin o‘tishlar faqat ma’lumot talab qiladi. Lekin katta JavaScript bandli ishga tushishni sekinlashtiradi, ayniqsa arzon qurilmalar va sekin internetda. Kodni bo‘lish (code splitting) va ekranlarni lazy yuklash yordam beradi.

## SEO

Qidiruv tizimlari **tayyor HTML** bilan eng yaxshi ishlaydi. MPA’da u standart holatda bor.

Klassik SPA deyarli bo‘sh HTML beradi va uni JavaScript orqali to‘ldiradi. Qidiruv tizimlari JS’ni bajara oladi, lekin bu sekinroq va kamroq bashorat qilinadigan jarayon. Shuning uchun ommaviy sahifalar uchun SPA odatda **SSR** (serverda rendering) yoki **prerendering** bilan to‘ldiriladi.

## Oflayn rejim

SPA butun interfeysni allaqachon brauzerda saqlaydi, shuning uchun **Service Worker** yordamida uni tarmoqsiz ochiladigan va ma’lumotlarni keyinroq sinxronlaydigan **PWA**’ga aylantirish osonroq. MPA’da ham oflayn mumkin — sahifalarni keshlash mumkin — lekin serversiz interaktivlik kamroq bo‘ladi.

## Gibridlar: chegara o‘chmoqda

Zamonaviy vositalar ikkala yondashuvning kuchli tomonlarini birlashtiradi:

- **Next.js, Nuxt, SvelteKit, Remix** — birinchi yuklanish MPA’dagidek (serverdan HTML), keyingi o‘tishlar SPA’dagidek.
- **Astro** — interaktiv «orollar»ga ega ko‘p sahifali sayt.
- **htmx, Hotwire Turbo** — o‘tishlar va sahifa qismlarini yangilash to‘liq qayta yuklashsiz bo‘ladigan MPA.
- Brauzerlardagi **View Transitions API** oddiy MPA sahifalari orasida silliq animatsiyalar qilish imkonini beradi.

Shuning uchun bugun savol «SPA yoki MPA» emas, balki **qayerda server HTML, qayerda klient interaktivligi kerak** degan ko‘rinishda.

## Qanday tanlash kerak

1. **Foydalanuvchilar qayerdan keladi?** Qidiruvdan bo‘lsa — server HTML kerak.
2. **Sessiya qancha davom etadi?** Bitta interfeysda daqiqalar o‘tkazilsa — SPA xatti-harakati foydasiga.
3. **Oflayn kerakmi?** Ha bo‘lsa — SPA yoki PWA.
4. **Jamoa qanday?** Backend dasturchilar MPA’ni tezroq qiladi, frontend jamoa — SPA yoki gibridni.
5. **Yopiq qism bormi?** Ko‘pincha ommaviy sayt MPA, shaxsiy kabinet esa SPA sifatida qilinadi.

## Odatiy xatolar

- **Lending yoki blog uchun SPA qilish** va keyin SEO bilan kurashish.
- **SPA analitikasida o‘tishlarni kuzatishni sozlamaslik.**
- **Kodni bo‘lish o‘rniga ulkan bandl yuklash.**
- **SPA’da «orqaga» tugmasi va chuqur havolalarni buzish.**

## FAQ

### SPA har doim MPA’dan tezroqmi?

Yo‘q. SPA ilova ichidagi o‘tishlarda tezroq, lekin odatda birinchi yuklanishda sekinroq. Qidiruvdan bir marta ochiladigan sahifalar uchun ko‘pincha MPA yutadi.

### Yaxshi indeksatsiya qilinadigan SPA qilish mumkinmi?

Ha, agar ommaviy sahifalarga SSR yoki prerendering qo‘shilsa. Next.js va Nuxt kabi freymvorklar aynan shuni qiladi.

### Internet-do‘kon uchun nimani tanlash kerak?

Katalog va mahsulot kartochkalari qidiruv uchun HTML sifatida berilishi kerak, shuning uchun asos — MPA yoki gibrid. Savat, filtrlar va shaxsiy kabinetni SPA xatti-harakati bilan qilish mumkin.
