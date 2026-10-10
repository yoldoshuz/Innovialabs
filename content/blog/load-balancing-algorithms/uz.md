---
title: Yuklama balanslash algoritmlari: round robin, least connections
description: Balanser so‘rov uchun serverni qanday tanlaydi: round robin, weighted, least connections, IP hash va boshqa algoritmlar, ularning afzallik va kamchiliklari.
summary: Stateless API uchun odatda round robin yetarli, uzoq ulanishlar (WebSocket, striming) uchun least connections yaxshiroq, quvvati har xil serverlar uchun vaznli variantlar, IP hash esa faqat «yopishqoq» sessiyalarsiz iloji bo‘lmasa kerak.
---
## Qisqacha: qaysi algoritmni tanlash

**Load balancer** (yuklama balanseri) kiruvchi so‘rovlarni qabul qiladi va ularni bir nechta server (backend) o‘rtasida taqsimlaydi. Algoritm keyingi so‘rovni *qaysi* server olishini belgilaydi.

Tezkor yo‘riqnoma:

- **Bir xil serverlar, qisqa stateless so‘rovlar** → round robin.
- **Quvvati har xil serverlar** → weighted round robin yoki weighted least connections.
- **Uzoq ulanishlar** (WebSocket, fayl yuklash, striming) → least connections.
- **Mijoz doim bitta serverga tushishi kerak** → IP hash yoki consistent hashing.
- **Serverlarning javob vaqti keskin o‘zgaradi** → least response time yoki power of two choices, agar balanseringiz ularni qo‘llasa.

## Round robin

So‘rovlar navbat bilan tarqatiladi: birinchisi A serverga, ikkinchisi B ga, uchinchisi C ga, keyin yana A ga.

- **Afzalliklari:** oddiy, oldindan aytib bo‘ladigan, serverlar holatini bilishni talab qilmaydi.
- **Kamchiliklari:** bitta so‘rov millisekundlarda, boshqasi soniyalarda bajarilishini hisobga olmaydi. Sekin server tez server bilan bir xil miqdorda so‘rov oladi.
- **Mos keladi:** bir xil serverlar ortidagi stateless API, so‘rovlar og‘irligi taxminan teng bo‘lganda.

## Weighted round robin

Xuddi shunday, lekin har bir serverga **vazn** beriladi. Vazni 3 bo‘lgan server vazni 1 bo‘lgan serverdan uch baravar ko‘p so‘rov oladi.

- **Mos keladi:** pulda quvvati har xil mashinalar bo‘lsa yoki yangi serverni asta-sekin yuklamaga kiritayotganda.
- **Kamchiligi:** vaznlar qo‘lda beriladi va joriy yuklamaga javob bermaydi.

## Least connections

Yangi so‘rov **eng kam faol ulanishga** ega serverga yuboriladi.

- **Afzalliklari:** notekis yuklamaga o‘zi moslashadi. Agar server og‘ir so‘rovlarda «tiqilib» qolsa, yangilari boshqalarga ketadi.
- **Kamchiliklari:** balanser ulanishlarni kuzatishi kerak; juda qisqa so‘rovlarda round robin’dan farqi deyarli sezilmaydi.
- **Mos keladi:** WebSocket, long polling, fayl yuklash, davomiyligi oldindan noma’lum so‘rovlar.

Shuningdek, ulanishlar soni va server vaznini birga hisobga oladigan **weighted least connections** ham bor.

## IP hash va consistent hashing

Server mijoz IP manzili (yoki boshqa kalit: cookie, foydalanuvchi ID) xeshi bo‘yicha tanlanadi. Bitta mijoz barqaror ravishda bitta serverga tushadi — bu **sticky sessions** deyiladi.

- **Afzalliklari:** server xotirasidagi sessiya yo‘qolmaydi, lokal kesh samaraliroq ishlaydi.
- **Kamchiliklari:** yuklama notekis taqsimlanishi mumkin (masalan, bitta NAT ortidagi ko‘p foydalanuvchilar bitta IP oladi). Server qo‘shilganda yoki olib tashlanganda oddiy xesh mijozlarning ko‘pchiligini aralashtirib yuboradi.
- **Consistent hashing** oxirgi muammoni hal qiladi: pul o‘zgarganda kalitlarning faqat kichik qismi ko‘chadi. U kesh serverlar va shardlash uchun ishlatiladi.

