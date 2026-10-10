---
title: n8n’ni o‘z serveringizda ishga tushirish: o‘rnatish, himoya, yangilash
description: VPS’da self-hosted n8n: Docker Compose, SQLite o‘rniga PostgreSQL, Redis bilan queue mode, shifrlash kaliti, HTTPS, zaxira, yangilash va bulutdan qachon afzal.
summary: Ishonchli sxema — HTTPS proksi ortida PostgreSQL bilan Docker Compose’dagi n8n, saqlab qo‘yilgan N8N_ENCRYPTION_KEY, bazaning muntazam zaxira nusxalari va qat’iy versiyaga yangilash; Redis bilan queue mode faqat bitta jarayon yetmay qolganda kerak.
---
## Qisqa javob

Ishchi self-hosted n8n uchun kerak bo‘ladi:

- Docker va Docker Compose o‘rnatilgan **VPS**;
- standart SQLite o‘rniga **PostgreSQL**;
- **HTTPS’li teskari proksi** (Caddy, Nginx yoki Traefik) va domen;
- **doimiy shifrlash kaliti** `N8N_ENCRYPTION_KEY`;
- bazaning **zaxira nusxalari** va aniq versiyaga **rejali yangilash**.

## Docker Compose orqali o‘rnatish

PostgreSQL bilan minimal konfiguratsiya. Maxfiy qiymatlarni compose faylining o‘zida emas, yonidagi `.env` faylida saqlang:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - pg_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_HOST: n8n.example.com
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://n8n.example.com/
      GENERIC_TIMEZONE: Asia/Tashkent
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  pg_data:
  n8n_data:
