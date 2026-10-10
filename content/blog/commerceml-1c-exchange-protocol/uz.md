---
title: CommerceML va 1C bilan almashinuv protokoli: batafsil tahlil
description: 1C sayt bilan CommerceML orqali qanday almashadi: so‘rovlar ketma-ketligi, import.xml, offers.xml va buyurtmalar tuzilmasi, qisman almashinuv va xatolar.
summary: 1C saytga o‘zi HTTP so‘rovlar yuboradi (checkauth, init, file, import), katalogni import.xml, narx va qoldiqlarni offers.xml orqali beradi va buyurtmalarni mode=query bilan oladi; ko‘p xatolar avtorizatsiya, yuklash limitlari va ID mos kelmasligidan chiqadi.
---
## Almashinuv qisqacha qanday ishlaydi

**CommerceML** — tovarlar, narxlar va buyurtmalarni almashish uchun XML formati. **Almashinuv protokoli** esa 1C saytning bitta manziliga (masalan, `/1c_exchange.php` yoki `/api/1c`) yuboradigan HTTP so‘rovlar to‘plami. Tashabbuskor doim 1C bo‘ladi, sayt faqat javob beradi. Almashinuv turi `type` parametri bilan (`catalog` — tovarlar, `sale` — buyurtmalar), bosqich esa `mode` bilan belgilanadi.

Sayt javoblari oddiy matn: birinchi qatorda `success`, `progress` yoki `failure`, keyin qo‘shimcha ma’lumotlar.

## Katalogni yuklash ketma-ketligi

```text
GET  ?type=catalog&mode=checkauth
GET  ?type=catalog&mode=init
POST ?type=catalog&mode=file&filename=import.xml
GET  ?type=catalog&mode=import&filename=import.xml
POST ?type=catalog&mode=file&filename=offers.xml
GET  ?type=catalog&mode=import&filename=offers.xml
```

1. **checkauth** — 1C login va parolni HTTP Basic Auth orqali yuboradi. Sayt `success`, so‘ng sessiya cookie nomi va qiymatini qaytaradi. Keyingi barcha so‘rovlar shu cookie bilan keladi.
2. **init** — sayt arxiv qabul qilishini (`zip=yes`/`zip=no`) va bitta bo‘lakning maksimal hajmini (`file_limit=...`) bildiradi. Oldingi almashinuvdan qolgan vaqtinchalik papkani shu yerda tozalash qulay.
3. **file** — 1C fayllarni POST so‘rov tanasida yuboradi. Katta fayl bo‘laklab kelishi mumkin: ularni ustidan yozmasdan, oxiriga **qo‘shib boring**. Rasmlar ham shunday keladi, odatda `import_files/...` ko‘rinishidagi yo‘llar bilan.
4. **import** — sayt faylni tahlil qiladi. Ishlov berish uzoq bo‘lsa, `progress` deb javob bering: 1C so‘rovni takrorlaydi, siz to‘xtagan joydan davom etasiz. Tayyor bo‘lganda — `success`, xatoda — `failure` va sababi.

## Fayllar tuzilmasi

CommerceML’dagi element nomlari rus tilida, parserda ularni o‘zgartirmang.

**import.xml** klassifikator va katalogni saqlaydi:

```xml
<КоммерческаяИнформация ВерсияСхемы="2.05">
  <Классификатор>
    <Группы>...</Группы>
    <Свойства>...</Свойства>
  </Классификатор>
  <Каталог СодержитТолькоИзменения="false">
    <Товары>
      <Товар>
        <Ид>b1f2...</Ид>
        <Наименование>Choynak</Наименование>
        <Группы><Ид>a7c3...</Ид></Группы>
        <Картинка>import_files/b1/b1f2.jpg</Картинка>
      </Товар>
    </Товары>
  </Каталог>
</КоммерческаяИнформация>
```

Bu yerda `Классификатор` — `Группы` (kategoriyalar) va `Свойства` (xususiyatlar) bilan klassifikator, `Товар` — `Ид`, `Наименование` (nomi) va `Картинка` (rasm)ga ega tovar.

**offers.xml** ichida `ПакетПредложений` bor: `ТипыЦен` (narx turlari) ro‘yxati va `Предложения` (takliflar). Har bir `Предложение`da `Ид`, `Цены` (`ИдТипаЦены`, `ЦенаЗаЕдиницу`, `Валюта` bilan) va `Количество` (miqdor) bo‘ladi. Tovarning variantlari (o‘lcham, rang) bo‘lsa, taklif `Ид`si odatda `tovarId#variantId` ko‘rinishida — uni `#` bo‘yicha ajrating.

