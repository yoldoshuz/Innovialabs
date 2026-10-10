---
title: AWS bepul darajasi: nima bepul va ortiqcha to‘lovdan qanday qochish
description: AWS Free Tier aslida nimani qamrab oladi, qaysi xizmatlar sezdirmasdan pul yechadi va birinchi kundanoq byudjet hamda ogohlantirishlarni qanday sozlash kerak.
summary: AWS Free Tier butun akkauntni emas, faqat ayrim xizmatlarning cheklangan hajmini qamrab oladi: limitdan oshgan hamma narsa va ko‘plab yordamchi resurslar pullik. Himoya oddiy — birinchi kundanoq ogohlantirishli byudjet va Billing bo‘limini muntazam tekshirish.
---

## Bepul daraja aslida nima

**AWS Free Tier** — bu bepul akkaunt emas, balki aniq xizmatlar uchun belgilangan limitlar to‘plami. Agar resurs dasturga kirmasa yoki limitdan oshib ketsangiz, oddiy tarif bo‘yicha hisoblanadi va pul bog‘langan kartadan yechiladi.

Takliflar bir necha turda bo‘ladi:

- **Always Free** — ayrim xizmatlar uchun doimiy oylik limitlar (masalan, Lambda chaqiruvlarining ma’lum soni yoki DynamoDB hajmi). Limit doirasida qolsangiz, amal qiladi.
- **Sinov muddatlari** — xizmatni birinchi marta ishga tushirgandan keyin cheklangan muddat bepul foydalanish.
- **Kreditlar va boshlang‘ich rejalar** — yangi akkauntlar uchun shartlar o‘zgargan: yangi akkauntlar boshlang‘ich kredit oladi va bepul yoki pullik rejani tanlaydi, eskiroq akkauntlarda esa ro‘yxatdan o‘tgandan keyin 12 oy amal qiladigan takliflar bor.

Limit va muddatlar o‘zgarib turadi, shuning uchun ishga tushirishdan oldin rasmiy [AWS Free Tier](https://aws.amazon.com/free/) sahifasini tekshiring.

## Nimalar sezdirmasdan hisobga aylanadi

Ko‘pincha pul asosiy serverga emas, uning atrofidagi narsalarga ketadi:

| Resurs | Nega pullik |
|---|---|
| **Ommaviy IPv4-manzillar** | AWS ommaviy IPv4-manzillar uchun soatbay haq oladi, ishlatilmayotgan Elastic IP uchun ham |
| **NAT Gateway** | Soatbay to‘lov va har bir qayta ishlangan gigabayt uchun to‘lov |
| **Load Balancer** | Trafik deyarli bo‘lmasa ham soatbay to‘lov |
| **EBS disklar va snapshotlar** | Instans o‘chirilgandan keyin ham qoladi va hisoblanadi |
| **Chiquvchi trafik** | Bepul hajmdan ortiq internetga ma’lumot uzatish |
| **RDS** | Multi-AZ, katta instans klasslari va limitdan ortiq xotira |
| **CloudWatch Logs** | Muddatsiz saqlanadigan loglar oyma-oy o‘sib boradi |
| **Secrets Manager, KMS, Route 53** | Har bir sir, kalit yoki hosted zone uchun oylik to‘lov |

Yana bir tuzoq — **boshqa regionlar**. Adashib boshqa regionda yaratilgan resursni konsolni ko‘zdan kechirganda payqamaslik oson.

## Birinchi kundan himoya: qadamma-qadam

1. **Root-akkauntni himoyalang.** MFA ni yoqing va kundalik ishni root ostida qilmang: IAM Identity Center yoki IAM orqali foydalanuvchi yarating.
2. **Free Tier ogohlantirishlarini yoqing.** Billing → Billing preferences bo‘limida limitga yaqinlashganda xat olishni belgilang.
3. **AWS Budgets da byudjet yarating.** Tayyor **Zero spend budget** shabloni birinchi xarajat paydo bo‘lishi bilan xat yuboradi. Ishchi loyihalar uchun haqiqiy va prognoz xarajatlar bo‘yicha chegaralari bor oylik byudjet yarating.
4. **Cost Anomaly Detection ni yoqing.** U xarajatlarni odatiy darajangiz bilan solishtiradi va keskin o‘sishlar haqida xabar beradi.
5. **Haftada bir marta Cost Explorer ni oching** va xarajatlarni xizmat hamda region bo‘yicha guruhlang.

Byudjetni buyruqlar qatoridan ham yaratish mumkin:

```bash
aws budgets create-budget \
  --account-id 111122223333 \
  --budget '{"BudgetName":"monthly-limit","BudgetLimit":{"Amount":"10","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"you@example.com"}]}]'
```

Summa va manzilni o‘zingiznikiga almashtiring. Muhim: **byudjet ogohlantiradi, lekin resurslarni o‘chirmaydi**. Avtomatik javob uchun Budget actions ni sozlang — masalan, cheklovchi IAM-siyosatni qo‘llash yoki tanlangan EC2 va RDS instanslarini to‘xtatish.

## Ko‘p uchraydigan xatolar

- «Sekin ishlamasin» deb kattaroq instans ishga tushirish — u bepul takliflarga kirmasligi mumkin.
- Instansni o‘chirib, diski, snapshotlari va Elastic IP ni qoldirib ketish.
- Loglarni saqlash muddatisiz qoldirish.
- Ommaviy subnet yetarli bo‘lgan o‘quv loyihasiga NAT Gateway qo‘shish.
- Xarajatlarni oyda bir marta, hisob allaqachon shakllanganda tekshirish.

## FAQ

### Bepul limit tugaganda AWS pul yechishni to‘xtatadimi?

Pullik rejada — yo‘q: limitdan oshgan hamma narsa shunchaki hisoblanadi. Yangi akkauntlarning bepul rejasida o‘zingiz pullik rejaga o‘tmaguningizcha pul yechilmaydi, ammo o‘tgandan keyin odatiy qoidalar amal qiladi. Shuning uchun byudjet va ogohlantirishlar har qanday holatda kerak.

### Barcha regionlardagi unutilgan resurslarni qanday topish mumkin?

AWS Resource Explorer yoki Tag Editor dan foydalaning — ular resurslarni barcha regionlar bo‘yicha ko‘rsatadi. Qo‘shimcha ravishda Cost Explorer da xarajatlarni region bo‘yicha guruhlang: kutilmagan joyda xarajat chiqsa, resurs aynan o‘sha yerda.

### AWS ni umuman xarajat xavfisiz o‘rganish mumkinmi?

Xavfni deyarli nolga tushirish mumkin: Zero spend budget shabloni, MFA, har bir tajribadan keyin resurslarni darhol o‘chirish hamda snapshot, disk va IP-manzillarni tekshirish. Bir martalik tajribalar uchun infratuzilmani kod sifatida yozish qulay — hammasini bitta buyruq bilan o‘chirish mumkin bo‘ladi.
