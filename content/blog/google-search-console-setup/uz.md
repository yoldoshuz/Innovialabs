---
title: Saytni Google Search Console’ga qo‘shish va u bilan ishlash
description: Bosqichma-bosqich: saytni Google Search Console’da tasdiqlash, resurs turini tanlash, asosiy hisobotlar va indeksatsiyani URL tekshiruvi orqali nazorat qilish.
summary: DNS yozuvi orqali «Domen» turidagi resursni qo‘shing, sitemap yuboring, so‘ng «Samaradorlik», «Sahifalar» va Core Web Vitals hisobotlarini muntazam ko‘rib, muhim URL’larni tekshiruv vositasi bilan tekshiring.
---
## Qisqacha: saytni qanday ulash kerak

**Google Search Console** — Google’ning bepul xizmati bo‘lib, qidiruv tizimi saytingizni qanday ko‘rishini ko‘rsatadi: qaysi sahifalar indeksda, sizni qaysi so‘rovlar bo‘yicha topishadi va qayerda texnik muammolar bor. Ulash bir necha daqiqa oladi:

1. Kompaniyaning Google akkaunti orqali kiring (xodimning shaxsiy akkaunti emas).
2. «Resurs qo‘shish» tugmasini bosing va turini tanlang: **Domen** yoki **URL prefiksi**.
3. Sayt egasi ekaningizni usullardan biri bilan tasdiqlang.
4. «Sitemap fayllari» bo‘limida sayt xaritasini yuboring.

Ma’lumotlar tasdiqlangandan keyin yig‘ila boshlaydi, shuning uchun xizmatni sayt ishga tushishi bilanoq ulang.

## Domen yoki URL prefiksi

| Resurs turi | Nimani qamrab oladi | Qanday tasdiqlanadi |
|---|---|---|
| **Domen** | Barcha subdomenlar va protokollar: http, https, www, m. | Faqat DNS TXT yozuvi |
| **URL prefiksi** | Faqat ko‘rsatilgan prefiksli manzillar, masalan `https://example.com/` | HTML fayl, meta-teg, Google Analytics, Tag Manager, DNS |

Ko‘pchilik saytlar uchun **«Domen» resursi** yaxshiroq: siz to‘liq manzarani ko‘rasiz va trafikning bir qismi www yoki www’siz versiyaga tushsa ham ma’lumot yo‘qolmaydi. URL prefiksi DNS’ga kirish imkoni bo‘lmaganda yoki `/blog/` kabi alohida bo‘limni tahlil qilish kerak bo‘lganda qulay.

## Tasdiqlash usullari

- **DNS TXT yozuvi** — registrator yoki DNS panelida qo‘shiladi. Eng ishonchli variant: redizaynda buzilmaydi.
- **HTML fayl** — sayt ildiziga yuklanadi. Tasdiqlangandan keyin o‘chirmang.
- Bosh sahifaning `<head>` qismidagi **meta-teg**. Shablon almashganda osongina yo‘qoladi.
- **Google Analytics yoki Tag Manager** — agar ular o‘rnatilgan bo‘lsa va sizda administrator huquqi bo‘lsa.

DNS yozuviga misol:

```text
Turi: TXT
Nomi: @
Qiymati: google-site-verification=sizning_kodingiz
```

DNS yangilanishi vaqt olishi mumkin. Tekshiruv birdan o‘tmasa, keyinroq qayta urinib ko‘ring.

## Asosiy hisobotlar

**Samaradorlik.** So‘rovlar, sahifalar, mamlakatlar va qurilmalar bo‘yicha kliklar, ko‘rsatishlar, CTR va o‘rtacha pozitsiya. Ko‘rsatishlari ko‘p, lekin kliki kam so‘rovlarga e’tibor bering — ular sarlavha va tavsiflarni yaxshilash uchun nomzodlar.

**Sahifalar (indeksatsiya).** Qaysi URL’lar indeksda va qolganlari nega yo‘q. Ko‘p uchraydigan sabablar: «Topilgan, indekslanmagan», «Dublikat», «noindex tegi bilan chiqarib tashlangan». Har bir istisno xato emas: xizmat va takroriy sahifalar indeksda bo‘lmasligi kerak.

**Core Web Vitals.** Mobil va desktopda LCP, INP va CLS ko‘rsatkichlari yomon, yaxshilanishi kerak va yaxshi bo‘lgan URL guruhlari. Ma’lumotlar haqiqiy Chrome foydalanuvchilaridan olinadi, shuning uchun trafigi kam saytlarda hisobot bo‘sh bo‘lishi mumkin.

**Sitemap fayllari.** Sayt xaritasining qayta ishlanish holati va topilgan URL’lar soni.

## URL tekshiruvi vositasi

Interfeys tepasidagi qidiruv qatoriga manzilni kiriting va quyidagilarni ko‘rasiz:

- sahifa Google indeksida bormi;
- Google qaysi kanonik manzilni tanlagan va u siznikiga mos keladimi;
- oxirgi skanerlashda sahifa ochiq bo‘lganmi;
- Googlebot sahifani qanday chizgan («Saytdagi sahifani tekshirish» tugmasi).

Tuzatishlardan keyin **«Indeksatsiyani so‘rash»** tugmasini bosing. Bu qayta skanerlashni tezlashtiradi, lekin indeksga tushishni kafolatlamaydi. So‘rovlar soni cheklangan, shuning uchun ularni muhim sahifalar uchun ishlating.

## Ko‘p uchraydigan xatolar

- Meta-teg orqali tasdiqlab, shablonni yangilashda uni o‘chirib yuborish.
- Faqat `http://` versiyani qo‘shib, `https://` bo‘yicha ma’lumotlarni ko‘rmaslik.
- Sababini o‘rganmasdan chiqarib tashlangan sahifalar sababli xavotirga tushish.
- Hamkasblarni «Foydalanuvchilar va ruxsatlar» orqali qo‘shish o‘rniga akkaunt parolini berish.

## FAQ

### Ulagandan keyin ma’lumotlar qachon paydo bo‘ladi?

Odatda birinchi ma’lumotlar bir necha kun ichida chiqadi. «Samaradorlik» hisoboti resurs tasdiqlanishidan oldingi davrni ko‘rsatmaydi.

### Google Analytics bo‘lsa, Search Console kerakmi?

Ha. Analytics tashrifchilar saytda nima qilishini ko‘rsatadi, Search Console esa klikdan oldin nima bo‘lishini: qidiruvdagi ko‘rsatishlar, so‘rovlar va indeksatsiyani.

### Bitta saytga bir necha kishi kira oladimi?

Ha. Egasi resurs sozlamalarida o‘z akkauntini bermasdan foydalanuvchilarni to‘liq yoki cheklangan huquqlar bilan qo‘shadi.
