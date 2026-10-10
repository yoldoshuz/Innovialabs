---
title: Wildcard va multidomen SSL: qaysi biri qachon kerak
description: Wildcard va SAN sertifikatlari qaysi nomlarni qamraydi, wildcard uchun DNS tekshiruvi qanday ishlaydi va ko‘p subdomen uchun sertifikatlarni rejalashtirish.
summary: Wildcard *.example.com bir darajadagi istalgan subdomenni qamraydi, lekin domenning o‘zini va ichki nomlarni emas; multidomen SAN sertifikati esa aniq nomlar ro‘yxatini, hatto turli domenlarni ham qamraydi. Ularni birlashtirish mumkin, tanlov esa yangi nomlar qanchalik tez-tez paydo bo‘lishi va kalit qayerda saqlanishiga bog‘liq.
---
## Qisqa javob

- **Wildcard** (`*.example.com`) — bitta domenning **bir darajadagi** barcha subdomenlari uchun bitta sertifikat: `shop.example.com`, `api.example.com` va har qanday yangisi.
- **Multidomen yoki SAN sertifikat** — Subject Alternative Name maydonidagi aniq nomlar ro‘yxati: `example.com`, `www.example.com`, `example.uz`, `brand.org`. Domenlar turlicha bo‘lishi mumkin.
- Bular bir-birini istisno qilmaydi: bitta SAN sertifikatiga oddiy nomlarni ham, bir nechta wildcard’ni ham joylash mumkin.

| | Wildcard | SAN |
|---|---|---|
| Yangi subdomenlar | qayta chiqarishsiz qamraladi | qayta chiqarish kerak |
| Turli domenlar | yo‘q | ha |
| `example.com`ning o‘zi | faqat alohida nom sifatida qo‘shilsa | ha, ro‘yxatda bo‘lsa |
| Tekshiruv | odatda faqat DNS orqali | HTTP yoki DNS |
| Nomlar ko‘rinishi | sertifikatda faqat `*.example.com` | barcha nomlar ochiq |

## Qamrov qoidalari

- Yulduzcha **aynan bitta belgini** (label) va faqat **eng chapdagisini** almashtiradi. `*.example.com` `a.example.com`ga mos keladi, lekin `a.b.example.com`ga emas.
- Wildcard **domenning o‘zini qamramaydi**. `example.com` ham, subdomenlar ham ishlashi uchun sertifikatga ikkala nom qo‘shiladi.
- `api-*.example.com` kabi qisman shablonlarni sertifikatlash markazlari chiqarmaydi.
- Ikkinchi daraja uchun o‘z wildcard’i kerak: `*.eu.example.com`.
- EV sertifikatlar wildcard variantida chiqarilmaydi.
- SAN’dagi nomlar soni har bir sertifikatlash markazi qoidalari bilan cheklanadi. Let’s Encrypt’da bitta sertifikatda 100 tagacha nom.

## Wildcard uchun DNS tekshiruvi

Let’s Encrypt wildcard’ni faqat **DNS-01** tekshiruvi orqali beradi: sertifikatlash markazi token beradi, siz uni `_acme-challenge.example.com` TXT yozuvida e’lon qilasiz, markaz yozuvni tekshiradi. Pullik markazlar ham wildcard’ni odatda DNS yoki pochta orqali tekshiradi.

Buni `--manual` bilan qo‘lda qilish mumkin, ammo bunday sertifikat o‘zi yangilanmaydi. To‘g‘ri yo‘l — DNS provayderingiz API’si uchun plagin, masalan Cloudflare uchun:

```bash
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d example.com -d '*.example.com'
```

```ini
# /root/.secrets/cloudflare.ini, huquqlar 600
dns_cloudflare_api_token = <faqat shu zona uchun Zone:DNS:Edit huquqli token>
```

Bilish muhim bo‘lgan narsalar:

