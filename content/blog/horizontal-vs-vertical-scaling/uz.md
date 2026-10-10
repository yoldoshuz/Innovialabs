---
title: Gorizontal va vertikal masshtablash: ilovani qanday kengaytirish
description: Vertikal va gorizontal masshtablash farqi, har birining chegaralari, ilovani stateless qilish va qachon boshqa yondashuvga o‘tish kerakligi haqida.
summary: Vertikal masshtablash — kuchliroq server, gorizontal — balanslovchi ortidagi ko‘proq serverlar. Vertikaldan boshlash osonroq, lekin o‘sish va barqarorlik uchun ilova stateless va gorizontal kengayishga tayyor bo‘lishi kerak.
---

## Qisqacha: farqi nimada

**Vertikal masshtablash (scale up)** — bitta server resurslarini oshirasiz: ko‘proq CPU, xotira, tezroq disk. Kodni o‘zgartirish shart emas.

**Gorizontal masshtablash (scale out)** — ilovaning bir nechta nusxasini turli serverlarda ishga tushirasiz va trafikni ular orasida **yuklama balanslovchisi** (load balancer) orqali taqsimlaysiz. Bu arxitekturani tayyorlashni talab qiladi, lekin deyarli chegarasi yo‘q va nosozliklarga chidamlilik beradi.

## Yondashuvlarni solishtirish

| Mezon | Vertikal | Gorizontal |
|---|---|---|
| Koddagi o‘zgarishlar | Kerak emas | Kerak: stateless, umumiy sessiyalar |
| Chegara | Mavjud eng kuchli server | Amalda yo‘q |
| Nosozlikka chidamlilik | Yagona nosozlik nuqtasi | Bitta tugun ishdan chiqishi muhim emas |
| O‘sishdagi to‘xtash | Ko‘pincha qayta ishga tushirish | Tugunlar to‘xtatmasdan qo‘shiladi |
| Ekspluatatsiya murakkabligi | Past | Yuqoriroq: balanslovchi, tugunlar monitoringi |
| Narx | Kuchli uskuna nomutanosib qimmatlashadi | Ko‘p arzon tugunlar, lekin ko‘proq xizmat |

## Vertikal masshtablash chegaralari

- **Jismoniy chegara.** Bir kun kelib kuchliroq server bo‘lmaydi yoki u nomutanosib qimmat turadi.
- **Yagona nosozlik nuqtasi.** Server tushdi — hammasi to‘xtadi.
- **Yangilashda to‘xtash.** Tarif yoki uskunani almashtirish odatda qayta yuklashni bildiradi.
- **Hamma narsa tezlashmaydi.** Ilova bir oqimli kod yoki bazadagi blokirovkalarga tiralsa, qo‘shimcha yadrolar kam yordam beradi.

Shunga qaramay, vertikal yo‘l — oqilona boshlanish: tez, qo‘llab-quvvatlash arzon va ko‘pchilik kichik loyihalarning o‘sishini qoplaydi.

## Ilovani gorizontal kengayadigan qiladigan narsalar

Asosiy qoida: **ilovaning istalgan nusxasi istalgan so‘rovni qayta ishlay olishi kerak**. Buning uchun:

- **Stateless servis.** Foydalanuvchi holatini jarayon xotirasida saqlamang.
- **Umumiy sessiyalar.** Sessiyalarni Redis, ma’lumotlar bazasi yoki imzolangan tokenlarda (masalan, JWT) saqlang, aniq bir server xotirasida emas.
- **Fayllar — tashqi omborda.** Foydalanuvchi yuklagan fayllarni lokal diskka emas, obyekt omboriga (S3-mos) joylang.
- **Fon vazifalari — navbat orqali.** Har bir tugundagi cron vazifani N marta bajaradi; navbat yoki taqsimlangan blokirovkadan foydalaning.
- **Kesh — umumiy.** Har bir tugundagi lokal kesh ma’lumotlar mos kelmasligiga olib keladi.
- **Health check.** Balanslovchi qaysi tugun tirikligini `/health` kabi endpoint orqali bilishi kerak.

nginx’da oddiy balanslash misoli:

```nginx
upstream app {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app;
    }
}
```

## Ma’lumotlar bazasi bilan nima bo‘ladi

Ilova gorizontal oson kengayadi, baza esa qiyinroq. Odatiy ketma-ketlik:

1. Baza serverini vertikal kattalashtirish, so‘rovlar va indekslarni optimallashtirish.
2. O‘qishni **replikalarga** (read replicas) chiqarish.
3. Tez-tez so‘raladigan ma’lumotlarni keshlash.
4. Faqat haqiqiy zarurat bo‘lganda — **sharding**, bu tizimni ancha murakkablashtiradi.

## Qachon gorizontal masshtablashga o‘tish kerak

- Yuklama muntazam bitta server chegarasiga tiraladi, keyingi tarif esa nomutanosib qimmat.
- To‘xtab qolish mumkin emas va nosozlikka chidamlilik kerak.
- Trafik keskin o‘zgaradi va tugunlarni talab bo‘yicha qo‘shish (autoscaling) foydali.
- Ilovani to‘xtatmasdan yangilash kerak (rolling deploy).

## Ko‘p uchraydigan xatolar

- Holatni xotiradan olib tashlamasdan gorizontal kengaytirish — foydalanuvchilar akkauntdan «chiqib ketadi».
- Asl muammo bazaga sekin so‘rovlar bo‘lganda serverlar qo‘shish.
- Monitoringni sozlamaslik va aynan nima tiralayotganini bilmaslik: CPU, xotira, disk yoki tarmoq.

## FAQ

### Kichik loyiha nimadan boshlashi kerak?

Vertikal masshtablash hamda kod va so‘rovlarni optimallashtirishdan. Lekin ilovani boshidanoq stateless yozing — shunda bir nechta serverga o‘tish qayta yozishni talab qilmaydi.

### Gorizontal masshtablash uchun Kubernetes kerakmi?

Yo‘q. Bir nechta tugun uchun nginx yoki bulutdagi Load Balancer kabi balanslovchi yetarli. Kubernetes servislar va tugunlar ko‘p bo‘lib, avtomatlashtirish kerak bo‘lganda foydali.

### Ikkala yondashuvni birlashtirish mumkinmi?

Ha, odatda shunday qilinadi: tugunning oqilona o‘lchami vertikal tanlanadi, so‘ngra tugunlar soni gorizontal oshiriladi.