**Buyurtmalar** `КоммерческаяИнформация` ichidagi `Документ` elementlari sifatida uzatiladi: `Ид`, `Номер`, `Дата`, `ХозОперация`, `Валюта`, `Сумма`, `Контрагенты` (mijozlar), `Товары` (pozitsiyalar) va `ЗначенияРеквизитов` (to‘lov holati, yetkazish usuli va h.k.).

Aniq elementlar to‘plami sxema versiyasi va 1C konfiguratsiyasiga bog‘liq, shuning uchun almashinuvdan kelgan haqiqiy fayllarni saqlab, parserni ular asosida quring.

## Buyurtmalar almashinuvi

1. `type=sale` bilan `checkauth` va `init` — katalogdagi kabi.
2. `mode=query` — sayt yangi yoki o‘zgargan buyurtmalar bilan XML qaytaradi.
3. `mode=success` — 1C qabul qilganini tasdiqlaydi. Buyurtmalarni faqat shundan keyin yuklangan deb belgilang.
4. Ba’zi konfiguratsiyalarda 1C keyin buyurtma holatlari yangilangan `mode=file` yuboradi.

## To‘liq va qisman almashinuv

`Каталог` va `ПакетПредложений`dagi **`СодержитТолькоИзменения`** ("faqat o‘zgarishlarni o‘z ichiga oladi") atributi rejimni belgilaydi:

| Rejim | Qiymat | Saytda nima qilish kerak |
|---|---|---|
| To‘liq | `false` | Hammasini sinxronlash; faylda yo‘q tovarlarni o‘chirib qo‘yish mumkin |
| Qisman | `true` | Faqat kelgan pozitsiyalarni yangilash, qolganlariga tegmaslik |

Keng tarqalgan xato — qisman yuklashda faylda yo‘q tovarlarni o‘chirib qo‘yish. Natijada 1C’dagi kichik o‘zgarishdan keyin deyarli butun katalog yo‘qoladi.

## Odatiy xatolarni tuzatish

- **Avtorizatsiya o‘tmaydi.** PHP CGI/FastCGI orqali ishlaganda `Authorization` sarlavhasi skriptga yetib bormasligi mumkin — uni veb-server sozlamalarida aniq uzating.
- **Sessiya yo‘qoladi.** Sayt `checkauth`da cookie qaytarishi va keyin uni qabul qilishi kerak; keshlovchi proksi yoki CDN bu manzilga aralashmasligi lozim.
- **Katta fayllarda uzilish.** So‘rov tanasi limitini (masalan, nginx’dagi `client_max_body_size`), taymautlar va `file_limit`ni tekshiring. Uzoq importni `progress` orqali bosqichlarga bo‘ling.
- **Tovar dublikatlari.** Yozuvlarni nomi yoki artikuli bo‘yicha emas, faqat 1C’dagi `Ид` bo‘yicha moslashtiring.
- **Buyurtmalar qayta yuklanadi.** `mode=success` qayta ishlanmayapti.
- **Buzilgan belgilar.** XML deklaratsiyasidagi kodirovka va javoblaringiz kodirovkasini tekshiring.

Diagnostika uchun har bir so‘rovni loglang: `type`, `mode`, `filename`, tana hajmi va javob. Qabul qilingan fayllar nusxasini saqlang — ular yordamida xatoni lokal takrorlash ancha oson.

## FAQ

### Almashinuvni 1C emas, sayt boshlashi mumkinmi?

Standart protokolda tashabbuskor 1C: u so‘rovlarni jadval bo‘yicha yoki qo‘lda yuboradi. Sayt faqat to‘g‘ri javob bera oladi.

### Zip arxiv majburiymi?

Yo‘q, bu ixtiyoriy. Arxiv uzatish hajmini kamaytiradi, lekin ochish bosqichini qo‘shadi. Kichik kataloglar uchun `zip=no` deb javob berish mumkin.

### import.xml yuklangan bo‘lsa ham, narxlar nega yangilanmayapti?

Narx va qoldiqlar alohida offers.xml’da keladi. U `import` bosqichiga yetganini va takliflar `Ид`si saytdagi tovarlar `Ид`si bilan mos kelishini tekshiring.
