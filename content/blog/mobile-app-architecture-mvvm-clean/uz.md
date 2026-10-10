---
title: Mobil ilova arxitekturasi: MVVM va Clean Architecture amalda
description: Mobil ilovani presentation, domain va data qatlamlariga qanday ajratish, ularni DI orqali bog‘lash va Clean Architecture qachon ortiqcha ekanini tushunish.
summary: MVVM ekran mantiqini holatni beruvchi ViewModel’da saqlaydi, Clean Architecture esa use case va repozitoriy interfeyslaridan iborat domain qatlamini qo‘shadi, shunda biznes qoidalar UI, tarmoq va bazaga bog‘liq bo‘lmaydi; kichik ilovalar uchun odatda repozitoriyli MVVM yetarli.
---

## Qisqacha

**MVVM** va **Clean Architecture** turli vazifalarni hal qiladi va bir-biri bilan yaxshi uyg‘unlashadi:

- **MVVM** ekranni tartibga soladi: View faqat holatni chizadi va hodisalarni uzatadi, **ViewModel** esa ekran mantiqini saqlaydi va holatni beradi.
- **Clean Architecture** butun ilovani tartibga soladi: biznes qoidalar **domain qatlamida** yashaydi, u UI freymvork, HTTP-klient va ma’lumotlar bazasi haqida hech narsa bilmaydi.

Amalda uchta qatlam hosil bo‘ladi: **presentation** (ekranlar va ViewModel), **domain** (use case, mohiyatlar, repozitoriy interfeyslari) va **data** (API, lokal baza, repozitoriy realizatsiyalari). Bog‘liqliklar ichkariga yo‘nalgan: presentation va data domain’ga bog‘liq, domain esa hech narsaga bog‘liq emas.

## Har bir qatlamda nima bo‘ladi

| Qatlam | Nimani o‘z ichiga oladi | Nima bo‘lmasligi kerak |
|---|---|---|
| Presentation | Ekranlar, ViewModel, UI holati, navigatsiya | SQL, HTTP so‘rovlar, biznes qoidalar |
| Domain | Mohiyatlar, use case, repozitoriy interfeyslari | Freymvork importlari (Android, UIKit, Flutter) |
| Data | API-klientlar, DTO, baza, kesh, repozitoriy realizatsiyalari | UI holati, ekran mantiqi |

Domain qatlamini tekshirishning oddiy usuli: u **sof Kotlin, Swift yoki Dart** sifatida emulyatorsiz kompilyatsiya qilinishi va unit-testlar bilan qoplanishi kerak.

## Kodda qanday ko‘rinadi

Kotlin’dagi minimal misol. Domain o‘ziga nima kerakligini e’lon qiladi, data buni taqdim etadi, ViewModel esa natijani faqat holatga aylantiradi.

```kotlin
// domain: Android importlarisiz
interface OrderRepository {
    suspend fun getOrders(): List<Order>
}

class GetActiveOrders(private val repo: OrderRepository) {
    suspend operator fun invoke(): List<Order> =
        repo.getOrders().filter { it.isActive }
}

// presentation
class OrdersViewModel(
    private val getActiveOrders: GetActiveOrders
) : ViewModel() {
    private val _state = MutableStateFlow<OrdersState>(OrdersState.Loading)
    val state: StateFlow<OrdersState> = _state

    fun load() {
        viewModelScope.launch {
            _state.value = try {
                OrdersState.Content(getActiveOrders())
            } catch (e: IOException) {
                OrdersState.Error
            }
        }
    }
}
```

Data qatlamida `OrderRepositoryImpl` API-klient va DAO’ni oladi, keshni qaytarish-qaytarmaslikni hal qiladi va **DTO’larni domain mohiyatlariga aylantiradi**. ViewModel hech qachon JSON yoki baza qatorlarini ko‘rmaydi.

Xuddi shu sxema Swift’da (interface o‘rniga protocol, `ObservableObject` yoki `@Observable` orqali view model) va Flutter’da (abstrakt klass hamda Bloc, Cubit yoki Riverpod notifier) ham ishlaydi.

## Dependency injection

Qatlamlar bog‘liqliklarni o‘zi yaratmaydi, balki konstruktor orqali oladi. **Dependency injection (DI)** — bu shunchaki obyektlar grafi yig‘iladigan joy.

