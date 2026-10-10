---
title: Docker tarmoqlari: bridge, host va maxsus tarmoqlar
description: Docker konteynerlari bir-biri va tashqi dunyo bilan qanday bog‘lanadi: bridge va host tarmoqlari, portlarni ochish, servis nomi bo‘yicha DNS va xatolar.
summary: Bitta maxsus tarmoqdagi konteynerlar bir-birini servis nomi orqali topadi, tashqaridan esa ilovaga faqat ochilgan port (-p) orqali kirish mumkin. Host tarmog‘i izolyatsiyani olib tashlaydi va kam hollarda kerak bo‘ladi.
---
## Docker tarmoqlari qanday ishlaydi

Har bir konteyner o‘zining tarmoq stekiga ega: alohida IP-manzil, alohida portlar, alohida `localhost`. Docker konteynerlarni bir-biri va host bilan **tarmoq drayverlari** orqali bog‘laydi. Kundalik ishda uchta variant muhim:

- **bridge (standart)** — host ichidagi virtual tarmoq. Konteynerlar ichki manzil oladi va tashqariga NAT orqali chiqadi.
- **maxsus (user-defined) bridge tarmog‘i** — xuddi shunday, lekin **konteyner nomi bo‘yicha DNS** va yaxshiroq izolyatsiya bilan. Bu standart tanlov.
- **host** — konteyner hostning tarmoq stekidan to‘g‘ridan-to‘g‘ri foydalanadi, izolyatsiyasiz va port ochmasdan.

Boshqa drayverlar ham bor (`none`, `overlay`, `macvlan`), lekin ular maxsus vazifalar uchun: to‘liq izolyatsiya, klasterlar yoki konteynerni fizik tarmoqqa bevosita ulash.

## Portlarni ochish: konteynerga tashqaridan kirish

Standart holatda konteyner ichidagi port hostdan ham, internetdan ham ko‘rinmaydi. Uni ochish uchun portni **publish** qilish kerak:

```bash
docker run -d -p 8080:80 nginx
```

Yozuv `HOST:KONTEYNER` deb o‘qiladi: hostning 8080-portiga kelgan so‘rovlar konteynerning 80-portiga tushadi.

Muhim tafsilotlar:

- `-p 8080:80` hostning barcha interfeyslarida tinglaydi, ya’ni port internetdan ko‘rinishi mumkin. Agar servis faqat lokal kerak bo‘lsa, `-p 127.0.0.1:8080:80` dan foydalaning.
- Docker hostdagi firewallga o‘z qoidalarini qo‘shadi va ular `ufw` kabi sozlamalarni chetlab o‘tishi mumkin. Ma’lumotlar bazasi portlarini zaruratsiz ochmang.
- Dockerfile’dagi `EXPOSE` — faqat hujjatlashtirish, u portni **ochmaydi**.

## Servis nomi bo‘yicha DNS

Maxsus tarmoqda konteynerlar bir-biriga IP orqali emas, nom orqali murojaat qiladi. IP-manzillar konteyner har safar qayta yaratilganda o‘zgaradi, nomlar esa o‘zgarmaydi.

```bash
docker network create app-net
docker run -d --name db --network app-net postgres
docker run -d --name api --network app-net my-api
```

Endi `api` bazaga `db:5432` manzili orqali ulanadi. Standart `bridge` tarmog‘ida bunday DNS ishlamaydi — bu «host topilmadi» xatosining keng tarqalgan sababi.

**Docker Compose**’da maxsus tarmoq avtomatik yaratiladi va `docker-compose.yml` dagi servis nomi uning DNS-nomiga aylanadi:

```yaml
services:
  api:
    build: .
    ports:
      - "8080:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
```

E’tibor bering: `db` da `ports` bo‘limi yo‘q. Bazaga tashqaridan kirish shart emas — `api` unga ichki tarmoq orqali yetib boradi.

## Rejimlarni solishtirish

| Rejim | Izolyatsiya | Nom bo‘yicha DNS | -p kerakmi | Qachon ishlatish |
|---|---|---|---|---|
| standart bridge | bor | yo‘q | ha | tezkor tajribalar |
| maxsus bridge | bor | ha | ha, tashqi kirish uchun | deyarli har doim |
| host | yo‘q | — | yo‘q | tarmoq unumdorligi bo‘yicha maxsus holatlar, faqat Linux |
| none | to‘liq | — | — | tarmoqsiz vazifalar |

## Keng tarqalgan xatolar

- **Konteyner ichidagi `localhost`.** Konteyner uchun `localhost` — bu uning o‘zi, host ham, qo‘shni konteyner ham emas. Qo‘shnilarga servis nomi orqali murojaat qiling.
- **Ilova 127.0.0.1 da tinglaydi.** Agar konteyner ichidagi server `127.0.0.1` ga bog‘langan bo‘lsa, ochilgan port ishlamaydi. `0.0.0.0` da tinglang.
- **`-p` da portlar almashib ketgan.** Chapda host porti, o‘ngda konteyner porti.
- **Hostda port band.** Agar host porti boshqa jarayon tomonidan ishlatilsa, Docker konteynerni ishga tushirmaydi.
- **Konteynerlar turli tarmoqlarda.** Turli Compose loyihalaridagi servislar standart holatda bir-birini ko‘rmaydi. Ularni umumiy tashqi tarmoqqa ulang.
- **Tashqariga ochiq ma’lumotlar bazasi.** `5432` yoki `3306` ni barcha interfeyslarda ochish — to‘g‘ridan-to‘g‘ri xavfsizlik xavfi.

## Aloqani qanday tekshirish mumkin

- `docker network ls` — tarmoqlar ro‘yxati.
- `docker network inspect app-net` — qaysi konteynerlar ulangan va ularning manzillari.
- `docker exec -it api sh`, so‘ng `ping db` yoki `nc -zv db 5432` (agar obrazda bu utilitalar bo‘lsa) — ichkaridan tekshirish.
- `docker port api` — qaysi portlar ochilgan.

Drayverlar haqida batafsil ma’lumot [Docker rasmiy hujjatlarida](https://docs.docker.com/engine/network/) bor.

## FAQ

### Konteynerdan hostdagi servisga qanday murojaat qilish mumkin?

Docker Desktop’da `host.docker.internal` nomi ishlaydi. Linux’da uni `--add-host=host.docker.internal:host-gateway` orqali yoki Compose’dagi `extra_hosts` orqali qo‘shish mumkin.

### Konteynerlar o‘zaro bog‘lanishi uchun portlarni ochish kerakmi?

Yo‘q. Bitta tarmoq ichida konteynerlar bir-birining barcha portlarini ko‘radi. Portni ochish faqat hostdan yoki tashqaridan kirish uchun kerak.

### Host tarmog‘idan qachon foydalanish kerak?

Kam hollarda: NAT xarajatlarini olib tashlash kerak bo‘lganda yoki ilovaga hostning tarmoq interfeyslariga bevosita kirish zarur bo‘lganda. Buning narxi — izolyatsiyani yo‘qotish va portlar to‘qnashuvi ehtimoli.
