---
title: QA-muhandis roadmap’i: qo‘lda testlashdan avtomatlashtirishgacha
description: Bo‘lajak QA-muhandis uchun reja: qo‘lda testlash asoslari, test hujjatlari, API va SQL, keyin dasturlash, avtotest freymvorklari va CI.
summary: Qo‘lda testlashdan boshlang: nazariya, test-keyslar, bag-reportlar, DevTools, API va SQL; so‘ng bitta dasturlash tili, avtotest freymvorki va testlarni CI’da ishga tushirishni o‘rganing, har bosqichda portfolio yig‘ing.
---

## Qisqa yo‘nalish

QA-muhandis yo‘lini ikki katta qismga bo‘lish qulay:

1. **Qo‘lda testlash** — nimani va qanday tekshirishni tushunish.
2. **Avtomatlashtirish** — tekshiruvlarni o‘zi ishga tushadigan kodga aylantirish.

«To‘g‘ridan-to‘g‘ri avtomatlashtirishga» deb birinchi qismni o‘tkazib yuborish — keng tarqalgan xato. Avtotest faqat **qaysi ssenariyni** avtomatlashtirish kerakligini va **nimani** xato deb hisoblashni bilsangizgina foydali.

## 1-qism. Qo‘lda testlash

### Nazariya

- Testlash maqsadi va **verification** hamda **validation** o‘rtasidagi farq.
- Testlash turlari: funksional, regressiya, smoke, UI, foydalanish qulayligi.
- Test dizayni texnikalari: **ekvivalentlik sinflari**, **chegaraviy qiymatlar**, qaror jadvallari, holat o‘tishlari.
- Bagning hayot sikli: yaratilishdan yopilishgacha.

### Hujjatlar

- Tezkor tekshiruvlar uchun **chek-listlar**.
- **Test-keyslar**: qadamlar, kutilgan natija, dastlabki shartlar.
- **Bag-reportlar**: sarlavha, takrorlash qadamlari, haqiqiy va kutilgan natija, muhit, skrinshot yoki video.

Yaxshi bag-reportni muallifga savol bermasdan takrorlash mumkin.

### Texnik ko‘nikmalar

- **DevTools**: konsol, Network bo‘limi, so‘rov va javoblarni ko‘rish.
- Postman yoki shunga o‘xshash vositalar bilan **API testlash**: metodlar, status kodlari, javob tanasini tekshirish.
- Asosiy darajada **SQL**: ma’lumot haqiqatan saqlanganini tekshirish uchun.
- **Mobil testlash** asoslari: turli ekranlar, yo‘nalish, uzilishlar.

**Nazorat nuqtasi:** istalgan ochiq veb-ilovani olib, unga chek-list tuzasiz va tushunarli bag-reportlar bilan real nuqsonlarni topasiz.

## 2-qism. Avtomatlashtirishga yo‘l

### 1-qadam. Dasturlash asoslari

Sizni qiziqtirgan kompaniyalarda avtotestlar yoziladigan tilni tanlang: ko‘pincha bu Python, JavaScript/TypeScript yoki Java. O‘zgaruvchilar, shartlar, sikllar, funksiyalar, klasslar, istisnolar bilan ishlash va Git’ni o‘zlashtiring.

### 2-qadam. Test freymvorki

- Tilingizning **test-raneri** (masalan, pytest, Jest yoki JUnit).
- **UI avtomatlashtirish**: Playwright, Cypress yoki Selenium.
- **API avtotestlar**: HTTP-klient va javoblarni tekshirish.
- **Page Object** patterni va qayta ishlatiladigan fixture’lar.

```python
def test_login_shows_error_for_wrong_password(page):
    page.goto("https://example.com/login")
    page.fill("#email", "user@example.com")
    page.fill("#password", "wrong")
    page.click("button[type=submit]")
    assert page.locator(".error").is_visible()
```

### 3-qadam. CI

- Har bir pull request’da avtotestlarni ishga tushirish.
- Testlar natijasi bo‘yicha hisobotlar.
- **Beqaror testlar** bilan kurash: pauza o‘rniga aniq kutishlar, mustaqil test ma’lumotlari.

**Nazorat nuqtasi:** testlar CI’da sizning ishtirokingizsiz ishlaydi, ularning yiqilishi esa real muammoga ishora qiladi.

## Birinchi navbatda nimani avtomatlashtirish kerak

| Yaxshi nomzod | Yomon nomzod |
|---|---|
| Muntazam regressiya | Har hafta o‘zgaradigan funksiya |
| Muhim ssenariylar: kirish, to‘lov, buyurtma | Bir martalik tekshiruv |
| Ko‘p kombinatsiyali API tekshiruvlari | Qulaylik va tashqi ko‘rinishni baholash |

## Portfolio rejasi

1. **Qo‘lda testlash loyihasi:** ochiq veb-ilova uchun chek-list, 10-15 ta test-keys va bir nechta bag-report.
2. **API loyihasi:** ochiq API’ga so‘rovlar to‘plami va javoblarni tekshirish.
3. **Avtomatlashtirish loyihasi:** GitHub repozitoriyasida UI va API testlar, ularni qanday ishga tushirish haqida README bilan.
4. **CI:** shu testlarning har bir push’da avtomatik ishga tushishi.

O‘quv stendlari va amaliyot uchun yaratilgan demo-ilovalarda mashq qiling, ruxsatsiz begona ishchi xizmatlarda emas.

Har bir loyihaga qisqa tavsif qo‘shing: nimani testladingiz, qaysi texnikalarni qo‘lladingiz va qanday nuqsonlar topildi. Ish beruvchi uchun sizning fikrlash tarzingiz kodning o‘zi kabi muhim.

## FAQ

### QA-muhandis dasturlashni bilishi shartmi?

Qo‘lda testlashni boshlash uchun chuqur dasturlash shart emas, lekin asosiy ko‘nikmalar o‘sishni tezlashtiradi. Avtomatlashtirishda esa dasturlash asosiy vositaga aylanadi.

### Avtomatlashtirishdan oldin qo‘lda testlashda qancha qolish kerak?

Qat’iy muddat yo‘q. Test-keyslarni ishonch bilan tuza olsangiz, tushunarli bag-reportlar yozsangiz va veb-ilovalar hamda API qanday ishlashini tushunsangiz, o‘tishingiz mumkin.

### Qaysi avtotest freymvorkini tanlash kerak?

Qiziqtirgan kompaniyalardagi vakansiyalarni ko‘ring va ko‘proq uchraydiganini tanlang. Tamoyillar — lokatorlar, kutishlar, fixture’lar, hisobotlar — freymvorklar orasida ko‘chadi.
