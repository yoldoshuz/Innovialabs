---
title: Birlamchi va tashqi kalit: jadvallar qanday bog‘lanadi
description: Birlamchi va tashqi kalit nima, birga-bir, birga-ko‘p va ko‘pga-ko‘p bog‘lanishlar, kaskadli o‘chirish hamda serial va UUID o‘rtasida tanlov.
summary: Birlamchi kalit o‘z jadvalidagi har bir qatorni yagona tarzda aniqlaydi, tashqi kalit esa boshqa jadvalning birlamchi kalitiga ishora qiluvchi ustun; ular birgalikda jadvallar orasida bog‘lanish yaratadi va bazaga mavjud bo‘lmagan qatorga havola saqlashga yo‘l qo‘ymaydi.
---

## Qisqacha javob

- **Birlamchi kalit (PK)** — qiymati jadvaldagi qatorni yagona tarzda aniqlaydigan ustun yoki ustunlar to‘plami. U unikal, hech qachon `NULL` bo‘lmaydi va jadvalda faqat bitta bo‘ladi.
- **Tashqi kalit (FK)** — bir jadvaldagi, boshqa jadvalning birlamchi kalitiga (yoki boshqa unikal ustuniga) havola qiluvchi ustun. U «bu buyurtma anavi mijozga tegishli» degan ma’noni beradi.

Baza ikkalasini ham nazorat qiladi. Bir xil ID’li ikkita mijozni qo‘shib bo‘lmaydi va mavjud bo‘lmagan mijoz uchun buyurtma yaratib bo‘lmaydi. Bu **havola yaxlitligi** deb ataladi.

