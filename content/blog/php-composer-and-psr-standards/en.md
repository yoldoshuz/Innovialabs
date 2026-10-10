---
title: PHP Composer and PSR Standards: Setting Up a Modern Project
description: Build a clean PHP project skeleton: composer.json, PSR-4 autoloading, PSR-12 coding style, plus PHPStan and PHP-CS-Fixer for predictable code.
summary: A modern PHP project starts with composer.json: Composer installs dependencies and provides PSR-4 autoloading, while PHP-CS-Fixer and PHPStan enforce PSR-12 style and catch bugs before runtime.
---

## What a modern PHP project is made of

The minimum set worth starting any project with:

- **Composer** — dependency manager and class autoloader.
- **PSR-4** — the rule that maps a class name to a file path.
- **PSR-12** — a shared coding style, so any developer can read the project without adjusting.
- **PHP-CS-Fixer** — automatically formats code to that style.
- **PHPStan** — static analysis: finds type errors and typos without running the code.

PSRs are recommendations from the PHP-FIG group, supported by most frameworks and libraries.

## Step 1. composer.json

Start with `composer init` or write the file by hand:

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

Key points:

- **require** is what production needs; **require-dev** holds development tools.
- Declare the PHP version in `require` so Composer refuses incompatible packages.
- **Commit composer.lock** for applications. It pins exact versions so everyone gets the same build.
- On the server, install with `composer install --no-dev --optimize-autoloader`.

## Step 2. PSR-4 autoloading

PSR-4 maps a namespace to a folder. With the config above, `Acme\Shop\Order\Invoice` must live in `src/Order/Invoice.php`:

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

Include the autoloader once at the entry point:

```php
require __DIR__ . '/../vendor/autoload.php';
```

After changing the `autoload` section, run `composer dump-autoload`. File and folder names must match the class name's case exactly: on a Linux server `invoice.php` and `Invoice.php` are different files.

## Step 3. Code style: PSR-12 and PHP-CS-Fixer

PSR-12 covers indentation, brace placement, `use` ordering and type declarations. You do not need to memorize it — PHP-CS-Fixer does the work. Config in `.php-cs-fixer.dist.php`:

```php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/tests']);

return (new PhpCsFixer\Config())
    ->setRules(['@PSR12' => true])
    ->setFinder($finder);
```

Commands:

- `vendor/bin/php-cs-fixer fix` — fix the code;
- `vendor/bin/php-cs-fixer fix --dry-run --diff` — only report violations (for CI).

You can swap the `@PSR12` rule set for the newer `@PER-CS`, which evolves PSR-12.

## Step 4. Static analysis: PHPStan

PHPStan checks types, missing methods and wrong arguments. The `phpstan.neon` file:

```yaml
parameters:
    level: 6
    paths:
        - src
        - tests
```

Run it with `vendor/bin/phpstan analyse`.

Rolling it out without pain:

- In a new project, start at a high strictness level.
- In legacy code, start low and raise it gradually, or record current errors in a **baseline** (`--generate-baseline`) and block only new ones.

## Step 5. Scripts and CI

Group the commands in the `scripts` section of composer.json:

```json
"scripts": {
    "cs": "php-cs-fixer fix --dry-run --diff",
    "stan": "phpstan analyse",
    "check": ["@cs", "@stan"]
}
```

Now `composer check` runs the same way on a laptop and in CI. A pipeline that fails on style violations and analysis errors is more reliable than any team agreement.

## Common mistakes

- **Not committing composer.lock** — the server installs different package versions.
- **Editing code in vendor/** — changes vanish on the next install.
- **Namespace and path mismatch** — the class is not found, but only in production.
- **Turning analysis to maximum on legacy code** — thousands of errors, and the tool gets switched off.

## FAQ

### Do I need all this for a small project?
Composer and PSR-4 always — they are simply easier than manual requires. PHP-CS-Fixer and PHPStan take minutes to set up and pay off as soon as more than one person works on the code.

### How is PHPStan different from Psalm?
Both do static analysis of PHP with similar capabilities. Pick one and keep it in CI — regular checks matter more than the specific tool.

### Do frameworks follow PSR?
Most popular frameworks use PSR-4 for autoloading and support several other PSR interfaces, such as logging and HTTP messages. Check your framework's documentation for details.