Eng yaxshisi — **ilovani stateless qilish** (sessiyalar Redis’da yoki tokenda), shunda sticky sessions umuman kerak bo‘lmaydi.

## Least response time va power of two choices

- **Least response time** nafaqat ulanishlar sonini, balki serverning o‘rtacha javob vaqtini ham hisobga oladi. Notekis serverlarda yaxshi, lekin hamma joyda qo‘llab-quvvatlanmaydi va sozlash murakkabroq.
- **Power of two choices**: balanser ikkita tasodifiy serverni tanlaydi va so‘rovni ulardan kamroq yuklanganiga yuboradi. Katta pullarda va bir nechta mustaqil balanserlarda yaxshi ishlaydigan oddiy usul.
- **Random** — tasodifiy tanlov. Sodda tuyuladi, lekin katta hajmlarda deyarli teng taqsimlaydi.

## Taqqoslash

| Algoritm | Yuklamani hisobga oladi | Sticky | Eng yaxshi qo‘llanishi |
|---|---|---|---|
| Round robin | Yo‘q | Yo‘q | Bir xil serverlar, stateless API |
| Weighted round robin | Yo‘q (statik vaznlar) | Yo‘q | Quvvati har xil serverlar |
| Least connections | Ha | Yo‘q | Uzoq ulanishlar |
| IP hash | Yo‘q | Ha | Sessiyasi xotirada bo‘lgan legacy ilovalar |
| Consistent hashing | Yo‘q | Ha | Keshlar, shardlash |
| Power of two choices | Ha | Yo‘q | Katta pullar, taqsimlangan balanserlar |

## nginx’dagi misol

```nginx
upstream api {
    least_conn;
    server 10.0.0.11:3000 weight=2;
    server 10.0.0.12:3000;
    server 10.0.0.13:3000 backup;
}
```

`least_conn` direktivasisiz nginx weighted round robin’dan foydalanadi. `backup` server faqat asosiy serverlar ishlamay qolganda trafik oladi. Batafsil — [nginx hujjatlarida](https://nginx.org/en/docs/http/ngx_http_upstream_module.html).

## Algoritmdan ham muhimroq narsalar

- **Health checks.** Balanser ishdan chiqqan serverga so‘rov yuborishni to‘xtatishi kerak. Busiz har qanday algoritm foydalanuvchilarni xatoga yuboradi.
- **Taymautlar va qayta urinishlar.** Server javob bermasa nima qilishni sozlang, lekin idempotent bo‘lmagan so‘rovlarni (to‘lovlar, buyurtma yaratish) takrorlamang.
- **Monitoring.** Faqat o‘rtachani emas, har bir server bo‘yicha yuklama taqsimoti va javob vaqtini kuzating.
- **Balanserning o‘zi** yagona nosozlik nuqtasi bo‘lmasligi kerak.

## FAQ

### Ko‘pchilik veb-loyihalar uchun nima yaxshiroq?

Agar ilova stateless va serverlar bir xil bo‘lsa, round robin yoki least connections yaxshi natija beradi. So‘rovlar davomiyligi keskin farq qilsa, least connections xavfsizroq standart tanlov.

### Sticky sessions kerakmi?

Faqat ilova holatni muayyan server xotirasida saqlasa va buni hozircha o‘zgartirib bo‘lmasa. Boshqa hollarda sessiyalarni umumiy xotiraga chiqargan ma’qul: shunda masshtablash va serverlarni texnik xizmatga olib chiqish osonlashadi.

### L4 va L7 balanslash farqi nimada?

L4 TCP/UDP darajasida ishlaydi va faqat manzil hamda portlarni ko‘radi — tez, lekin mazmun bo‘yicha mantiq yo‘q. L7 HTTP’ni tushunadi: yo‘l, sarlavhalar va cookie bo‘yicha marshrutlay oladi, TLS’ni tugatadi. Server tanlash algoritmlari ikkala darajada ham qo‘llanadi.
