---
title: Saytni DDoS hujumlaridan qanday himoya qilish mumkin
description: DDoS himoyasini tanlash: Cloudflare va scrubbing xizmatlari, hosting darajasidagi filtrlash, server IP manzilini yashirish, keshlash va hujum paytidagi reja.
summary: Saytni Cloudflare kabi trafikni filtrlovchi xizmat ortiga qo‘ying, serverning haqiqiy IP manzilini yashirib, unga faqat shu xizmatdan kirishga ruxsat bering, iloji boricha ko‘proq narsani keshlang va hujum uchun rejani oldindan tayyorlang.
---
## Qisqa javob

**DDoS** — saytni shunchalik ko‘p so‘rov yoki trafik bilan to‘ldirishki, u haqiqiy foydalanuvchilarga javob bermay qo‘yadi. Bitta server bunday yukni ko‘tara olmaydi, shuning uchun himoya bitta tamoyilga asoslanadi: **trafikni sizga yetib kelishidan oldin filtrlash**.

1. Trafikni **filtrlash xizmati** (Cloudflare yoki shunga o‘xshash) orqali o‘tkazing.
2. Serverning **haqiqiy IP manzilini yashiring** va unga filtrdan boshqa hammaning kirishini yoping.
3. Iloji boricha ko‘proq narsani **keshlang**, shunda hujum ma’lumotlar bazasiga emas, keshga uriladi.
4. Biror narsa sodir bo‘lishidan oldin **harakat rejasi** va kerakli kirish huquqlarini tayyorlab qo‘ying.

## Hujum turlari

- **L3/L4 (hajmli)** — kanal yoki tarmoq stekini to‘ldiradi: UDP-flud, SYN-flud, amplifikatsiya. nginx sozlamalari bu yerda yordam bermaydi — kanal allaqachon to‘lgan.
- **L7 (amaliy)** — oddiy HTTP so‘rovlarga o‘xshaydi: qidiruv, savat yoki kirish sahifasiga minglab murojaatlar. Har bir so‘rov server uchun qimmat, shuning uchun nisbatan kam trafik ham yetarli.

Yaxshi himoya ikkala darajani ham qamraydi.

## Himoya variantlari

| Variant | Nimani filtrlaydi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| **Cloudflare va shunga o‘xshash CDN/WAF** | L3/L4 va L7 | DNS orqali tez ulanadi, bepul tarif bor, kesh va WAF bir joyda | Butun trafik uchinchi tomon orqali o‘tadi; nozik L7 qoidalari pullik tariflarda bo‘lishi mumkin |
| **Maxsus scrubbing xizmatlari** | L3/L4 va L7 | Kuchli filtrlash, hujum paytida qo‘llab-quvvatlash, faqat HTTP emas | Qimmatroq, ulash murakkabroq |
| **Hosting yoki bulut provayderi filtrlashi** | Ko‘pincha L3/L4 | Hech narsa sozlash shart emas, ko‘pincha standart yoqilgan | L7 ga qarshi odatda kuchsiz; katta hujumda serverni tarmoqdan uzib qo‘yishlari mumkin |
| **Faqat o‘z serveringiz (nginx, firewall)** | Kichik L7 hujumlar | To‘liq nazorat | Hajmli hujum qoidalar ishlashidan oldin kanalni to‘ldiradi |

Ko‘pchilik saytlar va internet-do‘konlar uchun oqilona boshlanish — **DDoS himoyali CDN + hostingdagi bazaviy filtrlash**. Agar sayt asosiy daromad manbai bo‘lsa va to‘xtab qolish qimmatga tushsa yoki jiddiy hujumlar allaqachon bo‘lgan bo‘lsa, scrubbing xizmati mantiqli.

## Server IP manzilini yashirish

Agar hujumchi haqiqiy IP ni bilsa va filtrni chetlab o‘tib to‘g‘ridan-to‘g‘ri hujum qilsa, himoya ishlamaydi. Tekshiring:

- **Server firewall** 80/443 portlarini faqat himoya xizmatining IP diapazonlaridan qabul qiladi. Provayderlar bu ro‘yxatlarni rasman e’lon qiladi.
- Xuddi shu serverga proksisiz yo‘naltirilgan **subdomenlar yo‘q**: `mail`, `ftp`, `dev`, `cpanel`.
- **Pochta** xuddi shu IP dan yuborilmaydi: xat sarlavhalari yuboruvchi manzilini ochib beradi. Alohida pochta yuborish xizmatidan foydalaning.
- **Chiquvchi so‘rovlar** (vebhuklar, havola orqali rasm yuklash) ham IP ni oshkor qilmaydi.
- Agar IP ilgari DNS da ko‘ringan bo‘lsa, uni yozuvlar tarixidan topish mumkin. Himoyani ulagandan keyin serverning **IP manzilini almashtiring**.

