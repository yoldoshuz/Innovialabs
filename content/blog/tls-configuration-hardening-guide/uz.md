---
title: TLS’ni xavfsiz sozlash: protokollar, shifrlar va SSL Labs’da A+
description: Qaysi TLS versiyalari va shifrlarni o‘chirish kerak, forward secrecy va OCSP stapling nima uchun kerak, SSL Labs hisobotini o‘qish va nginx’da tuzatish.
summary: Faqat TLS 1.2 va 1.3 ni, faqat AEAD shifrlari bilan ECDHE kalit almashinuvini qoldiring, to‘liq sertifikatlar zanjirini bering va HSTS qo‘shing — bu kombinatsiya SSL Labs’ning odatiy e’tirozlarini yo‘qotadi va A+ bahosiga standart yo‘l hisoblanadi.
---

## Qisqacha javob

Ishonchli TLS sozlamasi to‘rtta qarorga borib taqaladi:

1. **Protokollar:** faqat TLS 1.2 va TLS 1.3. SSL 2/3, TLS 1.0 va TLS 1.1 rasman eskirgan va o‘chirilgan bo‘lishi kerak.
2. **Shifrlar:** faqat **ECDHE** kalit almashinuvi (forward secrecy) va **AEAD** shifrlashi (AES-GCM, ChaCha20-Poly1305) bo‘lgan to‘plamlar.
3. **Sertifikat:** to‘liq zanjir (yakuniy va oraliq sertifikatlar) va zamonaviy kalit — ECDSA P-256 yoki kamida 2048 bitli RSA.
4. **HSTS:** uzoq muddatli Strict-Transport-Security sarlavhasi. Usiz SSL Labs A+ qo‘ymaydi.

## Nimani o‘chirish kerak va nima uchun

| O‘chirish | Sabab |
|---|---|
| SSLv2, SSLv3 | Ma’lum hujumlar bilan buzilgan (POODLE va boshqalar) |
| TLS 1.0, TLS 1.1 | Eskirgan, zaif konstruksiyalarga tayanadi; SSL Labs bahoni B darajasi bilan cheklaydi |
| RC4, 3DES, NULL, EXPORT, anonim to‘plamlar | Zaif yoki nol shifrlash yoxud autentifikatsiya yo‘q |
| Statik RSA kalit almashinuvi (`AES128-GCM-SHA256` va h.k.) | Forward secrecy yo‘q |
| CBC rejimidagi to‘plamlar | Zamonaviy kutubxonalarda buzilmagan, lekin tarixan mo‘rt; SSL Labs ularni zaif deb belgilaydi |

TLS 1.3’da bularning hammasi protokoldan olib tashlangan, shuning uchun uning shifrlar ro‘yxatini sozlash shart emas. Yuqoridagilarning barchasi TLS 1.2 ga tegishli.

## Forward secrecy

**ECDHE** bilan har bir ulanish vaqtinchalik kalitlar juftligidan foydalanadi, keyin u yo‘q qilinadi. Server yopiq kaliti keyinroq o‘g‘irlansa ham, oldin yozib olingan trafikni ochib bo‘lmaydi.

Ikki narsa bu himoyani sezdirmasdan zaiflashtiradi:

- «Eski mijozlar uchun» ro‘yxatda qoldirilgan **statik RSA to‘plamlari**.
- Hech qachon almashtirilmaydigan kalit bilan shifrlangan **session ticket’lar**. Agar tiket kalitlarini rotatsiya qilmasangiz, `ssl_session_tickets off` qo‘ying va sessiyalar keshiga tayaning.

## OCSP stapling

Brauzer sertifikat qaytarib olinmaganini tekshirishi mumkin. **OCSP stapling**’da server CA’dan imzolangan holatni o‘zi oladi va uni handshake’ga qo‘shib yuboradi: brauzerga alohida so‘rov kerak bo‘lmaydi, foydalanuvchi maxfiyligi saqlanadi.

