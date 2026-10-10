---
title: Hosting O‘zbekistonda yoki xorijda: tezlik, qonun va narx
description: Mahalliy data-markazlar va xorijiy bulutlar: O‘zbekistondagi foydalanuvchilar uchun kechikish, shaxsiy ma’lumotlarni lokalizatsiya qilish, to‘lov va yordam.
summary: Foydalanuvchilaringiz O‘zbekistonda bo‘lsa va ularning shaxsiy ma’lumotlarini saqlasangiz, bu ma’lumotlar bazasi mamlakat ichidagi serverlarda turishi kerak, mahalliy hosting esa odatda kechikishni ham kamaytiradi. Xorijiy bulutlar xizmatlar to‘plami va global qamrovda ustun, shuning uchun ko‘pincha gibrid sxema oqilona.
---

## Qisqa javob

Tanlov uchta savolga bog‘liq:

1. **Foydalanuvchilaringiz qayerda?** O‘zbekistondagi auditoriya uchun mamlakat ichidagi server odatda tezroq javob beradi.
2. **O‘zbekiston fuqarolarining shaxsiy ma’lumotlarini saqlaysizmi?** Agar ha bo‘lsa, qonun ularni jismonan mamlakat hududida joylashgan serverlarda saqlashni talab qiladi.
3. **Sizga qanday xizmatlar kerak?** Boshqariladigan bazalar, serverless, global CDN va AI-xizmatlar yirik xorijiy bulutlarda ancha kengroq.

Ko‘pincha eng yaxshi javob — **gibrid**: foydalanuvchilar ma’lumotlari va asosiy baza mahalliy data-markazda, statika va yordamchi xizmatlar xorijda.

## Mahalliy foydalanuvchilar uchun tezlik

Kechikish masofa va marshrutga bog‘liq. Yevropadagi serverga so‘rov xalqaro kanallar orqali o‘tadi, Toshkentdagi serverga esa mahalliy tarmoq orqali. Provayderning ulanganligi ham muhim: milliy trafik almashish tarmog‘i **TAS-IX** ga ulangan resurslarga mamlakat ichidan odatda mahalliy marshrutlar orqali murojaat qilinadi.

Va’dalarga ishonmang — auditoriyangiz foydalanadigan tarmoqlardan o‘zingiz o‘lchang:

```bash
curl -o /dev/null -s -w "dns: %{time_namelookup}\nconnect: %{time_connect}\nttfb: %{time_starttransfer}\ntotal: %{time_total}\n" https://example.uz
```

Turli provayderlarning test serverlari uchun `connect` va `ttfb` ni solishtiring, o‘lchovni kunning turli vaqtlarida va mobil internetdan takrorlang. Xorijdagi foydalanuvchilar uchun manzara teskari: ularga xorijiy server yoki CDN yaqinroq.

## Qonun: shaxsiy ma’lumotlarni lokalizatsiya qilish

O‘zbekiston Respublikasining «Shaxsga doir ma’lumotlar to‘g‘risida»gi Qonuni axborot texnologiyalari yordamida ishlov beriladigan O‘zbekiston fuqarolarining shaxsiy ma’lumotlari jismonan mamlakat hududida joylashgan texnik vositalarda saqlanishini, shaxsga doir ma’lumotlar bazalari esa davlat reyestrida ro‘yxatdan o‘tkazilishini talab qiladi.

Amalda shaxsiy ma’lumotlarga nimalar kiradi:

- shakl va arizalardagi ismlar, telefonlar va elektron pochta manzillari;
- foydalanuvchi akkauntlari va buyurtmalar tarixi;
- CRM dagi mijozlar ma’lumotlari.

Agar sayt yoki ilova bunday ma’lumotlarni yig‘sa, asosiy bazani faqat xorijda saqlash xavfli. Saqlashning aniq sxemasini, jumladan zaxira nusxalar hamda tahlil va xabar yuborish bo‘yicha uchinchi tomon xizmatlarini yurist bilan muhokama qiling: qonun matni va uni qo‘llash amaliyoti aniqlashtirilishi mumkin.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | Mahalliy data-markaz | Xorijiy bulut |
|---|---|---|
| O‘zbekistondagi foydalanuvchilar uchun kechikish | Odatda pastroq | Yuqoriroq, marshrutga bog‘liq |
| Shaxsiy ma’lumotlarni lokalizatsiya qilish | Talabni bajarishga imkon beradi | Bunday ma’lumotlar uchun yagona saqlash joyi sifatida mos emas |
| To‘lov | So‘mda, shartnoma asosida, pul o‘tkazish; hisobot hujjatlari | Valyutadagi xalqaro karta; bank komissiyalari |
| Yordam | Rus va o‘zbek tillarida, sizning vaqt mintaqangizda | Odatda ingliz tilida; kengaytirilgan yordam pullik |
| Xizmatlar to‘plami | VPS, ajratilgan serverlar, colocation, asosiy bulut xizmatlari | Yuzlab boshqariladigan xizmatlar |
| Global qamrov | Cheklangan | Butun dunyo bo‘ylab regionlar va CDN |

## To‘lov va hujjatlar

Kompaniya uchun bu ko‘pincha hal qiluvchi omil. Mahalliy provayder hisob-faktura beradi, shartnoma tuzadi va buxgalteriya uchun hujjatlarni taqdim etadi. Xorijiy bulutlar odatda avtomatik yechib olinadigan xalqaro karta bilan to‘lanadi; konvertatsiya komissiyalari, karta limitlari va buxgalteriya bunday xarajatlarni qanday aks ettirishini hisobga oling.

## Qanday tanlash kerak: tekshiruv ro‘yxati

- Asosiy auditoriyangiz qayerda ekanini aniqlang.
- Yig‘ayotgan shaxsiy ma’lumotlaringiz va ular qayerda saqlanishi, jumladan zaxira nusxalar ro‘yxatini tuzing.
- Mahalliy provayderda tekshiring: data-markaz darajasi, elektr ta’minoti va kanallarning zaxiralanishi, zaxira nusxa siyosati, SLA mavjudligi.
- Xorijiy provayderda tekshiring: eng yaqin region, chiquvchi trafik narxi, to‘lov usullari.
- Haqiqiy foydalanuvchi tarmoqlaridan sinov tezlik o‘lchovini o‘tkazing.

## FAQ

### Ariza shakli bor saytni xorijda joylashtirish mumkinmi?

Shakldagi ism va telefon — bu shaxsiy ma’lumotlar. Ularni saqlasangiz, O‘zbekistondagi serverlarda saqlash kerak. Ko‘p uchraydigan yechim: saytning o‘zi istalgan joyda ishlashi mumkin, arizalar esa mahalliy serverdagi bazaga saqlanadi. Sxemani yurist bilan tekshiring.

### Mahalliy hosting O‘zbekistondagi foydalanuvchilar uchun har doim tezroqmi?

Odatda ha, lekin har doim emas: ko‘p narsa aniq provayderning kanallari va mahalliy trafik almashish tarmoqlariga ulanishiga bog‘liq. Shuning uchun reklama emas, o‘lchov hal qilishi kerak.

### Mahalliy provayderlarda yo‘q xizmatlar kerak bo‘lsa-chi?

Gibrid sxemadan foydalaning: shaxsiy ma’lumotlar va asosiy bazani mahalliy saqlang, shaxsiy ma’lumotlarsiz hisoblashlar, statikani tarqatish yoki anonimlashtirilgan ma’lumotlarni AI orqali qayta ishlashni xorijiy bulutga chiqaring.
