---
title: Docker Compose: ko‘p konteynerli ilovalarni qanday ishga tushirish
description: Ilova, ma’lumotlar bazasi va kesh uchun compose faylni bosqichma-bosqich yig‘amiz: servislar, tarmoqlar, volume, env fayllar, depends_on va kundalik buyruqlar.
summary: Docker Compose loyihaning barcha konteynerlarini bitta YAML faylda tasvirlaydi va ularni bitta docker compose up buyrug‘i bilan ishga tushiradi. Servislar bir-birini nomi bo‘yicha ko‘radi, ma’lumotlar volume’da, sozlamalar .env’da saqlanadi.
---

## Docker Compose nima

**Docker Compose** — bir nechta konteynerni bitta `compose.yaml` faylida tasvirlaydigan va ularni yagona ilova sifatida boshqaradigan vosita. Bayroqlarga to‘la uchta uzun `docker run` buyrug‘i o‘rniga konfiguratsiyani bir marta yozasiz va hammasini `docker compose up` orqali ishga tushirasiz.

Veb-loyiha uchun odatiy to‘plam: **ilova**, **ma’lumotlar bazasi** (PostgreSQL) va **kesh** (Redis). Uni bosqichma-bosqich yig‘amiz.

## 1-qadam: ilova servisi

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
```

- `build: .` — joriy papkadagi Dockerfile’dan obraz yig‘ish.
- `ports` — konteyner portini xostga chiqarish: `xost:konteyner`.
- `env_file` — muhit o‘zgaruvchilarini fayldan yuklash.

## 2-qadam: ma’lumotlar bazasi va volume

```yaml
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 5s
      retries: 5

volumes:
  db-data:
```

- `image` — tayyor rasmiy obraz, hech narsa yig‘ish shart emas.
- `${...}` — qiymatlar compose fayl yonidagi `.env` faylidan qo‘yiladi.
- **Nomlangan volume** `db-data` ma’lumotlarni konteynerdan tashqarida saqlaydi: konteynerni qayta yaratish ularni o‘chirmaydi.
- `healthcheck` baza haqiqatan ulanishlarni qabul qilishga tayyorligini tekshiradi. `$$` belgisi `$`ni ekranlaydi, o‘zgaruvchini konteyner ichidagi shell ochishi uchun.

## 3-qadam: kesh

```yaml
  cache:
    image: redis:7
```

Portni tashqariga chiqarmaymiz: Redis faqat ilovaga kerak.

## 4-qadam: depends_on va ishga tushirish tartibi

`app` servisiga qo‘shing:

```yaml
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
```

Oddiy `depends_on` faqat konteynerlarning **ishga tushish** tartibini kafolatlaydi, servis tayyorligini emas. `service_healthy` sharti bazaning healthcheck’i muvaffaqiyatli o‘tishini kutadi. Baribir ilova bazaga qayta ulana olishi foydali — bu ishonchliroq.

## Tarmoqlar: servislar bir-birini qanday topadi

Compose loyiha uchun avtomatik umumiy tarmoq yaratadi. Uning ichida har bir servis **nomi bo‘yicha** mavjud. Shuning uchun ilovaning `.env` faylida xost sifatida `localhost` emas, `db` yoziladi:

```text
POSTGRES_USER=app
POSTGRES_PASSWORD=change-me
POSTGRES_DB=app
DATABASE_URL=postgres://app:change-me@db:5432/app
REDIS_URL=redis://cache:6379
```

Konteyner ichida `localhost` konteynerning o‘ziga ishora qiladi — bu «connection refused» xatosining tez-tez uchraydigan sababi. `.env` faylini `.gitignore`ga qo‘shing, repozitoriyda esa `.env.example`ni saqlang.

`networks` kaliti orqali alohida tarmoqlar servislarni bir-biridan ajratish kerak bo‘lganda foydali, masalan frontendni bazadan.

## Kundalik buyruqlar

| Buyruq | Nima qiladi |
|---|---|
| `docker compose up -d` | Hammasini fonda ishga tushirish |
| `docker compose up -d --build` | Obrazlarni qayta yig‘ib ishga tushirish |
| `docker compose ps` | Servislar ro‘yxati va holati |
| `docker compose logs -f app` | Servis loglarini real vaqtda ko‘rish |
| `docker compose exec db psql -U app` | Ishlayotgan konteynerda buyruq bajarish |
| `docker compose down` | Konteynerlar va tarmoqni to‘xtatib o‘chirish |
| `docker compose down -v` | Xuddi shu, qo‘shimcha volume’larni o‘chirish — **baza ma’lumotlari yo‘qoladi** |

## Keng tarqalgan xatolar

- Ulanish satrida servis nomi o‘rniga `localhost`.
- Parollar to‘g‘ridan-to‘g‘ri `compose.yaml`da va Gitga commit qilingan.
- «Har ehtimolga qarshi» `down -v` — va lokal bazani yo‘qotish.
- Serverda zaruratsiz baza portini tashqariga ochish.
- healthcheck’siz `depends_on` baza tayyor bo‘lishini kutadi deb o‘ylash.

## FAQ

### Docker Compose’ni prodakshnda ishlatish mumkinmi?

Ha, bitta serverdagi kichik loyihalar uchun bu ishlaydigan variant. Bir nechta server, avtomasshtablash va rolling yangilanishlar kerak bo‘lganda odatda orkestratorga o‘tiladi.

### compose.yaml va docker-compose.yml o‘rtasida qanday farq bor?

Ma’no jihatidan ular bir xil. `compose.yaml` — hozirgi afzal nom, eskisi ham qo‘llab-quvvatlanadi. Zamonaviy Compose’ga fayl boshidagi `version` kaliti kerak emas.

### Ishlab chiqish va prodakshn sozlamalarini qanday ajratish mumkin?

Asosiy `compose.yaml` va qayta belgilash faylini saqlang, masalan lokal ishlab chiqish uchun avtomatik ulanadigan `compose.override.yaml`, yoki kerakli faylni `-f` bayrog‘i bilan ulang.
