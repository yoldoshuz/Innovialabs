---
title: HashiCorp Vault yoki AWS, GCP va Azure secret manager’lari
description: HashiCorp Vault va AWS Secrets Manager, GCP Secret Manager, Azure Key Vault taqqoslanadi: dinamik secret’lar, rotatsiya, siyosatlar, audit va xarajat.
summary: Butun infratuzilma bitta bulutda va jamoa kichik bo‘lsa, shu bulutning o‘rnatilgan secret manager’ini oling; Vault esa ko‘p bulut yoki o‘z serverlaringiz bo‘lganda, dinamik secret’lar kerak bo‘lganda va jamoada uni qo‘llab-quvvatlashga resurs bo‘lganda o‘zini oqlaydi.
---
## Qisqa javob

- **Bulutdagi secret manager** (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) — boshqariladigan servis: hech narsa o‘rnatish shart emas, huquqlar va audit bulutga o‘rnatilgan. Bitta bulutda ishlaydigan jamoa uchun eng yaxshi tanlov.
- **HashiCorp Vault** — maxfiy ma’lumotlar uchun alohida platforma: dinamik hisob ma’lumotlari, xizmat sifatida shifrlash, istalgan muhit uchun yagona siyosatlar. Kuchliroq va moslashuvchanroq, lekin uni ekspluatatsiya qilish yoki boshqariladigan versiyasi uchun to‘lash kerak.

Asosiy savol «qaysi biri yaxshi» emas, balki «sizda nechta turli muhit bor va buni kim qo‘llab-quvvatlaydi».

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | HashiCorp Vault | AWS Secrets Manager | GCP Secret Manager | Azure Key Vault |
|---|---|---|---|---|
| Dinamik secret’lar | Ha: bazalar, bulutlar, PKI va boshqalar uchun | Yo‘q, faqat saqlash va rotatsiya | Yo‘q | Yo‘q |
| Rotatsiya | Lease va TTL orqali, avtomatik bekor qilish | Lambda orqali o‘rnatilgan, ayrim AWS servislari uchun boshqariladigan | Pub/Sub’ga xabar yuboruvchi jadval, rotatsiya mantig‘ini o‘zingiz yozasiz | Kalitlar uchun avtomatik; secret’lar uchun Event Grid hodisalari va o‘z funksiyangiz orqali |
| Kirish siyosatlari | HCL’dagi o‘z siyosatlari, ko‘p autentifikatsiya usullari | IAM va resource policy’lar | IAM | Azure RBAC |
| Audit | Audit device’lar, sozlash va saqlash kerak | CloudTrail | Cloud Audit Logs | Azure Monitor’dagi diagnostik log’lar |
| Bulutdan tashqarida | Istalgan joyda: bulutlar, o‘z serverlari, Kubernetes | Asosan AWS ichida | Asosan GCP ichida | Asosan Azure ichida |
| Ekspluatatsiya yuki | Yuqori (self-hosted) yoki o‘rtacha (managed) | Minimal | Minimal | Minimal |

## Dinamik secret’lar

Bu Vault’ning asosiy farqi. Bazaga bitta doimiy parol o‘rniga ilova ishga tushganda Vault’dan **vaqtinchalik hisob ma’lumotlarini** so‘raydi: Vault bazada kerakli huquqlar va cheklangan yashash muddati (**TTL**) bilan foydalanuvchi yaratadi. Muddat tugagach, Vault foydalanuvchini o‘chiradi.

Bu nima beradi:

- ilovaning har bir nusxasi o‘z login’iga ega, log’larda kim nima qilgani ko‘rinadi;
- sizib chiqqan parol tezda ishlamay qoladi;
- alohida rotatsiya tartibi kerak emas — u modelga o‘rnatilgan.

Bulutdagi menejerlar **statik** secret’larni saqlaydi va ularni jadval bo‘yicha almashtira oladi. Ko‘p loyihalar uchun bu yetarli. Bulutda shunga yaqin natijani rollar ham beradi: masalan, boshqariladigan bazalarda parol o‘rniga IAM autentifikatsiyasi.

## Amalda rotatsiya va audit

Bulutdagi menejerlarda rotatsiya bulutning «o‘z» servislari, masalan boshqariladigan bazalar uchun eng oson. Uchinchi tomon API kaliti uchun deyarli har doim provayderda yangi kalit yaratib, uni secret’ning yangi versiyasi sifatida saqlaydigan funksiya yozishga to‘g‘ri keladi.

