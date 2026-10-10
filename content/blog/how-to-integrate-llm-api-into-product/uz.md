---
title: LLM API’ni o‘z mahsulotingizga qanday integratsiya qilish
description: LLM API’ni production’ga ulash bo‘yicha amaliy qo‘llanma: kalitlarni saqlash, streaming, limitlar, qayta urinishlar, provayderlar o‘rtasida fallback va loglar.
summary: LLM’ni faqat serverdan chaqiring, javobni foydalanuvchiga stream qiling, limitlarni backoff bilan qayta urinish orqali boshqaring, zaxira provayder saqlang va har bir so‘rovni tokenlar bilan loglang.
---

## Qisqa javob

LLM API integratsiyasi — bu provayderga bitta `fetch` emas, balki serveringizdagi yupqa qatlam. U kalitlarni saqlaydi, yuklamani cheklaydi, muvaffaqiyatsiz so‘rovlarni qayta yuboradi, zaxira modelga o‘tadi va log yozadi. Interfeys faqat sizning backend bilan gaplashadi, provayder bilan to‘g‘ridan-to‘g‘ri emas.

Minimal ishonchli sxema:

1. **Klient** sizning API’ga so‘rov yuboradi.
2. **Backend** foydalanuvchi va uning limitlarini tekshiradi, promptni yig‘adi.
3. **LLM-shlyuz** (sizning modulingiz) provayderni timeout, qayta urinish va fallback bilan chaqiradi.
4. Javob klientga **stream** qilinadi, metama’lumotlar esa logga yoziladi.

## API kalitlari: faqat serverda

- **Kalitni hech qachon frontend yoki mobil ilovaga qo‘ymang** — uni bundle’dan bir necha daqiqada olishadi.
- Kalitlarni repozitoriyda emas, environment o‘zgaruvchilarida yoki secrets manager’da saqlang.
- **Dev, staging va production uchun alohida kalitlar** oching — test kaliti sizib chiqsa, asosiysiga ta’sir qilmaydi.
- Provayder kabinetida xarajat limitlarini va ogohlantirishlarni sozlang.
- Kalitlarni muntazam almashtiring, oshkor bo‘lganlarini darhol bekor qiling.

## Javoblarni streaming qilish

Modellar matnni asta-sekin yaratadi, to‘liq javob sezilarli vaqt olishi mumkin. **Streaming** matnni yaratilishi bilan ko‘rsatadi va interfeys tez tuyuladi.

- Ko‘pchilik provayderlar oqimni **Server-Sent Events (SSE)** orqali beradi.
- Backend provayder oqimini o‘qib, oxirini kutmasdan klientga uzatadi.
- Ulanish uzilishini hisobga oling: foydalanuvchi vkladkani yopsa, keraksiz tokenlar uchun to‘lamaslik uchun provayderga so‘rovni to‘xtating.
- Fon vazifalari (xulosa, klassifikatsiya) uchun streaming shart emas — javobni to‘liq oling.

## Limitlar va qayta urinishlar

Provayderlar daqiqasiga so‘rovlar va tokenlar sonini cheklaydi. Oshib ketsa **429**, yuklama yuqori bo‘lsa **5xx** xatolari keladi.

Qayta urinish qoidalari:

- Faqat **vaqtinchalik xatolarni** qayta yuboring: 429, 5xx, tarmoq timeout’lari. 400 va 401 ni qaytarishdan foyda yo‘q.
- **Jitter bilan eksponensial backoff** ishlating: pauza har urinishda o‘sadi va biroz tasodifiy bo‘ladi.
- Provayder `Retry-After` sarlavhasini yuborsa, unga amal qiling.
- Urinishlar soni va umumiy timeout’ni cheklang.

```ts
async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const retryable = err.status === 429 || err.status >= 500 || err.code === "ETIMEDOUT";
      if (!retryable || i >= attempts - 1) throw err;
      const delay = Math.min(1000 * 2 ** i, 15000) * (0.5 + Math.random() / 2);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

Bundan tashqari, foydalanuvchi va tarif bo‘yicha **o‘z limitlaringizni** qo‘ying — aks holda bitta faol mijoz butun byudjetni sarflab yuboradi.

## Provayderlar o‘rtasida fallback

Bitta provayderdagi nosozlik mahsulotingizni to‘xtatmasligi kerak.

- Kod ichida model chaqiruvi uchun **yagona interfeys** yarating, har bir provayder uchun adapterni alohida saqlang.
- Zanjir belgilang: asosiy model → shu provayderning zaxira modeli → boshqa provayder modeli.
- **Promptlar turli modellarda turlicha ishlashini** unutmang. Zaxira variantni o‘sha ssenariylarda sinab ko‘ring.
- Muhim funksiyalar uchun LLM’siz oddiy zaxira javob saqlang: shablon, baza bo‘yicha qidiruv yoki «keyinroq urinib ko‘ring» xabari.

## Loglash va kuzatuv

Logsiz javob nega yomonligini yoki hisob qayerdan kelganini tushunolmaysiz.

Har bir chaqiruv uchun nima yozish kerak:

| Maydon | Nima uchun |
|---|---|
| So‘rov va foydalanuvchi ID | Shikoyatlarni tahlil qilish |
| Model va prompt versiyasi | Sifatni solishtirish |
| Kirish va chiqish tokenlari | Xarajat nazorati |
| Birinchi tokengacha va umumiy kechikish | Tezlik |
| Status, urinishlar soni, fallback | Ishonchlilik |

Prompt va javob matnlarida shaxsiy ma’lumotlar bo‘lishi mumkin. Ularni **maskalang** yoki qisqa muddat, faqat kerakli odamlar kira oladigan joyda saqlang.

## Ko‘p uchraydigan xatolar

- Kalit kodda turgan holda provayderni brauzerdan chaqirish.
- Pauzasiz qayta urinishlar — ular yuklamani yanada oshiradi.
- Timeout yo‘qligi: so‘rov osilib qoladi, foydalanuvchi kutadi.
- Promptning versiyasiz kodga yozilishi — nima o‘zgarganini bilib bo‘lmaydi.
- Foydalanuvchi va xarajat bo‘yicha limitlar yo‘qligi.

## FAQ

### LLM uchun alohida shlyuz-servis kerakmi?

Boshida backend ichidagi modul yetarli. Bir nechta servis LLM chaqirsa va kalitlar, limitlar hamda loglarni markazdan boshqarish kerak bo‘lsa, alohida shlyuz ma’noga ega.

### Token xarajatlarini qanday kamaytirish mumkin?

Kontekstni qisqartiring, takrorlanadigan javoblarni keshlang, oddiy vazifalar uchun yengilroq modellardan foydalaning va javobning maksimal uzunligini cheklang.

### Dialoglar tarixini provayderda saqlash mumkinmi?

Tarixni o‘zingizda saqlab, har so‘rovda kerakli qismini yuborgan ma’qul. Shunda ma’lumotlarni nazorat qilasiz va bitta provayderga bog‘lanib qolmaysiz.
