---
title: Marketingda kogort tahlili: ushlab qolish va LTV’ni qanday o‘lchash
description: Jalb qilish kogortalarini tuzish, ushlab qolish jadvalini o‘qish, kanallarni kogort LTV bo‘yicha solishtirish va natijalardan byudjet uchun foydalanish.
summary: Kogort tahlili mijozlarni birinchi xarid oyi va jalb qilish kanali bo‘yicha guruhlaydi hamda vaqt o‘tishi bilan ulardan qanchasi qaytishini va qancha pul keltirishini ko‘rsatadi. Kanallarni bir xil gorizontdagi kogort LTV bo‘yicha jalb qilish narxi bilan solishtirish byudjetni qayerga yo‘naltirish foydaliroq ekanini ko‘rsatadi.
---

## Kogortalar nega kerak

Umumiy metrikalar barcha mijozlarni aralashtirib yuboradi. Tushum o‘sayotgan bo‘lsa, yangi mijozlar ko‘proq xarid qilyaptimi yoki eskilari yaxshiroq qaytyaptimi — tushunarsiz. **Kogorta** — bir davrda umumiy hodisa bilan birlashgan mijozlar guruhi, ko‘pincha **bir oyda birinchi xarid yoki ro‘yxatdan o‘tish**. Har bir kogortani alohida kuzatib, quyidagilarni ko‘rasiz:

- mijozlar qanchalik tez «tushib qoladi»;
- mahsulotdagi o‘zgarishlardan keyin yangi kogortalarda ushlab qolish yaxshilanyaptimi;
- qaysi kanallar uzoqroq qoladigan va to‘laydigan mijozlarni olib keladi.

## Jalb qilish kogortalarini qanday tuzish

Uchta maydonli buyurtmalar (yoki faollik hodisalari) jadvali kerak: mijoz ID’si, sana, summa. Shuningdek mijozning jalb qilish kanali — odatda birinchi teginish yoki birinchi buyurtma bo‘yicha.

1. Har bir mijoz uchun **birinchi xarid sanasini** toping — bu kogorta oyi.
2. Har bir buyurtma uchun birinchi xariddan beri **davr raqamini** hisoblang: 0, 1, 2-oy…
3. Kogorta va davr raqami bo‘yicha guruhlang: faol mijozlar soni va tushum.

```sql
WITH first_order AS (
  SELECT customer_id, DATE_TRUNC(MIN(order_date), MONTH) AS cohort_month
  FROM orders
  GROUP BY customer_id
)
SELECT
  f.cohort_month,
  DATE_DIFF(DATE_TRUNC(o.order_date, MONTH), f.cohort_month, MONTH) AS month_n,
  COUNT(DISTINCT o.customer_id) AS active_customers,
  SUM(o.revenue) AS revenue
FROM orders o
JOIN first_order f USING (customer_id)
GROUP BY 1, 2
ORDER BY 1, 2;
```

Sintaksis BigQuery uchun berilgan; boshqa MBBTlarda sana funksiyalari boshqacha nomlanadi. Kanallarni solishtirish uchun kanalni `first_order` ga va guruhlashga qo‘shing.

## Ushlab qolish jadvalini qanday o‘qish

Qatorlar — kogortalar, ustunlar — birinchi xariddan beri o‘tgan oylar, kataklar — kogortaning shu oyda xarid qilgan ulushi. Shartli misol:

| Kogorta | Mijozlar | M0 | M1 | M2 | M3 |
|---|---|---|---|---|---|
| Yanvar | 400 | 100% | 22% | 15% | 12% |
| Fevral | 450 | 100% | 25% | 17% | — |
| Mart | 380 | 100% | 30% | — | — |

Raqamlar shartli, faqat tushuntirish uchun. Jadval uch yo‘nalishda o‘qiladi:

