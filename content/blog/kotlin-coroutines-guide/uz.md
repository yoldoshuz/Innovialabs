---
title: Kotlin’da korutinlar: amaliy kirish
description: Kotlin’da suspend funksiyalar, launch va async, dispetcherlar, tuzilmali konkurentlik va bekor qilish — tarmoq so‘rovlari misolida tushuntirilgan.
summary: Kotlin korutinlari asinxron kodni ketma-ket yozish imkonini beradi: suspend funksiyalar oqimni bloklamaydi, launch va async scope ichida ishni boshlaydi, bekor qilish esa ierarxiya bo‘ylab tarqaladi.
---

## Korutinlar nima va ular nega kerak

**Korutina** — oqimni bloklamasdan to‘xtab, keyinroq davom eta oladigan hisoblash. Kotlin’da bu tarmoq va baza bilan ishlovchi kodni colback’larsiz, oddiy ketma-ket kod sifatida yozish imkonini beradi:

```kotlin
suspend fun loadProfile(id: String): Profile {
    val user = api.getUser(id)       // to‘xtaydi, oqim bo‘sh
    val orders = api.getOrders(id)
    return Profile(user, orders)
}
```

Korutinlar **kotlinx.coroutines** kutubxonasida joylashgan. Android’da asosiy oqim qotib qolmaydi va interfeys sezgir bo‘lib qoladi.

## suspend funksiyalar

`suspend` modifikatori funksiya to‘xtashi mumkinligini bildiradi. Uni faqat boshqa suspend funksiyadan yoki korutina ichidan chaqirish mumkin.

Muhim jihatlar:

- `suspend` funksiyani o‘z-o‘zidan fonga **o‘tkazmaydi**. Og‘ir ishni baribir mos dispetcherga o‘tkazish kerak.
- Yaxshi suspend funksiya **main-safe** bo‘ladi: uni asosiy oqimdan xavfsiz chaqirish mumkin, chunki kontekstni o‘zi almashtiradi.

```kotlin
suspend fun readFile(path: String): String =
    withContext(Dispatchers.IO) {
        File(path).readText()
    }
```

## launch yoki async

| | `launch` | `async` |
|---|---|---|
| Qaytaradi | `Job` | `Deferred<T>` |
| Natija | Kerak emas | `await()` orqali olinadi |
| Qachon ishlatiladi | «Bajar va unut»: saqlash, yuborish | Natija qaytaradigan parallel so‘rovlar |

Ikki resursni parallel yuklash:

```kotlin
suspend fun loadScreen(id: String) = coroutineScope {
    val user = async { api.getUser(id) }
    val orders = async { api.getOrders(id) }
    Screen(user.await(), orders.await())
}
```

Agar so‘rovlardan biri xato bersa, ikkinchisi bekor qilinadi va xato chaqiruvchi kodga yetib boradi.

## Dispetcherlar: kod qayerda bajariladi

- **Dispatchers.Main** — UI asosiy oqimi (Android, desktop).
- **Dispatchers.IO** — tarmoq, fayllar, ma’lumotlar bazasi: bloklovchi kiritish-chiqarish.
- **Dispatchers.Default** — protsessorni yuklaydigan hisoblashlar: parsing, saralash, rasmlarga ishlov berish.

Yangi korutinlar ishga tushirish o‘rniga `withContext` orqali almashing. Ko‘plab tarmoq kutubxonalari, masalan Retrofit, o‘zi suspend funksiyalar beradi va ularni `Dispatchers.IO`ga o‘rash shart emas.

## Tuzilmali konkurentlik

Har bir korutina **CoroutineScope** ichida ishga tushadi va bu asosiy tamoyil:

- Ota-korutina barcha bolalari tugashini kutadi.
- Bolaning xatosi otani va boshqa bolalarni bekor qiladi.
- Scope bekor qilinsa, ichidagi hamma narsa bekor bo‘ladi.

Android’da tayyor scope’lardan foydalaning: ViewModel’da `viewModelScope`, Activity va Fragment’da `lifecycleScope`. Ular komponent bilan birga bekor qilinadi, shuning uchun ekran yopilgandan keyin so‘rovlar ishlashda davom etmaydi.

```kotlin
class ProfileViewModel : ViewModel() {
    fun load(id: String) {
        viewModelScope.launch {
            try {
                _state.value = UiState.Data(repo.loadProfile(id))
            } catch (e: IOException) {
                _state.value = UiState.Error
            }
        }
    }
}
```

**`GlobalScope`dan qoching**: undagi korutinlar hayot sikliga bog‘lanmagan va oson sizib ketadi.

## Bekor qilish

Korutinlarda bekor qilish **kooperativ**: kod unda ishtirok etishi kerak.

- kotlinx.coroutines’dagi barcha suspend funksiyalar (`delay`, `withContext` va boshqalar) bekor qilinishni o‘zi tekshiradi.
- Uzoq sikllarda `ensureActive()` chaqiring yoki `isActive`ni tekshiring.
- `CancellationException`ni umumiy `catch (e: Exception)` ichida yutib yubormang — uni uzating.
- Resurslarni `finally`da bo‘shating, agar u yerda suspend funksiya kerak bo‘lsa — `withContext(NonCancellable)`dan foydalaning.

Tarmoq so‘roviga taymaut:

```kotlin
val result = withTimeoutOrNull(5_000) { api.getUser(id) }
```

## Ko‘p uchraydigan xatolar

- **Production kodda runBlocking** oqimni bloklaydi — u `main` va testlar uchun.
- **Korutinani scope’siz** yoki `GlobalScope`da ishga tushirish.
- **Dispatchers.Main’da og‘ir hisoblashlar**, ular sabab interfeys qotadi.
- **await’siz async**: xato yo‘qolishi yoki kutilmaganda chiqishi mumkin.

## FAQ

### Korutinlar — bu oqimlarmi?
Yo‘q. Korutinlar oqimlarda bajariladi, lekin bitta korutina to‘xtagandan keyin boshqa oqimda davom etishi mumkin. Minglab korutinlar kichik oqimlar pulida ishlay oladi.

### Korutinlar RxJava’dan nimasi bilan farq qiladi?
Korutinlar ketma-ket kod uslubini beradi va til hamda Jetpack’ga o‘rnatilgan. Ma’lumot oqimlari uchun korutinlarda Flow bor. RxJava hali ham mavjud loyihalarda uchraydi.

### Korutinli kodni qanday test qilish kerak?
`kotlinx-coroutines-test` va `runTest` funksiyasidan foydalaning: u kechikishlarni virtual vaqt bilan o‘tkazib yuboradi va testlar tez bajariladi.
