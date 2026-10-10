---
title: CI/CD для мобильных приложений: автосборка через Fastlane и Codemagic
description: Как автоматизировать подпись, сборку, тесты и загрузку в TestFlight и Google Play через Fastlane и Codemagic, нумеровать версии и хранить секреты.
summary: Fastlane описывает шаги релиза кодом — подпись, сборку, тесты и загрузку в сторы, — а Codemagic даёт облачные macOS-машины и встроенную публикацию. Их часто сочетают: Fastlane для логики, CI для запуска, секреты только в зашифрованных переменных.
---

## Что автоматизировать и чем

Ручной релиз мобильного приложения — это десяток шагов: обновить номер сборки, подписать, собрать, прогнать тесты, загрузить в TestFlight и Google Play. Каждый шаг — шанс ошибиться. Пайплайн делает это одинаково при каждом коммите или теге.

- **Fastlane** — open-source инструмент, где релиз описывается «дорожками» (lanes) в `Fastfile`. Работает локально и на любом CI.
- **Codemagic** — облачный CI/CD с macOS- и Linux-машинами, конфигом `codemagic.yaml`, встроенной подписью и публикацией в сторы. Хорошо поддерживает Flutter, React Native и нативные проекты.

Это не конкуренты: внутри Codemagic можно запускать Fastlane, если логика релиза уже описана в нём.

## Типовой пайплайн

1. Получить код и зависимости.
2. Прогнать линтер и тесты — при падении релиз останавливается.
3. Установить сертификаты и профили (iOS) или keystore (Android).
4. Выставить номер сборки.
5. Собрать `.ipa` и `.aab`.
6. Загрузить в TestFlight и во внутренний трек Google Play.
7. Уведомить команду.

## Fastlane: пример Fastfile

```ruby
default_platform(:ios)

platform :ios do
  lane :beta do
    api_key = app_store_connect_api_key(
      key_id: ENV["ASC_KEY_ID"],
      issuer_id: ENV["ASC_ISSUER_ID"],
      key_content: ENV["ASC_KEY_CONTENT"]
    )
    setup_ci
    match(type: "appstore", readonly: true, api_key: api_key)
    increment_build_number(
      build_number: latest_testflight_build_number(api_key: api_key) + 1
    )
    build_app(scheme: "App", export_method: "app-store")
    upload_to_testflight(api_key: api_key, skip_waiting_for_build_processing: true)
  end
end

platform :android do
  lane :internal do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(track: "internal")
  end
end
```

Ключевые моменты:

- **`match`** хранит сертификаты и профили в зашифрованном приватном репозитории или облачном хранилище. Вся команда и CI используют одни и те же — исчезает хаос «у меня подписывается, у тебя нет».
- **`setup_ci`** создаёт временный keychain на CI-машине.
- **Ключ App Store Connect API** вместо логина Apple ID — не нужна двухфакторная авторизация в пайплайне.
- Для Android `upload_to_play_store` использует JSON-ключ сервисного аккаунта Google Play.

## Codemagic: пример для Flutter

```yaml
workflows:
  ios-testflight:
    integrations:
      app_store_connect: CI key
    environment:
      flutter: stable
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.app
    scripts:
      - name: Dependencies
        script: flutter pub get
      - name: Tests
        script: flutter test
      - name: Signing
        script: xcode-project use-profiles
      - name: Build
        script: |
          flutter build ipa --release \
            --build-number=$BUILD_NUMBER \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

Codemagic сам получает сертификаты через интеграцию с App Store Connect. Для Android в блок `publishing` добавляется `google_play` с ключом сервисного аккаунта и треком.

## Версионирование

- **Версия** (`1.4.0`) — для пользователей. Меняйте её осознанно, вручную или по тегу.
- **Номер сборки** (`CFBundleVersion`, `versionCode`) — техническое число, которое обязано расти. Его лучше отдать машине.

Надёжные источники номера сборки:

- последний номер из TestFlight или Google Play плюс один;
- счётчик сборок CI (например, `$BUILD_NUMBER` в Codemagic);
- количество коммитов — только если история никогда не переписывается.

Не храните номер сборки как значение, которое нужно править руками в репозитории: это источник конфликтов и отклонённых загрузок.

## Секреты в пайплайне

Мобильный пайплайн работает с особо ценными файлами: Android keystore, `.p8`-ключ App Store Connect, пароль от `match`, JSON сервисного аккаунта Google.

- **Никогда не коммитьте** их в репозиторий, даже приватный.
- Храните в **зашифрованных переменных** CI. Бинарные файлы — в base64 с декодированием во время сборки.
- Выдавайте **минимальные права**: сервисному аккаунту Google Play — только на нужное приложение, ключу API — подходящую роль.
- Ограничьте, кто может запускать релизные workflow, и не запускайте их на pull request из форков.
- Сохраните **резервную копию keystore** отдельно: если подписываете сами и потеряли ключ, обновлять приложение станет крайне сложно. Play App Signing снижает этот риск.

## Частые ошибки

- Один и тот же пайплайн для каждого коммита и для релиза — разделяйте проверку и публикацию.
- Тесты запускаются после загрузки в стор, а не до.
- Сертификаты созданы вручную на разных машинах и конфликтуют.
- Нет кэша зависимостей — сборка идёт заметно дольше, чем нужно.

## FAQ

### Fastlane или Codemagic — что выбрать?

Если нужен готовый облачный CI с macOS без настройки своих машин — Codemagic. Если релизная логика сложная или уже есть другой CI (GitHub Actions, GitLab CI) — Fastlane. Часто их используют вместе.

### Можно ли собирать iOS без Mac?

Сборка iOS требует macOS и Xcode, но не обязательно вашего компьютера: облачные CI предоставляют macOS-машины.

### Как часто выкладывать сборки в TestFlight?

Удобно отправлять сборку из основной ветки после каждого слияния или по расписанию, а в продакшн — по тегу. Так тестировщики всегда видят актуальную версию.