- **Qator bo‘yicha** — bitta kogortaning hayot sikli: eng kuchli tushish qayerda va egri chiziq plato’ga chiqadimi. Plato mahsulotda doimiy mijozlar yadrosi borligini bildiradi.
- **Ustun bo‘yicha** — kogortalarni bir xil yoshda solishtirish. Agar M1 kogortadan kogortaga o‘ssa, o‘zgarishlar ishlayapti.
- **Diagonal bo‘yicha** — kalendar hodisalari: chegirmali savdo yoki nosozlik bir kalendar oyida barcha kogortalarga ta’sir qiladi.

## Kogort LTV va kanallarni solishtirish

N gorizontdagi **kogort LTV** — kogortaning N-oygacha jamlangan tushumi (yaxshisi — **yalpi marja**), kogortadagi mijozlar soniga bo‘lingan. Kanallarni faqat **bir xil gorizontda** to‘g‘ri solishtirish mumkin: 3 oylik LTV’ni 3 oylik LTV bilan.

Keyin uni shu kanal bo‘yicha **CAC** (mijozni jalb qilish narxi) bilan taqqoslang:

| Metrika | Nimani ko‘rsatadi |
|---|---|
| LTV(N) / CAC | kanal N-oyga kelib o‘zini oqladimi |
| Qoplash muddati | jamlangan marja qaysi oyda CAC ga yetib oldi |
| LTV egri chizig‘i shakli | birinchi xariddan keyin tushum o‘sadimi yoki kanal «bir martalik» mijozlar beradimi |

Odatiy manzara: arzon kanal takroriy talabi past mijozlarni, qimmat kanal esa qaytib keladiganlarni olib keladi. Birinchi xarid bo‘yicha birinchisi, kogort LTV bo‘yicha ikkinchisi yutadi.

## Byudjet uchun qanday foydalanish

- **Byudjetni** pul oqimingiz ko‘tara oladigan gorizontda LTV/CAC nisbati eng yaxshi bo‘lgan kanallarga **qayta taqsimlang**.
- Kanallar uchun kutilgan LTV orqali **maqsadli CAC belgilang**: kerakli oyga kelib o‘zini oqlashi uchun mijozga qancha to‘lash mumkin.
- **Yangi kogortalarni kuzating**: agar yangi kogortalarning ushlab qolinishi tushsa, byudjetni oshirish faqat yo‘qotishlarni tezlashtiradi.
- Yosh kogortalar uchun eski kogortalar egri chiziqlari asosida **LTV prognozidan** foydalaning, lekin ma’lumot to‘plangan sari uni qayta tekshiring.

## Ko‘p uchraydigan xatolar

- **To‘liq bo‘lmagan kogortalar**: mart kogortasida hali M3 yo‘q — uning «yakuniy» LTV’sini yanvarniki bilan solishtirmang.
- **Marja o‘rniga tushum**: chegirma izlovchi mijozlar ko‘p kanal aslidagidan yaxshiroq ko‘rinadi.
- **Kichik kogortalar**: o‘nlab mijozlarda foizlar tasodifan sakraydi. Davrni kattalashtiring yoki kanallarni birlashtiring.
- **Takroriy mijozlarni aralashtirish**: kogorta faqat yangi mijozlardan iborat bo‘lishi kerak.

## FAQ

### Kogorta davrini qanday tanlash — hafta yoki oy?

Xaridlar chastotasiga bog‘liq. Har kuni ishlatiladigan ilova va servislar uchun haftalar, e-commerce va B2B uchun oylar mos. Asosiysi, barqaror foizlar uchun kogortada yetarlicha mijoz bo‘lsin.

### Kogort tahlilini dasturchisiz qayerda qilish mumkin?

GA4 tadqiqotlarida «Kogort tahlili» hisoboti bor, ko‘plab CRM’larda esa o‘rnatilgan kogort hisobotlari mavjud. Marja va kanallar bilan LTV uchun odatda buyurtmalarni jadval yoki BI’ga eksport qilish kerak.

### Mijozni jalb qilish kanali deb nimani hisoblash kerak?

Ko‘pincha — birinchi buyurtma yoki birinchi teginish manbai. Bitta qoidani tanlab, uni barcha kogortalarga qo‘llash muhim, aks holda kanallarni solishtirish ma’nosini yo‘qotadi.
