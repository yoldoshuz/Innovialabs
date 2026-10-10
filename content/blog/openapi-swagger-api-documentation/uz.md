---
title: OpenAPI va Swagger yordamida API’ni qanday hujjatlashtirish kerak
description: API’ni OpenAPI formatida qanday tavsiflash, spetsifikatsiyadan hujjat va tiplangan klientlar yaratish hamda hujjatni kod bilan mos saqlash.
summary: API’ni bitta OpenAPI faylida (YAML yoki JSON) tavsiflang, uni Swagger UI yoki Redoc orqali hujjat sifatida ko‘rsating, undan klientlar yarating va kod bilan mosligini CI’da avtomatik tekshiring.
---
## Qisqa javob

**OpenAPI** — HTTP API’ni tavsiflashning standart formati: qanday endpointlar bor, ular qanday parametrlar qabul qiladi, nima qaytaradi va qanday himoyalangan. **Swagger** — shu format atrofidagi vositalar to‘plami: Swagger UI interaktiv hujjatni ko‘rsatadi, Swagger Editor spetsifikatsiya yozishga yordam beradi. Ilgari formatning o‘zi ham Swagger deb atalgan, shuning uchun nomlar ko‘pincha chalkashtiriladi.

Ishlash sxemasi oddiy: bitta spetsifikatsiya — yagona haqiqat manbai. Hujjat, klientlar va so‘rovlarni tekshirish shundan olinadi.

## Spetsifikatsiya qanday ko‘rinadi

YAML’dagi minimal misol:

```yaml
openapi: 3.0.3
info:
  title: Orders API
  version: 1.0.0
paths:
  /orders/{id}:
    get:
      summary: Buyurtmani olish
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: Buyurtma topildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"
        "404":
          description: Buyurtma topilmadi
components:
  schemas:
    Order:
      type: object
      required: [id, status]
      properties:
        id:
          type: integer
        status:
          type: string
          enum: [new, paid, shipped]
```

Asosiy bo‘limlar:

- **info** — API nomi va versiyasi.
- **paths** — endpointlar va HTTP metodlar.
- **components/schemas** — `$ref` orqali qayta ishlatiladigan ma’lumot modellari.
- **securitySchemes** — avtorizatsiya qanday ishlaydi (Bearer token, API kalit, OAuth2).

## Bitta spetsifikatsiya nima beradi

- **Hujjat.** Swagger UI yoki Redoc faylni qulay sahifaga aylantiradi, u yerda brauzerdan test so‘rov yuborish mumkin.
- **Tiplangan klientlar.** OpenAPI Generator yoki openapi-typescript kabi generatorlar TypeScript, Kotlin, Swift, Python va boshqa tillar uchun tiplar va SDK yaratadi. Frontend va mobil jamoa modellarni qo‘lda yozishni to‘xtatadi.
- **Moklar.** Spetsifikatsiya asosida soxta server ko‘tarib, backend tayyor bo‘lmasdan frontendni boshlash mumkin.
- **Validatsiya.** Middleware kiruvchi so‘rov va javoblarni sxemaga mosligini tekshiradi.

## Code-first yoki spec-first

| | Code-first | Spec-first |
|---|---|---|
| Spetsifikatsiya qayerdan olinadi | Koddan generatsiya qilinadi (annotatsiyalar, dekoratorlar, validatsiya sxemalari) | Koddan oldin qo‘lda yoziladi |
| Boshlash tezligi | Tezroq | Sekinroq |
| Jamoalar o‘rtasida kelishuv | Amalga oshirilgandan keyin | Amalga oshirishdan oldin |
| Mos kelmaslik xavfi | Generatsiya avtomatik bo‘lsa, past | CI’da tekshiruv kerak |
| Kimga mos | Kichik jamoalar, bitta backend | Ommaviy API, bir nechta jamoa, hamkor integratsiyalari |

Ko‘plab freymvorklarda code-first tayyor holda ishlaydi: FastAPI spetsifikatsiyani Python tiplaridan, NestJS dekoratorlardan quradi, Express va Fastify uchun validatsiya sxemalariga asoslangan plaginlar bor.

Spec-first kontrakt amalga oshirishdan muhimroq bo‘lganda foydali: frontend, mobil ilova va hamkorlar API haqida oldindan kelishib, parallel ishlaydi.

## Hujjat eskirmasligi uchun

1. **Yagona haqiqat manbai.** Yoki spetsifikatsiya koddan generatsiya qilinadi, yoki kod spetsifikatsiya bo‘yicha tekshiriladi. Ikkita mustaqil tavsifni saqlamang.
2. **CI’da tekshiruv.** Spectral yoki Redocly CLI kabi linter spetsifikatsiyadagi xatolarni topadi. Alohida qadam generatsiya qilingan spetsifikatsiyani commit qilingani bilan solishtiradi.
3. **Kontrakt testlari.** Testlar so‘rov yuborib, javoblarni sxema bilan solishtiradi.
4. **Breaking change detektori.** Spetsifikatsiyalarni solishtirish vositalari maydon o‘chirilgani yoki tip o‘zgarganini relizdan oldin ko‘rsatadi.
5. **Versiyalash.** Buzuvchi o‘zgarishlar faqat yangi API versiyasi bilan yoki eski xatti-harakatni qo‘llab-quvvatlash davri bilan.

## Ko‘p uchraydigan xatolar

- **Misollar yo‘q.** Sxemalarga `example` qo‘shing — hujjat ancha tushunarli bo‘ladi.
- **Faqat muvaffaqiyatli javoblar tavsiflangan.** 400, 401, 404, 422 xatolari ham kontrakt qismi.
- **Sxemalar takrorlanadi.** Modellarni `components`ga chiqaring va `$ref` orqali murojaat qiling.
- **Bo‘sh tavsiflar.** `description` maydon nomini takrorlamasdan, ma’nosini tushuntirishi kerak.
- **Notion yoki Word’da qo‘lda yozilgan hujjat.** U birinchi relizdan keyinoq eskiradi.

Formatning rasmiy spetsifikatsiyasi: [spec.openapis.org](https://spec.openapis.org/oas/latest.html).

## FAQ

### OpenAPI Swagger’dan nimasi bilan farq qiladi?

OpenAPI — API’ni tavsiflash formatining o‘zi. Swagger — shu format bilan ishlaydigan vositalar to‘plami (UI, Editor, Codegen). Uchinchi versiyagacha format Swagger Specification deb atalgan.

### OpenAPI’ning qaysi versiyasini tanlash kerak?

Vositalaringiz qo‘llab-quvvatlaydigan eng yangisini oling. Tanlashdan oldin klient generatori va hujjat kutubxonasi u bilan ishlay olishini tekshiring.

### OpenAPI GraphQL yoki WebSocket uchun mos keladimi?

Yo‘q, OpenAPI REST uslubidagi HTTP API’ni tavsiflaydi. GraphQL’ning o‘z sxemasi bor, hodisaviy va WebSocket API uchun esa alohida AsyncAPI standarti mavjud.