```sql
CREATE TABLE customers (
  id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers (id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Tabiiy va surrogat kalitlar

- **Tabiiy kalit** real dunyodan olinadi: pasport raqami, email, STIR.
- **Surrogat kalit** — baza yoki ilova yaratadigan sun’iy ID.

Birlamchi kalit uchun odatda surrogat kalit tanlanadi, chunki real dunyo qiymatlari o‘zgaradi: odamlar pochtasini almashtiradi, hujjatlar qayta beriladi. Tabiiy identifikatorlarni `UNIQUE` cheklovli oddiy ustunlar sifatida saqlang.

## Bog‘lanish turlari

### Birga-ko‘p

Eng ko‘p uchraydigan tur. Bitta mijozning ko‘p buyurtmasi bor, har bir buyurtmaning bitta mijozi bor. Tashqi kalit «ko‘p» tomonga qo‘yiladi: `orders.customer_id`.

### Birga-bir

Bitta foydalanuvchining bitta profili bor. Profillar jadvaliga FK qo‘shiladi va unikal qilinadi — ko‘pincha u bir vaqtda birlamchi kalit ham bo‘ladi:

```sql
CREATE TABLE profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users (id),
  bio     TEXT
);
```

Birga-bir bog‘lanish kam ishlatiladigan yoki maxfiy ustunlarni alohida jadvalga chiqarish uchun qulay. Agar ma’lumotlar doim birga o‘qilsa, bitta jadval odatda soddaroq.

### Ko‘pga-ko‘p

Talaba ko‘p kurslarga qatnaydi, kursda ko‘p talaba bor. Jadvallarning hech biri FK’ni yolg‘iz saqlay olmaydi, shuning uchun **bog‘lovchi jadval** (junction table) qo‘shiladi:

```sql
CREATE TABLE enrollments (
  student_id  BIGINT REFERENCES students (id),
  course_id   BIGINT REFERENCES courses (id),
  enrolled_at DATE NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```

Tarkibli birlamchi kalit bitta talabani bitta kursga ikki marta yozishga yo‘l qo‘ymaydi. Bog‘lovchi jadvalda bog‘lanishning o‘zi haqidagi faktlarni ham saqlash mumkin, masalan yozilish sanasini.

## O‘chirishda nima bo‘ladi

Buyurtmalari bor mijozni o‘chirganingizda xatti-harakatni tashqi kalit belgilaydi:

| Variant | Xatti-harakat |
|---|---|
| `RESTRICT` / `NO ACTION` | Bola qatorlar bor ekan, o‘chirish amalga oshmaydi (standart) |
| `CASCADE` | Bola qatorlar ota qator bilan birga o‘chiriladi |
| `SET NULL` | Bola qatorlardagi FK `NULL` bo‘ladi |
| `SET DEFAULT` | FK standart qiymatni oladi |

```sql
customer_id BIGINT REFERENCES customers (id) ON DELETE CASCADE
```

`CASCADE` ota qatorsiz ma’nosiz bo‘lgan ma’lumotlarga mos, masalan buyurtmasiz buyurtma pozitsiyalari. Qimmatli yozuvlar uchun undan qochgan ma’qul: mijozlardan buyurtmalar va to‘lovlarga kaskad moliyaviy tarixni sezdirmay o‘chirib yuborishi mumkin. Bunday hollarda `RESTRICT` yoki **yumshoq o‘chirish** (`is_deleted` yoki `deleted_at` ustuni) afzal.

## Serial yoki UUID

| | Serial / identity | UUID |
|---|---|---|
| Hajmi | 4 yoki 8 bayt | 16 bayt |
| O‘qilishi | `1042` ni aytish va debug qilish oson | Uzun satr |
| Qayerda yaratiladi | Bazada | Bazada yoki ilovada |
| Taxmin qilish mumkinmi | Ha, ID’lar ketma-ket | Amalda yo‘q |
| Ma’lumotlarni birlashtirish, oflayn yaratish | Ziddiyat xavfi | Tizimlar orasida unikal |
| Indeksga qulayligi | Ketma-ket, yaxshi lokallik | Tasodifiy UUIDv4 qo‘shishlarni sochib yuboradi |

Amaliy maslahatlar:

- Ko‘pchilik ichki jadvallar uchun **identity/serial** — oddiy va samarali variant.
- ID’lar mijoz tomonida yoki bir nechta servisda yaratilsa, turli manbalardan ma’lumot birlashtirsangiz yoki yozuvlar sonini oshkor qilishni istamasangiz, **UUID** tanlang.
- UUID birlamchi kalit bo‘lsa, **vaqt bo‘yicha tartiblangan variantlarga, masalan UUIDv7 ga** e’tibor bering: ular indeksdagi qo‘shishlarni bir-biriga yaqinroq saqlaydi.
- Taxmin qilib bo‘lmaydigan ID’larni himoya deb hisoblamang — kirish huquqlarini doim tekshiring.

## Ko‘p uchraydigan xatolar

- FK ustuniga indeks qo‘yishni unutish. PostgreSQL havola qiluvchi ustunda uni avtomatik yaratmaydi, MySQL InnoDB esa yaratadi. Katta jadvallarda JOIN va kaskadli o‘chirish sekinlashadi.
- Turlarning mos kelmasligi, masalan bir jadvalda `INT`, boshqasida `BIGINT`.
- «Tezlik uchun» FK’dan voz kechish — natijada hech qayerga ishora qilmaydigan yetim qatorlar paydo bo‘ladi.
- Email kabi o‘zgaruvchan qiymatni birlamchi kalit qilish.

## FAQ

### Jadvalda bir nechta tashqi kalit bo‘lishi mumkinmi?

Ha. Buyurtma bir vaqtda mijozga, yetkazish manziliga va menejerga havola qilishi mumkin. Jadval o‘ziga ham havola qila oladi, masalan `employees.manager_id` boshqa xodimga ishora qiladi.

### Tashqi kalit NULL bo‘lishi mumkinmi?

Ha, agar `NOT NULL` qo‘shilmasa. Tashqi kalitdagi `NULL` majburiy bo‘lmagan bog‘lanishni bildiradi, masalan hali kuryer biriktirilmagan buyurtma.

### Yangi loyiha uchun UUID yoki serial?

Agar barcha yozuvlarni bitta baza yaratsa va ID’lar ochiq ko‘rinmasa, serial/identity soddaroq. Yozuvlar turli joylarda yaratilsa yoki ID’lar ochiq URL’larda ko‘rinsa, ko‘pincha UUID yaxshiroq mos keladi.
