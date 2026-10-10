---
title: Vercel, Netlify yoki Cloudflare Pages: qaysi birini tanlash kerak
description: Vercel, Netlify va Cloudflare Pages’ni bepul limitlar, build, serverless va edge, trafik o‘sganda narx va freymvorklar bo‘yicha solishtiramiz.
summary: Server imkoniyatlari bilan Next.js uchun eng oson yo‘l — Vercel, statik saytlar va Astro uchun Netlify qulay, katta trafikda esa statik trafik uchun haq olmaydigan Cloudflare odatda arzonroq. Yakuniy qarorni freymvorkingiz va yuklama turi belgilaydi.
---
## Qisqa javob

- **Vercel** — agar sayt Next.js’da bo‘lsa va uning server imkoniyatlaridan foydalansangiz: serverda render qilish, ISR, server actions, middleware. Next.js’ning yangi funksiyalari birinchi bo‘lib shu yerda paydo bo‘ladi.
- **Netlify** — agar sayt statik bo‘lsa yoki Astro, Hugo, Eleventy’da qurilgan bo‘lsa va sizga formalarni qayta ishlash kabi tayyor qulayliklar kerak bo‘lsa.
- **Cloudflare Pages** — agar trafik ko‘p bo‘lsa, narx oldindan aniq bo‘lishi muhim bo‘lsa yoki domen allaqachon Cloudflare’da xizmat ko‘rsatilsa. Cloudflare hozir yangi loyihalar uchun asosiy yo‘l sifatida statik resursli Workers’ni rivojlantirmoqda, lekin Pages ishlashda davom etadi.

Uchala platforma ham statikani global CDN orqali tarqatadi, Git’ga ulanadi va branch’lar uchun preview-deploylar yaratadi. Farq server qismida, narxlarda va cheklovlarda.

## Asosiy ko‘rsatkichlar bo‘yicha solishtirish

| Ko‘rsatkich | Vercel | Netlify | Cloudflare Pages |
|---|---|---|---|
| Next.js | To‘liq, tayyor holda | Adapter orqali, ko‘pchilik funksiyalar | OpenNext adapteri orqali, sinab ko‘rish kerak |
| Boshqa freymvorklar | Keng qo‘llab-quvvatlash | Keng, statikada kuchli | Adapterlar orqali keng |
| Serverless-funksiyalar | Node.js va boshqa tillar | Node.js, Go | Workers muhiti, Node.js bilan qisman moslik |
| Edge | Middleware va edge-funksiyalar | Deno’dagi Edge Functions | Butun kod edge’da bajariladi |
| Bepul tarif | Faqat notijorat loyihalar | Bor, resurslar cheklangan | Statik trafik uchun haq yo‘q, build va funksiya so‘rovlariga limit |
| O‘sishda to‘lov | Jamoa o‘rinlari + iste’mol | Kreditlar va iste’molga asoslangan | Workers iste’moli, chiquvchi trafik uchun haq yo‘q |

Uchala platforma ham limit va narxlarni muntazam o‘zgartiradi, shuning uchun qaror qabul qilishdan oldin tarif sahifalarini tekshiring.

## Bepul tariflar: nimaga e’tibor berish kerak

- **Foydalanish shartlari.** Vercel’ning Hobby tarifi tijorat maqsadida foydalanishni to‘g‘ridan-to‘g‘ri taqiqlaydi, ya’ni kompaniya saytini u yerda saqlab bo‘lmaydi.
- **Limitdan oshganda nima bo‘ladi.** Ba’zi platformalarda loyiha keyingi davrgacha to‘xtatiladi, boshqalarida pul yechila boshlaydi. Buni oldindan bilib oling.
- **Bir vaqtdagi build’lar soni va build daqiqalari.** Tez-tez push qiladigan jamoada bu trafikdan oldinroq tugaydi.

## Build tezligi

Build tezligi birinchi navbatda loyihaga bog‘liq: sahifalar soni, bog‘liqliklar og‘irligi, build keshi va qancha sahifa oldindan generatsiya qilinishi. Bu yerda halol universal reyting yo‘q. Eng ishonchli usul — bitta repozitoriyni uchala platformaga ulash (bu bepul) va o‘z kodingizda build vaqtini solishtirish.

## Serverless va edge: asosiy farq

- **Vercel va Netlify** funksiyalarni odatiy Node.js muhitida ishga tushiradi. Istalgan npm-paket, ma’lumotlar bazasi drayveri va fayllar bilan ishlash mos keladi.
- **Cloudflare** kodni V8-izolyatlarga asoslangan Workers muhitida bajaradi. Sovuq start deyarli sezilmaydi, lekin Node.js’ning hamma API’lari ham qo‘llab-quvvatlanmaydi va ba’zi kutubxonalarni almashtirishga to‘g‘ri keladi.

Uchala platformada ham funksiyalar qisqa vazifalar uchun. Uzoq davom etadigan fon jarayonlari, navbatlar va doimiy ulanishlarni alohida server yoki konteynerda saqlagan ma’qul.

## O‘sishda narx

Katta hajmlarda hisob quyidagilardan tashkil topadi:

- **chiquvchi trafik** — ayniqsa sayt ko‘p rasm va video tarqatsa;
- **funksiyalar chaqiruvi va ishlash vaqti**;
- **build daqiqalari** va jamoa a’zolari soni;
- ba’zi platformalarda alohida hisoblanadigan **rasmlarni optimallashtirish**.

Media ko‘p va tashrif buyuruvchilar soni katta saytda Cloudflare’ning statik trafik uchun haq olmaydigan modeli odatda eng oldindan aytib bo‘ladigan hisobni beradi. Agar asosiy yuklama Next.js’ning serverda render qilishi bo‘lsa, Vercel’ning qulayligi narxdagi farqni oqlashi mumkin.

## Tanlashdagi ko‘p uchraydigan xatolar

- Bepul tarif tijorat loyihalariga ruxsat beradimi-yo‘qmi, tekshirmasdan tanlash.
- Platformaning o‘ziga xos funksiyalariga (xususiy omborlar, konfiguratsiya xizmatlari, edge-API’lar) chuqur bog‘lanib qolish va keyin ko‘chib o‘ta olmaslik.
- Xarajat limitlari va iste’mol haqidagi bildirishnomalarni yoqmaslik.
- Funksiyalarni ma’lumotlar bazasidan uzoqda ishga tushirish: uzoqdagi bazaga so‘rov edge’ning butun afzalligini yo‘qqa chiqaradi.

## FAQ

### Keyinchalik bir platformadan boshqasiga ko‘chsa bo‘ladimi?

Statik sayt tez ko‘chadi: yangi platformada repozitoriyni ulash va DNS’ni qayta sozlash kifoya. Server funksiyalari va platforma xizmatlari bilan ish ko‘proq: ularni yangi muhitga, ayniqsa Workers’ga moslashtirish kerak bo‘ladi.

### Qaysi platforma tashrif buyuruvchilar uchun tezroq?

Statik fayllarni uchala CDN ham taxminan bir xil tarqatadi. Dinamik sahifalar uchun ma’lumotlar bazasi qayerda ekanligi va funksiyalar unga qanchalik yaqin bajarilishi muhimroq.

### Next.js Vercel’dan tashqarida to‘liq ishlaydimi?

Ko‘pchilik imkoniyatlar adapterlar orqali ishlaydi, lekin eng yangi funksiyalar kechikib paydo bo‘lishi mumkin. Ko‘chishdan oldin tanlangan platformada saytning asosiy ssenariylarini sinab ko‘ring.
