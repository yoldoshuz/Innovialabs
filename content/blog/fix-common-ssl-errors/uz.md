---
title: SSL sertifikatining ko‘p uchraydigan xatolari va ularni tuzatish
description: HTTPS saytda muddati o‘tgan sertifikat, nom mos kelmasligi, to‘liq bo‘lmagan zanjir, aralash kontent va cheksiz yo‘naltirishlarni aniqlash va tuzatish.
summary: SSL muammolarining deyarli barchasi beshta sababga borib taqaladi: sertifikat muddati o‘tgan, sayt nomini qamramaydi, oraliq zanjirsiz beriladi, sahifa resurslarni HTTP orqali yuklaydi yoki HTTP va HTTPS bir-biriga aylana bo‘ylab yo‘naltiradi.
---
## Qisqa javob: beshta odatiy xato

| Brauzerdagi belgi | Sabab | Tuzatish |
|---|---|---|
| `NET::ERR_CERT_DATE_INVALID` | sertifikat muddati o‘tgan | uzaytirish va veb-serverni qayta yuklash |
| `ERR_CERT_COMMON_NAME_INVALID` | sayt nomi sertifikatga kirmagan | kerakli nomlar bilan qayta chiqarish |
| xato faqat ba’zi qurilmalarda yoki `curl`da | zanjir to‘liq emas | `fullchain` berish |
| «Xavfsiz emas», qulf belgisida ogohlantirish | aralash kontent | resurslarni HTTPS’ga o‘tkazish |
| `ERR_TOO_MANY_REDIRECTS` | yo‘naltirishlar aylanasi | yo‘naltirish uchun bitta joy, to‘g‘ri proksi rejimi |

Xato matnlari brauzerlarda turlicha, lekin sabablari bir xil.

Avval server aslida nimani berayotganini ko‘ring:

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

Buyruq sertifikat qaysi nomlarga chiqarilganini, kim berganini va qachongacha amal qilishini ko‘rsatadi.

## 1. Sertifikat muddati o‘tgan

**Qanday bilish mumkin:** yuqoridagi natijada `notAfter` sanasi o‘tib ketgan.

**Nima qilish kerak:**

- sertifikatni uzaytiring (Let’s Encrypt uchun — `sudo certbot renew`);
- **veb-serverni qayta yuklang**: yangi fayl diskda turgani holda server xotiradagi eskisini berayotgan holat ko‘p uchraydi;
- avtomatik yangilash va muddatni tashqi monitoringini sozlang.

Agar xato faqat bitta foydalanuvchida chiqsa, uning qurilmasidagi sana va vaqtni tekshiring: noto‘g‘ri soat ham xuddi shu xatoni beradi.

## 2. Nom sertifikatga mos kelmaydi

**Qanday bilish mumkin:** `subjectAltName` ro‘yxatida tashrif buyuruvchi ochgan nom yo‘q. Klassik holat: sertifikat `example.com` uchun, kirishsa `www.example.com` orqali.

**Nima qilish kerak:**

- sertifikatni barcha kerakli nomlar bilan qayta chiqaring: `-d example.com -d www.example.com`;
- yodda tuting: `*.example.com` wildcard sertifikati `example.com`ning o‘zini ham, `a.b.example.com` kabi ichki nomlarni ham qamramaydi;
- bitta IP’da bir nechta sayt bo‘lsa, har bir `server_name` uchun o‘z sertifikati ko‘rsatilganini tekshiring: xato bo‘lsa, server standart saytning sertifikatini beradi.

## 3. Sertifikatlar zanjiri to‘liq emas

**Qanday bilish mumkin:** sayt kompyuter brauzerida ochiladi, ammo ba’zi telefonlarda, `curl`da yoki integratsiyalarda «unable to get local issuer certificate» kabi xato chiqadi. Brauzerlar ba’zan zanjirni o‘zi to‘ldiradi, boshqa mijozlar buni qilmaydi.

```bash
openssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null
```

Agar natijada faqat bitta sertifikat bo‘lsa, oraliq sertifikat yetishmayapti.

**Nima qilish kerak:** konfiguratsiyada to‘liq zanjirli faylni ko‘rsating. Let’s Encrypt uchun bu `fullchain.pem`. Pullik sertifikatda o‘z sertifikatingiz va sertifikatlash markazining oraliq sertifikatini bitta faylga birlashtiring — avval siznikini, keyin oraliqni.

```nginx
ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

## 4. Aralash kontent

**Qanday bilish mumkin:** sertifikat joyida, lekin brauzer sahifadan shikoyat qiladi, dasturchi konsolida esa **Mixed Content** ogohlantirishlari bor. HTTPS sahifa rasmlar, skriptlar yoki stillarni `http://` orqali yuklaydi.

**Nima qilish kerak:**

- havolalarni `https://` yoki nisbiy yo‘llarga almashtiring;
- CMS’da sozlamalardagi sayt manzilini yangilang va bazada saqlangan eski havolalarni almashtiring;
- vaqtinchalik himoya sifatida sarlavha qo‘shing:

```nginx
add_header Content-Security-Policy "upgrade-insecure-requests";
```

Sarlavha brauzerdan resurslarni HTTPS orqali yuklashni so‘raydi, ammo resurs HTTPS’da mavjud bo‘lmasa, baribir yuklanmaydi.

## 5. Cheksiz yo‘naltirishlar

**Qanday bilish mumkin:** `ERR_TOO_MANY_REDIRECTS`. Zanjirni ko‘ring:

```bash
curl -sIL http://example.com | grep -i -E "^(HTTP|location)"
```

Odatiy sabablar:

- **«Flexible» rejimidagi CDN yoki proksi** (masalan, Cloudflare’da): tashrif buyuruvchi HTTPS orqali keladi, proksi serverga HTTP orqali boradi, server esa HTTPS’ga yo‘naltiradi — va bu aylana davom etadi. Yechim: serverga sertifikat o‘rnating va **Full (strict)** rejimini yoqing.
- **Proksi ortidagi ilova HTTPS’ni ko‘rmaydi.** `X-Forwarded-Proto` sarlavhasini uzating va ilovani unga ishonadigan qilib sozlang.
- **Yo‘naltirish ikki joyda sozlangan** — veb-serverda va CMS yoki plaginda — va ular bir-biriga zid (masalan, `www` va `www`siz). Bitta qoidani qoldiring.

## FAQ

### Sertifikat uzaytirildi, lekin brauzer hamon eski sanani ko‘rsatyapti. Nega?
Ko‘pincha veb-server qayta yuklanmagan yoki konfiguratsiya boshqa faylga ishora qiladi. Kamroq hollarda javobni sertifikati alohida boshqariladigan CDN beradi.

### Saytni bitta xato bo‘yicha emas, to‘liq qanday tekshirish mumkin?
SSL konfiguratsiyasini onlayn tekshirish xizmatidan foydalaning — u zanjir, nomlar, muddatlar va protokollarni ko‘rsatadi. Buyruqlar qatorida asosiy ma’lumotni `openssl s_client` va `curl -v` beradi.

### Tashrif buyuruvchilardan shunchaki «Davom etish»ni bosishni so‘rasa bo‘ladimi?
Yo‘q. Bu odamlarni ogohlantirishlarni e’tiborsiz qoldirishga o‘rgatadi, ko‘plab brauzerlar, ilovalar va API’lar esa umuman davom etishga yo‘l qo‘ymaydi. Xatoni server tomonida tuzatish kerak.