To‘g‘ridan-to‘g‘ri so‘rovlar baribir serverga yetib kelsa, nginx uchun misol:

```nginx
# faqat himoya xizmati diapazonlariga ruxsat (misol, ro‘yxatni provayderdan oling)
allow 173.245.48.0/20;
allow 103.21.244.0/22;
deny all;
```

Buni firewall yoki bulutdagi security group darajasida qilish ishonchliroq — paketlar nginx ga yetmasdanoq tashlab yuboriladi.

## Keshlash himoya sifatida

Tarmoq chetidagi keshdan qancha ko‘p javob berilsa, ilovaga shuncha kam so‘rov yetib keladi:

- Statik fayllarni (JS, CSS, rasmlar) uzoq muddatga keshlang.
- Hamma uchun bir xil sahifalarni (bosh sahifa, maqolalar, katalog) hech bo‘lmasa qisqa muddatga keshlang — bir necha soniyalik kesh ham yuklama keskin oshganda uni sezilarli kamaytiradi.
- Qimmat endpointlarni (qidiruv, filtrlar, kirish, API) **so‘rovlar limiti** va bot tekshiruvi bilan himoyalang.

## Hujum boshlanganda nima qilish kerak

1. **Bu hujum ekaniga ishonch hosil qiling**, nosozlik yoki reklama kampaniyasi emas: loglar, trafik grafiklari va so‘rov manbalarini ko‘ring.
2. Himoya xizmatida **kuchaytirilgan rejimni yoqing** (Cloudflare da — Under Attack Mode): tashrif buyuruvchilar brauzer tekshiruvidan o‘tadi.
3. **Qoidalar qo‘shing**: hujum qilinayotgan URL larga limitlar, so‘rov belgilari bo‘yicha bloklash (User-Agent, yo‘l, parametrlar), mamlakat yoki tarmoq bo‘yicha vaqtinchalik cheklovlar — ehtiyotkorlik bilan, o‘z mijozlaringizni uzib qo‘ymaslik uchun.
4. Himoya va hosting **provayderlariga yozing**, boshlanish vaqti va so‘rov namunalarini ilova qiling.
5. **Trafik filtrni chetlab o‘tayotganini tekshiring.** Agar shunday bo‘lsa — IP oshkor bo‘lgan, uni almashtirish kerak.
6. **Hujumdan keyin** loglarni saqlang, nima ish berganini tahlil qiling va foydali qoidalarni doimiy qiling.

Oldindan tayyorlang: DNS va himoya paneliga kamida ikki kishining kirishi, qo‘llab-quvvatlash kontaktlari, oddiy texnik ishlar sahifasi.

## Ko‘p uchraydigan xatolar

- Cloudflare ulangan, lekin server hamon butun internet uchun ochiq.
- Kesh «har ehtimolga qarshi» o‘chirilgan va har bir so‘rov bazaga boradi.
- DNS ga faqat bitta xodimning kirishi bor, u esa ta’tilda.
- Tahlilsiz butun mamlakatlarni bloklash — hujum bilan birga mijozlar ham ketadi.

## FAQ

### Cloudflare ning bepul tarifi yetarlimi?

Ko‘plab kichik saytlar uchun — ha: hajmli hujumlardan bazaviy himoya bepul tarifda ham bor. Nozik L7 qoidalari, kengaytirilgan WAF va ustuvor qo‘llab-quvvatlash uchun odatda pullik tarif kerak.

### Faqat nginx sozlamalari bilan himoyalanish mumkinmi?

Faqat kichik amaliy hujumlardan. Hajmli hujum serverga boradigan kanalni to‘ldiradi va nginx uni umuman ko‘rmaydi. nginx limitlari yagona himoya emas, balki foydali ikkinchi qatlam.

### Hali hujum bo‘lmagan bo‘lsa, biror narsa qilish kerakmi?

Ha. Filtrlashni ulash, IP ni yashirish va keshni sozlash sayt allaqachon ochilmay qolgan hujum paytidan ko‘ra oldindan qilinsa, ancha oson.
