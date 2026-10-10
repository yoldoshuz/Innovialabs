---
title: PgBouncer ulanishlar puli: sozlash va yashirin muammolar
description: PostgreSQL ulanishlari nega qimmat, session va transaction rejimlari farqi hamda PgBouncer’ni prepared statements va serverless uchun sozlash.
summary: PgBouncer minglab mijozlarga PostgreSQL’ning oz sonli haqiqiy ulanishlarini bo‘lishib ishlatish imkonini beradi; veb va serverless uchun transaction rejimini tanlang, lekin sessiya holatidan voz keching va prepared statements masalasini aniq hal qiling.
---
## Pooler nima uchun kerak

PostgreSQL **har bir ulanish uchun alohida server jarayonini** yaratadi. Bu fork, autentifikatsiya (ko‘pincha TLS bilan) va keshlar hamda so‘rovlarni bajarish uchun alohida xotira demakdir. Bo‘sh turgan ulanishlar ham tekin emas: ular `max_connections` limitidan joy egallaydi va ichki hisob-kitobga qo‘shimcha yuk beradi.

Oddiy veb-ilovaga bir vaqtning o‘zida ko‘p ulanish kerak emas — unga har biri ulanishni bir necha millisekund ushlab turadigan ko‘p mijoz kerak. **PgBouncer** ilova va PostgreSQL o‘rtasida turadi, ko‘plab arzon mijoz ulanishlarini qabul qiladi va ularni haqiqiy server ulanishlarining kichik puliga taqsimlaydi.

## Session va transaction rejimlari

PgBouncer’da uchta rejim bor, amalda ikkitasi muhim.

| | Session | Transaction |
|---|---|---|
| Server ulanishi band | butun mijoz sessiyasi davomida | faqat tranzaksiya vaqtida |
| Qayta foydalanish | past | yuqori |
| `SET`, vaqtinchalik jadvallar, `LISTEN` | ishlaydi | buziladi yoki boshqa mijozlarga o‘tib ketadi |
| Sessiya advisory bloklari | ishlaydi | xavfli |
| Qayerda qo‘llanadi | eski ilovalar, admin vositalari | veb-API, worker’lar, serverless |

**Session** xavfsiz, lekin foydasi kam: ulanib, jim turgan mijoz baribir server ulanishini band qilib turadi. Bu rejim asosan bazani ulanishlarning tez-tez ochilib-yopilishidan himoya qiladi.

**Transaction** — pulning haqiqiy foydasi shu yerda. `COMMIT` yoki `ROLLBACK`’dan keyin server ulanishi pulga qaytadi va o‘sha mijozning keyingi so‘rovi boshqa backend’ga tushishi mumkin. Sessiyaga bog‘liq hamma narsa — `SET search_path`, `SET timezone`, vaqtinchalik jadvallar, `LISTEN/NOTIFY`, `pg_advisory_lock` — endi ishonchli emas.

**Statement** bir nechta so‘rovdan iborat tranzaksiyalarni taqiqlaydi va kamdan-kam to‘g‘ri tanlov bo‘ladi.

## Minimal ishlaydigan konfiguratsiya

```ini
[databases]
app = host=127.0.0.1 port=5432 dbname=app

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 2000
default_pool_size = 20
reserve_pool_size = 5
server_idle_timeout = 300
```

Asosiy parametrlar:

- **max_client_conn** — PgBouncer nechta mijozni qabul qiladi. Katta bo‘lishi mumkin: mijoz ulanishlari arzon.
- **default_pool_size** — har bir «foydalanuvchi + baza» juftligi uchun haqiqiy ulanishlar soni. PostgreSQL’ga aynan shu yuk beradi.
- **reserve_pool_size** — mijozlar juda uzoq kutganda ruxsat etiladigan qo‘shimcha ulanishlar.
- Barcha PgBouncer nusxalaridagi pullar yig‘indisi `max_connections`’dan kichik bo‘lishi va admin sessiyalari hamda migratsiyalar uchun zaxira qolishi kerak.

Ilovani 5432 o‘rniga 6432-portga ulang va admin konsolni tekshiring:

```bash
psql -h 127.0.0.1 -p 6432 -U pgbouncer pgbouncer -c "SHOW POOLS;"
```

`cl_waiting` va `maxwait`’ni kuzating. Mijozlar doim kutib tursa, pul kichik **yoki** tranzaksiyalar juda uzun — ko‘pincha ikkinchisi.

## Prepared statements

Ko‘plab drayverlar va ORM’lar protokol darajasidagi **prepared statements**’dan foydalanadi: so‘rov bitta backend’da tayyorlanadi va keyin nomi bo‘yicha bajariladi. Transaction rejimida keyingi bajarish boshqa backend’ga tushishi mumkin va `prepared statement "s1" does not exist` kabi xatoni olasiz.

