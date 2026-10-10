---
title: Kichik biznes uchun zaxira nusxalash: nima, qay tezlikda, qayerga
description: RPO va RTO ni qanday aniqlash, nimani nusxalash (sayt, CRM, 1C, pochta, fayllar), vositalar va omborni tanlash hamda tiklashni muntazam tekshirish.
summary: Avval qancha ma’lumot va to‘xtab qolish vaqtini yo‘qotishga qodir ekaningizni aniqlang (RPO va RTO), so‘ng tizimlar ro‘yxatini tuzing, 3-2-1 qoidasi bo‘yicha avtomatik nusxalashni sozlang va tiklashni muntazam tekshiring.
---
## Qisqa javob

Zaxira nusxalash strategiyasi uchta savolga javob beradi: **nimani** nusxalash, **qanchalik tez-tez** va **qayerga**. Harakatlar tartibi:

1. Har bir tizim uchun **RPO** va **RTO** ni aniqlang.
2. **Inventarizatsiya** qiling: kompaniya ma’lumotlari saqlanadigan barcha joylar.
3. Bitta o‘zgarmas nusxa bilan 3-2-1 qoidasi bo‘yicha **vositalar va omborlarni** tanlang.
4. **Mas’ul shaxs** tayinlang va jadval bo‘yicha **tiklashni** tekshiring.

## RPO va RTO oddiy so‘zlar bilan

- **RPO (Recovery Point Objective)** — qancha ma’lumot yo‘qotish mumkin. Agar RPO bir sutka bo‘lsa, kunlik nusxa yetarli. Agar hatto bir soatlik buyurtmalarni yo‘qotish ham mumkin bo‘lmasa, tez-tez nusxalash kerak.
- **RTO (Recovery Time Objective)** — tizim qancha vaqtda qayta ishga tushishi kerak. Nusxa qayerda saqlanishi RTO ga bog‘liq: terabaytlarni ofis kanali orqali bulutdan tiklash mahalliy NAS dan tiklashga qaraganda ancha uzoq davom etishi mumkin.

Bu ko‘rsatkichlarni faqat IT bilan emas, rahbariyat bilan birga belgilang: bu biznesning puli va xatarlari haqidagi qaror. Turli tizimlarga turli qiymatlar kerak — buxgalteriya va buyurtmalar qabul qiladigan sayt uchun ular odatda hujjatlar arxividan qat’iyroq.

## Nimani nusxalash kerak

| Tizim | Aynan nima | Nimaga e’tibor berish kerak |
|---|---|---|
| **Sayt** | Fayllar, ma’lumotlar bazasi, foydalanuvchilar yuklagan fayllar, server konfiguratsiyasi | Ishlab turgan baza fayllarini nusxalamang, baza dampini oling |
| **CRM (bulutli)** | Mijozlar, bitimlar, tarixni muntazam eksport qilish | Provayder sizning o‘chirilgan ma’lumotlaringiz uchun emas, o‘z infratuzilmasi uchun javob beradi; shartlarni aniqlang |
| **1C** | Axborot bazasini yuklab olish (.dt) yoki MBBT zaxira nusxasi; fayl bazasi uchun — barcha seanslar yopiq holda baza faylining nusxasi | Ochiq seanslar paytida fayl bazasini nusxalash buzilgan nusxa berishi mumkin |
| **Pochta** | Pochta qutilari, ayniqsa rahbariyat va buxgalteriyaniki | Google Workspace yoki Microsoft 365 dagi savat va saqlash muddatlari — zaxira emas |
| **Fayllar** | Umumiy papkalar, NAS, noutbuklardagi hujjatlar | Bulut bilan sinxronizatsiya o‘chirish va shifrlashni takrorlaydi |
| **Kirish huquqlari** | Domenlar, DNS, hosting, parollar menejeri, litsenziyalar | Ularsiz tiklangan ma’lumotlarni joylashtirishga joy bo‘lmaydi |

**Ko‘zga tashlanmaydigan narsalarni** unutmang: xodimlarning shaxsiy bulutlaridagi jadvallar, Telegram-botlar va ularning bazalari, router va telefoniya sozlamalari.

