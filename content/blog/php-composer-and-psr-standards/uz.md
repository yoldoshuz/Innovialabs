---
title: Composer va PSR standartlari: zamonaviy PHP loyihani sozlash
description: PHP loyiha karkasini yig‘ish: composer.json, PSR-4 autoload, PSR-12 kod uslubi, toza va bashorat qilinadigan kod uchun PHPStan va PHP-CS-Fixer.
summary: Zamonaviy PHP loyiha composer.json’dan boshlanadi: Composer bog‘liqliklarni o‘rnatadi va PSR-4 autoload beradi, PHP-CS-Fixer va PHPStan esa PSR-12 uslubini saqlab, xatolarni ishga tushirishdan oldin topadi.
---

## Zamonaviy PHP loyiha nimalardan iborat

Har qanday loyihani boshlashga arziydigan minimal to‘plam:

- **Composer** — bog‘liqliklar menejeri va klasslar autoloader’i.
- **PSR-4** — klass nomini fayl yo‘liga moslashtiruvchi qoida.
- **PSR-12** — umumiy kod uslubi, shunda istalgan dasturchi loyihani ko‘nikmasdan o‘qiydi.
- **PHP-CS-Fixer** — kodni avtomatik ravishda uslubga keltiradi.
- **PHPStan** — statik tahlil: kodni ishga tushirmasdan tip xatolari va imlo xatolarini topadi.

PSR — PHP-FIG guruhining tavsiyalari bo‘lib, ularni ko‘pchilik freymvork va kutubxonalar qo‘llab-quvvatlaydi.

## 1-qadam. composer.json

Loyihani `composer init` buyrug‘i bilan yarating yoki faylni qo‘lda yozing:

```json
{
    "name": "acme/shop",
    "type": "project",
    "require": {
        "php": ">=8.2"
    },
    "require-dev": {
        "phpstan/phpstan": "^2.0",
        "friendsofphp/php-cs-fixer": "^3.0"
    },
    "autoload": {
        "psr-4": { "Acme\\Shop\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Acme\\Shop\\Tests\\": "tests/" }
    },
    "config": {
        "sort-packages": true
    }
}
```

Asosiy jihatlar:

- **require** — production uchun kerak bo‘lgan narsalar; **require-dev** — ishlab chiqish vositalari.
- `require`da PHP versiyasini ko‘rsating: Composer mos kelmaydigan paketlarni o‘rnatishga yo‘l qo‘ymaydi.
- Ilovalar uchun **composer.lock**ni repozitoriyga commit qiling. U aniq versiyalarni qayd etadi va hammada bir xil yig‘iladi.
- Serverda bog‘liqliklarni `composer install --no-dev --optimize-autoloader` buyrug‘i bilan o‘rnating.

## 2-qadam. PSR-4 bo‘yicha autoload

PSR-4 namespace’ni papka bilan bog‘laydi. Yuqoridagi sozlamada `Acme\Shop\Order\Invoice` klassi `src/Order/Invoice.php`da joylashishi kerak:

```php
<?php

declare(strict_types=1);

namespace Acme\Shop\Order;

final class Invoice
{
    public function __construct(
        private readonly int $amount,
    ) {
    }
}
```

Autoloader’ni kirish nuqtasida bir marta ulang:

```php
require __DIR__ . '/../vendor/autoload.php';
```

`autoload` bo‘limini o‘zgartirgandan keyin `composer dump-autoload`ni bajaring. Fayl va papka nomlaridagi harf registri klass nomiga aynan mos kelishi kerak: Linux serverda `invoice.php` va `Invoice.php` — turli fayllar.

## 3-qadam. Kod uslubi: PSR-12 va PHP-CS-Fixer

PSR-12 chekinishlar, qavslar joylashuvi, `use` tartibi va tip e’lonlarini tavsiflaydi. Uni yodlash shart emas — buni PHP-CS-Fixer bajaradi. `.php-cs-fixer.dist.php` konfiguratsiyasi:

```php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/tests']);

return (new PhpCsFixer\Config())
    ->setRules(['@PSR12' => true])
    ->setFinder($finder);
```

Buyruqlar:

- `vendor/bin/php-cs-fixer fix` — kodni tuzatish;
- `vendor/bin/php-cs-fixer fix --dry-run --diff` — faqat buzilishlarni ko‘rsatish (CI uchun).

`@PSR12` qoidalar to‘plamini PSR-12’ni rivojlantiruvchi yangiroq `@PER-CS` bilan almashtirish mumkin.

## 4-qadam. Statik tahlil: PHPStan

PHPStan tiplarni, mavjud bo‘lmagan metodlarni va noto‘g‘ri argumentlarni tekshiradi. `phpstan.neon` fayli:

```yaml
parameters:
    level: 6
    paths:
        - src
        - tests
```

Ishga tushirish: `vendor/bin/phpstan analyse`.

Og‘riqsiz joriy qilish:

- Yangi loyihada yuqori qat’iylik darajasidan boshlang.
- Eski loyihada past darajadan boshlab, asta-sekin oshiring yoki joriy xatolarni **baseline**ga saqlang (`--generate-baseline`) va faqat yangilarini taqiqlang.

## 5-qadam. Skriptlar va CI

Buyruqlarni composer.json’ning `scripts` bo‘limiga yig‘ing:

```json
"scripts": {
    "cs": "php-cs-fixer fix --dry-run --diff",
    "stan": "phpstan analyse",
    "check": ["@cs", "@stan"]
}
```

Endi `composer check` dasturchida ham, CI’da ham bir xil ishga tushadi. Uslub buzilishi va tahlil xatolarida to‘xtaydigan pipeline har qanday kelishuvdan ishonchliroq.

## Ko‘p uchraydigan xatolar

- **composer.lock commit qilinmaydi** — serverda paketlarning boshqa versiyalari o‘rnatiladi.
- **vendor/ ichidagi kod tahrirlanadi** — o‘zgarishlar keyingi o‘rnatishda yo‘qoladi.
- **Namespace va yo‘l mos kelmaydi** — klass faqat production’da topilmaydi.
- **Eski kodda tahlil maksimal darajaga qo‘yiladi** — minglab xatolar chiqadi va vosita o‘chirib qo‘yiladi.

## FAQ

### Kichik loyiha uchun bularning hammasi kerakmi?
Composer va PSR-4 har doim kerak — bu qo‘lda require yozishdan qulayroq. PHP-CS-Fixer va PHPStan bir necha daqiqada sozlanadi va kod ustida bir kishidan ko‘p ishlay boshlashi bilan o‘zini oqlaydi.

### PHPStan Psalm’dan nimasi bilan farq qiladi?
Ikkalasi ham o‘xshash imkoniyatlarga ega PHP statik tahlilini bajaradi. Bittasini tanlang va CI’da saqlang — aniq vositadan ko‘ra tekshiruvlarning muntazamligi muhimroq.

### Freymvorklar PSR’ga amal qiladimi?
Ko‘pchilik mashhur freymvorklar autoload uchun PSR-4’dan foydalanadi va loglash hamda HTTP xabarlari kabi boshqa PSR interfeyslarini qo‘llab-quvvatlaydi. Tafsilotlarni o‘z freymvorkingiz hujjatlarida ko‘ring.