Eslatma: ba’zi sertifikatlash markazlari, jumladan Let’s Encrypt, qaytarib olish ro‘yxatlari foydasiga OCSP’dan voz kechgan. Agar sertifikatingizda OCSP manzili bo‘lmasa, stapling qo‘llanilmaydi, nginx logga ogohlantirish yozadi, SSL Labs esa uni shunchaki mavjud emas deb ko‘rsatadi — bu bahoga ta’sir qilmaydi.

## Ishlaydigan nginx konfiguratsiyasi

Asos sifatida Mozilla tavsiya qiladigan «intermediate» profili olingan: xavfsiz va bugun ishlatilayotgan deyarli barcha brauzerlar bilan mos.

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Faqat CA hali OCSP’ni qo‘llab-quvvatlasa
    # ssl_stapling on;
    # ssl_stapling_verify on;
    # resolver 1.1.1.1 8.8.8.8 valid=300s;

    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

`ssl_prefer_server_ciphers off` ataylab tanlangan: ro‘yxatdagi barcha to‘plamlar ishonchli, mijoz esa o‘z qurilmasi uchun eng tezini tanlashi mumkin (ko‘p telefonlarda bu ChaCha20). Serveringizning aniq versiyasi uchun konfiguratsiya olish uchun [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/) dan foydalaning.

Qo‘llash va tekshirish:

```bash
nginx -t && systemctl reload nginx
openssl s_client -connect example.com:443 -tls1_1   # xato bilan tugashi kerak
openssl s_client -connect example.com:443 -tls1_3   # ulanishi kerak
```

## SSL Labs hisobotini qanday o‘qish kerak

Testni ssllabs.com’da ishga tushiring va hisobotni yuqoridan pastga ko‘rib chiqing:

- **Summary.** Baho hamda sariq va qizil izohlar. Aynan ular bahoni nima cheklaganini aytadi.
- **Certificate.** «Chain issues: Incomplete» yozuvini qidiring — faqat yakuniy sertifikat emas, `fullchain.pem` berish bilan tuzatiladi.
- **Configuration → Protocols.** TLS 1.2 va 1.3 dan boshqa «Yes» deb belgilangan hamma narsani o‘chirish kerak.
- **Cipher Suites.** WEAK yoki INSECURE belgili qatorlar sizning `ssl_ciphers` ro‘yxatingizdan keladi.
- **Handshake Simulation.** Qaysi real mijozlar qanday parametrlar bilan ulanishini ko‘rsatadi. Kerakli auditoriyani kesib qo‘ymaganingizni tekshiring.
- **Protocol Details.** Forward Secrecy, OCSP stapling va Strict Transport Security’ni tekshiring.

## Ko‘p uchraydigan xatolar

- Bitta `server` bloki tahrirlanadi, boshqa standart blok esa eski sozlamalarni berishda davom etadi.
- TLS balanslovchi yoki CDN’da o‘z sozlamalari bilan tugatiladi — kuchaytirishni faqat origin’da emas, o‘sha yerda ham qilish kerak.
- Test uchun HSTS’ning qisqa `max-age` qiymati qo‘yilgan va uni oshirish unutilgan.
- Yangilash skripti sertifikat fayllarini almashtirgandan keyin nginx qayta yuklanmaydi.

## FAQ

### TLS 1.0 va 1.1 o‘chirilsa, ba’zi foydalanuvchilarda sayt ishlamay qoladimi?

Faqat yillar davomida yangilanmagan juda eski OT va brauzerlarda. Agar auditoriyangizda eski qurilmalar ko‘p bo‘lsa, Handshake Simulation bo‘limini va analitika ma’lumotlarini ko‘rib chiqing.

### TLS 1.3 shifrlarini sozlash kerakmi?

Odatda yo‘q. TLS 1.3’ning barcha to‘plamlari forward secrecy’li AEAD, kutubxonaning standart sozlamalari esa xavfsiz.

### Nega menda A+ emas, A?

Ko‘pincha HSTS yo‘q yoki uning max-age qiymati juda qisqa. HTTPS butun domenda ishlagach, uzoq muddatli Strict-Transport-Security sarlavhasini qo‘shing.
