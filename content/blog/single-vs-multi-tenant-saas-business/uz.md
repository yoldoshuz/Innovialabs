---
title: Single-tenant va multi-tenant SaaS: biznes uchun oqibatlari
description: Single-tenant yoki multi-tenant SaaS tanlovi narxlash, yirik mijozlarga sotuv, ma’lumotlar izolyatsiyasi va xarajatlarga qanday ta’sir qiladi.
summary: Multi-tenant ekspluatatsiyada arzonroq va oson masshtablanadi, shuning uchun ommaviy bozorga mos. Single-tenant qimmatroq, lekin izolyatsiyaga qat’iy talablari bor yirik mijozlarga sotishni osonlashtiradi; ko‘p mahsulotlar gibriddan foydalanadi.
---

## Qisqa javob

**Multi-tenant** — ilovaning bitta nusxasi va umumiy infratuzilma barcha mijozlarga xizmat qiladi, ma’lumotlar mantiqiy ajratiladi. **Single-tenant** — har bir mijozning o‘z izolyatsiyalangan ilova nusxasi va odatda alohida ma’lumotlar bazasi bor.

Ko‘pchilik SaaS mahsulotlar uchun, ayniqsa boshlang‘ich bosqichda va kichik hamda o‘rta biznes segmentida, standart oqilona tanlov — multi-tenant. Single-tenant mijozlar yirik kompaniyalar yoki tartibga solinadigan sohalar bo‘lib, izolyatsiya uchun to‘lashga tayyor bo‘lganda o‘zini oqlaydi.

## Asosiy parametrlar bo‘yicha taqqoslash

| Parametr | Multi-tenant | Single-tenant |
|---|---|---|
| Bir mijozga ekspluatatsiya narxi | Past, resurslar umumiy | Yuqori, resurslar ajratilgan |
| Yangilanishlar | Hamma uchun bitta reliz | Har bir nusxani yangilash kerak |
| Ma’lumotlar izolyatsiyasi | Mantiqiy, kod sifatiga bog‘liq | Jismoniy yoki infratuzilma darajasida |
| Moslashtirish | Sozlamalar bilan cheklangan | Chuqur moslashtirish mumkin |
| Mijozni ulash | Tez, o‘z-o‘ziga xizmat | Joylashtirishni talab qiladi |
| Ma’lumotlarni ma’lum mamlakatda saqlash talabi | Bajarish qiyinroq | Bajarish osonroq |

## Narxlash

Multi-tenant **arzon tariflar va bepul sinov muddatlarini** taklif qilish imkonini beradi: yangi mijoz deyarli xarajat qo‘shmaydi. Bu o‘z-o‘ziga xizmat modelining asosi.

Single-tenantda har bir mijoz o‘z infratuzilma va qo‘llab-quvvatlash xarajatlarini olib keladi. Shuning uchun narx odatda yuqoriroq, ko‘pincha shartnomaning minimal chegarasi bor, joylashtirish narxi esa shartnomaga kiritiladi.

## Yirik mijozlarga sotuv

Yirik kompaniyalar, banklar va davlat tuzilmalari ko‘pincha single-tenantda bajarish osonroq bo‘lgan talablar qo‘yadi:

- ma’lumotlar boshqa mijozlar ma’lumotlari bilan jismonan yonma-yon bo‘lmasligi;
- ma’lumotlarni ma’lum yurisdiksiyada saqlash;
- yangilanish oynasini nazorat qilish;
- o‘z shifrlash kalitlari, alohida audit, ichki infratuzilma bilan integratsiya.

Multi-tenant mahsulot ham bunday tekshiruvlardan o‘tishi mumkin, ammo xavfsizlik, hujjatlar va sertifikatlash bo‘yicha jiddiy ish talab qiladi.

## Ma’lumotlar izolyatsiyasi va xavflar

Multi-tenantda asosiy xavf — kod xatosi tufayli **mijozlar o‘rtasida ma’lumot sizib chiqishi**, masalan `tenant_id` bo‘yicha filtrsiz so‘rov. Xavfni kamaytirish usullari:

- ORM yoki ma’lumotlar bazasi darajasida majburiy filtrlash (masalan, row-level security);
- izolyatsiyani tekshiradigan testlar;
- umumiy infratuzilma ichida har bir mijoz uchun alohida sxema yoki baza.

```sql
-- PostgreSQL: qatorlar faqat o‘z tenantiga ko‘rinadi
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**«Shovqinli qo‘shni»** muammosi ham bor: bitta faol mijoz qolganlarning ishini sekinlashtirishi mumkin. Uni limitlar va kvotalar hal qiladi.

## Ekspluatatsiya xarajatlari va masshtablash

Multi-tenant yagona tizim sifatida masshtablanadi: quvvat qo‘shildi — hamma yutdi. Monitoring, bekaplar va deploy — bitta jarayon.

Single-tenant nusxalar soni bilan masshtablanadi. Kuchli avtomatlashtirishsiz (infratuzilma kod sifatida, avtomatik deploy, markazlashgan monitoring) har bir yangi nusxa jamoaga yuk qo‘shadi, yuzlab o‘rnatmalar esa alohida operatsion muammoga aylanadi.

## Gibrid yondashuv

Ko‘p mahsulotlar modellarni birlashtiradi:

- mijozlarning asosiy qismi umumiy infratuzilmada;
- yirik mijozlar xuddi shu koddagi ajratilgan muhitlarda;
- yagona kod bazasi, turli joylashtirish konfiguratsiyalari.

Asosiy shart — barcha variantlar uchun **yagona kod**. Alohida mijozlar uchun tarmoqlangan versiyalar tezda qo‘llab-quvvatlab bo‘lmaydigan holga keladi.

## Ko‘p uchraydigan xatolar

- Mijozlarning real talablarisiz single-tenantni «har ehtimolga qarshi» tanlash.
- Ma’lumotlar darajasida izolyatsiyasiz va uning testlarisiz multi-tenant qurish.
- Single-tenantda alohida mijozlar uchun maxsus kodga ruxsat berish.
- Mijoz identifikatorini boshidanoq ma’lumotlar modeliga kiritmaslik — keyin qo‘shish qimmatga tushadi.

## FAQ

### Keyinroq single-tenantdan multi-tenantga o‘tish mumkinmi?

Mumkin, lekin bu yirik loyiha: ma’lumotlarga mijoz identifikatorini qo‘shish, ularga kirishni qayta yozish va mijozlarni migratsiya qilish kerak. Ma’lumotlarni boshidanoq tenantni hisobga olib loyihalash osonroq.

### Multi-tenant maxfiy ma’lumotlar uchun xavfsizmi?

Ma’lumotlar bazasi darajasidagi izolyatsiya, shifrlash va muntazam audit bilan xavfsiz bo‘lishi mumkin. Lekin ba’zi mijozlar o‘z qoidalariga ko‘ra ajratilgan infratuzilmani talab qiladi, unda single-tenant yoki gibrid kerak.

### MVP uchun nimani tanlash kerak?

Odatda multi-tenant: u ekspluatatsiyada arzonroq va tezroq rivojlanadi. Agar birinchi mijozlar izolyatsiya talablari bor yirik kompaniyalar bo‘lsa, ajratilgan muhitlar imkoniyatini darhol ko‘zda tuting.
