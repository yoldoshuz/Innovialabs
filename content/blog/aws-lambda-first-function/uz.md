---
title: Birinchi AWS Lambda funksiyasini qanday yaratish mumkin
description: AWS Lambda funksiyasini yaratamiz, HTTP orqali ochamiz, huquqlarni sozlaymiz, loglarni o‘qiymiz va chaqiruvlar uchun to‘lov qanday hisoblanishini ko‘ramiz.
summary: Lambda konsolida funksiya yarating, Function URL ni yoqing yoki API Gateway ulang, rolga faqat kerakli huquqlarni bering va loglarni CloudWatch da kuzating. To‘lov chaqiruvlar soni va ajratilgan xotirani hisobga olgan ishlash vaqti uchun olinadi.
---

## Qisqasi: to‘rt qadam

**AWS Lambda** kodingizni hodisa bo‘yicha ishga tushiradi — HTTP-so‘rov, S3 dagi fayl, navbatdagi xabar — va boshqarish kerak bo‘lgan server yo‘q. Ishlaydigan HTTP-endpointgacha eng qisqa yo‘l:

1. Funksiya yaratish va handler yozish.
2. Uni **Function URL** yoki **API Gateway** orqali HTTP da ochish.
3. Huquqlarni tekshirish: funksiya nima qila oladi va uni kim chaqira oladi.
4. Loglarni **CloudWatch Logs** da topish.

## 1-qadam. Funksiya yaratamiz

Konsolda Lambda → **Create function** → Author from scratch ni oching. Nom bering, masalan `hello-fn`, Node.js muhitini va arxitekturani tanlang. Konsol loglarni yozish uchun asosiy huquqlarga ega **execution role** ni o‘zi yaratadi.

`index.mjs` faylidagi kodni almashtiring:

```javascript
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? "world";
  console.log("request", { name });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
```

**Deploy** ni bosing, so‘ng **Test** bo‘limida test hodisasini yaratib, ishga tushiring. Natijada javob, davomiylik va ishlatilgan xotira ko‘rinadi — aynan shu qiymatlar narxga ta’sir qiladi.

Configuration → General sozlamalariga ham e’tibor bering: standart **timeout** qisqa, **xotira** esa protsessor quvvatini ham belgilaydi.

## 2-qadam. HTTP-endpoint

Ikki asosiy variant bor:

| | Function URL | API Gateway (HTTP API) |
|---|---|---|
| Sozlash | Funksiya sozlamalarida bir-ikki klik | Alohida xizmat, marshrutlar va stage lar |
| Marshrutlar | Har bir funksiyaga bitta manzil | Turli funksiyalarga ko‘plab yo‘l va metodlar |
| Himoya | `NONE` yoki `AWS_IAM`, CORS | Avtorizatorlar, JWT, so‘rovlar chastotasini cheklash |
| O‘z domeningiz | CloudFront orqali | O‘rnatilgan qo‘llab-quvvatlash |
| To‘lov | Faqat Lambda | Lambda va API Gateway so‘rovlari uchun to‘lov |

Birinchi funksiya uchun Function URL yetarli: Configuration → Function URL → Create. `NONE` avtorizatsiya turi manzilni ommaviy qiladi — uni bilgan har kim funksiyani sizning hisobingizdan chaqira oladi. O‘quv loyihasi uchun bu maqbul, ishchi loyiha uchun esa `AWS_IAM` yoki avtorizatsiyali API Gateway yaxshiroq.

Tekshirish:

```bash
curl "https://<your-id>.lambda-url.<region>.on.aws/?name=Tashkent"
```

## 3-qadam. Huquqlar

Lambda da huquqlarning ikki xil tomoni bor:

- **Execution role** — funksiyaning o‘zi nima qila oladi. Agar u S3 dan fayl o‘qisa, rolga to‘liq kirish emas, faqat kerakli bucket va amal uchun siyosat qo‘shing.
- **Resource-based policy** — funksiyani kim chaqira oladi. `NONE` turidagi Function URL yaratilganda konsol ommaviy chaqiruv uchun ruxsat qo‘shadi.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/uploads/*"
    }
  ]
}
```

**Minimal imtiyozlar** tamoyili shunchaki rasmiyat emas: kalit sizib chiqsa yoki kodda xato bo‘lsa, faqat rol kira oladigan narsalar zarar ko‘radi.

## 4-qadam. Loglar

Funksiya `console.log` orqali yozgan hamma narsa hamda START, END va REPORT xizmat qatorlari `/aws/lambda/hello-fn` log-guruhiga tushadi. REPORT qatori davomiylik, hisoblangan vaqt va eng yuqori xotirani ko‘rsatadi.

```bash
aws logs tail /aws/lambda/hello-fn --follow
```

Log-guruh uchun darhol **saqlash muddatini** belgilang: standart holatda loglar muddatsiz saqlanadi, saqlash esa bepul emas.

## To‘lov qanday hisoblanadi

Lambda hisobi ikki qismdan iborat:

- **So‘rovlar** — funksiyaning har bir ishga tushishi.
- **Davomiylik** — bajarilish vaqti ajratilgan xotiraga ko‘paytiriladi (gigabayt-soniyalar).

Lambda da so‘rovlar va hisoblash uchun doimiy bepul oylik limit bor; joriy qiymatlarni [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/) sahifasida tekshiring. API Gateway, loglarni saqlash va chiquvchi trafik alohida to‘lanadi.

Amaliy xulosalar: xotirani keraksiz oshirmang, lekin juda kamaytirib ham yubormang — ba’zan ko‘proq xotira bilan funksiya shunchalik tez ishlaydiki, umumiy summa oshmaydi. arm64 arxitekturasi odatda bir gigabayt-soniya uchun arzonroq. So‘rovlar oqimidan zararni cheklash uchun **reserved concurrency** belgilang.

## FAQ

### Function URL yoki API Gateway — qaysi birini tanlash kerak?

Bitta endpoint, webhook yoki prototip uchun Function URL yetarli. Bir nechta marshrut, token orqali avtorizatsiya, so‘rovlar chastotasini cheklash yoki qo‘shimcha xizmatlarsiz o‘z domeningiz kerak bo‘lsa, API Gateway ni tanlang.

### Sovuq start nima va u xalaqit beradimi?

Birinchi chaqiruvda yoki bekor turishdan keyin Lambda yangi bajarilish muhitini ko‘taradi va javob kechikib keladi. Webhook va fon vazifalari uchun bu odatda sezilmaydi; kechikishga sezgir API lar uchun yengil bog‘liqliklar va provisioned concurrency yordam beradi.

### Ommaviy manzil tufayli katta hisob olmaslik uchun nima qilish kerak?

`AWS_IAM` avtorizatsiyasi yoki chastota cheklovli API Gateway dan foydalaning, reserved concurrency belgilang va AWS Budgets da ogohlantirishli byudjet sozlang.