Yechimlar, oddiydan murakkabga:

- **PgBouncer’ning yangi versiyalari** transaction rejimida protokol prepared statements’ni `max_prepared_statements` orqali kuzata oladi. Versiyangiz buni qo‘llab-quvvatlashini tekshiring.
- **Drayverda nomlangan prepared statements’ni o‘chirish**: masalan, PostgreSQL JDBC drayverida `prepareThreshold=0`, asyncpg’da `statement_cache_size=0`, Prisma ulanish satrida `pgbouncer=true`.
- **SQL darajasidagi `PREPARE`** transaction rejimida hech qachon xavfsiz emas — u sessiyada yashaydi.

## Serverless va ko‘plab kichik nusxalar

Serverless funksiyalar va avtomatik masshtablanadigan konteynerlar — pulning klassik holati. Har bir nusxa o‘z ulanishlarini ochadi va trafik keskin oshganda bu **ulanishlar bo‘roniga** aylanadi: CPU yetishmasligidan ancha oldin `max_connections`’ga borib taqaladi.

Nima ishlaydi:

- Baza oldiga PgBouncer (yoki provayderingizning boshqariladigan pooler’ini) qo‘ying va **transaction** rejimidan foydalaning.
- **Ilova tomonidagi pulni minimal** saqlang — ko‘pincha har bir funksiya nusxasiga bitta ulanish. Ikki qavat katta pul muammoni faqat yashiradi.
- **Migratsiyalar, `pg_dump` va uzoq admin vazifalarini** pooler orqali emas, to‘g‘ridan-to‘g‘ri ulanish orqali bajaring. Masalan, Prisma’da buning uchun alohida `directUrl` bor.
- Sessiya parametrlarini kodda `SET` bilan emas, rol yoki baza darajasida bering (`ALTER ROLE app SET search_path = ...`).

## Ko‘p uchraydigan xatolar

- **Uzun tranzaksiyalar.** Tashqi HTTP so‘rovni kutayotgan tranzaksiya butun vaqt davomida server ulanishini band qiladi. Tranzaksiyalarni qisqa qiling, tarmoq chaqiruvlarini ulardan tashqarida bajaring.
- **`idle in transaction` sessiyalari.** Commit qilinmagan unutilgan `BEGIN` pul slotini to‘sib qo‘yadi. PostgreSQL’da `idle_in_transaction_session_timeout`’ni sozlang.
- **Haddan tashqari katta pul.** Ko‘proq server ulanishi ko‘proq o‘tkazuvchanlik degani emas: ma’lum nuqtadan keyin ular CPU va bloklar uchun raqobatlasha boshlaydi. Kichikdan boshlang va kechikishlarni o‘lchab turib oshiring.
- **Yagona PgBouncer — yagona nosozlik nuqtasi.** U bir oqimli va yengil, lekin production uchun kamida ikkita nusxa yoki boshqariladigan yechimni rejalashtiring.
- **Sessiya imkoniyatlari ishlashda davom etadi, deb o‘ylash.** Transaction’ga o‘tishdan oldin kodni `SET`, vaqtinchalik jadvallar, `LISTEN` va advisory bloklar bo‘yicha tekshiring.

Barcha parametrlar ro‘yxati: [PgBouncer hujjatlari](https://www.pgbouncer.org/config.html).

## FAQ

### Freymvorkda ulanishlar puli bo‘lsa ham PgBouncer kerakmi?

Ilova ichidagi pul bitta jarayon ulanishlarini cheklaydi. Jarayonlar, konteynerlar yoki funksiyalar bir nechta bo‘lsa, ularning pullari qo‘shilib ketadi. PgBouncer butun tizim uchun umumiy sonni cheklaydi, shuning uchun gorizontal masshtablashda odatda ikkalasi ham kerak, ilova ichidagi pul esa kichik bo‘ladi.

### Qaysi rejimni tanlash kerak?

Sessiya holatiga tayanmasangiz, ko‘pchilik veb-API, fon worker’lari va serverless uchun transaction. Ilova `LISTEN/NOTIFY`, vaqtinchalik jadvallar yoki sessiya bloklariga bog‘liq bo‘lsa va buni tez o‘zgartirib bo‘lmasa — session.

### default_pool_size’ni qanday tanlash kerak?

Universal raqam yo‘q: hammasi CPU yadrolari, disk tezligi va so‘rovlar profiliga bog‘liq. Kamtarona puldan boshlang, `SHOW POOLS`, so‘rovlar kechikishi va baza CPU yuklamasini kuzating hamda o‘tkazuvchanlik o‘sib borar ekan, oshirib boring.
