---
title: Docker image hajmini qanday kamaytirish mumkin: amaliy usullar
description: Docker image hajmini kamaytirish: alpine va distroless bazalar, multi-stage build, paket keshlarini tozalash va dive orqali qatlamlarni tahlil qilish.
summary: Eng katta natijani multi-stage build va yengil bazaviy image (slim, alpine yoki distroless) beradi; so‘ng paket keshlarini o‘sha qatlamda tozalang, .dockerignore qo‘shing va qatlamlarni dive bilan tekshiring.
---

## Qisqa javob

Image hajmi **bazaviy image**, **bog‘liqliklar** va build tugagach **qatlamlarda qolgan hamma narsa** yig‘indisidan iborat. Shuning uchun to‘rtta narsa ishlaydi:

1. **Multi-stage build** — bitta image’da yig‘ib, yakuniy image’ga faqat natijani nusxalash.
2. **Yengil baza** — to‘liq distributiv o‘rniga `slim`, `alpine` yoki `distroless`.
3. **O‘sha qatlamda tozalash** — paket menejeri keshini u paydo bo‘lgan `RUN` buyrug‘ining o‘zida o‘chirish.
4. **Tahlil** — qatlamlarda aslida nima borligini `dive` yordamida ko‘rish.

Kichik image deploy paytida tezroq yuklanadi, yangi node’larda tezroq ishga tushadi va zaiflik topilishi mumkin bo‘lgan paketlar kamroq bo‘ladi.

## Multi-stage build

Kompilyatorlar, dev-bog‘liqliklar va manba kodi faqat build bosqichida kerak. Multi-stage build’da ular oraliq bosqichda qoladi:

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
```

Go va Rust’da natija yanada sezilarli: yakuniy image’da bitta binar fayl bo‘ladi, baza esa `distroless` yoki hatto `scratch` bo‘lishi mumkin.

## Bazaviy image’ni qanday tanlash kerak

| Baza | Ichida nima bor | Qachon mos |
|---|---|---|
| To‘liq (`debian`, `ubuntu`) | Shell, paket menejeri, ko‘p utilitalar | Debug, murakkab tizim bog‘liqliklari |
| `slim` | Qisqartirilgan Debian | Ko‘pchilik tillar uchun yaxshi murosa |
| `alpine` | musl libc, busybox, `apk` | Kichik hajm, agar bog‘liqliklar musl bilan mos bo‘lsa |
| `distroless` | Faqat runtime, shell va paket menejerisiz | Production, minimal hujum yuzasi |
| `scratch` | Bo‘sh | Statik yig‘ilgan binar fayllar |

**Alpine nozik jihati:** glibc o‘rniga musl ishlatilgani sababli ba’zi native modullarni (masalan, C-kengaytmali Python paketlarini) manbadan yig‘ishga to‘g‘ri keladi. Build sekinlashadi, ba’zan image hatto kattalashadi. Bunday holatda `slim` ko‘pincha amaliyroq.

**Distroless nozik jihati:** ichida shell yo‘q, shuning uchun `docker exec ... sh` ishlamaydi. Debug uchun image’larning debug-variantlari yoki efemer konteynerlar ishlatiladi.

## Keshlar va qatlamlarni tozalash

Har bir `RUN`, `COPY` va `ADD` buyrug‘i qatlam yaratadi. Keyingi qatlamda o‘chirilgan fayl **baribir image’da qoladi**. Shuning uchun o‘rnatish va tozalash bitta buyruqda bo‘lishi kerak:

```dockerfile
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*
```

Xuddi shunday:

- `pip install --no-cache-dir ...`
- `apk add --no-cache ...`
- agar kesh image’ga tushsa, o‘sha `RUN` ichida `npm ci` dan keyin `npm cache clean --force`.

**Qatlamlarni squash qilish** (bittaga birlashtirish) ba’zan hajmni kamaytiradi, lekin image’lar o‘rtasida qatlam keshidan qayta foydalanishni buzadi. Odatda multi-stage build xuddi shu vazifani tozaroq hal qiladi.

## .dockerignore

Usiz build kontekstiga, so‘ng `COPY . .` orqali image’ga `.git`, `node_modules`, loglar, lokal `.env` fayllar va test ma’lumotlari tushadi. Minimal misol:

```text
.git
node_modules
*.log
.env
coverage
```

Bu build’ni ham tezlashtiradi va maxfiy ma’lumotlarning image’ga tasodifan tushishidan himoya qiladi.

## Joyni nima egallayotganini qanday topish

- `docker images` — image’ning umumiy hajmi.
- `docker history <image>` — har bir qatlam hajmi va uni yaratgan buyruq.
- **dive** — har bir qatlam tarkibini, qo‘shilgan va o‘zgargan fayllarni hamda behuda sarflangan joyni interaktiv ko‘rsatadi. Image sezdirmasdan kattalashib ketmasligi uchun uni CI’da ham ishga tushirish mumkin.

## Keng tarqalgan xatolar

- Bog‘liqliklarni o‘rnatishdan oldin butun loyihani nusxalash — qatlam keshi buziladi va har build hammasini qaytadan o‘rnatadi.
- Dev-bog‘liqliklar va build vositalarini yakuniy image’da qoldirish.
- Fayllarni alohida `RUN` bilan o‘chirib, image kichraydi deb o‘ylash.
- Native bog‘liqliklarni tekshirmasdan alpine’ga ko‘r-ko‘rona o‘tish.

## FAQ

### Alpine yoki distroless — qaysi birini tanlash kerak?

Agar konteyner ichida shell va paket menejeri kerak bo‘lsa — alpine yoki slim. Agar ilova shunchaki ishga tushsa va tashqaridan debug qilish sizga yetarli bo‘lsa — distroless ortiqcha dasturlar va potensial zaifliklarni kamroq olib keladi.

### Image hajmi ilova unumdorligiga ta’sir qiladimi?

Ilovaning o‘zi ishlash tezligiga deyarli ta’sir qilmaydi. U image’ni yuklab olish vaqtiga, yangi pod’larning sovuq startiga va registry’ga tushadigan yuklamaga ta’sir qiladi.

### docker history bo‘lsa, dive kerakmi?

`docker history` qatlamlar hajmini ko‘rsatadi, lekin ularning tarkibini emas. dive aniq fayllarni ko‘rsatadi, shu bois unutilgan kesh yoki ortiqcha papkani topish ancha oson.