## Vositalar

- **Serverlar va saytlar uchun**: restic, BorgBackup, Duplicati — ular ma’lumotlarni shifrlaydi, siqadi, takrorlarni olib tashlaydi va obyektli omborga yubora oladi.
- **Ofis uchun**: NAS ning o‘rnatilgan vositalari (Synology, QNAP va boshqalarda kompyuterlar va bulutga zaxira uchun o‘z ilovalari bor), Windows Server Backup, Veeam Agent.
- **Bulutli servislar uchun**: o‘rnatilgan eksport yoki Google Workspace va Microsoft 365 uchun maxsus zaxira xizmatlari.

PostgreSQL va restic ishlatiladigan server uchun misol:

```bash
#!/bin/sh
set -e
pg_dump -Fc shop > /var/backups/shop.dump
restic -r s3:https://storage.example.com/backups backup /var/www /var/backups
restic -r s3:https://storage.example.com/backups forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```

Repozitoriy paroli va kalitlarni skriptda emas, muhit o‘zgaruvchilarida saqlang. Parolni server tashqarisida ham albatta saqlab qo‘ying: usiz nusxalarni deshifrlab bo‘lmaydi.

## Qayerga nusxalash kerak

- **Mahalliy (NAS, alohida server)** — tez tiklash, qisqa RTO uchun yaxshi.
- **Bulutdagi obyektli ombor** — ofisdan tashqaridagi nusxa; provayder qo‘llab-quvvatlasa, **versiyalash** va **Object Lock** ni yoqing.
- **Oflayn disklar** — ransomware hujumi uchun zaxira variant: faqat nusxalash vaqtida ulanadi.

Zaxira uchun hisob qaydnomalari **alohida**, minimal huquqlarga ega va domen hamda administrator pochtasi bilan bog‘lanmagan bo‘lishi kerak.

## Jadval va tekshiruvlar

- **Nusxalash**: bazalar va muhim tizimlar — RPO ga qarab har kuni yoki tez-tez; fayllar — har kuni; serverlarning to‘liq obrazlari — har hafta.
- **Saqlash**: masalan, bir haftalik kunlik nusxalar, bir oylik haftalik, yarim yillik oylik nusxalar — o‘z talablaringizga moslang.
- **Monitoring**: vazifa bajarilmasa, pochta yoki Telegram ga xabar.
- **Tiklash testi**: alohida fayllarni muntazam tiklang, chorakda bir marta esa butun tizimni test serverga tiklang. Vaqtni o‘lchang va RTO bilan solishtiring.
- **Hujjat**: nusxalar qayerda, qanday tiklash va kirish huquqlari kimda ekanligi haqida qisqa yo‘riqnoma.

## FAQ

### Bulutli CRM allaqachon zaxira nusxa oladi — yana biror narsa kerakmi?

Ma’qul. Provayder o‘z infratuzilmasini himoya qiladi, lekin odatda xodimingiz yoki integratsiya o‘chirgan alohida yozuvlarni tiklamaydi. O‘z omboringizga muntazam eksport bundan ham, servisga kirish bilan bog‘liq muammolardan ham sug‘urtalaydi.

### Zaxira nusxalash qancha turadi?

Ma’lumotlar hajmi, saqlash muddati, nusxalar soni va kerakli RTO ga bog‘liq. Asosiy xarajatlar — ombor (NAS, disklar, bulut), dasturiy ta’minot litsenziyalari hamda sozlash va tekshirishga ketadigan vaqt. Ularni hisoblab, bir kunlik to‘xtab qolish narxi bilan solishtiring.

### Kichik kompaniyada zaxira nusxalar uchun kim javob berishi kerak?

Aniq bir shaxs — shtatdagi administrator yoki majburiyatlarida xabarnomalarni nazorat qilish va tiklashni tekshirish yozilgan pudratchi. Mas’ul shaxs bo‘lmasa, zaxira nusxalar jimgina ishlamay qoladi.
