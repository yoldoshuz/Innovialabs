---
title: Rust’da egalik va qarz olish: batafsil tushuntirish
description: Rust’da egalik, ko‘chirish, havolalar, o‘zgaruvchan qarz olish va lifetime’lar — yangi boshlovchilar duch keladigan kompilyator xatolari misolida.
summary: Rust’da har bir qiymatning bitta egasi bor; uni ko‘chirish yoki qarzga berish mumkin — o‘qish uchun ko‘p marta, o‘zgartirish uchun bir marta — va havola qiymatdan uzoq yashay olmaydi.
---

## Hamma narsa tayanadigan uchta qoida

Rust xotirani garbage collector’siz **egalik** (ownership) orqali boshqaradi. Qoidalar:

1. Har bir qiymatning **aynan bitta egasi** bor — o‘zgaruvchi.
2. Ega ko‘rinish sohasidan chiqqanda qiymat **bo‘shatiladi**.
3. Qiymatni havola orqali **qarzga berish** mumkin: yoki istalgancha o‘zgarmas `&T` havola, yoki bitta o‘zgaruvchan `&mut T` — lekin bir vaqtda emas.

Kompilyator buni yig‘ish bosqichida tekshiradi. Yangi boshlovchilarning deyarli barcha «tushunarsiz» xatolari shu qoidalardan birining buzilishi. Ularni xato kodlari bo‘yicha ko‘rib chiqamiz.

## E0382: ko‘chirilgan qiymatdan foydalanish

```rust
let s = String::from("salom");
let t = s;
println!("{}", s); // error[E0382]: borrow of moved value: `s`
```

`String` ma’lumotni heap’da saqlaydi va o‘zlashtirish egalikni `t`ga **ko‘chiradi**. `s` endi yaroqsiz.

Qanday tuzatish mumkin:

- Nusxa kerak — `let t = s.clone();`. Bu aniq va qimmat bo‘lishi mumkin bo‘lgan nusxalash.
- Faqat kirish kerak — qarzga oling: `let t = &s;`.
- Funksiyaga uzatyapsiz — `String` o‘rniga `&str` yoki `&String` qabul qiling.

`i32`, `bool`, `char` kabi oddiy tiplar `Copy`ni amalga oshiradi va avtomatik nusxalanadi, shuning uchun ularda bu xato yo‘q.

## E0502: bir vaqtda o‘zgaruvchan va o‘zgarmas qarz

```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4); // error[E0502]
println!("{}", first);
```

`push` vektor xotirasini qayta ajratishi mumkin, va `first` bo‘shatilgan xotiraga ishora qilib qolardi. Rust buni taqiqlaydi.

Qanday tuzatish: o‘zgartirishdan oldin havoladan foydalanishni tugating yoki qiymatni nusxalang:

```rust
let first = v[0]; // i32 nusxalanadi
v.push(4);
```

Muhim: qarz blok oxirigacha emas, havoladan **oxirgi foydalanishgacha** davom etadi. Ko‘pincha qatorlar o‘rnini almashtirish kifoya.

## E0499: bir vaqtda ikkita o‘zgaruvchan havola

```rust
let mut s = String::new();
let a = &mut s;
let b = &mut s; // error[E0499]
a.push('x');
```

Bitta o‘zgaruvchan havola data race yo‘qligini kafolatlaydi. Yechimlar:

- Havolalardan navbat bilan foydalaning, ularni alohida `{ }` bloklar bilan cheklang.
- Strukturaning turli maydonlari uchun butun strukturani emas, maydonlarni qarzga oling.
- Slice’ning turli qismlari uchun — `split_at_mut`.

## E0106 va E0597: lifetime’lar

```rust
fn longest(a: &str, b: &str) -> &str { // error[E0106]
    if a.len() > b.len() { a } else { b }
}
```

Kompilyator natija qaysi argumentga bog‘langanini bilmaydi. **Lifetime**ni aniq ko‘rsating:

```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
```

`'a` ma’lumot qancha yashashini o‘zgartirmaydi. Bu va’da: natija argumentlarning eng qisqa yashaydiganidan uzoq yashamaydi.

E0597 xatosi («borrowed value does not live long enough») havola qiymatdan uzoq yashaganini bildiradi — masalan, lokal o‘zgaruvchiga havola qaytardingiz. Yechim — havola emas, qiymatning o‘zini (`String`) qaytarish.

## Qoidalar yetmay qolganda

Ba’zan egalik haqiqatan umumiy bo‘ladi. Buning uchun standart tiplar bor:

| Vazifa | Vosita |
|---|---|
| Bitta oqimda bir nechta ega | `Rc<T>` |
| Oqimlar orasida bir nechta ega | `Arc<T>` |
| O‘zgarmas havola orqali o‘zgartirish | `RefCell<T>`, `Mutex<T>` |

`RefCell` qarz tekshiruvini runtime’ga o‘tkazadi: buzilish kompilyatsiya xatosi emas, panic beradi. Ongli ravishda foydalaning.

## Borrow checker xatolarini qanday o‘qish kerak

- Xabarni to‘liq o‘qing: kompilyator qarz **qayerda** boshlanishi, qayerda ziddiyat borligi va havola oxirgi marta qayerda ishlatilganini ko‘rsatadi.
- `rustc --explain E0502` buyrug‘i misollar bilan batafsil tushuntirish beradi.
- Hammasini `.clone()` bilan davolamang: bu ishlaydi, lekin ma’lumotlar arxitekturasidagi muammoni yashiradi.

## FAQ

### Nega Rust qiymatni o‘zi nusxalab qo‘ymaydi?
Chunki heap’dagi ma’lumotni nusxalash resurs talab qiladi, Rust esa qimmat operatsiyalarni aniq qiladi. Faqat `Copy` tiplari avtomatik nusxalanadi.

### Lifetime’larni qo‘lda qanchalik tez-tez yozish kerak?
Kamdan-kam. Chiqarish qoidalari ko‘pchilik funksiyalarni qamrab oladi. Aniq annotatsiyalar funksiya bir nechta kirishga bog‘liq havola qaytarganda yoki struktura havolalarni saqlaganda kerak.

### Bu haqiqatan xotira xatolaridan himoya qiladimi?
Xavfsiz Rust’da egalik qoidalari osilib qolgan ko‘rsatkichlar, ikki marta bo‘shatish va data race’larni istisno qiladi. `unsafe` bloklari tekshiruvlarning bir qismini olib tashlaydi va u yerda mas’uliyat dasturchida.