```

Port faqat `127.0.0.1` da ochiq — tashqaridan n8n’ga faqat proksi orqali kirish mumkin. Caddy bilan HTTPS sertifikati avtomatik chiqariladi:

```
n8n.example.com {
    reverse_proxy localhost:5678
}
```

Proksi ortida `WEBHOOK_URL` majburiy: aks holda n8n webhook manzillarida ommaviy manzil o‘rniga ichki manzilni ko‘rsatadi.

## SQLite yoki PostgreSQL

| | SQLite | PostgreSQL |
|---|---|---|
| Sozlash | Hech narsa kerak emas | Alohida konteyner |
| Yuklama | Testlar, shaxsiy foydalanish | Jamoa va biznes jarayonlari |
| Queue mode | Mos emas | Talab qilinadi |
| Zaxira | Faylni nusxalash | `pg_dump` va standart vositalar |

Biznes tayanadigan har qanday narsa uchun darhol PostgreSQL’ni tanlang: keyin ko‘chirish noldan o‘rnatishdan qiyinroq.

## Queue mode: qachon kerak

Standart holatda barcha bajarilishlar bitta jarayonda ketadi. Ssenariylar ko‘p yoki og‘ir bo‘lsa, webhook’lar to‘lqin bilan kelsa, **queue mode** yoqiladi:

- asosiy jarayon trigger va webhook’larni qabul qilib, vazifalarni **Redis** navbatiga qo‘yadi;
- alohida **worker’lar** (`n8n worker`) vazifalarni olib bajaradi;
- yuklama oshgani sari worker’lar qo‘shiladi.

U `EXECUTIONS_MODE=queue` o‘zgaruvchisi va Redis sozlamalari bilan yoqiladi. Barcha jarayonlarda `N8N_ENCRYPTION_KEY` **bir xil** bo‘lishi shart. Queue mode’ni «kelajak uchun» yoqmang — bu ham xizmat ko‘rsatish kerak bo‘lgan qo‘shimcha komponentlar.

## Himoya

- **Shifrlash kaliti.** n8n saqlangan hisob ma’lumotlarini (credentials) shu kalit bilan shifrlaydi. Uni aniq belgilang va nusxasini parollar menejerida saqlang. Kalit yo‘qolsa, barcha credentials’ni qaytadan kiritishga to‘g‘ri keladi.
- **Kirish.** Ikki faktorli autentifikatsiyali shaxsiy foydalanuvchi akkauntlaridan foydalaning, butun jamoa uchun bitta umumiy login emas.
- **Tarmoq.** Tashqariga faqat 80 va 443 portlari ochiq, SSH — kalitlar orqali, ma’lumotlar bazasi porti ochilmaydi.
- **Webhook’lar.** Chaqiruvchi tomon imkon bersa, Webhook tugunida autentifikatsiyani yoqing (sarlavha, Basic yoki JWT).
- **Bajarilishlar tarixi.** Eski bajarilishlarni tozalashni yoqing (`EXECUTIONS_DATA_PRUNE`), aks holda baza o‘sib boradi va shaxsiy ma’lumotlarni keragidan uzoq saqlaydi.

## Zaxira nusxalar

Uch narsaning zaxirasi kerak:

1. **Ma’lumotlar bazasi** — workflow’lar, credentials va tarix shu yerda.
2. **Shifrlash kaliti** — usiz zaxiradagi shifrlangan credentials foydasiz.
3. **`/home/node/.n8n` tomi** — nusxa konfiguratsiyasi.

```bash
docker compose exec -T postgres pg_dump -U n8n n8n | gzip > n8n-$(date +%F).sql.gz
```

Nusxalarni serverdan tashqarida saqlang va vaqti-vaqti bilan alohida mashinada tiklashni tekshirib turing.

## Yangilash

- `N8N_VERSION` da **versiyani qat’iy belgilang**, prodakshenda `latest` ishlatmang.
- Yangilashdan oldin release notes va breaking changes bo‘limini o‘qing.
- Zaxira nusxa oling, so‘ng:

```bash
docker compose pull
docker compose up -d
```

- Yangilashdan keyin asosiy workflow’lar va loglarni tekshiring. Katta versiyaga o‘tishni avval nusxada sinab ko‘ring.

## Self-hosting qachon bulutdan afzal

**O‘z serveringiz** quyidagi hollarda mantiqli:

- ma’lumotlar sizning infratuzilmangiz yoki yurisdiksiyangizda qolishi kerak;
- bajarilishlar ko‘p va bulut limitlari xalaqit bera boshlaydi;
- o‘z tugunlaringiz, ichki xizmatlarga kirish yoki nostandart sozlamalar kerak;
- jamoada yangilash, zaxira va monitoring uchun javob beradigan odam bor.

**Bulutli reja** serverni boshqaradigan odam bo‘lmasa va yuklama o‘rtacha bo‘lsa yaxshiroq. n8n litsenziyasini ham hisobga oling: kompaniya ichida foydalanish odatda ruxsat etilgan, n8n’ning o‘zini boshqalarga xizmat sifatida taklif qilish esa cheklangan — rasmiy hujjatlardan aniqlang.

## FAQ

### Workflow’larni n8n bulutidan o‘z serverimga ko‘chirsa bo‘ladimi?

Ha. Workflow’lar JSON’ga eksport qilinib, yangi nusxaga import qilinadi. Credentials’ni ko‘chirishdan ko‘ra qayta yaratish odatda osonroq, chunki ular dastlabki nusxaning kaliti bilan shifrlangan.

### Serverga qancha resurs kerak?

Bu ssenariylar soni va og‘irligiga, ma’lumotlar hajmiga va ishga tushish chastotasiga bog‘liq. Kichik VPS’dan boshlang, monitoringda xotira va CPU’ni kuzating va real cheklovlar paydo bo‘lganda kengaytiring.

### N8N_ENCRYPTION_KEY o‘zgartirilsa nima bo‘ladi?

n8n avval saqlangan credentials’ni shifrdan chiqara olmaydi va ulardan foydalanadigan workflow’lar ishlamay qoladi. Kalit bir marta belgilanadi va rejali migratsiyasiz o‘zgartirilmaydi.
