---
title: Webflow CMS: blog yoki katalogni qanday qilish mumkin
description: Webflow CMS bosqichma-bosqich: kolleksiya va maydonlar, yozuv shabloni va ro‘yxatlar, filtrlash, bog‘lovchi maydonlar, tarif cheklovlari va muharrirlar.
summary: Webflow’da blog yoki katalog shunday yig‘iladi: maydonlarga ega kolleksiya yaratasiz, yozuvning shablon sahifasini bezaysiz va yozuvlarni saralash hamda filtrlarga ega Collection List orqali kerakli sahifalarga chiqarasiz.
---
## Qisqa javob

Webflow CMS oddiy sxema bo‘yicha ishlaydi:

1. **Kolleksiya** — kontent turi: maqolalar, mahsulotlar, keyslar.
2. **Maydonlar** — har bir yozuv nimadan iborat: sarlavha, muqova, matn, narx.
3. **Shablon sahifa** — bitta maket, Webflow u bo‘yicha har bir yozuv uchun sahifa yaratadi.
4. **Collection List** — yozuvlarni istalgan sahifada chiqaradigan blok: blog lentasi, bosh sahifa, katalog.

Dizaynni bir marta qilasiz, keyin kontent-menejer shunchaki yozuv qo‘shadi.

## 1-qadam. Tuzilmani loyihalang

Kolleksiyalarni yaratishdan oldin qanday mohiyatlar borligi va ular qanday bog‘langanini qog‘ozga yozib chiqing. Blog uchun odatiy to‘plam:

- **Maqolalar** — sarlavha, slug, muqova, qisqa tavsif, matn, sana, muallif, kategoriya.
- **Kategoriyalar** — nomi, slug, tavsif.
- **Mualliflar** — ism, rasm, lavozim.

Katalog uchun: **Mahsulotlar**, **Kategoriyalar**, ba’zan **Brendlar**. Takrorlanadigan va o‘z sahifasiga ega bo‘lishi mumkin bo‘lgan hamma narsani alohida kolleksiyaga chiqaring. Yozuvlar ko‘payganda bu qayta ishlashdan qutqaradi.

## 2-qadam. Kolleksiya va maydonlarni yarating

CMS panelida yangi kolleksiya yarating, birlik va ko‘plikdagi nomini hamda asosiy manzilni (masalan, `/blog`) belgilang. **Name** va **Slug** maydonlari avtomatik yaratiladi.

Asosiy maydon turlari:

| Maydon turi | Nima uchun |
|---|---|
| Plain text | Sarlavhalar, qisqa izohlar |
| Rich text | Formatlash va rasmlarga ega maqola matni |
| Image, Multi-image | Muqova, mahsulot galereyasi |
| Number, Date | Narx, e’lon sanasi |
| Switch | «Tanlangan» yoki «Mavjud emas» kabi belgilar |
| Option | Qat’iy ro‘yxatdan tanlash |
| Reference, Multi-reference | Boshqa kolleksiya yozuvlari bilan bog‘lanish |

Majburiy maydonlarni required deb belgilang va yordamchi matn (help text) qo‘shing — bu muharrirlar xatolarini ancha kamaytiradi.

## 3-qadam. Yozuv shablonini bezang

Har bir kolleksiyada **Collection Template Page** bor. Uni oddiy sahifa kabi maketlang, so‘ng elementlarni maydonlarga bog‘lang: sarlavhani Name’ga, rasmni muqovaga, Rich text blokini maqola matniga. Bu element sozlamalarida kolleksiya maydoniga ulash orqali qilinadi.

Shablonning SEO sozlamalarini unutmang: title va description’ni ham yozuv maydonlaridan, masalan sarlavha va qisqa tavsifdan yig‘ish mumkin.

## 4-qadam. Yozuvlarni Collection List orqali chiqaring

Sahifaga **Collection List** elementini qo‘shing, kolleksiyani tanlang va bitta kartochkani bezang — qolganlari avtomatik takrorlanadi. Ro‘yxat sozlamalarida quyidagilar bor:

