---
title: Telegram Mini App ga TON Connect ni qanday ulash mumkin
description: Telegram Mini App da TON Connect: hamyonni ulash, backendda ton_proof tekshiruvi, tranzaksiya yuborish va kripto to‘lovlarning huquqiy jihatlari.
summary: Hamyonni @tonconnect/ui va manifest orqali ulang, manzilga egalikni serverda tekshiriladigan ton_proof bilan tasdiqlang, tranzaksiyalarni sendTransaction orqali yuboring va buyurtmani faqat blokcheynda tekshirgandan keyin to‘langan deb belgilang — ishga tushirishdan oldin esa Telegram qoidalari va mahalliy tartibga solishni o‘rganing.
---
## Bu qanday tuzilgan

**TON Connect** — Mini App foydalanuvchi hamyoni (Telegram Wallet, Tonkeeper va boshqalar) bilan bog‘lanadigan protokol. Ilova hech qachon kalitlarni olmaydi — u faqat hamyondan ma’lumot yoki tranzaksiyani imzolashni so‘raydi.

To‘liq ssenariy to‘rt qismdan iborat:

1. **Manifest** — ilovangiz tavsifi yozilgan JSON fayl.
2. **Hamyonni ulash** — foydalanuvchi hamyonni tanlaydi va tasdiqlaydi.
3. **ton_proof** — manzil haqiqatan foydalanuvchiga tegishli ekanining kriptografik isboti. Backendda tekshiriladi.
4. **Tranzaksiyalar** — hamyon imzolaydi va yuboradi, server natijani blokcheynda tekshiradi.

## 1-qadam. Manifest va ulanish

`tonconnect-manifest.json` ni ochiq HTTPS manzilga joylang:

```json
{
  "url": "https://example.com",
  "name": "Example Shop",
  "iconUrl": "https://example.com/icon-180.png",
  "termsOfUseUrl": "https://example.com/terms",
  "privacyPolicyUrl": "https://example.com/privacy"
}
```

React ilovada `@tonconnect/ui-react` dan foydalaning:

```tsx
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";

export function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://example.com/tonconnect-manifest.json"
      actionsConfiguration={{ twaReturnUrl: "https://t.me/your_bot/app" }}
    >
      <TonConnectButton />
    </TonConnectUIProvider>
  );
}
```

`twaReturnUrl` tashqi hamyonda tasdiqlagandan keyin foydalanuvchini Mini App ga qaytaradi. `useTonWallet()` va `useTonAddress()` hooklari joriy ulanishni beradi.

## 2-qadam. ton_proof: manzilga egalikni tekshirish

`useTonAddress()` dagi manzil — klientdan kelgan ma’lumot. Uni soxtalashtirish `initDataUnsafe` ni soxtalashtirish kabi oson. Agar manzil kirish, akkauntga bog‘lash yoki biror narsa hisoblash uchun ishlatilsa, **ton_proof** kerak.

Jarayon:

1. Backend qisqa muddatli **tasodifiy payload** (nonce) yaratadi va saqlaydi.
2. Frontend uni ulanish so‘roviga uzatadi.
3. Hamyon domeningiz, vaqt, manzil va payload bor xabarni imzolaydi.
4. Frontend imzoni backendga yuboradi.

```ts
tonConnectUI.setConnectRequestParameters({ state: "loading" });
const payload = await fetch("/api/ton-proof/payload").then((r) => r.text());
tonConnectUI.setConnectRequestParameters({ state: "ready", value: { tonProof: payload } });

tonConnectUI.onStatusChange((wallet) => {
  const item = wallet?.connectItems?.tonProof;
  if (wallet && item && "proof" in item) {
    fetch("/api/ton-proof/check", {
      method: "POST",
      body: JSON.stringify({ account: wallet.account, proof: item.proof }),
    });
  }
});
```

Backend nimani tekshiradi:

- **payload** siz tomondan berilgan, muddati o‘tmagan va hali ishlatilmagan;
- isbotdagi **domen** sizniki bilan mos keladi;
- **timestamp** yangi;
- **ochiq kalit** `walletStateInit` dan yoki hamyon kontraktiga so‘rov orqali olingan va undan haqiqatan da’vo qilingan manzil kelib chiqadi;
- **Ed25519 imzosi** TON Connect spetsifikatsiyasi bo‘yicha yig‘ilgan xabar uchun to‘g‘ri.