Bulutlarda audit bulutning boshqa log’lari bilan birga yoqiladi va jamoa allaqachon kuzatayotgan joyga tushadi. Vault’da auditni alohida yoqish va jurnalni qayerga yuborish, qancha saqlashni hal qilish kerak.

## Xarajat va jamoaga yuk

Aniq narxlar o‘zgarib turadi, shuning uchun omillar bo‘yicha taqqoslang:

- **Bulutdagi menejerlar** secret’lar soni va/yoki API murojaatlari soni bo‘yicha hisoblanadi. Ilova secret’ni har bir so‘rovda o‘qisa, hisob o‘sadi — qiymatlarni xotirada keshlang. AWS’da oddiy konfiguratsiya uchun Parameter Store arzonroq bo‘lishi mumkin.
- **Self-hosted Vault** — bu serverlar, ishonchlilik uchun klaster, zaxira nusxalar, yangilanishlar, unseal tartibi, monitoring va tungi soat uchda hammasini tiklashni biladigan odamlar. Asosiy xarajat — muhandislar vaqti.
- **Boshqariladigan Vault** (HCP Vault) ekspluatatsiyani olib tashlaydi, lekin secret’lar soni kam bo‘lganda odatda bulutdagi menejerlardan qimmatroq tushadi.

Litsenziyani ham hisobga oling: Vault Business Source License asosida tarqatiladi. To‘liq ochiq variant kerak bo‘lsa, **OpenBao** fork’i mavjud.

## Nimani tanlash kerak

| Vaziyat | Tavsiya |
|---|---|
| Kichik jamoa, hammasi bitta bulutda | Shu bulutning o‘rnatilgan secret manager’i |
| Bitta VPS yoki bulutsiz bir nechta server | CI/CD va hosting secret’lari; Vault hozircha ortiqcha |
| Bir nechta bulut yoki bulut va o‘z serverlari | Yagona nuqta sifatida Vault (managed yoki self-hosted) |
| Bazaga kirish va auditga qat’iy talablar, platforma jamoasi bor | Dinamik secret’lar bilan Vault |
| Istalgan bulutdagi Kubernetes | Bulut menejeri yoki Vault, klasterga sinxronlash uchun External Secrets Operator |

Bulut menejeridan boshlab, keyinroq Vault’ga o‘tish — odatiy yo‘l. Agar ilova secret’larni muhit o‘zgaruvchilari yoki alohida konfiguratsiya qatlami orqali o‘qisa, migratsiya ko‘p vaqt olmaydi.

## Ko‘p uchraydigan xatolar

- O‘nta statik secret uchun Vault o‘rnatish.
- Zaxira nusxa va tiklash rejasisiz self-hosted Vault: unseal kalitlarini yo‘qotish barcha secret’larni yo‘qotish demakdir.
- Har bir ilova uchun siyosat o‘rniga «hammasiga» bitta umumiy kirish.
- Keshlash o‘rniga har bir HTTP so‘rovda secret’ni bulutdan o‘qish.

## FAQ

### Vault va bulut menejeridan bir vaqtda foydalansa bo‘ladimi?

Ha. Ko‘pincha bulut menejeri bulut servislari uchun secret’larni, Vault esa dinamik hisob ma’lumotlari va bulutdan tashqaridagi muhitlar uchun secret’larni saqlaydi. Ikki xil haqiqat manbai bo‘lmasligi uchun qaysi secret qayerda turishini aniq kelishib oling.

### Azure Key Vault sertifikatlar va shifrlash kalitlari uchun mos keladimi?

Ha, Key Vault dastlab secret’lar, kriptografik kalitlar va sertifikatlar uchun mo‘ljallangan. AWS va GCP’da shifrlash kalitlari odatda secret manager’da emas, alohida servis — KMS’da saqlanadi.

### Bir menejerdan boshqasiga ko‘chish qiyinmi?

Qiymatlarning o‘zi skript bilan ko‘chiriladi. Kirish siyosatlari, rotatsiya va CI/CD integratsiyalarini qayta yozish qiyinroq. Kod aniq bir ombor haqida qanchalik kam bilsa, ko‘chish shunchalik oson.
