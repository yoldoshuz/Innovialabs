---
title: Swift asoslari: sintaksis, optional’lar va strukturalar
description: Swift’ning asosiy imkoniyatlari: let va var, optional’lar va ularni ochish, struct va class farqi, enum va closure’lar — qisqa kod misollari bilan.
summary: Swift’da avval beshta narsani o‘zlashtiring: let/var, optional’larni xavfsiz ochish, struct (qiymat) va class (havola) farqi, enum va closure’lar — iOS kodining deyarli hammasi shularga tayanadi.
---

## Avvalo nimani bilish kerak

**Swift** — Apple’ning iOS, macOS, watchOS va server dasturlash uchun tili. U qat’iy tiplashtirilgan, lekin tip ko‘pincha avtomatik aniqlanadi. Yangi boshlovchi deyarli darhol beshta mavzuga duch keladi: **konstantalar va o‘zgaruvchilar**, **optional’lar**, **strukturalar va klasslar**, **enum’lar** va **closure’lar**. Har birini qisqa misollar bilan ko‘rib chiqamiz — ularni Xcode Playground’da yoki swift.org’dagi vositalar bilan ishga tushirish mumkin.

## let va var

- `let` — konstanta, qiymat berilgandan keyin o‘zgarmaydi.
- `var` — o‘zgaruvchi.

```swift
let name = "Aziz"        // String tipi avtomatik aniqlanadi
var score = 10
score += 5               // mumkin
// name = "Bobur"        // kompilyatsiya xatosi
let price: Double = 9.5  // tipni aniq ko‘rsatish ham mumkin
```

Qoida: **sukut bo‘yicha `let` yozing**, `var` esa faqat qiymat haqiqatan o‘zgarganda kerak. `var` ortiqcha bo‘lsa, kompilyator o‘zi aytadi.

## Optional’lar va ularni ochish

**Optional** (`String?`, `Int?`) degani: «bu yerda qiymat bo‘lishi ham, `nil` bo‘lishi ham mumkin». Oddiy `String` hech qachon `nil` bo‘lmaydi — bu butun bir turdagi xatolardan himoya qiladi.

```swift
let input = "42"
let number: Int? = Int(input)   // satr son bo‘lmasligi mumkin

// 1. if let — qiymat bo‘lsa, ochish
if let n = number {
    print("Son: \(n)")
}

// 2. guard let — qiymat bo‘lmasa, erta chiqish
func double(_ value: Int?) -> Int {
    guard let v = value else { return 0 }
    return v * 2
}

// 3. ?? — sukut bo‘yicha qiymat
let safe = number ?? 0

// 4. ?. — optional zanjir
let length = Int("abc")?.description.count  // nil
```

**Majburiy ochish** `number!` ham bor. Agar ichida `nil` bo‘lsa, ilova qulaydi. Undan faqat qiymat kafolatlangan holda foydalaning, eng yaxshisi — umuman ishlatmang.

## Strukturalar va klasslar

Asosiy farq — **struct qiymat bo‘yicha, class havola bo‘yicha uzatiladi**.

```swift
struct Point { var x: Int; var y: Int }
class Counter { var value = 0 }

var a = Point(x: 1, y: 2)
var b = a          // nusxa
b.x = 100          // a.x hali ham 1

let c1 = Counter()
let c2 = c1        // o‘sha havola
c2.value = 5       // c1.value ham 5
```

| | struct | class |
|---|---|---|
| Uzatish | qiymat nusxasi | obyektga havola |
| Meros olish | yo‘q | bor |
| Avtomatik initsializator | bor (memberwise) | yo‘q |
| Metodda o‘zgartirish | `mutating` kerak | erkin |

Swift amaliyoti: **struct’dan boshlang**, class’ni esa umumiy o‘zgaruvchan obyekt, meros olish yoki Objective-C API bilan moslik kerak bo‘lganda oling.

## Enum’lar

Swift’dagi `enum` — shunchaki konstantalar to‘plami emas. Variantlar bog‘langan qiymatlarni saqlashi mumkin, `switch` esa barcha holatlarni qamrab olishi shart.

```swift
enum PaymentStatus {
    case pending
    case paid(amount: Double)
    case failed(reason: String)
}

let status = PaymentStatus.paid(amount: 250)

switch status {
case .pending:            print("Kutilmoqda")
case .paid(let amount):   print("To‘landi: \(amount)")
case .failed(let reason): print("Xato: \(reason)")
}
```

Yangi variant qo‘shsangiz, kompilyator yangilash kerak bo‘lgan barcha `switch`’larni ko‘rsatadi.

## Closure’lar

**Closure** — nomsiz funksiya bo‘lib, uni qiymat sifatida uzatish mumkin. Ular saralash, filtrlash va callback’lar uchun doimo ishlatiladi.

```swift
let prices = [120, 45, 80]

let sorted = prices.sorted { $0 < $1 }        // [45, 80, 120]
let expensive = prices.filter { $0 > 50 }     // [120, 80]
let labels = prices.map { "\($0) so‘m" }

func load(completion: (String) -> Void) {
    completion("tayyor")
}
load { result in print(result) }
```

`$0`, `$1` — argumentlarning qisqa nomlari. Closure’ni qavsdan keyin yozish **trailing closure** deyiladi.

## Yangi boshlovchilarning keng tarqalgan xatolari

- `if let` / `guard let` o‘rniga hamma joyda `!` qo‘yish.
- Boshqa tillardagi odat bo‘yicha hamma narsani class qilish.
- `let` yetarli bo‘lgan joyda `var` ishlatish.
- Enum bo‘yicha `switch`’da `default` yozib, yangi variantlar haqida kompilyator ogohlantirishini yo‘qotish.

Tilning rasmiy qo‘llanmasi — [The Swift Programming Language](https://docs.swift.org/swift-book/).

## FAQ

### Swift’ni o‘rganish uchun Mac kerakmi?

iOS uchun dasturlashda — ha, Xcode kerak, u esa faqat macOS’da ishlaydi. Tilning o‘zini rasmiy saytdan Swift o‘rnatib, Linux yoki Windows’da ham o‘rganish mumkin.

### Optional boshqa tillardagi null’dan nimasi bilan farq qiladi?

Swift’da oddiy tip `nil` bo‘la olmaydi. Qiymat yo‘qligi ehtimoli tipda aniq ko‘rinadi (`String?`), va kompilyator undan foydalanishdan oldin bu holatni qayta ishlashga majbur qiladi.

### Qachon baribir struct o‘rniga class tanlash kerak?

Obyekt dasturning bir nechta qismi uchun umumiy bo‘lishi va o‘zgarishlar hammaga ko‘rinishi kerak bo‘lganda, meros olish zarur bo‘lganda yoki foydalanilayotgan freymvork buni talab qilganda.
