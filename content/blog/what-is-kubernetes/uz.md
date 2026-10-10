---
title: Kubernetes nima va u loyihaga qachon haqiqatan kerak
description: Kubernetes oddiy tilda: orkestratsiya nima, control plane va nodalar, u nimalarni avtomatlashtiradi va kichik loyiha qachon usiz ishlagani ma’qul.
summary: Kubernetes — konteynerlarni serverlar guruhida o‘zi ishga tushiradigan, qayta ishga tushiradigan, masshtablaydigan va yangilaydigan tizim. U ko‘p servislar, bir nechta server va uzluksiz ishlash talablari bo‘lganda o‘zini oqlaydi; kichik loyihaga odatda Docker Compose yoki PaaS yetarli.
---
## Kubernetes qisqacha

**Kubernetes** (K8s) — bu **konteynerlarni orkestratsiya qilish** platformasi. Siz kerakli holatni tasvirlaysiz: «API’ning uchta nusxasini ishga tushir, ularni shu manzilda och, shuncha xotira ajrat». Kubernetes doimiy ravishda haqiqiy holatni tavsif bilan solishtiradi va farqlarni tuzatadi: tushib qolgan konteynerlarni qayta ishga tushiradi, ishdan chiqqan serverdan ko‘chiradi, yangi versiyalarni joriy qiladi.

Docker «bitta konteynerni qanday qadoqlash va ishga tushirish» degan savolga javob beradi. Kubernetes esa «o‘nlab serverlardagi yuzlab konteynerlarni qo‘lda aralashuvsiz ishlashi uchun qanday boshqarish» degan savolga.

## Klaster nimalardan iborat

Kubernetes klasteri ikki qismdan iborat.

**Control plane** — klasterning «miyasi»:

- **API server** — yagona kirish nuqtasi. Barcha buyruqlar (`kubectl`, CI/CD, panellar) u orqali o‘tadi.
- **etcd** — klaster holati ombori: nima va qayerda ishlashi kerak.
- **Scheduler** — bo‘sh resurslarga qarab yangi konteynerni qaysi nodada ishga tushirishni hal qiladi.
- **Controller manager** — haqiqiy holatni kerakli holatga keltiradigan kontrollerlar to‘plami.

**Nodalar (worker nodes)** — ilovalar ishlaydigan serverlar:

- **kubelet** — nodadagi agent, control plane ko‘rsatmasi bo‘yicha konteynerlarni ishga tushiradi.
- **container runtime** — konteynerlarni bevosita ishga tushiradigan muhit (masalan, containerd).
- **kube-proxy** — servislarga tarmoq marshrutizatsiyasi uchun javob beradi.

Bulut provayderlarining boshqariladigan (managed) servislarida control plane’ni provayder boshqaradi, siz esa faqat nodalar va o‘z ilovalaringiz bilan ishlaysiz.

## Kubernetes nimalarni avtomatlashtiradi

- **O‘zini tiklash.** Konteyner tushdi — qayta ishga tushiriladi. Noda ishdan chiqdi — podlar boshqa nodalarga ko‘chadi.
- **Masshtablash.** Nusxalar soni bitta buyruq bilan yoki yuklamaga qarab avtomatik o‘zgaradi.
- **To‘xtovsiz yangilanishlar.** Rolling update eski nusxalarni asta-sekin yangilari bilan almashtiradi va orqaga qaytara oladi.
- **Service discovery va balanslash.** Servislar bir-birini nom orqali topadi, trafik nusxalar o‘rtasida taqsimlanadi.
- **Konfiguratsiya va maxfiy ma’lumotlar.** Sozlamalar va parollar obrazdan alohida saqlanadi.
- **Deklarativlik.** Butun infratuzilma Git’da saqlanadigan va ko‘rib chiqiladigan YAML fayllarda tasvirlanadi.

## Kubernetes qachon kerak emas

Kubernetes haqiqiy muammolarni hal qiladi, lekin o‘zi murakkab. U bilim, qo‘llab-quvvatlash uchun vaqt, monitoring va klasterni yangilashni talab qiladi. Loyihaga hozircha kerak emasligining halol belgilari:

- ilova **bir-ikki serverda** ishlaydi va bu yetarli;
- servislar **kam** va kamdan-kam o‘zgaradi;
- jamoada klaster bilan shug‘ullanishga **tayyor odam yo‘q**;
- deploy paytida qisqa to‘xtash **qabul qilinadi**;
- loyiha **MVP** bosqichida va asosiy vazifa — gipotezani tez tekshirish.

Bunday hollarda serverda **Docker Compose**, **PaaS platformasi** yoki bulutning boshqariladigan konteyner servislari yetarli. Agar ilova allaqachon konteynerlarga qadoqlangan va muhit o‘zgaruvchilari orqali sozlangan bo‘lsa, keyinroq Kubernetes’ga o‘tish osonroq.

## Kubernetes qachon o‘zini oqlaydi

- turli jamoalar mustaqil chiqaradigan ko‘plab servislar;
- yuklama sezilarli o‘zgaradi va avtomatik masshtablash kerak;
- **uzluksiz ishlash** talablari: bitta serverning ishdan chiqishi mahsulotni to‘xtatmasligi kerak;
- tez-tez relizlar va yagona standart deploy sxemasi kerak;
- bir xil bo‘lishi kerak bo‘lgan bir nechta muhit (dev, staging, prod).

## Qanday qaror qabul qilish kerak

| Savol | Ko‘proq Compose / PaaS | Ko‘proq Kubernetes |
|---|---|---|
| Nechta server? | bir-ikkita | bir nechta va undan ko‘p |
| Nechta servis? | bir nechta | o‘nlab |
| DevOps tajribasi bormi? | yo‘q | ha |
| To‘xtash qabul qilinadimi? | ha, qisqa | yo‘q |
| Yuklama | barqaror | keskin, o‘suvchi |

Agar javoblarning aksariyati chap ustunda bo‘lsa — soddaroq yechimdan boshlang. Loyiha hujjatlari: [kubernetes.io](https://kubernetes.io/docs/concepts/overview/).

## FAQ

### Kubernetes Docker’ni almashtiradimi?

Yo‘q. Docker (yoki boshqa vosita) obrazlarni yig‘adi, Kubernetes esa ularning klasterda ishlashini boshqaradi. Docker bilan yig‘ilgan obrazlar Kubernetes’da o‘zgarishsiz ishlaydi.

### Kubernetes’ni bitta serverda ishga tushirish mumkinmi?

Ha, bitta noda uchun yengil distributivlar bor. Lekin asosiy afzallik — server ishdan chiqqanda ham ishlashda davom etish — yo‘qoladi, murakkablik esa qoladi.

### Nimani tanlash kerak: o‘z klasteringizmi yoki boshqariladiganmi?

Ko‘pchilik jamoalar uchun boshqariladigan klaster soddaroq: control plane yangilanishlari va mavjudligini provayder o‘z zimmasiga oladi. O‘z klasteringiz ma’lumotlarni joylashtirish yoki infratuzilmaga maxsus talablar bo‘lganda mantiqli.
