---
title: Ma’lumotlar bazasini loyihalashdagi odatiy xatolar va ulardan qochish
description: Bitta ustundagi ro‘yxatlar, cheklovlarsiz jadvallar, pul uchun float, tartibsiz nomlar va vaqt zonalari — bazadagi keng tarqalgan xatolar va yechimlar.
summary: Ma’lumotlardagi muammolarning ko‘pi sxemada boshlanadi: bitta katakda bitta qiymat saqlang, cheklovlarni bazada belgilang, pul uchun numeric, bir xil nomlar va vaqt uchun timestamptz ishlating.
---

## Qisqa javob: eng ko‘p uchraydigan xatolar

Ma’lumotlar bazasi sxemasi uning atrofidagi deyarli barcha koddan uzoqroq yashaydi. Funksiyadagi xatoni bir soatda tuzatish mumkin, sxemadagi xatoni esa faqat migratsiya bilan, ko‘pincha yig‘ilib qolgan ma’lumotlarni tozalash bilan birga. Eng ko‘p uchraydigan muammolar:

- **bitta ustunda ro‘yxat** saqlash, alohida jadval o‘rniga;
- **cheklovlar yo‘q** — tekshiruv faqat ilova kodida;
- **pul uchun float**;
- jadval va ustunlarning **tartibsiz nomlari**;
- `created_at` va `updated_at` kabi **xizmat sanalari yo‘q**;
- **vaqt zonasisiz vaqt**.

Quyida har birini PostgreSQL misolida yechimi bilan ko‘rib chiqamiz. MySQL va boshqa tizimlarda tamoyillar bir xil, faqat sintaksis farq qiladi.

## 1-xato: bitta ustunda qiymatlar ro‘yxati

`tags = 'vip,ulgurji,toshkent'` kabi ustun qulay ko‘rinadi, toki «ulgurji» tegli barcha mijozlarni topish, ularni sanash yoki tegni qayta nomlash kerak bo‘lmaguncha. Qism-satr bo‘yicha qidiruv sekin va noto‘g‘ri natija beradi.

**Yechim:** qiymatlarni bog‘lovchi jadvalga chiqaring («ko‘pga ko‘p» bog‘lanish).

```sql
CREATE TABLE tags (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE customer_tags (
  customer_id bigint NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tag_id      bigint NOT NULL REFERENCES tags(id),
  PRIMARY KEY (customer_id, tag_id)
);
```

PostgreSQL’dagi massivlar va JSONB butunligicha o‘qiladigan va kam filtrlanadigan ma’lumotlar uchun mos. Agar qiymat bo‘yicha qidirsangiz, bog‘lasangiz yoki sanasangiz — jadval kerak.

## 2-xato: bazada cheklovlar yo‘q

«Tekshiruv backend’da bor» degan gap birinchi import skripti, ikkinchi servis yoki qo‘lda qilingan `UPDATE` gacha ishlaydi. Keyin mijozsiz buyurtmalar, manfiy miqdorlar va takroriy email’lar paydo bo‘ladi.

**Sxemada belgilang:**

- majburiy maydonlar uchun `NOT NULL`;
- jadvallar orasidagi bog‘lanishlar uchun `FOREIGN KEY`;
- tabiiy kalitlar uchun `UNIQUE` (email, shartnoma raqami, STIR);
- oddiy qoidalar uchun `CHECK`: `CHECK (quantity > 0)`.

Cheklovlar — bazaning barcha mijozlari uchun bir xil ishlaydigan oxirgi himoya chizig‘i.

## 3-xato: pul uchun float

`float` va `double` turlari sonlarni ikkilik ko‘rinishda taxminiy saqlaydi. Ularda `0.1 + 0.2` aniq `0.3` ga teng emas, minglab operatsiyalarda esa tiyinlar buxgalteriya bilan mos kelmay qoladi.

**Yechim:**

- aniqligi ko‘rsatilgan `numeric(14, 2)` (yoki `decimal`) ishlating;
- yoki summani eng kichik birlikda (tiyin, sent) `bigint` sifatida saqlang;
- bir nechta valyuta bo‘lsa, summa yonida **valyutani** saqlang: `amount numeric(14,2), currency char(3)`.

