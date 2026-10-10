---
title: Dockerfile bo‘yicha eng yaxshi amaliyotlar: tez va toza obrazlar
description: Kesh uchun qatlamlar tartibi, bazaviy obraz, .dockerignore, root bo‘lmagan foydalanuvchi va versiyalarni qotirish — Node.js va Python uchun misollar.
summary: Yaxshi Dockerfile bog‘liqlik fayllarini koddan oldin nusxalaydi, versiyasi qotirilgan ixcham bazaviy obrazdan foydalanadi, ortiqchani .dockerignore orqali chiqarib tashlaydi va ilovani root bo‘lmagan foydalanuvchidan ishga tushiradi.
---

## Qisqacha: Dockerfile’ni nima yaxshi qiladi

Besh qoidaga amal qilsangiz, tez va toza obraz olasiz:

- **Qatlamlar tartibi**: kam o‘zgaradigan narsalar yuqorida, tez-tez o‘zgaradiganlar pastda.
- Aniq versiyali **ixcham bazaviy obraz**.
- Obrazga keraksiz narsalar va sirlar tushmasligi uchun **.dockerignore**.
- root o‘rniga **imtiyozsiz foydalanuvchi**.
- Bazaviy obraz va bog‘liqliklarning **qotirilgan versiyalari**.

## Qatlamlar tartibi va kesh

Docker obrazni qatlamma-qatlam yig‘adi va har birini keshlaydi. Agar qatlam o‘zgarsa, undan keyingi barcha qatlamlar qayta yig‘iladi. Shuning uchun avval **faqat bog‘liqlik fayllarini** nusxalab o‘rnating, keyin esa manba kodini.

Yomon: boshida `COPY . .`. Kodga har qanday tuzatish barcha paketlarni qayta o‘rnatishga majbur qiladi.

Yaxshi: `package.json` va lock fayl alohida, o‘rnatish, keyin kod. Bog‘liqliklar o‘zgarmaguncha o‘rnatish keshdan olinadi.

Yana maslahatlar:

- Bog‘liq buyruqlarni bitta `RUN`ga birlashtiring va paket menejeri keshini o‘sha qatlamda tozalang.
- Faqat yig‘ish uchun kerak bo‘lgan vositalarni yakuniy obrazga qo‘shmang — **multi-stage build**dan foydalaning.

## Bazaviy obrazni tanlash

| Variant | Afzalliklari | Kamchiliklari |
|---|---|---|
| To‘liq (`node:22`, `python:3.12`) | Hammasi tayyor | Katta hajm, ko‘proq zaifliklar |
| Slim (`-slim`) | Kichikroq, Debian asosida | Ba’zan tizim paketlari yetishmaydi |
| Alpine (`-alpine`) | Juda kichik | glibc o‘rniga musl, native modullar bilan muammolar bo‘lishi mumkin |
| Distroless | Minimal hujum yuzasi | Shell yo‘q, debug qilish qiyinroq |

Ko‘pchilik ilovalar uchun oqilona boshlanish — aniq versiyaning rasmiy tegi bilan **slim** yoki **alpine**.

## .dockerignore

Usiz build kontekstiga hamma narsa tushadi: `node_modules`, `.git`, lokal `.env`. Yig‘ish sekinlashadi, obraz kattalashadi, sirlar oshkor bo‘lishi mumkin.

```text
node_modules
.git
.env
*.log
dist
__pycache__
.venv
```

## Node.js uchun misol

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

Bu yerda nima muhim:

- Birinchi bosqich bog‘liqliklarni lock fayl bo‘yicha `npm ci` orqali o‘rnatadi — natija takrorlanadigan bo‘ladi.
- Yakuniy bosqich faqat tayyor `node_modules` va kodni oladi.
- `USER node` — rasmiy obrazdagi o‘rnatilgan imtiyozsiz foydalanuvchi.
- `CMD` exec shaklida (massiv) — jarayon to‘xtatish signallarini to‘g‘ri qabul qiladi.

Agar loyihaga yig‘ish kerak bo‘lsa (TypeScript, frontend), alohida `build` bosqichini qo‘shing va yakuniy obrazga faqat natijani nusxalang.

## Python uchun misol

```dockerfile
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN useradd --create-home appuser
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 8000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

Bu yerda nima muhim:

- `requirements.txt` koddan oldin nusxalanadi — o‘rnatish keshlanadi.
- `--no-cache-dir` obrazda pip keshini qoldirmaydi.
- `PYTHONUNBUFFERED=1` — loglar darhol konteyner stdout’iga tushadi.
- Ilova alohida `appuser` foydalanuvchisidan ishlaydi.

## Keng tarqalgan xatolar

- Bazaviy obraz uchun `latest` tegi — yig‘ish sizdan bexabar o‘zgaradi.
- `ENV` yoki `COPY` ichidagi sirlar — ular o‘chirilgandan keyin ham obraz qatlamlarida qoladi.
- `apt-get update` va `apt-get install` alohida `RUN`larda — indeks keshi eskiradi.
- Prodakshnda kompilyatorlar va dev-bog‘liqliklar bilan bitta ulkan obraz.

## FAQ

### Versiyani patchgacha qotirish kerakmi yoki major versiya yetarlimi?

Kamida major va minor versiyani qotiring. To‘liq takrorlanuvchanlik uchun obraz digestini ko‘rsatish mumkin, lekin unda muntazam yangilash jarayoni kerak bo‘ladi.

### Multi-stage build bitta bosqichdan nimasi bilan yaxshi?

Yig‘ish vositalari va dev-bog‘liqliklar oraliq bosqichda qoladi, yakuniy obraz esa faqat ishga tushirish uchun keraklisini o‘z ichiga oladi. U kichikroq va xavfsizroq.

### Nega konteynerni shunchaki root’dan ishga tushirib bo‘lmaydi?

Agar ilovada zaiflik topilsa, hujumchi konteyner ichida ko‘proq huquqqa va undan tashqariga chiqish uchun ko‘proq imkoniyatga ega bo‘ladi. Imtiyozsiz foydalanuvchi mumkin bo‘lgan zararni cheklaydi.
