---
title: k6 bilan yuklama testi: ilova chegaralarini qanday aniqlash
description: k6 bo‘yicha amaliy qo‘llanma: skriptlar, real yuklama profili, kechikish persentillari va xatolarni o‘qish hamda natijalarni aniq tuzatishlarga aylantirish.
summary: k6’da real foydalanuvchi harakatlarini takrorlaydigan skript yozing, p95 kechikish va xatolar uchun chegaralar bilan yuklamani bosqichma-bosqich oshiring, server metrikalarini parallel kuzating va qayta testdan oldin birinchi tor joyni tuzating.
---

## Qisqa javob

**k6** — ochiq kodli yuklama testi vositasi: ssenariylar JavaScript’da yoziladi va buyruq satridan ishga tushiriladi. Ilova chegaralarini topish uchun:

1. Muhim foydalanuvchi ssenariylarini tanlang (kirish, katalog, buyurtma berish, qidiruv).
2. Ularni k6’da real pauzalar va ma’lumotlar bilan yozing.
3. Yuklamani bosqichma-bosqich oshiring va kechikish hamda xatolar uchun **thresholds** belgilang.
4. Test davomida server tomonini kuzating: CPU, xotira, ma’lumotlar bazasi, navbatlar.
5. Kechikish yoki xatolar o‘sa boshlagan nuqtani toping, sababini tuzating, takrorlang.

Maqsad — soniyasiga ko‘p so‘rov emas, balki **qanday yuklamada foydalanuvchi tajribasi buzilishini va nima uchunligini** bilish.

## Birinchi skript

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://staging.example.com/api/products');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

Ishga tushirish: `k6 run script.js`. Bu yerda 50 ta virtual foydalanuvchi (VU) ikki daqiqada yig‘iladi, besh daqiqa ushlab turiladi va asta kamayadi. Chegaralar — namunaviy qiymatlar, ularni mahsulotingiz maqsadlariga almashtiring. Chegara bajarilmasa, k6 noldan farqli kod bilan tugaydi, shuning uchun testni CI’da ishlatish mumkin.

## Real yuklama profilini modellashtirish

Test foydasi yuklama profiliga bog‘liq. Nimalarni to‘g‘ri qilish kerak:

- **Alohida endpoint emas, ssenariylar.** So‘rovlarni inson bajaradigan tartibda birlashtiring va qadamlar orasiga o‘ylash vaqti sifatida `sleep()` qo‘shing.
- **Turli ma’lumotlar.** Turli mahsulot ID’lari, qidiruv so‘rovlari va akkauntlardan foydalaning, aks holda kesh hamma narsani tez qilib ko‘rsatadi.
- **Ochiq va yopiq model.** VU bilan sekin server foydalanuvchilarni kuttiradi va ular kamroq so‘rov yuboradi — muammo yashirinadi. `constant-arrival-rate` va `ramping-arrival-rate` executor’lari javob vaqtidan qat’i nazar so‘rovlarni belgilangan tezlikda yuboradi, bu real trafikka yaqinroq.
- **Test turlari.** Qisqa **smoke** skriptning o‘zini tekshiradi; **load** — kutilgan trafikni; **stress** undan oshib ketadi; **spike** keskin sakrash qo‘shadi; **soak** yuklamani soatlab ushlab, xotira sizib chiqishi va ulanishlar tugashini aniqlaydi.

Production’ga o‘xshash staging muhitini sinang. Production’ni sinash kerak bo‘lsa, vaqt oynasini kelishib oling va jamoa hamda tashqi provayderlarni ogohlantiring.

## Natijalarni o‘qish

Oxirida k6 xulosa chiqaradi. Eng muhimlari:

| Metrika | Nimani ko‘rsatadi |
|---|---|
| `http_req_duration` p(95), p(99) | Eng sekin 5% va 1% so‘rovlar qanchalik sekin |
| `http_req_duration` avg | Yolg‘iz o‘zi kam foydali: o‘rtacha qiymat uzun dumni yashiradi |
| `http_req_failed` | Muvaffaqiyatsiz so‘rovlar ulushi (tarmoq xatolari, standart bo‘yicha 4xx/5xx) |
| `checks` | Javoblarda kutilgan mazmun bormi |
| `iterations` | Nechta to‘liq ssenariy tugadi |
| `dropped_iterations` | Arrival-rate testlarida k6 boshlay olmagan so‘rovlar: VU kam yoki generator yuklangan |

Faqat xulosaga emas, **vaqt bo‘yicha dinamikaga** qarang. Foydali topilma — yuklama hali o‘sayotganda p95 keskin ko‘tarila boshlagan yoki xatolar paydo bo‘lgan nuqta. Bu sizning amaliy chegarangiz.

## Topilmalarni tuzatishlarga aylantirish

Kechikish raqamlari faqat nimadir sekinligini aytadi. Nima ekanini bilish uchun testni server metrikalari va loglari bilan solishtiring:

- **Ilova serverlarida CPU chegarada**: issiq kodni profillang, kesh qo‘shing, gorizontal masshtablang.
- **Tor joy — baza**: sekin so‘rovlar logi, yetishmayotgan indekslar, N+1 so‘rovlar, juda kichik ulanishlar puli.
- **Yuqori CPU’siz xatolar**: ulanish va fayl deskriptorlari limitlari, nginx yoki balanser timeout’lari, tashqi API rate limit’lari.
- **Soak testda kechikish asta o‘sadi**: xotira sizishi, o‘sib borayotgan navbatlar, yopilmagan ulanishlar.

Taqqoslash adolatli bo‘lishi uchun bir vaqtda bitta narsani o‘zgartiring va xuddi shu skriptni qayta ishga tushiring. Skriptlarni repozitoriyda kod yonida saqlang.

## Ko‘p uchraydigan xatolar

- Yuklama generatorining o‘zi CPU yoki kanalga tiralib, tor joyga aylanadi.
- Pauzalar yo‘q, va bir nechta VU foydalanuvchi emas, hujum kabi ishlaydi.
- Kechikish yaxshi bo‘lgani uchun xatolar e’tiborsiz qoladi: tez 500 javoblari ham muvaffaqiyatsizlik.
- Faqat bosh sahifa sinaladi, holbuki real yuklama qidiruv va buyurtmaga tushadi.
- Test mock’lar o‘rniga tashqi to‘lov yoki SMS API’larga so‘rov yuboradi.

## FAQ

### Nechta virtual foydalanuvchini modellashtirish kerak?

Real yoki kutilgan trafikdan kelib chiqing: analitika yoki loglardagi bir vaqtdagi foydalanuvchilar va soniyasiga so‘rovlar cho‘qqisi. Avval shu darajani sinang, keyin zaxirani ko‘rish uchun undan oshing.

### k6 og‘ir frontend JavaScript’li saytlar uchun mos keladimi?

Asosiy HTTP moduli backend va API unumdorligini o‘lchaydi. k6’da sahifa metrikalari uchun browser moduli ham bor, lekin protokol darajasidagi testlar arzonroq va server chegaralari odatda aynan ular orqali topiladi.

### Yuklama testlarini qanchalik tez-tez o‘tkazish kerak?

Ishga tushirish va yirik relizlardan oldin, ideal holda esa unumdorlik regressiyalarini erta ushlash uchun CI’da jadval bo‘yicha qisqa versiyasini. Rasmiy hujjatlar: [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/).
