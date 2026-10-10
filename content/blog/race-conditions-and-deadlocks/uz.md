---
title: Race condition va deadlock: sabablari va ulardan himoya
description: Race condition va deadlock qanday paydo bo‘ladi, ularni kodda qanday takrorlash va lock, atomar amallar, bloklash tartibi hamda navbatlar bilan tuzatish.
summary: Race condition bir nechta oqim umumiy ma’lumotni sinxronizatsiyasiz o‘zgartirganda, deadlock esa oqimlar bir-birining resursini aylana bo‘ylab kutganda yuzaga keladi. Yechim — sinxronizatsiya, yagona bloklash tartibi va umumiy o‘zgaruvchan holatni kamaytirish.
---
## Qisqacha: bu nima va nega xavfli

**Race condition (poyga holati)** — natija oqimlar yoki jarayonlar umumiy ma’lumot ustida amallarni qaysi tartibda bajarganiga bog‘liq bo‘lgan holat. Kod testlarda ishlaydi, yuklama ostida esa buziladi.

**Deadlock (o‘zaro bloklanish)** — oqimlar bir-birini cheksiz kutadi: birinchisi A resursini ushlab B ni kutadi, ikkinchisi B ni ushlab A ni kutadi. Dastur yiqilmaydi, shunchaki qotib qoladi.

Ikkala xato ham qiyin takrorlanadi, shuning uchun ularni prodakshnda qidirgandan ko‘ra oldindan tushunib olish foydaliroq.

## Poygani takrorlaymiz

«O‘qish — o‘zgartirish — yozish» amali atomar emas. O‘qish va yozish orasida boshqa oqim qiymatni yangilashga ulgurishi mumkin va uning o‘zgarishi yo‘qoladi.

```python
import threading

balance = 0

def deposit(n):
    global balance
    for _ in range(n):
        current = balance      # o‘qish
        balance = current + 1  # yozish

threads = [threading.Thread(target=deposit, args=(100_000,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(balance)  # 400000 dan kam chiqishi mumkin
```

Real tizimlarda xuddi shu narsa ombor qoldiqlari, balanslar va hisoblagichlar bilan sodir bo‘ladi: ikki so‘rov bir vaqtda «1 dona qoldi» deb o‘qiydi va ikkalasi ham buyurtma rasmiylashtiradi.

## Poygani qanday tuzatish kerak

- **Lock (mutex).** Kritik qismni bir vaqtda faqat bitta oqim bajaradi.

```python
lock = threading.Lock()

def deposit(n):
    global balance
    for _ in range(n):
        with lock:
            balance += 1
```

- **Atomar amallar.** Oddiy hisoblagichlar uchun Java’da `AtomicInteger`, Go’da `sync/atomic` paketi bor. Ular mutexdan tezroq, lekin faqat bitta o‘zgaruvchi uchun mos.
- **Ma’lumotlar bazasidagi atomarlik.** Kodda o‘qib, keyin qayta yozish o‘rniga shartni so‘rovning o‘ziga yozing:

```sql
UPDATE products SET stock = stock - 1
WHERE id = 42 AND stock > 0;
```

Agar 0 ta qator o‘zgargan bo‘lsa — tovar qolmagan. Murakkab mantiq uchun tranzaksiyalar va `SELECT ... FOR UPDATE` dan foydalaning.

- **Xabar almashish.** Ma’lumotga bitta oqim egalik qiladi, qolganlari unga navbat orqali vazifa yuboradi (`queue.Queue`, Go kanallari, aktorlar). Umumiy o‘zgaruvchan holat yo‘q — poyga ham yo‘q.

## Deadlockni takrorlaymiz

```python
import threading, time

a, b = threading.Lock(), threading.Lock()

def worker1():
    with a:
        time.sleep(0.1)
        with b: pass

def worker2():
    with b:
        time.sleep(0.1)
        with a: pass

threading.Thread(target=worker1).start()
threading.Thread(target=worker2).start()  # dastur qotib qoladi
```

## Deadlockdan qanday qochish mumkin

1. **Yagona bloklash tartibi.** Agar barcha oqimlar lock’larni qat’iy A, keyin B tartibida olsa, kutish aylanasi bo‘lishi mumkin emas. Tartibni resurs id’si bo‘yicha belgilang: hisoblar orasida o‘tkazmada avval kichik id’li hisobni bloklang.
2. **Taymautlar.** `lock.acquire(timeout=1)` oqimga orqaga chekinish, olganini bo‘shatish va qayta urinish imkonini beradi.
3. **Kichik kritik qismlar.** Tarmoq so‘rovlari, I/O va begona kod chaqiruvlari vaqtida lock’ni ushlab turmang.
4. **Bir nechta o‘rniga bitta lock**, agar unumdorlik imkon bersa.
5. **Navbatlar va o‘zgarmas ma’lumotlar** muammoni arxitektura darajasida yo‘qotadi.

Ma’lumotlar bazasida ham deadlock bo‘ladi: DBMS uni aniqlaydi va tranzaksiyalardan birini bekor qiladi. Kod bunday tranzaksiyani qayta bajara olishi kerak.

## Qanday aniqlash mumkin

| Vosita | Nimani topadi |
|---|---|
| `go test -race`, `go run -race` | Go’dagi ma’lumot poygalari |
| ThreadSanitizer (`-fsanitize=thread`) | C/C++ va Rust’dagi poygalar |
| Oqimlar dampi (`jstack`, `py-spy dump`) | oqimlar aynan qayerda qotgani |
| DBMS loglari | tranzaksiyalar deadlocki |
| Yuklama testlari | faqat parallel so‘rovlarda ko‘rinadigan poygalar |

Ko‘p uchraydigan xatolar: xatti-harakatni bitta so‘rov bilan tekshirish, `+=` ni atomar deb hisoblash, HTTP so‘rov vaqtida lock’ni ushlab turish va deadlock xatosini qayta urinishsiz ushlash.

## FAQ

### Python’da GIL bor, demak poyga bo‘lmaydimi?

Bo‘ladi. GIL interpretatorning ichki tuzilmalarini himoya qiladi, lekin oqim sizning o‘zgaruvchingizni o‘qish va yozish orasida almashinishi mumkin. Bundan tashqari, poygalar jarayonlar va bazaga so‘rovlar orasida ham yuzaga keladi.

### Nimani tanlash kerak: lock yoki navbat?

Umumiy hisoblagichli kichik qism uchun lock yoki atomar amal yetarli. Umumiy holat ko‘p va oqimlar soni ortsa, ma’lumotning yagona egasi bo‘lgan navbatlarni qo‘llab-quvvatlash odatda osonroq.

### Testlar bu xatolarni topishga yordam beradimi?

Oddiy unit-testlar deyarli yordam bermaydi. Poyga detektorlari, parallel so‘rovli yuklama testlari va «agar buni ikki oqim bir vaqtda bajarsa nima bo‘ladi?» degan savol bilan kod-review kerak.
