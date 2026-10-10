---
title: Veb-ilovalarni E2E-testlash: Playwright yoki Cypress
description: E2E-testlar nimani qamrashi kerak, Playwright va Cypress tezlik, brauzerlar va qulaylik bo‘yicha qanday farq qiladi va tizimga kirish testini qanday yozish mumkin.
summary: E2E-testlar asosiy foydalanuvchi ssenariylarini haqiqiy brauzerda boshidan oxirigacha tekshiradi. Playwright krossbrauzerlik, parallellik va bir nechta vkladkada kuchliroq, Cypress esa interaktiv nosozliklarni tuzatishda; yangi loyiha uchun ko‘pincha Playwright tanlanadi.
---

## Qisqa javob

**E2E-test** (end-to-end) ilovani haqiqiy brauzerda ochadi va ssenariyni foydalanuvchi kabi bajaradi: kiradi, bosadi, formalarni to‘ldiradi, natijani tekshiradi. U unit-testlar ko‘rmaydigan narsani ushlaydi: frontend, API va ma’lumotlar bazasi o‘rtasidagi buzilgan bog‘lanishni.

Qisqacha tanlov:

- **Playwright** — turli brauzerlar (jumladan Safari dvigateli WebKit), qo‘shimcha to‘lovsiz parallel ishga tushirish, bitta testda bir nechta vkladka yoki domen kerak bo‘lganda.
- **Cypress** — jamoa uchun ko‘rgazmali interaktiv nosozliklarni tuzatish muhim bo‘lsa va testlar asosan bitta brauzerda ishlasa.

## E2E-testlar nimani qamrashi kerak

E2E-testlar unit-testlardan sekinroq va beqarorroq, shuning uchun ular kam, lekin eng muhim ssenariylarda bo‘lishi kerak:

- **kirish, ro‘yxatdan o‘tish, parolni tiklash**;
- **pulning asosiy yo‘li**: savat, rasmiylashtirish, test rejimida to‘lov;
- **asosiy forma**: ariza, bron qilish, obyekt yaratish;
- **kirish huquqlari**: foydalanuvchi boshqalarning ma’lumotlarini va admin sahifalarini ko‘rmaydi.

Har bir validatsiya tarmog‘i yoki har bir ekran maketini E2E orqali tekshirish shart emas — buning uchun unit va komponent testlari bor.

## Taqqoslash

| Mezon | Playwright | Cypress |
|---|---|---|
| Brauzerlar | Chromium, Firefox, WebKit | Chrome oilasi, Firefox, Edge; WebKit eksperimental |
| Tillar | JS/TS, Python, Java, .NET | JS/TS |
| Parallellik | O‘rnatilgan worker’lar | Pullik bulut servisi yoki uchinchi tomon yechimlari orqali |
| Bir nechta vkladka va domen | Qo‘llab-quvvatlanadi | Cheklangan, domenlar uchun `cy.origin` |
| Nosozliklarni tuzatish | UI-rejim, trace viewer | «Vaqt mashinasi»li interaktiv runner |
| Kutishlar | Avtomatik | Avtomatik |

**Tezlik** ilova va infratuzilmaga kuchli bog‘liq, lekin o‘rnatilgan parallel ishga tushirish odatda katta test to‘plamlarida Playwright’ga ustunlik beradi.

**Dasturchi uchun qulaylik**: Cypress’da juda ko‘rgazmali runner bor — har bir qadam va sahifa holati ko‘rinadi. Playwright’da codegen (harakatlarni kodga yozib olish), UI-rejim va CI’dagi xatodan keyin tahlil qilish qulay bo‘lgan trassirovka bor.

## Birinchi kirish testi: Playwright

O‘rnatish konfiguratsiya va namunaviy test yaratadi:

```bash
npm init playwright@latest
```

`playwright.config.ts` da ilovangizning `baseURL` manzilini ko‘rsating, keyin test:

```ts
import { test, expect } from "@playwright/test";

test("foydalanuvchi tizimga kiradi", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Parol").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Kirish" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Kabinet" })).toBeVisible();
});
```

Ishga tushirish: `npx playwright test`.

## Xuddi shu test: Cypress

```js
describe("kirish", () => {
  it("foydalanuvchi tizimga kiradi", () => {
    cy.visit("/login");
    cy.get('[data-testid="email"]').type("user@example.com");
    cy.get('[data-testid="password"]').type(Cypress.env("TEST_PASSWORD"), { log: false });
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});
```

## Testlarni qanday barqaror qilish kerak

- **Elementlarni rol va yozuv bo‘yicha** yoki `data-testid` orqali qidiring, CSS-klasslar bo‘yicha emas.
- **Qat’iy pauzalar qo‘ymang** — avtomatik kutishlarga tayaning.
- **Alohida test bazasi** va test foydalanuvchilari; har bir test o‘z ma’lumotlarini tayyorlaydi.
- Boshqa testlarda **API orqali kirish**: UI-loginni bir marta tekshiring, keyin saqlangan sessiyadan foydalaning.
- **Parollar muhit o‘zgaruvchilarida**, kodda emas.
- Har bir pull request’da **CI’da ishga tushirish**.

## FAQ

### Qancha E2E-test kerak?

Qancha muhim ssenariyingiz bo‘lsa, shuncha. Eng muhim besh-o‘nta yo‘ldan boshlang va test ushlashi mumkin bo‘lgan xatolarni topganingizda to‘plamni kengaytiring.

### Cypress’dan Playwright’ga o‘tish mumkinmi?

Ha, lekin avtomatik ko‘chirish yo‘q: testlar qayta yoziladi. Odatda bosqichma-bosqich o‘tishadi — yangi testlar Playwright’da, eskilari tahrirlanganda.

### E2E-testlar qo‘lda testlashni almashtiradimi?

Yo‘q. Ular takrorlanuvchi ssenariylarni ishonchli tekshiradi, lekin yangi funksionallik, qulaylik va vizual muammolarni hali ham inson ko‘rgani ma’qul.
