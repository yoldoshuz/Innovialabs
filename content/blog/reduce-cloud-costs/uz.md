---
title: Bulut xarajatlarini qanday kamaytirish mumkin: amaliy maslahatlar
description: Bulut hisobini kamaytirishning amaliy usullari: shaffoflik uchun teglar, bekor turgan resurslarni o‘chirish, rightsizing, rezervlash, spot va xotira qoidalari.
summary: Avval teglar yordamida xarajatlarni ko‘rinadigan qiling, keyin bekor turgan resurslarni o‘chiring, instanslar hajmini haqiqiy yuklamaga moslang, barqaror yuklamani rezervlashga, uzilishi mumkin bo‘lgan ishlarni spot ga o‘tkazing va xotira uchun hayot sikli qoidalarini sozlang.
---

## Qisqa javob

Bulut xarajatlari ma’lum tartibda kamaytiriladi — oddiy va xavfsizdan majburiyat talab qiladiganiga qarab:

1. **Ko‘rinuvchanlik**: kim va nimaga sarflayotganini tushunish uchun teglar va hisobotlar.
2. **Tozalash**: ishlatilmayotgan narsalarni o‘chirish va to‘xtatish.
3. **Rightsizing**: resurslar hajmini haqiqiy yuklamaga moslash.
4. **To‘lov modeli**: doimiy yuklama uchun rezervlash, uzilishi mumkin bo‘lgan ishlar uchun spot.
5. **Xotira**: hayot sikli qoidalari va loglarni saqlash muddatlari.

Rezervlashdan boshlasangiz, keyinchalik ortiqcha bo‘lib chiqadigan resurslar uchun to‘lovni yillarga mahkamlab qo‘yishingiz mumkin.

## Ko‘rinuvchanlik: teglar

Teglarsiz hisob — bu xizmatlar ro‘yxati, «qaysi loyiha qimmatlashyapti» degan savolga javob emas. Minimal to‘plam bo‘yicha kelishib oling:

- `project` — mahsulot yoki mijoz;
- `env` — production, staging, dev;
- `owner` — jamoa yoki mas’ul shaxs.

AWS da teglarni Billing bo‘limida **cost allocation tags sifatida faollashtirish** kerak, shundan keyin Cost Explorer da xarajatlarni ular bo‘yicha guruhlash mumkin. Tegsiz resurslar — tekshiruv uchun birinchi nomzod: ko‘pincha bular unutilgan tajribalar. Qoidalarga rioya qilinishi uchun tag policies va infratuzilma kodida teglarni tekshirishdan foydalaning.

## Bekor turgan resurslarni tozalash

Kamida oyda bir marta ushbu ro‘yxatni ko‘rib chiqing:

- hech qaysi instansga ulanmagan EBS disklar;
- hech kim ishlatmayotgan eski snapshot va obrazlar;
- ishlatilmayotgan ommaviy IP-manzillar;
- maqsadli serverlari yo‘q load balancer;
- to‘xtatilgan instanslar: ular uchun soatbay to‘lanmaydi, ammo disklari hisoblanishda davom etadi;
- tunda va dam olish kunlarida ishlab turadigan test muhitlari.

Dev va staging muhitlarini **jadval bo‘yicha o‘chirish** qulay — provayder rejalashtiruvchisi yoki oddiy cron vazifasi orqali. Agar muhit haftalab kerak bo‘lmasa, uni o‘chirib, koddan qayta yaratgan ma’qul.

## Rightsizing: yuklamaga mos hajm

Instanslar ko‘pincha «zaxira bilan» tanlanadi va keyin qayta ko‘rib chiqilmaydi. Bir necha hafta davomida, eng yuqori yuklama kunlarini ham qo‘shib, CPU, xotira va tarmoq yuklamasini ko‘ring. Resurs doimiy ravishda kam yuklangan bo‘lsa, hajmini kichraytiring.

Nima yordam beradi:

- **AWS Compute Optimizer** yoki boshqa provayderlardagi o‘xshash vositalar tavsiyalari;
- dasturiy ta’minot qo‘llab-quvvatlasa, instanslarning yangi avlodlari va ARM arxitekturasiga o‘tish;
- cho‘qqi uchun doimiy yoqilgan zaxira o‘rniga **avtomasshtablash**.

## To‘lov modeli

| Model | Nima uchun mos | Nimaga e’tibor berish kerak |
|---|---|---|
| **On-demand** | Oldindan aytib bo‘lmaydigan va yangi yuklama | Eng moslashuvchan va soatiga eng qimmat |
| **Reserved / Savings Plans** | Barqaror bazaviy yuklama | Muddatli majburiyat; rightsizing dan keyin oling |
| **Spot** | CI, paketli ishlov berish, stateless-vorkerlar | Instansni qisqa ogohlantirish bilan olib qo‘yishlari mumkin |

Google Cloud va Azure da o‘xshashlari bor: committed use discounts, reservations va spot VM. Qoida bitta: yuklamaning faqat **kafolatlangan minimumini** rezervlang, cho‘qqilarni esa on-demand yoki spot bilan yoping.

## Xotira va loglar

Kamroq murojaat qilinadigan ma’lumotlarni arzonroq saqlash klasslariga o‘tkazish va muddati bo‘yicha o‘chirish kerak. S3 da buni hayot sikli qoidasi bajaradi:

```json
{
  "Rules": [
    {
      "ID": "logs-archive",
      "Filter": { "Prefix": "logs/" },
      "Status": "Enabled",
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}
```

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-bucket \
  --lifecycle-configuration file://lifecycle.json
```

Muddatlarni o‘z talablaringizga moslang. «Sovuq» klasslarda ma’lumotni chiqarib olish uchun to‘lov va minimal saqlash muddati borligini hisobga oling. Barcha log-guruhlar uchun **retention** belgilang: muddatsiz loglar — ko‘p uchraydigan yashirin xarajat.

## Ko‘p uchraydigan xatolar

- Resurslar hajmi tartibga keltirilmasdan rezervlash sotib olish.
- To‘satdan to‘xtashga chidamaydigan ishlarni spot da ishga tushirish.
- Egasini aniqlamasdan tegsiz resurslarni o‘chirish.
- Bir marta optimallashtirib, tekshiruvni takrorlamaslik.

## FAQ

### Vaqt kam bo‘lsa, nimadan boshlash kerak?

Xizmatlar bo‘yicha guruhlangan Cost Explorer hisobotidan: eng qimmat uchta qatorni toping va aynan ularni tekshiring. Parallel ravishda ulanmagan disklar, ortiqcha IP-manzillar va eski snapshotlarni o‘chiring — bu tez va xavfsiz.

### Kichik loyiha rezervlash sotib olishi kerakmi?

Faqat yuklama bir necha oydan beri barqaror bo‘lsa va majburiyat muddati davomida arxitekturaga ishonchingiz komil bo‘lsa. Yosh loyiha uchun ko‘pincha chegirmadan ko‘ra on-demand moslashuvchanligi muhimroq.

### Tejash ishonchlilikka zarar yetkazmaydimi?

Tahlilsiz qisqartirilsa — yetkazishi mumkin. Tejash uchun production dagi nosozlikka chidamlilik zaxirasini olib tashlamang va instanslarni kichraytirishdan oldin eng yuqori yuklamani tekshiring.
