---
title: Presigned URL orqali fayllarni obyekt omboriga yuklash
description: Nega fayllarni brauzerdan to‘g‘ridan-to‘g‘ri S3 bilan mos omborga yuklash yaxshiroq va havola muddati, fayl hajmi hamda CORS’ni qanday sozlash kerak.
summary: Server brauzerga qisqa muddatli imzolangan havola beradi va fayl backend’ni chetlab to‘g‘ridan-to‘g‘ri omborga ketadi; hajm va tur cheklovlari imzoda belgilanadi (yaxshisi presigned POST orqali), CORS esa faqat sizning domeningizdan yuklashga ruxsat beradi.
---

## Yondashuvning mohiyati

Klassik «brauzer → sizning serveringiz → ombor» sxemasi backend’ni har bir baytni qabul qilishga, ulanishni ochiq ushlab turishga va trafik uchun ikki marta to‘lashga majbur qiladi. **Presigned URL** — bu server o‘z kirish kalitlari bilan yaratadigan, kriptografik imzoga ega havola. Brauzer uni oladi va faylni **to‘g‘ridan-to‘g‘ri S3 bilan mos omborga** (AWS S3, Cloudflare R2, MinIO va boshqalar) yuklaydi.

Bunda kalitlar hech qachon mijozga tushmaydi: imzo bitta obyekt bilan faqat bitta amalga va faqat muddat tugaguncha ruxsat beradi.

## Nega bu proksilashdan yaxshiroq

| | Server orqali | Presigned URL |
|---|---|---|
| Backend’ga yuklama | Butun faylni qabul qiladi va uzatadi | Faqat imzo beradi |
| So‘rov tanasi cheklovlari | Proksi va platforma sozlamalariga tiralasiz | Ombor cheklovlari ishlaydi |
| Serverless | So‘rov hajmi va bajarilish vaqti cheklovlari | Hech qanday shartsiz mos keladi |
| Foydalanuvchi uchun tezlik | Ikki bosqich | Bitta, to‘g‘ridan-to‘g‘ri omborga |
| Nazorat | To‘liq, lekin qimmat | Imzo shartlari va yuklashdan keyingi tekshiruv orqali |

Proksilash faqat faylni saqlashdan oldin qayta ishlash kerak bo‘lsa (masalan, oqimdagi antivirus) yoki omborga internetdan kirib bo‘lmasa o‘zini oqlaydi.

## Jarayon qanday tuzilgan

1. Mijoz serverga fayl nomi, turi va hajmini yuboradi.
2. Server foydalanuvchi huquqlarini tekshiradi, **obyekt kalitini** o‘zi yaratadi (fayl nomiga ishonmasdan) va havolani imzolaydi.
3. Brauzer faylni havola bo‘yicha yuklaydi.
4. Mijoz muvaffaqiyatli yuklash haqida xabar beradi, server obyektni tekshiradi (`HeadObject`: hajm, tur) va shundan keyingina uni bazaga yozadi.

## Muddat va hajm: presigned POST

**Presigned PUT** uchun amal qilish muddati beriladi, lekin hajm oralig‘ini cheklab bo‘lmaydi. **Presigned POST** esa siyosatga ombor o‘zi tekshiradigan shartlarni yozish imkonini beradi: hajm oralig‘i, tur, kalit prefiksi. JavaScript uchun AWS SDK v3 misoli:

```ts
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({ region: process.env.S3_REGION });

export async function createUpload(userId: string, contentType: string) {
  const key = `uploads/${userId}/${crypto.randomUUID()}`;
  return createPresignedPost(s3, {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Conditions: [
      ["content-length-range", 1, 10 * 1024 * 1024], // 10 MB gacha
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 300, // soniya
  });
}
```

Mijozda `fields` dagi barcha maydonlar `FormData` ga qo‘shiladi, **fayl esa eng oxirida**:

```ts
const { url, fields } = await fetch("/api/upload").then((r) => r.json());
const form = new FormData();
Object.entries(fields).forEach(([k, v]) => form.append(k, v as string));
form.append("file", file);
await fetch(url, { method: "POST", body: form });
```

Muddatni qisqa qiling: havola faqat yuklash boshlanguncha kerak. S3 bilan mos provayderlarda presigned POST qo‘llab-quvvatlanishi turlicha — o‘z provayderingiz hujjatlarini tekshiring. Agar POST mavjud bo‘lmasa, PUT’dan foydalaning va hajmni yuklashdan keyin tekshirib, chegaradan oshgan obyektlarni o‘chiring.

## CORS sozlash

CORS bo‘lmasa, brauzer ombor domeniga so‘rovni bloklaydi. Faqat o‘z domenlaringiz va kerakli metodlarga ruxsat bering:

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["POST", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Agar multipart yuklashdan foydalansangiz, `ETag` `ExposeHeaders` da bo‘lishi kerak: mijoz uni har bir qism javobidan o‘qishi zarur.

## Ko‘p uchraydigan xatolar

- **Ommaviy bucket.** Imzo orqali yuklash ommaviy kirishni talab qilmaydi. Fayllarni ham imzolangan havolalar yoki CDN orqali bering.
- **Fayl nomidan olingan kalit.** Boshqa obyektlarning ustidan yozib yuborishga va belgilar bilan muammolarga olib keladi. Kalitni serverda yarating.
- Production’da **`AllowedOrigins: ["*"]`**.
- **Mijozga ishonish.** So‘rovdagi tur va hajm — shunchaki da’vo. Obyektni yuklashdan keyin tekshiring.
- **Tozalash yo‘q.** Tashlab ketilgan yuklashlar to‘planib qoladi. Vaqtinchalik prefiks va tugallanmagan multipart yuklashlar uchun lifecycle qoidasini sozlang.

## FAQ

### Juda katta fayllar bilan nima qilish kerak?

**Multipart upload**’dan foydalaning: fayl qismlarga bo‘linadi, har biriga alohida imzolangan havola beriladi, oxirida server yuklashni yakunlaydi. Aloqa uzilsa, alohida qismlarni qayta yuborish mumkin.

### Bu Cloudflare R2 yoki MinIO bilan ishlaydimi?

Ha, ular S3 API va imzolarni qo‘llab-quvvatlaydi, shuning uchun boshqa endpoint bilan o‘sha SDK ishlaydi. Qo‘llab-quvvatlanadigan amallar va shartlar to‘plami farq qiladi — provayder hujjatlarini tekshiring.

### Yuklangan maxfiy fayllarni qanday berish kerak?

Xuddi shunday: server huquqlarni tekshiradi va o‘qish uchun qisqa muddatli presigned havola (`GetObject`) yaratadi. Avatarlar kabi ommaviy resurslar uchun ombor oldida CDN qulayroq.
