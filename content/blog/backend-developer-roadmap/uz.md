---
title: Backend-dasturchi roadmap’i: amaliy o‘qish rejasi
description: Bo‘lajak backend-dasturchi uchun amaliy reja: til, ma’lumotlar bazasi, API, avtorizatsiya, testlar va deploy asoslari, har qadamda isbotlovchi loyiha.
summary: Backend’ni shu tartibda o‘rganing: bitta til va uning ekotizimi, SQL va ma’lumotlar bazalari, REST API, autentifikatsiya, testlar va deploy asoslari; har bir ko‘nikmani uni isbotlaydigan loyiha bilan mustahkamlang.
---

## O‘qish tartibi

Backend-dasturchi foydalanuvchi ko‘rmaydigan qism uchun javob beradi: ma’lumotlar, biznes-mantiq, API, xavfsizlik va server ishi. Buni quyidagi ketma-ketlikda o‘rgangan ma’qul:

1. **Dasturlash tili** va uning ekotizimi.
2. **Ma’lumotlar bazalari** va SQL.
3. **API**: HTTP, REST, xatolarni qayta ishlash.
4. **Autentifikatsiya va avtorizatsiya.**
5. **Testlash.**
6. **Deploy asoslari**: Linux, Docker, muhit o‘zgaruvchilari, loglar.

Har bir bosqich **loyiha-bosqichtosh** bilan tugaydi: sertifikat emas, suhbatda ko‘rsatish mumkin bo‘lgan ishlaydigan kod.

## 1-qadam. Til

Hududingizdagi vakansiyalarda talab qilinadigan bitta tilni tanlang: masalan, Python, JavaScript (Node.js), Go, Java, C# yoki PHP. Muhimi «eng yaxshi til» emas, chuqurlik.

Nimani o‘zlashtirish kerak:

- sintaksis, ma’lumot tiplari, funksiyalar, OOP yoki modullar;
- fayllar, istisnolar (exception), kolleksiyalar bilan ishlash;
- paket menejeri va loyiha tuzilishi;
- Git asoslari.

**Bosqichtosh:** konsol utilitasi, masalan, CSV faylni o‘qib, konsolga hisobot chiqaradigan va noto‘g‘ri qatorlarni qayta ishlaydigan parser.

## 2-qadam. Ma’lumotlar bazalari

- **Relyatsion model**: jadvallar, kalitlar, birga-ko‘p va ko‘pga-ko‘p bog‘lanishlar.
- **SQL**: `SELECT`, `JOIN`, `GROUP BY`, ichki so‘rovlar, tranzaksiyalar.
- **Indekslar**: nima uchun kerak va nega ularni hamma joyga qo‘ymaslik kerak.
- **Migratsiyalar** va ORM yoki query builder orqali ishlash.

```sql
SELECT u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name
ORDER BY orders DESC;
```

**Bosqichtosh:** kichik do‘kon yoki kutubxona uchun migratsiyalar va test ma’lumotlariga ega loyihalangan sxema.

## 3-qadam. API

- **HTTP** protokoli: metodlar, status kodlari, sarlavhalar.
- **REST** loyihalash: resurslar, sahifalash, filtrlar, versiyalar.
- Kiruvchi ma’lumotlarni **validatsiya** qilish va xatolar haqida tushunarli javoblar.
- API’ni hujjatlashtirish, masalan, OpenAPI formatida.

**Bosqichtosh:** o‘sha sxema uchun validatsiya va hujjatlarga ega CRUD API.

## 4-qadam. Autentifikatsiya va avtorizatsiya

- **Autentifikatsiya** (siz kimsiz) va **avtorizatsiya** (sizga nima ruxsat) o‘rtasidagi farq.
- Parollarni xeshlash, sessiyalar va tokenlar.
- Rollar va ruxsatlar.
- Asosiy xavflar: SQL-in’eksiyalar, maxfiy kalitlarning sizib chiqishi, ruxsatlar tekshirilmasligi.

**Bosqichtosh:** API’ingizda ro‘yxatdan o‘tish va kirish, «foydalanuvchi» va «administrator» rollari, yopiq endpoint’lar.

## 5-qadam. Testlash

- Biznes-mantiq uchun **unit-testlar**.
- Test bazasi bilan API uchun **integratsion testlar**.
- Har bir push’da testlarni avtomatik ishga tushirish.

**Bosqichtosh:** testlar API’ning asosiy ssenariylarini qamraydi, CI ularni har bir pull request’da ishga tushiradi.

## 6-qadam. Deploy asoslari

- **Linux**’ning asosiy buyruqlari va SSH.
- **Docker**: ilova image’i va uni ma’lumotlar bazasi bilan birga ishga tushirish.
- Muhit o‘zgaruvchilari va maxfiy kalitlarni koddan tashqarida saqlash.
- Loglar va oddiy monitoring.

```yaml
services:
  api:
    build: .
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
```

**Bosqichtosh:** loyiha bitta buyruq bilan ishga tushadi va ochiq manzil orqali mavjud.

## Ko‘p uchraydigan xatolar

| Xato | Qanday tuzatish |
|---|---|
| Bir nechta tilni parallel o‘rganish | Ishonchli loyihalar darajasigacha bitta til |
| ORM’ga tayanib SQL’ni o‘tkazib yuborish | So‘rovlarni qo‘lda yozish, ORM nima yaratishini ko‘rish |
| Parol va kalitlarni kodda saqlash | Muhit o‘zgaruvchilari, `.env` faylini `.gitignore`’ga qo‘shish |
| «O‘qiyotganimda» test yozmaslik | Asosiy mantiq uchun testlardan boshlash |

## FAQ

### Backend uchun qaysi tilni tanlash kerak?

Hududingizda vakansiyalari ko‘proq bo‘lgan va o‘zingizga qulay tilni. Ma’lumotlar bazalari, HTTP, xavfsizlik va deploy tilga bog‘liq emas, shuning uchun keyinroq boshqa tilga o‘tish o‘ylaganingizdan osonroq.

### Backend-dasturchi frontend’ni bilishi kerakmi?

Chuqur shart emas, lekin HTML, JavaScript va brauzer API’ni qanday chaqirishini asosiy darajada tushunish qulay API loyihalash va xatolarni tezroq topishga yordam beradi.

### Birinchi ish uchun nechta loyiha kerak?

Miqdordan ko‘ra sifat muhimroq. Ma’lumotlar bazasi, API, avtorizatsiya, testlar va deploy mavjud bo‘lgan bir-ikki loyiha o‘nlab chala o‘quv mashqlaridan ko‘ra ko‘proq narsani ko‘rsatadi.
