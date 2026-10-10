---
title: Как вызывать нативный код из Flutter и React Native
description: Platform channels во Flutter и нативные модули в React Native: когда кроссплатформенному приложению нужен нативный код и как сделать этот слой поддерживаемым.
summary: Flutter общается с нативом через platform channels (лучше с генерацией кода через Pigeon), React Native — через нативные модули (TurboModules или Expo Modules API). Нативный код нужен для SDK, сенсоров и фоновых задач; держите его тонким, типизированным и изолированным в отдельном пакете.
---

## Как это устроено

Кроссплатформенный фреймворк покрывает большую часть задач, но не все API iOS и Android. Когда нужного пакета нет, вы пишете небольшой кусок на Swift/Kotlin и вызываете его из общего кода.

- **Flutter** — **platform channels**. Dart отправляет сообщение по именованному каналу, нативная сторона его обрабатывает и возвращает результат.
  - `MethodChannel` — вызов метода с ответом;
  - `EventChannel` — поток событий из натива (сенсоры, статус подключения);
  - **Pigeon** — генератор типизированного кода для каналов вместо ручных строк.
  - Для C-библиотек есть `dart:ffi` — прямой вызов без канала.
- **React Native** — **нативные модули**. В новой архитектуре это **TurboModules** со спецификацией на TypeScript и Codegen. Альтернатива — **Expo Modules API**: модуль описывается на Swift и Kotlin в декларативном стиле и работает и в Expo-, и в обычных проектах. Для нативных UI-элементов есть нативные компоненты.

## Пример: Flutter MethodChannel

Dart:

```dart
const _channel = MethodChannel("com.example.app/battery");

Future<int> getBatteryLevel() async {
  final level = await _channel.invokeMethod<int>("getBatteryLevel");
  return level ?? -1;
}
```

Kotlin:

```kotlin
class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/battery")
      .setMethodCallHandler { call, result ->
        if (call.method == "getBatteryLevel") {
          val manager = getSystemService(BATTERY_SERVICE) as BatteryManager
          result.success(manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY))
        } else {
          result.notImplemented()
        }
      }
  }
}
```

Имена каналов и методов — строки, опечатка обнаружится только в рантайме. Поэтому для чего-то большего, чем пара методов, используйте **Pigeon**: вы описываете интерфейс на Dart, а он генерирует код для Dart, Kotlin и Swift.

```dart
@HostApi()
abstract class BatteryApi {
  int getBatteryLevel();
}
```

## Пример: модуль на Expo Modules API

```kotlin
class BatteryModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Battery")

    Function("getLevel") {
      val manager = appContext.reactContext
        ?.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
      manager?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: -1
    }
  }
}
```

```ts
import { requireNativeModule } from "expo-modules-core";

const Battery = requireNativeModule("Battery");
const level: number = Battery.getLevel();
```

Аналогичная реализация пишется на Swift для iOS.

## Когда нативный код действительно нужен

- **Сторонние SDK без плагина**: платёжные терминалы, банковские и идентификационные SDK, SDK оборудования и IoT-устройств.
- **Сенсоры и железо**, которые не покрыты пакетами или покрыты не полностью: Bluetooth-профили, NFC с нестандартными протоколами, специфические режимы камеры.
- **Фоновые задачи**: `WorkManager` и foreground-сервисы на Android, `BGTaskScheduler` на iOS, обработка геолокации в фоне.
- **Системные интеграции**: виджеты домашнего экрана, Share Extension, CallKit, Live Activities, App Clips.
- **Производительность**: обработка изображений, аудио, криптография — то, что эффективнее выполнять нативно или через C-библиотеку.

Перед написанием своего кода проверьте pub.dev, npm и React Native Directory — поддерживаемый пакет часто уже есть.

## Как сделать нативный слой поддерживаемым

1. **Изолируйте.** Выносите нативный код в отдельный плагин или пакет внутри репозитория, а не в `MainActivity` и `AppDelegate`.
2. **Типизируйте контракт.** Pigeon, Codegen или Expo Modules API вместо строковых имён и словарей.
3. **Держите слой тонким.** Натив только вызывает SDK и преобразует данные. Бизнес-логика остаётся в Dart или TypeScript.
4. **Один контракт на обе платформы.** Одинаковые имена методов, типы и коды ошибок на iOS и Android. Если функция есть только на одной платформе — явно возвращайте «не поддерживается».
5. **Не блокируйте главный поток.** Обработчики каналов и модулей по умолчанию часто выполняются на главном потоке — тяжёлую работу переносите в фон.
6. **Нормализуйте ошибки.** Превращайте нативные исключения в понятные коды и сообщения для общей части.
7. **Тестируйте обе стороны.** Мок канала или модуля в Dart/JS-тестах и нативные юнит-тесты для самой реализации.
8. **Документируйте** версии нативных SDK и шаги настройки (ключи, разрешения, записи в манифестах).

## Частые ошибки

- Логика размазана между Dart/JS и нативом — сложно понять, где искать ошибку.
- Реализация есть только для одной платформы, а вторая падает без внятного сообщения.
- Обновление нативного SDK ломает сборку, потому что версия не зафиксирована.
- Нативный код знает один человек в команде.

## FAQ

### Нужно ли знать Swift и Kotlin, чтобы писать на Flutter или React Native?

Для большинства экранов — нет. Но для интеграций с SDK, фоновых задач и сборки под сторы базовое понимание нативных платформ очень помогает, а в сложных проектах становится необходимым.

### Что выбрать во Flutter: MethodChannel или Pigeon?

Для одного-двух простых вызовов подойдёт `MethodChannel`. Если методов больше или передаются сложные структуры, Pigeon экономит время и избавляет от ошибок в именах и типах.

### Если нужно много нативного кода, может, проще писать нативное приложение?

Иногда да. Если большая часть ценности приложения в платформенных функциях, нативная разработка может оказаться проще. Если нативных точек немного, кроссплатформенный подход с изолированным нативным слоем обычно выгоднее.