- **Android:** Hilt (Dagger asosida qurilgan) yoki Koin.
- **iOS:** ko‘pincha oddiy konstruktor orqali inyeksiya va composition root; kerak bo‘lsa, Factory yoki Swinject kabi kutubxonalar bor.
- **Flutter:** get_it, injectable yoki Riverpod provayderlari.

Sog‘lom DI qoidalari:

- **Interfeyslarni realizatsiyalar bilan** bitta joyda bog‘lang (`OrderRepository` va `OrderRepositoryImpl`).
- Bog‘liqliklarni faqat konstruktor orqali bering, klasslar ichida chuqur service locator chaqirishdan qoching.
- Testlarda haqiqiy realizatsiyalarni soxta (fake) obyektlar bilan almashtiring. Agar bu qiyin bo‘lsa, chegaralar noto‘g‘ri chizilgan.

## Modullar tuzilmasi

Avval **fichalar bo‘yicha**, ficha ichida esa qatlamlar bo‘yicha guruhlang:

```text
app/
core/
  network/
  database/
  ui/
feature/
  orders/
    presentation/
    domain/
    data/
  profile/
```

Paketlar yoki papkalardan boshlang. Yig‘ish vaqti oshganda yoki bir nechta jamoa parallel ishlaganda alohida Gradle modullari, Swift packages yoki Dart packages’ga o‘ting: modullar chegaralarni intizom bilan emas, kompilyator bilan nazorat qiladi.

## Qachon bu ortiqcha

To‘liq Clean Architecture qo‘shimcha fayllar, mapping va bilvosita qatlamlar evaziga keladi. U o‘zini oqlamasligi mumkin, agar:

- ilova qayta yozilishi mumkin bo‘lgan prototip yoki MVP bo‘lsa;
- ekranlar asosan o‘z qoidalarisiz API ma’lumotlarini ko‘rsatsa;
- uni bitta dasturchi qo‘llab-quvvatlasa va umri qisqa bo‘lsa.

Bunday hollarda **MVVM va repozitoriylar** yetarli: ViewModel use case’siz to‘g‘ridan-to‘g‘ri repozitoriyga murojaat qiladi. Haqiqiy biznes qoidalar paydo bo‘lganda domain qatlamini keyinroq, ficha-baficha qo‘shish mumkin.

To‘liq yondashuv kerakligining belgilari: murakkab qoidalar (narxlar, ruxsatlar, statuslar), sinxronizatsiyali oflayn rejim, bir nechta ma’lumot manbasi, bir nechta jamoa yoki platformalar uchun umumiy mantiq.

## Ko‘p uchraydigan xatolar

- **Vositachi use case’lar** — faqat bitta repozitoriy metodini chaqiradi. Qoida bo‘lmasa, ularni yaratmang.
- **Domain’da freymvork turlari**: `Context`, `UIImage`, `BuildContext` yoki JSON annotatsiyalari.
- **ViewModel View’larga havola saqlaydi** yoki navigatsiyani UI obyektlari orqali boshqaradi.
- **Ulkan BaseViewModel** — barcha ekranlar undan meros oladi va uni o‘zgartirishga hech kim jur’at etmaydi.
- **Juda erta juda ko‘p modul**: yig‘ish konfiguratsiyasi mahsulotdan tezroq o‘sadi.
- **Hamma narsa uchun bitta model**: UI’ga sizib chiqqan DTO ekranlarni backend formatiga bog‘lab qo‘yadi.

## FAQ

### Har bir amal uchun use case kerakmi?

Yo‘q. Use case unda qoida bo‘lsa, bir nechta repozitoriyni birlashtirsa yoki turli ekranlarda qayta ishlatilsa, ma’noga ega. Oddiy ma’lumot o‘qish ViewModel’dan to‘g‘ridan-to‘g‘ri repozitoriyga borishi mumkin.

### MVVM yoki MVI?

MVI — xuddi shu g‘oyaning qat’iyroq shakli: bitta o‘zgarmas holat va foydalanuvchining aniq niyatlari. U ko‘p holatli murakkab ekranlar uchun qulay. Ikkalasi ham Clean Architecture’ga mos keladi, chunki faqat presentation qatlamiga ta’sir qiladi.

### Bu Flutter, SwiftUI va Compose’ga ham tegishlimi?

Ha. Deklarativ UI freymvorklar View holatni qanday chizishini o‘zgartiradi, lekin biznes qoidalar va ma’lumotlarga kirish qayerda yashashini o‘zgartirmaydi. Qatlamlar va bog‘liqlik qoidasi o‘zgarishsiz qoladi.
