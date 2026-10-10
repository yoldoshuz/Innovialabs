---
title: Blue-green yoki canary deploy: reliz strategiyalarini solishtirish
description: Blue-green va canary trafikni qanday o‘tkazadi, infratuzilma narxi, orqaga qaytish tezligi va ikkala strategiyani Nginx hamda Kubernetes’da amalga oshirish.
summary: Blue-green butun trafikni ikki to‘liq muhit o‘rtasida birdaniga almashtiradi — orqaga qaytish bir zumda, lekin ikki baravar infratuzilma kerak. Canary trafikni yangi versiyaga bosqichma-bosqich o‘tkazadi — xavf kamroq, lekin versiyalar bo‘yicha metrikalar va avtomatik tahlil kerak.
---

## Asosiy farq

Ikkala strategiya bitta vazifani hal qiladi — yangi versiyani to‘xtalishsiz chiqarish va tezda orqaga qaytish imkoniyatini saqlash. Farq **trafik qanday o‘tishida**.

- **Blue-green.** Ikkita bir xil muhit bor: «ko‘k» (joriy versiya) va «yashil» (yangi). Yangi versiya yashilga joylanadi, tekshiriladi va **butun trafik birdaniga** o‘tkaziladi. Ko‘k muhit orqaga qaytish uchun zaxirada qoladi.
- **Canary.** Yangi versiyani **trafikning kichik qismi** oladi. Metrikalar me’yorida bo‘lsa, ulush bosqichma-bosqich 100% gacha oshiriladi. Aks holda trafik eski versiyaga qaytariladi.

## Asosiy parametrlar bo‘yicha taqqoslash

| Parametr | Blue-green | Canary |
|---|---|---|
| Trafikni o‘tkazish | Birdaniga to‘liq | Asta-sekin, bosqichlar bilan |
| Infratuzilma | Reliz vaqtida ikki baravar | Bir nechta qo‘shimcha nusxa |
| Orqaga qaytish tezligi | Bir zumda — qayta almashtirish | Tez — canary ulushini olib tashlash |
| Xatoning ta’sir radiusi | Almashtirishdan keyin barcha foydalanuvchilar | Faqat canary ulushi |
| Monitoring talablari | Almashtirishdan oldin bazaviy tekshiruvlar | Versiyalar bo‘yicha metrikalar, xato va kechikishni solishtirish |
| Murakkablik | Pastroq | Yuqoriroq |
| Real trafikda tekshirish | Faqat almashtirishdan keyin | Birinchi bosqichdan |

## Qachon qaysi birini tanlash kerak

**Blue-green** mos keladi, agar:

- bir zumda orqaga qaytadigan oddiy va oldindan aytib bo‘ladigan reliz kerak bo‘lsa;
- trafik kam va statistik jihatdan ishonchli canary tahlili baribir imkonsiz bo‘lsa;
- byudjet reliz vaqtida muhitning ikkinchi nusxasini ushlab turishga yetsa.

**Canary** mos keladi, agar:

- foydalanuvchilar ko‘p va xato hammaga birdaniga tegsa qimmatga tushsa;
- versiyalar bo‘yicha ajratilgan metrikalar bo‘lsa: xatolar ulushi, kechikish, biznes ko‘rsatkichlari;
- jamoa tahlil va orqaga qaytishni avtomatlashtirishga tayyor bo‘lsa.

Bu strategiyalar bir-biriga mos keladi: yashil muhitni joylab, trafikni unga asta-sekin o‘tkazish mumkin.

## Umumiy qiyinchilik: ma’lumotlar bazasi

Ilovaning ikkala versiyasi bir muddat **bitta baza bilan** ishlaydi. Shuning uchun sxema migratsiyalari **orqaga mos** bo‘lishi kerak: avval yangi ustun va jadvallar qo‘shiladi, ikkala sxema bilan ishlay oladigan kod chiqariladi va faqat shundan keyin eskisi o‘chiriladi. Aks holda ilovani orqaga qaytarish yordam bermaydi — eski versiya yangi sxema bilan ishlay olmaydi.

## Nginx’da amalga oshirish

**Blue-green** — ikkita upstream va bitta qatorni almashtirib, so‘ng `nginx -s reload`:

```nginx
upstream blue  { server 10.0.0.10:8080; }
upstream green { server 10.0.0.20:8080; }

server {
    listen 80;
    location / {
        proxy_pass http://green;  # almashtirish: green <-> blue
    }
}
```

**Canary** — bitta upstream ichida og‘irliklar:

```nginx
upstream app {
    server 10.0.0.10:8080 weight=9;  # barqaror versiya
    server 10.0.0.20:8080 weight=1;  # canary
}
```

Foydalanuvchi versiyalar o‘rtasida sakrab yurmasligi uchun cookie yoki xesh bo‘yicha bog‘lash ishlatiladi (`hash $cookie_user_id consistent;`), lekin unda taqsimot og‘irliklarga emas, kalitga bog‘liq bo‘ladi.

## Kubernetes’da amalga oshirish

- **Blue-green.** `version: blue` va `version: green` label’li ikkita Deployment. Service podlarni selektor bo‘yicha tanlaydi; almashtirish — Service selektoridagi `version`’ni o‘zgartirish.
- **Oddiy canary.** Bitta Service ortida ikkita Deployment; trafik ulushi taxminan replikalar ulushiga teng. Qo‘pol, lekin qo‘shimcha vositalarsiz.
- **Ingress orqali canary.** Ingress-nginx kabi Ingress kontrollerlari og‘irlik yoki header va cookie qoidalari bilan canary annotatsiyalarini qo‘llab-quvvatlaydi.
- **Avtomatlashtirilgan canary.** Argo Rollouts, Flagger yoki service mesh bosqichlarni boshqaradi, metrikalarni tekshiradi va relizni avtomatik orqaga qaytaradi.

## Ko‘p uchraydigan xatolar

- Orqaga qaytishni imkonsiz qiladigan mos kelmaydigan baza migratsiyalari.
- Versiyalar bo‘yicha metrikalarsiz canary — aynan nima buzilgani noma’lum.
- Juda qisqa canary bosqichlari: yuklama ostida yoki vaqt o‘tib paydo bo‘ladigan muammolar ko‘rinishga ulgurmaydi.
- Orqaga qaytish hali kerak bo‘lishi mumkin bo‘lgan paytda ko‘k muhitni almashtirishdan keyin darhol o‘chirish.

## FAQ

### Infratuzilma bo‘yicha qaysi biri arzonroq?

Odatda canary: qo‘shimcha resurslar faqat trafikning kichik ulushi uchun kerak. Blue-green kamida reliz vaqtida muhitning to‘liq ikkinchi nusxasini talab qiladi.

### Trafik kam bo‘lsa canary qilish mumkinmi?

Mumkin, lekin bir necha foizlik ulush ishonchli xulosa uchun juda kam so‘rov berishi mumkin. Bunday holda bosqichlar vaqtini uzaytiring yoki almashtirishdan oldin puxta tekshiruv bilan blue-green’dan foydalaning.

### Canary feature flags’dan nimasi bilan farq qiladi?

Canary trafikni ilovaning joylangan versiyalari o‘rtasida taqsimlaydi. **Feature flags** esa bitta versiya ichida tanlangan foydalanuvchilar uchun funksiyalarni yoqadi. Ular ko‘pincha birga ishlatiladi.