## 4-xato: tartibsiz nomlar

`Users`, `order_item`, `tblProducts`, `dt` va `date2` nomli ustunlar — bir yildan keyin hech kim nima qayerdaligini eslamaydi. Yomon nomlar har bir so‘rovni va har bir yangi dasturchini sekinlashtiradi.

**Oddiy qoidalar:**

| Qoida | Misol |
|---|---|
| Bitta uslub, odatda snake_case | `order_items`, `created_at` |
| Jadval nomlari ko‘plikda (yoki hamma joyda birlikda) | `customers`, `orders` |
| Tashqi kalit = jadval + `_id` | `customer_id` |
| Tushunarli mantiqiy maydonlar | `is_active`, `has_discount` |
| Qisqartma va xizmat prefikslarisiz | `tbl_` emas, `cst_nm` emas |

Muayyan uslub emas, butun bazada **bir xillik** muhim.

## 5-xato: created_at va updated_at yo‘q

Yaratilish va o‘zgarish sanalarisiz oddiy savollarga javob berib bo‘lmaydi: mijoz qachon paydo bo‘lgan, kecha nima o‘zgargan, analitikaga navbatdagi inkremental eksportda qaysi yozuvlarni olish kerak.

```sql
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
```

`updated_at` ni ilovada yoki trigger orqali yangilang. Muhim obyektlar (pul, buyurtma statuslari) uchun alohida **o‘zgarishlar tarixi jadvali** yuritish foydali.

## 6-xato: vaqt zonasisiz vaqt

Server bitta zonada, foydalanuvchilar Toshkent va Moskvada, integratsiya esa UTC’da vaqt yuboradi. `timestamp without time zone` turi qiymat qaysi zonaga tegishli ekanini bilmaydi va «kunlik» hisobotlar bir necha soatga siljiy boshlaydi.

**Yechim:**

- vaqt momentlarini `timestamptz` da saqlang — PostgreSQL ularni UTC’ga keltiradi;
- chiqarishda mahalliy vaqtga o‘tkazing: `created_at AT TIME ZONE 'Asia/Tashkent'`;
- vaqtsiz sanalar uchun (tug‘ilgan kun, hujjat sanasi) `date` turini ishlating.

## Yangi loyihalarda xatolarning oldini olish

1. Kod yozishdan oldin **ER-diagramma** chizing va uni biznes jarayonini biladigan odam bilan muhokama qiling.
2. Sxemani kamida **uchinchi normal shakl**ga keltiring, denormalizatsiyani ongli ravishda qiling.
3. Sxemani faqat repozitoriydagi **migratsiyalar** orqali o‘zgartiring, serverda qo‘lda emas.
4. Kod review’ga chek-list qo‘shing: cheklovlar, turlar, nomlar, sanalar.

## FAQ

### Ishlab turgan tizimda sxema xatolarini tuzatish mumkinmi?

Ha, bosqichma-bosqich: yangi tuzilmani qo‘shing, ma’lumotlarni ko‘chirib tekshiring, kodni o‘tkazing, so‘ng eskisini o‘chiring. PostgreSQL’da katta jadvallarga cheklovni `NOT VALID` bilan qo‘shib, mavjud qatorlarni keyinroq `VALIDATE CONSTRAINT` bilan tekshirish mumkin.

### UUID yoki sonli id ishlatish kerakmi?

Ikkalasi ham ishlaydi. `bigint` ixchamroq va indekslarda tezroq, UUID esa id baza tashqarisida yaratilganda yoki taxmin qilib bo‘lmasligi kerak bo‘lganda qulay. Bitta yondashuvni tanlab, unga amal qiling.

### Relyatsion bazada JSON saqlash xatomi?

Yo‘q, agar bu haqiqatan moslashuvchan ma’lumot bo‘lsa: sozlamalar, tashqi API’ning xom javobi, tuzilishi har xil atributlar. Doimiy filtrlaydigan, bog‘laydigan va hisoblaydigan maydonlarni JSON’da saqlash xatoga aylanadi.