Imzolanadigan xabarni yig‘ishda baytlar tartibida xato qilish oson. O‘zingiz yozgan yechimga emas, TON Connect ning rasmiy backend misollariga tayaning. Tekshiruvdan keyin o‘z sessiya tokeningizni bering.

## 3-qadam. Tranzaksiya yuborish

```ts
import { beginCell, toNano } from "@ton/core";

const comment = beginCell().storeUint(0, 32).storeStringTail(`order:${orderId}`).endCell();

await tonConnectUI.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 300,
  messages: [
    {
      address: MERCHANT_ADDRESS,
      amount: toNano("1.5").toString(),
      payload: comment.toBoc().toString("base64"),
    },
  ],
});
```

- `amount` — **nanotonlarda**, satr ko‘rinishida.
- Buyurtma raqami yozilgan izoh to‘lovni buyurtma bilan solishtirishga yordam beradi.
- `validUntil` foydalanuvchi tranzaksiyani tasdiqlashi mumkin bo‘lgan vaqtni cheklaydi.

**Asosiy qoida:** `sendTransaction` ning muvaffaqiyatli javobi hamyon xabarni yuborganini bildiradi, pul kelganini emas. «To‘langan» belgisini **backend** qo‘yadi — indeksator yoki blokcheyn API orqali manzilingizga kelgan tranzaksiyani topib, summa, manzil va izohni solishtirgandan keyin. Ishlov berish idempotent bo‘lishi kerak: bitta tranzaksiya — bitta buyurtma.

## Qoidalar va tartibga solish

TON ni texnik jihatdan ulash oson. Huquqiy qismi murakkabroq.

- **Telegram qoidalari.** Mini App ichidagi raqamli tovar va xizmatlar uchun Telegram **Stars** da to‘lovni talab qiladi. Mini App ekotizimidagi kripto funksiyalar TON va TON Connect ga yo‘naltirilgan. Ishga tushirishdan oldin amaldagi qoidalarni tekshiring.
- **Mahalliy qonunchilik.** Ko‘plab mamlakatlarda, jumladan O‘zbekistonda, kriptoaktivlar aylanmasi alohida tartibga solinadi, ular bilan bog‘liq xizmatlar esa litsenziya talab qiladi. Kriptoni to‘lov sifatida qabul qilish cheklangan bo‘lishi mumkin.
- **KYC va AML.** Biznes modelingizga qarab mijozlarni identifikatsiya qilish va mablag‘lar manbasini tekshirish kerak bo‘lishi mumkin.
- **Soliqlar va buxgalteriya.** Tushumlarni qanday va qaysi kurs bo‘yicha hisobga olishni bilish kerak.
- **Qaytarib bo‘lmaslik.** Blokcheyndagi tranzaksiyani bekor qilib bo‘lmaydi — qaytarishlarni alohida jarayon sifatida o‘ylab chiqing.
- **Volatillik.** TON narxi o‘zgarib turadi: kursni qisqa vaqtga qotiring yoki ruxsat etilgan bo‘lsa, steyblkoinlardan foydalaning.

Ishlab chiqishdan oldin yurisdiksiyangiz va modelingiz bo‘yicha yurist maslahatini oling.

## FAQ

### Faqat to‘lov qabul qilsam, ton_proof kerakmi?

Oddiy buyurtma to‘lovi uchun serverda kelgan tranzaksiyani tekshirish yetarli. ton_proof hamyon manzili tizimingiz uchun biror narsani anglatganda kerak: kirish, akkauntga bog‘lash, ruxsat berish.

### Nega hamyonda tasdiqlagandan keyin foydalanuvchi Mini App ga qaytmadi?

`twaReturnUrl` ni tekshiring — u Telegram dagi Mini App ingizga olib borishi kerak. Usiz tashqi hamyon foydalanuvchini qayerga qaytarishni bilmaydi.

### Raqamli tovarlar uchun TON da to‘lov qabul qilish mumkinmi?

Telegram qoidalariga ko‘ra Mini App lardagi raqamli tovar va xizmatlar Stars evaziga sotiladi. TON ni qoidalar ruxsat bergan ssenariylarda ishlating va qoidalarning so‘nggi versiyasi bilan solishtiring.
