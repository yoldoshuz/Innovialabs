---
title: CDN nima va u saytni qanday tezlashtiradi
description: CDN qanday ishlaydi: edge serverlar, keshlanadigan va dinamik kontent, nega sayt uzoqdagi foydalanuvchilarda tezroq ochiladi va qachon CDN ulash shart emas.
summary: CDN — butun dunyo bo‘ylab joylashgan serverlar tarmog‘i bo‘lib, sayt fayllarining nusxalarini saqlaydi va ularni tashrif buyuruvchiga eng yaqin nuqtadan beradi, shuning uchun sahifalar tezroq yuklanadi va asosiy server yengillashadi.
---
## Qisqa javob

**CDN (Content Delivery Network)** — turli shahar va mamlakatlardagi serverlar tarmog‘i. Ular tashrif buyuruvchi va asosiy serveringiz (**origin**) o‘rtasida turadi va sayt fayllarining nusxalarini saqlaydi. Inson sahifani ochganda rasmlar, stillar va skriptlar unga origin’dan emas, tarmoqning eng yaqin tugunidan keladi.

Natija: sahifalar tezroq ochiladi, asosiy server kamroq so‘rov oladi, sayt esa trafik keskin oshishini osonroq ko‘taradi.

## Qanday ishlaydi

CDN tugunlari **edge serverlar** yoki mavjudlik nuqtalari (PoP) deb ataladi. Jarayon quyidagicha:

1. Toshkentdagi foydalanuvchi `example.com/logo.png` faylini so‘raydi.
2. DNS uni eng yaqin CDN edge serveriga yo‘naltiradi.
3. Fayl edge keshida allaqachon bo‘lsa — darhol beriladi (**cache hit**).
4. Bo‘lmasa (**cache miss**) — edge faylni origin’dan oladi, foydalanuvchiga beradi va keyingilar uchun nusxasini saqlaydi.

Nusxani qancha saqlashni serveringiz javobidagi sarlavhalar belgilaydi, masalan:

```http
Cache-Control: public, max-age=31536000, immutable
```

Bu sarlavha nomida xeshi bor fayllar (`app.3f9a2c.js`) uchun mos: fayl o‘zgarsa, nomi ham o‘zgaradi va eski kesh xalaqit bermaydi.

## Nega CDN saytni tezlashtiradi

Asosiy omil — **kechikish (latency)**: signal serverga borib-kelishi uchun ketadigan vaqt. U masofa va oraliq tarmoq tugunlari soniga qarab oshadi. Agar server Yevropada, foydalanuvchi esa Markaziy Osiyoda bo‘lsa, har bir so‘rov uzun yo‘l bosadi, sahifa yuklanishi esa o‘nlab so‘rovlar va ulanish o‘rnatishning bir necha bosqichidan (TCP, TLS) iborat.

CDN bu yo‘lni qisqartiradi:

- **statik fayllar yaqin tugundan beriladi**, shuning uchun har bir so‘rov qisqaroq;
- **TLS ulanish** uzoqdagi server bilan emas, **eng yaqin edge bilan** o‘rnatiladi;
- **edge va origin o‘rtasida** CDN odatda doimiy optimallashtirilgan ulanishlarni ushlab turadi.

Origin yaqinidagi foydalanuvchilar uchun farq kichik. Uzoqdagilar uchun esa sezilarli.

## Keshlanadigan va dinamik kontent

| Kontent | Misollar | Keshlanadimi? |
|---|---|---|
| **Statika** | Rasmlar, shriftlar, CSS, JS, video | Ha, uzoq muddatga |
| **Ommaviy sahifalar** | Bosh sahifa, blog maqolalari, mahsulot kartochkalari | Ko‘pincha ha, qisqa muddatga |
| **Shaxsiy kontent** | Savat, shaxsiy kabinet, foydalanuvchi ma’lumotlari bilan API javoblari | Yo‘q |

Shaxsiy sahifalarni CDN baribir o‘zi orqali o‘tkazadi, lekin keshlamaydi. Bu yerda ham tez TLS va origin’gacha optimallashtirilgan yo‘l hisobiga biroz yutuq bo‘ladi, ammo statikadagidan kamroq.

## CDN yana nima beradi

- Tarmoq darajasida **DDoS’dan himoya** va zararli trafikni filtrlash.
- Edge serverlarda **bepul SSL**.
- Ayrim provayderlarda **siqish va rasmlarni optimallashtirish**.
- **Barqarorlik**: origin qisqa vaqt ishlamay qolsa, sahifalarning bir qismi keshdan berilishi mumkin.

## Qachon CDN ulash shart emas

- **Butun auditoriya server yaqinida** va sayt kichik. Yutuq minimal, murakkablik esa oshadi.
- **Deyarli butun kontent shaxsiy** — masalan, ichki CRM. Keshlaydigan narsa yo‘q.
- **Ma’lumotlarni saqlash va qayta ishlash joyiga talablar bor**, provayderda esa kerakli yurisdiksiyada tugunlar yo‘q.
- **Kesh bilan shug‘ullanishga vaqt yo‘q.** Noto‘g‘ri sozlash bir foydalanuvchiga boshqasining ma’lumotlarini ko‘rsatishi yoki yangilanishdan keyin eskirgan sahifani qoldirishi mumkin.

## Ko‘p uchraydigan xatolar

- **Shaxsiy ma’lumotli sahifalarni keshlash.** Sessiya cookie’lari va shaxsiy ma’lumotlarga bog‘liq javoblar `Cache-Control: private` yoki `no-store` bilan belgilanganini doim tekshiring.
- **Nomida xeshi yo‘q fayllar uchun uzun kesh.** Yangilanishdan keyin foydalanuvchilar eski `style.css`’ni ko‘radi.
- Deploy’dan keyin **keshni tozalashni (purge) unutish**.
- **Origin to‘g‘ridan-to‘g‘ri ochiq.** Server CDN’ni chetlab o‘tib ochilsa, hujumlardan himoya ma’nosini yo‘qotadi.

## FAQ

### Kichik saytga CDN kerakmi?

Auditoriya bitta mamlakatda, server ham o‘sha yerda yoki yaqinda bo‘lsa — shart emas. Lekin ko‘plab hostinglar va Vercel yoki Netlify kabi platformalar CDN’ni sukut bo‘yicha qo‘shadi, u holda alohida hech narsa qilish kerak emas.

### CDN hostingni almashtiradimi?

Yo‘q. CDN nusxalarni tarqatadi va so‘rovlarni proksilaydi, lekin sayt baribir qayerdadir ishlashi kerak. Istisno — ayrim CDN platformalari o‘zi joylashtira oladigan to‘liq statik saytlar.

### Fayl CDN keshidan berilayotganini qanday bilish mumkin?

Brauzerning dasturchi vositalaridagi Network bo‘limida javob sarlavhalarini ko‘ring. Ko‘pchilik provayderlar kesh holati sarlavhasini qo‘shadi, masalan, Cloudflare’da `cf-cache-status: HIT` yoki boshqa tarmoqlarda `x-cache: Hit`.
