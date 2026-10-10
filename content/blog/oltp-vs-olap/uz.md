---
title: OLTP va OLAP: tranzaksion va tahliliy ma’lumotlar bazalari
description: OLTP va OLAP yuklamalari farqi, qatorli va ustunli saqlash so‘rovlar tezligiga qanday ta’sir qiladi va nega hisobotlarni ishchi bazada ishga tushirmaslik kerak.
summary: OLTP-bazalar ilovaning ko‘plab mayda amallariga xizmat qiladi: buyurtmalar, to‘lovlar, ro‘yxatdan o‘tishlar. OLAP-bazalar katta hajmdagi tarix bo‘yicha og‘ir tahliliy so‘rovlar uchun mo‘ljallangan. Bu yuklamalarni bitta bazada aralashtirish — prodakshendagi sekinlashuvlarning keng tarqalgan sababi.
---

## Asosiy farq

**OLTP (Online Transaction Processing)** — ilovaning o‘zi ishlaydigan bazalar. Foydalanuvchi buyurtma berdi, to‘ladi, manzilini o‘zgartirdi — har bir amal bir nechta qatorni o‘qiydigan yoki o‘zgartiradigan qisqa tranzaksiyaga aylanadi. Bunday amallar ko‘p va har biri millisekundlarda bajarilishi kerak. Odatiy misollar: PostgreSQL, MySQL, SQL Server.

**OLAP (Online Analytical Processing)** — tahlil uchun bazalar. Ularga so‘rovlar kamroq, lekin har biri millionlab qatorlarni ko‘rib chiqishi mumkin: uch yil davomida oylar bo‘yicha tushum, hududlar bo‘yicha o‘rtacha chek, kanallar bo‘yicha voronka. Bu yerda alohida yozuvlar emas, agregatsiyalar tezligi muhim. Misollar: ClickHouse, BigQuery, Snowflake.

## Yuklamalarni solishtirish

| Parametr | OLTP | OLAP |
|---|---|---|
| Odatiy amal | Bitta yozuvni qo‘shish, yangilash yoki o‘qish | Katta diapazon bo‘yicha yig‘indi, o‘rtacha yoki sonni hisoblash |
| Bitta so‘rov hajmi | Bir nechta qator | Millionlab qator, lekin bir nechta ustun |
| Chastota | Juda ko‘p qisqa so‘rovlar | Kam, lekin uzun so‘rovlar |
| Foydalanuvchilar | Ilova va uning mijozlari | Tahlilchilar, BI-vositalar, rahbariyat |
| Ustuvorlik | Yaxlitlik, tranzaksiyalar, past kechikish | Agregatsiya tezligi, siqish, tarix bilan ishlash |
| Ma’lumotlar modeli | Normallashtirilgan, takrorlarsiz | Denormallashtirilgan, «yulduz» va vitrinalar |

## Qatorli va ustunli saqlash

Yuklamadagi farq ma’lumotlarning diskda qanday joylashishini belgilaydi.

**Qatorli saqlash (OLTP).** Bitta yozuvning barcha maydonlari yonma-yon saqlanadi. Buyurtma kartochkasini ko‘rsatish uchun baza diskdagi bitta joyni o‘qiydi va barcha maydonlarni birdan oladi. «Buyurtmani ID bo‘yicha top va statusini yangila» uchun ideal.

**Ustunli saqlash (OLAP).** Har bir ustunning qiymatlari alohida saqlanadi. «Oylar bo‘yicha `amount` yig‘indisi» so‘roviga, aytaylik, o‘ttizta ustundan faqat ikkitasi kerak — qolganlarini baza umuman o‘qimaydi. Ustundagi bir turdagi qiymatlar esa juda yaxshi siqiladi.

Teskari tomoni: ustunli bazada alohida qatorlarni yangilash qimmat, shuning uchun ma’lumotlar odatda bittalab emas, paketlab yuklanadi.

```sql
-- Odatiy OLTP-so‘rov: kalit bo‘yicha bitta yozuv
SELECT status, total FROM orders WHERE id = 48213;

-- Odatiy OLAP-so‘rov: butun tarix bo‘yicha agregatsiya
SELECT date_trunc('month', created_at) AS month, SUM(total)
FROM orders
GROUP BY 1
ORDER BY 1;
```

## Nega hisobotlarni ishchi bazada ishga tushirmaslik kerak

Ikkinchi so‘rov zararsiz ko‘rinadi, lekin katta jadvalda u:

- **Butun jadvalni o‘qiydi** va ilovaga kerakli ma’lumotlarni keshdan siqib chiqaradi.
- **Protsessor va diskni yuklaydi**, natijada foydalanuvchilarning oddiy so‘rovlari kutib qoladi.
- **Uzoq vaqt ma’lumotlar snapshotini ushlab turadi**, bu PostgreSQL’da qatorlarning eski versiyalarini tozalashga xalaqit beradi va jadvallarni shishiradi.
- **Hisobotlar «uchun» ortiqcha indekslarga undaydi**, ular esa har bir yozuvni sekinlashtiradi.

Natija ko‘pchilikka tanish: oy oxirida buxgalteriya hisobot tuzadi, sayt va CRM esa sekinlasha boshlaydi.

## Buning o‘rniga nima qilish kerak

1. **O‘qish uchun replika.** Ishchi bazaning alohida nusxasi, hisobotlar unga yo‘naltiriladi. Eng oddiy birinchi qadam.
2. **Tahliliy baza.** Ma’lumotlarni ClickHouse, BigQuery yoki boshqa ustunli omborga muntazam yuklash.
3. **Vitrinalar.** Oldindan hisoblangan agregatlar, masalan kunlik tushum, dashbordlar butun tarixni qayta hisoblamasligi uchun.
4. **Cheklovlar.** Tahlil uchun so‘rovlar taymautiga ega alohida foydalanuvchi.

## FAQ

### Bitta baza ikkala yuklamani ham ko‘tara oladimi?

Gibrid yechimlar mavjud (ular HTAP deb ataladi), kichik hajmlarda esa PostgreSQL oddiy tahlilni bemalol tortadi. Lekin ma’lumotlar o‘sgan sari yuklamalarni ajratish deyarli har doim soddaroq va ishonchliroq bo‘ladi.

### Replika muammoni to‘liq hal qiladimi?

U asosiy bazani og‘ir so‘rovlardan himoya qiladi, lekin replika baribir qatorli baza bo‘lib qoladi. Tahliliy so‘rovlar unda ham sekinlasha boshlasa, ustunli omborga o‘tish vaqti keldi.

### Ilova ma’lumotlarini OLAP-bazada saqlasa bo‘ladimi?

Tavsiya etilmaydi. Ustunli bazalar buyurtmalar va to‘lovlarga kerak bo‘ladigan tez-tez nuqtaviy yangilanishlar va qat’iy tranzaksiyalar uchun mo‘ljallanmagan.
