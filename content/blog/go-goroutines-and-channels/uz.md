---
title: Go’da goroutine va kanallar: konkurentlik bo‘yicha qo‘llanma
description: Goroutine’larni ishga tushirish, buferli va bufersiz kanallar orqali ma’lumot uzatish, select, WaitGroup va context’dan sizishlarsiz foydalanish.
summary: Goroutine — go orqali ishga tushadigan yengil funksiya, kanal esa unga ma’lumotni xavfsiz uzatish usuli; tugashini WaitGroup va context boshqaradi, aks holda goroutine’lar sizib ketadi.
---

## Qisqa javob: Go’da konkurentlik qanday ishlaydi

**Goroutine** — Go runtime qolgan kod bilan parallel bajaradigan funksiya. U `go` kalit so‘zi bilan ishga tushadi va arzon: bir vaqtda minglab goroutine bo‘lishi odatiy hol.

**Kanal** — goroutine’lar ma’lumot almashadigan tiplangan quvur. Go tamoyili: xotirani bo‘lishib muloqot qilmang, muloqot orqali xotirani bo‘lishing.

```go
func main() {
    ch := make(chan string)
    go func() {
        ch <- "tayyor"
    }()
    fmt.Println(<-ch)
}
```

Kanaldan o‘qilmasa, `main` goroutine’dan oldin tugab, xabar yo‘qolardi.

## Bufersiz va buferli kanallar

| Turi | Yaratish | Xatti-harakati |
|---|---|---|
| Bufersiz | `make(chan int)` | Yuborish kimdir o‘qimaguncha kutadi. Bu sinxronlash nuqtasi |
| Buferli | `make(chan int, 10)` | Yuborish faqat bufer to‘lganda bloklanadi |

Amaliy qoidalar:

- **Bufersiz** kanal — qabul qiluvchi qiymatni haqiqatan olgani muhim bo‘lganda.
- **Buferli** — tez ishlab chiqaruvchi va sekin iste’molchi orasidagi to‘lqinlarni yumshatish uchun. Bufer deadlock’ni tuzatmaydi, faqat kechiktiradi.
- **Kanalni yuboruvchi yopadi**, qabul qiluvchi emas. Yopiq kanaldan o‘qish nol qiymat qaytaradi, yopiq kanalga yuborish esa panic beradi.
- `for v := range ch` kanal yopilguncha o‘qiydi.

## select: bir nechta hodisani kutish

`select` bir nechta kanaldan birinchi tayyor bo‘lganini kutadi. Odatiy qo‘llanilishi — taymaut:

```go
select {
case res := <-results:
    fmt.Println(res)
case <-time.After(2 * time.Second):
    fmt.Println("taymaut")
}
```

`default` tarmog‘i `select`ni bloklamaydigan qiladi: hech bir kanal tayyor bo‘lmasa, darhol u bajariladi.

## WaitGroup: goroutine’lar guruhini kutish

Natija kerak bo‘lmay, faqat tugashini kutish kerak bo‘lsa, `sync.WaitGroup`dan foydalaning:

```go
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait()
```

`Add`ni goroutine ishga tushishidan **oldin** chaqiring, `Done`ni esa `defer` orqali — shunda erta chiqishda ham ishlaydi.

## context: bekor qilish va muddatlar

`context.Context` bekor qilish signalini chaqiruvlar zanjiri bo‘ylab pastga uzatadi. Bu osilib qolgan goroutine’larga qarshi asosiy vosita:

```go
func worker(ctx context.Context, jobs <-chan int) {
    for {
        select {
        case <-ctx.Done():
            return
        case j, ok := <-jobs:
            if !ok {
                return
            }
            process(j)
        }
    }
}
```

Kontekstni `context.WithTimeout` yoki `context.WithCancel` bilan yarating va har doim `defer cancel()` yozing.

## Goroutine sizishidan qanday qochish kerak

Sizish — abadiy bloklangan va hech qachon tugamaydigan goroutine. U xotirani bo‘shatmaydi. Ko‘p uchraydigan sabablar:

- **Hech kim o‘qimaydigan kanalga yuborish**, masalan chaqiruvchi kod taymautdan keyin. Yechim: 1 lik bufer yoki `ctx.Done()` bilan `select`.
- **Hech kim yopmaydigan kanaldan o‘qish.** Kanal egasi kim va uni kim yopishini kelishib oling.
- **Kontekstni tekshirmaydigan cheksiz sikl.**
- **Unutilgan `wg.Done()`** — `Wait` abadiy kutadi.

Tekshirish: testlarda `runtime.NumGoroutine()` yoki `pprof` profilerı goroutine’lar soni vaqt o‘tishi bilan o‘syaptimi, ko‘rsatadi.

## Ko‘p uchraydigan xatolar

- **Data race** — bir nechta goroutine umumiy map yoki slice’ga yozganda. Testlarni `-race` bayrog‘i bilan ishga tushiring.
- **Sikl o‘zgaruvchisini ushlab qolish.** Go’ning yangi versiyalarida har bir iteratsiya o‘z o‘zgaruvchisini oladi, lekin eski kodda qiymatni argument sifatida uzatgan ma’qul.
- **Har bir vazifaga cheklanmagan goroutine.** Minglab vazifalar uchun goroutine soni qat’iy bo‘lgan worker pool’dan foydalaning.

## FAQ

### Qachon kanal o‘rniga mutex ishlatish kerak?
Hisoblagich yoki kesh kabi umumiy holatni himoya qilish uchun `sync.Mutex` soddaroq va tushunarliroq. Kanallar ma’lumot bir ishlov bosqichidan boshqasiga o‘tganda qulayroq.

### Nechta goroutine ishga tushirish mumkin?
Goroutine’lar yengil, lekin bepul emas, baza yoki API kabi tashqi resurslar esa cheklangan. Bir vaqtdagi operatsiyalarni worker pool yoki semafor bilan cheklang.

### Kanalni har doim yopish shartmi?
Yo‘q. Qabul qiluvchi ma’lumot tugaganini bilishi kerak bo‘lsa, masalan `range`da, yoping. Ishlatilmayotgan kanalni garbage collector tozalaydi.