- `example.com` va `*.example.com` uchun tekshiruv **bitta nom** — `_acme-challenge.example.com` bo‘yicha o‘tadi, shuning uchun u yerda bir vaqtda ikkita TXT yozuvi bo‘ladi. Bu normal holat.
- **Tokenni cheklang** — bitta zona va faqat DNS huquqi. Veb-serverda butun akkauntga kirish huquqli kalit — ortiqcha xavf.
- **CNAME orqali delegatsiya.** `_acme-challenge.example.com`ni avtomatlashtirish boshqaradigan alohida xizmat zonasidagi nomga CNAME qilib qo‘yish mumkin. Shunda server asosiy zonaga umuman huquq olmaydi.
- TXT yozuvi hali barcha avtoritativ serverlarga yetib bormagan bo‘lsa, tekshiruv muvaffaqiyatsiz bo‘lishi mumkin. Plaginlarda tarqalishni kutish parametri bor.

## Ko‘p subdomenlar uchun sertifikatlarni rejalashtirish

Nomlarni qulaylik bo‘yicha emas, **maxfiy kalit qayerda turishi va unga kim mas’ulligi** bo‘yicha guruhlang.

**Wildcard’ni qachon tanlash kerak:**

- subdomenlar avtomatik yaratiladi, masalan har bir mijoz uchun `client1.app.example.com`;
- TLS bitta joyda yakunlanadi — balansirovkachi, ingress yoki reverse proxy’da;
- subdomen nomlarini oshkor qilishni istamaysiz: SAN nomlari ommaviy Certificate Transparency jurnallariga tushadi, wildcard esa faqat shablonni ko‘rsatadi.

**SAN yoki alohida sertifikatlarni qachon tanlash kerak:**

- bitta loyihaning turli domenlari — `example.com`, `example.uz`;
- xizmatlar turli serverlarda yoki turli pudratchilarda;
- nomlar kam va kamdan-kam o‘zgaradi.

**Ishlaydigan sxema:**

1. `example.com` + `www.example.com` — ikki nomli oddiy sertifikat.
2. `*.app.example.com` — mijozlar subdomenlari uchun balansirovkachidagi wildcard.
3. `*.staging.example.com` — test muhiti uchun alohida sertifikat va kalit, prodakshen bilan umumiy emas.
4. Ichki xizmatlar — o‘z sertifikatlari yoki ichki sertifikatlash markazi.
5. Barcha sertifikatlar hisobi va muddatlarning tashqi monitoringi. Kubernetes’da chiqarish va yangilashni cert-manager’ga topshirish qulay.

## Ko‘p uchraydigan xatolar

- `*.example.com` `example.com` yoki `a.b.example.com`ni qamraydi deb kutish.
- Bitta wildcard kalitini barcha serverlarga, jumladan pudratchilarnikiga ham nusxalash: bir joydagi sizib chiqish barcha subdomenlarni xavf ostiga qo‘yadi.
- Wildcard’ni qo‘lda chiqarib, u o‘zi yangilanmasligini unutish.
- Bir-biriga aloqasiz loyihalarni bitta SAN sertifikatiga yig‘ish: bitta domen boshqa joyga ketsa yoki tekshiruvdan o‘tmasa, butun sertifikatni yangilash buziladi.

## FAQ

### Qaysi biri arzonroq: wildcard yoki SAN?
Let’s Encrypt’da ikkalasi ham bepul. Pullik markazlarda narx modelga bog‘liq: SAN ko‘pincha nomlar soni bo‘yicha, wildcard esa butun shablon uchun hisoblanadi. Bir yildan keyin qancha nomingiz bo‘lishini hisobga olib solishtiring.

### `*.*.example.com` chiqarish mumkinmi?
Yo‘q. Har bir daraja uchun alohida wildcard kerak, lekin bir nechta shunday shablonni bitta SAN sertifikatiga joylash mumkin.

### Wildcard’ni HTTP tekshiruvi orqali olish mumkinmi?
Let’s Encrypt’da yo‘q — faqat DNS-01. Shuning uchun wildcard uchun DNS avtomatlashtirishni oldindan o‘ylab qo‘ying.