- sana, nom yoki istalgan maydon bo‘yicha **saralash**;
- **limit** va siljish — masalan, bosh sahifada oxirgi uchta maqolani ko‘rsatish;
- uzun lentalar uchun **sahifalash**;
- qaysi yozuvlar ko‘rinishini belgilaydigan **filtrlar**.

## Filtrlash va bog‘lovchi maydonlar

Collection List filtrlari muharrirda beriladi: «Tanlangan yoqilgan», «Kategoriya X ga teng», «Sana hozirgidan keyin». Shablon sahifada **joriy yozuv** bo‘yicha filtrni tanlash mumkin — «Shu kategoriyadagi boshqa maqolalar» yoki «O‘xshash mahsulotlar» bloklari shunday quriladi.

**Reference** maydoni yozuvni boshqa kolleksiyaning bitta yozuvi bilan bog‘laydi (maqola → muallif), **Multi-reference** — bir nechtasi bilan (mahsulot → bir nechta teg). Bog‘lanishlar tufayli kategoriyaning maqolalar ro‘yxatiga ega o‘z sahifasi paydo bo‘ladi, ro‘yxat ichida esa bog‘langan yozuv ma’lumotlarini — muallif ismi, kategoriya nomini chiqarish mumkin.

Muhim: bunday filtrlarni dizayner sozlaydi, sayt tashrif buyuruvchisi ularni o‘zgartira olmaydi. Interaktiv katalog filtrlari (tugmalar, qidiruv, jonli saralash) o‘z kodingiz yoki uchinchi tomon kutubxonalari orqali qilinadi.

## Tarif cheklovlari

CMS’ning **sayt tarifiga** bog‘liq cheklovlari bor: yozuvlarning umumiy soni, kolleksiyalar soni, kolleksiyadagi maydonlar, shuningdek bitta ro‘yxatdagi yozuvlar va ichma-ich ro‘yxatlar soni. Raqamlar vaqti-vaqti bilan o‘zgaradi, shuning uchun ishni boshlashdan oldin rasmiy hujjatlarda tekshiring — ayniqsa katalog minglab pozitsiyalarga o‘sadigan bo‘lsa.

## Kontent-menejerlar uchun kirish

Muharrirlarga dizaynga kirish kerak emas. Webflow’da ular uchun cheklangan rollar bor: CMS yozuvlari va sahifalardagi matnlarni qo‘shish va tahrirlash, qoralama saqlash va e’lonni rejalashtirish mumkin, lekin maket va stillarni buzib bo‘lmaydi. Muharrirlar o‘rinlari soni tarifga bog‘liq.

Yozuvlarni **CSV**’dan import qilish mumkin, tashqi tizimlar bilan sinxronlash uchun esa **CMS API** bor.

## Ko‘p uchraydigan xatolar

- Alohida maydonlar o‘rniga hamma narsani bitta Rich text maydoniga joylash — keyin filtr va kartochkalar qilib bo‘lmaydi.
- Kategoriyani Reference emas, matn sifatida saqlash — imlo xatolari kategoriyalarni bo‘lib yuboradi.
- Shablonda alt-matnlar va SEO maydonlarini bermaslik.
- Katalogni to‘ldirishdan oldin tarif cheklovlarini tekshirmaslik.

## FAQ

### Webflow’da tashrif buyuruvchilar uchun qidiruv va filtrlar qilsa bo‘ladimi?

O‘rnatilgan sayt qidiruvi bor. Interaktiv katalog filtrlari standart tarzda sozlanmaydi, ular Collection List ustidan o‘z kodingiz yoki uchinchi tomon kutubxonalari bilan qo‘shiladi.

### Maqolalarni boshqa CMS’dan Webflow’ga qanday ko‘chirish mumkin?

Yozuvlarni kolleksiya maydonlariga mos ustunli CSV’ga eksport qiling va import qiling. Katta hajm yoki muntazam sinxronlash uchun CMS API’dan foydalaning.

### Kolleksiyada nechta yozuv bo‘lishi mumkin?

Bu sayt tarifiga bog‘liq va vaqti-vaqti bilan o‘zgaradi. Amaldagi cheklovlar Webflow tariflar sahifasi va hujjatlarida ko‘rsatilgan.
