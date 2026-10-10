---
title: Mikrofrontendlar: frontendni bo‘lish qachon mantiqli
description: Mikrofrontendlar nima, Module Federation va boshqa integratsiya usullari qanday ishlaydi, jamoalarga nima beradi va buning uchun nima bilan to‘laysiz.
summary: Mikrofrontendlar bitta interfeysni turli jamoalar mustaqil ishlab chiqadigan va chiqaradigan qismlarga bo‘ladi; ular tashkiliy muammoni hal qiladi va bitta kichik jamoa uchun deyarli doim ortiqcha.
---

## Qisqacha: bu nima va nima uchun

**Mikrofrontendlar** — bitta veb-interfeys bir nechta mustaqil ilovalardan yig‘iladigan yondashuv. Masalan, katalog, savat va shaxsiy kabinetni turli jamoalar ishlab chiqadi, ular turli repozitoriylarda yashaydi va alohida chiqariladi, foydalanuvchi esa yagona saytni ko‘radi.

Asosiysi: mikrofrontendlar **tashkiliy** vazifani hal qiladi, texnik emas. Ular bir nechta jamoa bitta frontendda bir-biriga xalaqit berganda kerak: umumiy relizlarni kutish, kodda to‘qnashuvlar, bog‘liqliklarni yangilay olmaslik. Bunday muammo bo‘lmasa, yondashuv foydasiz murakkablik qo‘shadi.

## Integratsiya usullari

Qismlarni birlashtirishning turli yo‘llari bor:

| Yondashuv | Qanday ishlaydi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| **Module Federation** | Bandler bir ilovaga boshqasining modullarini ishlash vaqtida yuklash imkonini beradi | Mustaqil deploy, umumiy bog‘liqliklar bir marta yuklanadi | Bandlerga bog‘liqlik, versiyalarni debag qilish qiyin |
| **Server / edge darajasida** | Server turli servislar fragmentlaridan HTML yig‘adi | Tez birinchi render, SEO uchun yaxshi | Interaktivlik va umumiy holat murakkabroq |
| **Paketlar orqali yig‘ish** | Har bir qism npm-paket sifatida chiqariladi, xost ularni yig‘adi | Oddiy, tiplangan | Mustaqil deploy yo‘q: har o‘zgarish xostni qayta yig‘ishni talab qiladi |
| **iframe** | Har bir qism freymda ochiladi | To‘liq izolyatsiya | UX, moslashuvchanlik, navigatsiya va SEO bilan muammolar |
| **Web Components** | Qismlar custom element sifatida | Freymvorkka bog‘liq emas | Yuklash, versiya va umumiy holatni o‘zingiz hal qilasiz |
| **Yo‘llar bo‘yicha routing** | Turli URL larga turli ilovalar xizmat qiladi | Eng oddiy variant | Qismlar orasida o‘tish — sahifani to‘liq qayta yuklash |

Ko‘pincha eng amaliy boshlanish — **yo‘llar bo‘yicha bo‘lish**: `/shop` — bitta ilova, `/account` — boshqasi, umumiy faqat dizayn-paket.

## Nimaga ega bo‘lasiz

- **Mustaqil relizlar**: savat jamoasi katalog jamoasini kutmasdan chiqaradi.
- **Aniq mas’uliyat chegaralari**: har bir qismning egasi bor.
- **Bosqichma-bosqich migratsiya**: eski interfeysni mahsulotni to‘xtatmasdan qismma-qism qayta yozish mumkin.
- **Texnologiya erkinligi** — nazariyada. Amalda freymvorklarni aralashtirish odatda foydadan ko‘ra ko‘proq muammo keltiradi.

## Nima bilan to‘laysiz

- **Unumdorlik.** Freymvork va kutubxonalarning bir nechta nusxasini yuklash xavfi, ko‘proq JavaScript va so‘rovlar. Umumiy bog‘liqliklarni aniq sozlash kerak.
- **UI izchilligi.** Umumiy dizayn-tizim bo‘lmasa, tugmalar va bo‘shliqlar qismlar orasida farqlana boshlaydi.
- **Umumiy holat.** Avtorizatsiya, savat, interfeys tili — bularning barchasi kontraktlar orqali sinxronlanishi kerak: hodisalar, URL, umumiy ombor.
- **Infratuzilma.** Bir nechta payplayn, kontraktlar versiyasi, qismlar bo‘yicha xatolar monitoringi, end-to-end testlar.
- **Debag.** Xato mustaqil chiqarilgan ikki qism tutashgan joyda paydo bo‘lishi mumkin.

## Mikrofrontendlar sizga kerak emasligi belgilari

- Frontend ustida **bitta jamoa** yoki bir necha kishi ishlaydi.
- Relizlar bir-birini bloklamaydi, kodda to‘qnashuvlar kam.
- Asl muammo — **kodning yomon tuzilishi**; uni modullar, monorepozitoriy ichidagi chegaralar va code review hal qiladi.
- Maqsad — «turli freymvorklarni sinab ko‘rish».
- Mahsulot hali o‘z shaklini izlayapti va qismlar orasidagi chegaralar tez-tez o‘zgaradi.

Yaxshi muqobil — **modulli monolit**: bitta ilova, lekin domenlar chegaralari aniq, papkalar alohida va import qoidalari bor. O‘sish paytida uni bo‘lish osonroq.

## Qanday qaror qilish kerak

1. Aynan qaysi muammoni hal qilayotganingizni yozing: reliz tezligi, to‘qnashuvlar, migratsiya.
2. Uni arzonroq yo‘l bilan hal qilish mumkinmi, tekshiring — modullar, monorepozitoriy, feature-flaglar.
3. Agar bo‘lsangiz, texnik qatlamlar bo‘yicha emas, **biznes-domenlar** bo‘yicha bo‘ling.
4. Umumiy dizayn-tizim va qismlar orasidagi kontraktlarni oldindan ajrating.
5. Bitta ajratilgan qismdan boshlang va yuklanish tezligiga ta’sirini o‘lchang.

## FAQ

### Mikrofrontendlarda turli freymvorklardan foydalansa bo‘ladimi?

Texnik jihatdan ha, lekin har bir freymvork yuklanishga o‘z kodini qo‘shadi va qo‘llab-quvvatlashni murakkablashtiradi. Odatda jamoalar bitta stek bo‘yicha kelishib, faqat kod va relizlarni bo‘lishadi.

### Mikrofrontendlar kichik startap uchun mosmi?

Odatda yo‘q. Kichik jamoa uchun infratuzilma va kelishuv xarajatlari foydadan oshib ketadi. Yaxshi tuzilgan monolitdan boshlagan ma’qul.

### Module Federation npm-paketlardan nimasi bilan farq qiladi?

Paketlar yig‘ish vaqtida ulanadi, shuning uchun o‘zgarish xostni qayta yig‘ishni talab qiladi. Module Federation kodni ishlash vaqtida yuklaydi va bir qismni boshqalarini qayta yig‘masdan yangilash mumkin.
