---
title: Docker’da multi-stage build: yig‘ish va ishga tushirishni ajratish
description: Docker’da multi-stage build qanday ishlaydi: Go, Node.js va Nginx orqali beriladigan frontend uchun misollar hamda image hajmi qisqarishini o‘zingiz o‘lchash.
summary: Bitta Dockerfile’da bir nechta bosqich yoziladi: barcha vositalari bor og‘ir bosqich ilovani yig‘adi, yakuniy yengil image’ga esa faqat tayyor natija ko‘chiriladi — kompilyator, manba kod va dev-bog‘liqliklarsiz.
---
## Qisqa javob

**Multi-stage build** — bu bir nechta `FROM` buyrug‘iga ega Dockerfile. Har bir `FROM` o‘z bazaviy image’i bilan yangi bosqich (stage) boshlaydi. Yakuniy image’ga faqat oxirgi bosqich kiradi, oldingi bosqichlardan esa kerakli fayllarni `COPY --from=<bosqich>` orqali aniq olasiz.

Bu nima beradi:

- **Kichikroq hajm** — kompilyator, paket menejeri, manba kod va test bog‘liqliklari production’ga bormaydi.
- **Hujum yuzasi kichrayadi** — image’da vositalar qancha kam bo‘lsa, skanerlar shuncha kam zaiflik topadi.
- **Bitta Dockerfile** — «build-skript + alohida runtime Dockerfile» o‘rniga.
- **Bosqichlar bo‘yicha kesh** — kirish fayllari o‘zgarmagan bo‘lsa, Docker har bir bosqich qatlamlarini qayta ishlatadi.

## Go: kompilyatordan deyarli bo‘sh image’gacha

Go statik binar faylga kompilyatsiya qilinadi, shuning uchun yakuniy image minimal bo‘lishi mumkin.

```dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app ./cmd/server

FROM gcr.io/distroless/static-debian12
COPY --from=build /app /app
USER nonroot
ENTRYPOINT ["/app"]
```

Asosiy jihatlar: `CGO_ENABLED=0` libc’ga bog‘liq bo‘lmagan binar beradi, `go.mod` esa manba koddan oldin ko‘chiriladi — shunda bog‘liqliklar qatlami keshda qoladi.

## Node.js: yig‘ish va ishga tushirish bog‘liqliklari alohida

Node.js ilovasida yagona binar yo‘q, lekin ajratish baribir foydali: TypeScript, bundler’lar va test paketlari faqat yig‘ish paytida kerak.

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

Yakuniy bosqichda faqat production bog‘liqliklari o‘rnatiladi, yig‘ish bosqichidan esa tayyor `dist` papkasi ko‘chiriladi.

## Frontend: Node’da yig‘ish, Nginx orqali berish

SPA (React, Vue, Svelte) uchun Node faqat statik fayllarni yig‘ishga kerak. Ularni berishni yengil veb-serverga topshirgan ma’qul.

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Natijaviy image’da Node.js ham, `node_modules` ham yo‘q — faqat Nginx va yig‘ilgan fayllar. Chiqish papkasi bundler’ga bog‘liq: ba’zilarida u `build` deb ataladi.

## Yutuqni qanday o‘lchash mumkin

Boshqalarning raqamlariga tayanmang — hajm sizning bog‘liqliklaringizga bog‘liq. O‘zingiz solishtiring:

1. Bir bosqichli «sodda» versiyani yig‘ing: `docker build -t app:single -f Dockerfile.single .`
2. Multi-stage versiyani yig‘ing: `docker build -t app:multi .`
3. Solishtiring: `docker images app`
4. Qaysi qatlamlar joy egallashini ko‘ring: `docker history app:multi`

Odatda eng katta farq kompilyatsiya qilinadigan tillarda (Go, Rust) bo‘ladi — yakuniy image’da bitta binar qoladi. Node.js’da yutuq kamroq, lekin dev-bog‘liqliklar va og‘ir bazaviy image’dan voz kechish hisobiga sezilarli.

## Ko‘p uchraydigan xatolar

- **Butun kontekstni ko‘chirish** `.dockerignore`’siz — `node_modules`, `.git` va lokal `.env` fayllar yig‘ishga tushib qoladi.
- **Bog‘liqliklarni o‘rnatishdan oldin `COPY . .`** — koddagi har qanday o‘zgarish `npm ci` yoki `go mod download` keshini buzadi.
- **Dinamik bog‘langan binar** distroless yoki scratch ichida — konteyner «not found» xatosi bilan to‘xtaydi.
- **Root’dan ishga tushirish** — vaholanki bitta `USER` qatori buni tuzatadi.
- **Nomsiz bosqichlar** — yangi bosqich qo‘shilganda `COPY --from=0` buziladi. Bosqichlarga `AS` orqali nom bering.

## FAQ

### Faqat bitta oraliq bosqichni yig‘ish mumkinmi?

Ha. `--target` bayrog‘i yig‘ishni ko‘rsatilgan bosqichda to‘xtatadi: `docker build --target build -t app:build .`. Bu CI’da testlarni barcha vositalar bor bosqichda ishga tushirish uchun qulay.

### Multi-stage yig‘ishni sekinlashtiradimi?

Odatda yo‘q. BuildKit maqsadli bosqichga kerak bo‘lmagan bosqichlarni o‘tkazib yuboradi, mustaqil bosqichlarni esa parallel yig‘ishi mumkin. Buyruqlar tartibi to‘g‘ri bo‘lsa, kesh oddiy Dockerfile’dagidek ishlaydi.

### Yakuniy bosqich uchun nima tanlash kerak: alpine, slim yoki distroless?

Statik binarlar uchun distroless/static yoki scratch mos. Interpretatsiya qilinadigan tillar uchun rasmiy image’ning slim varianti yoki kerakli runtime uchun distroless. Alpine glibc o‘rniga musl ishlatadi, shuning uchun native modullar mosligini tekshiring.
