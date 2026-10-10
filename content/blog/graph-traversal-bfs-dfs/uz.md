---
title: Graflarni aylanib chiqish: BFS va DFS kod misollari bilan
description: Grafni kodda qanday saqlash, kenglik va chuqurlik bo‘yicha qidiruv qanday ishlashi hamda ular qayerda qo‘llanishi: eng qisqa yo‘l, sikllar, bog‘liqliklar.
summary: BFS grafni navbat yordamida qatlamma-qatlam aylanadi va vaznsiz grafda eng qisqa yo‘lni topadi, DFS esa stek yoki rekursiya bilan chuqurlikka boradi va sikllarni topish hamda topologik saralash uchun mos.
---
## Qisqa javob: farqi nimada

**BFS (kenglik bo‘yicha qidiruv)** avval boshlang‘ich cho‘qqining barcha qo‘shnilariga, keyin ularning qo‘shnilariga boradi va hokazo. U **navbat** (queue) ishlatadi va vaznsiz grafda har bir cho‘qqiga eng qisqa yo‘l bilan yetib borishni kafolatlaydi.

**DFS (chuqurlik bo‘yicha qidiruv)** bitta tarmoq bo‘ylab oxirigacha boradi, so‘ng orqaga qaytadi. U **stek** (aniq stek yoki rekursiyadagi chaqiruvlar steki) ishlatadi va yo‘llar tuzilishi muhim bo‘lgan joyda qulay: sikllar, bog‘langan komponentlar, bog‘liqliklar tartibi.

Ikkalasi ham har bir cho‘qqi va qirraga bir marta kiradi, murakkabligi **O(V + E)**, bu yerda V — cho‘qqilar soni, E — qirralar soni.

## Grafni qanday saqlash kerak

| Ko‘rinish | Xotira | Qirrani tekshirish | Qachon tanlash |
|---|---|---|---|
| Qo‘shnilik ro‘yxati | O(V + E) | O(cho‘qqi darajasi) | Deyarli har doim, ayniqsa siyrak graflar uchun |
| Qo‘shnilik matritsasi | O(V²) | O(1) | Kichik va zich graflar |
| Qirralar ro‘yxati | O(E) | O(E) | Qirralar ustidagi algoritmlar, BDda saqlash |

Ko‘pchilik vazifalar uchun lug‘at yetarli: kalit — cho‘qqi, qiymat — qo‘shnilar ro‘yxati.

```python
graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D", "E"],
    "D": ["F"],
    "E": ["F"],
    "F": [],
}
```

## BFS: vaznsiz grafda eng qisqa yo‘l

```python
from collections import deque

def shortest_path(graph, start, goal):
    queue = deque([start])
    parent = {start: None}
    while queue:
        node = queue.popleft()
        if node == goal:
            path = []
            while node is not None:
                path.append(node)
                node = parent[node]
            return path[::-1]
        for nxt in graph[node]:
            if nxt not in parent:
                parent[nxt] = node
                queue.append(nxt)
    return None
```

Asosiy jihatlar:

- Cho‘qqi **navbatga qo‘shilgan paytda** ko‘rilgan deb belgilanadi, chiqarilganda emas — aks holda u navbatga bir necha marta tushadi.
- `parent` lug‘ati bir vaqtda ko‘rilganlar to‘plami vazifasini bajaradi va yo‘lni tiklashga imkon beradi.
- `deque` ishlating: Python’da `list.pop(0)` chiziqli vaqt oladi.

Qo‘llanilishi: eng kam o‘tkazmali marshrut, ijtimoiy tarmoqda «do‘stlarning do‘stlari», saytni daraja bo‘yicha crawler bilan aylanish, to‘rda sohani to‘ldirish.

## DFS: yo‘naltirilgan grafda siklni topish

Yo‘naltirilgan grafda «cho‘qqi ko‘rilganmi» degan ma’lumot yetmaydi. Uchta holat kerak: ko‘rilmagan, **jarayonda** (joriy yo‘lda) va tugallangan. Agar «jarayonda»gi cho‘qqiga duch kelsak — sikl topildi.

```python
def has_cycle(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {v: WHITE for v in graph}

    def visit(v):
        color[v] = GRAY
        for nxt in graph[v]:
            if color[nxt] == GRAY:
                return True
            if color[nxt] == WHITE and visit(nxt):
                return True
        color[v] = BLACK
        return False

    return any(color[v] == WHITE and visit(v) for v in graph)
```

## DFS: bog‘liqliklar tartibi

Paket menejerlari, build tizimlari va BD migratsiyalari bitta vazifani hal qiladi: bog‘liqlik unga bog‘liq bo‘lgan qadamdan oldin bajarilishi kerak. Bu **topologik saralash** bo‘lib, DFS asosida quriladi: cho‘qqi uning barcha avlodlari ishlangandan keyin natijaga qo‘shiladi, so‘ng ro‘yxat teskari aylantiriladi.

```python
def topo_sort(graph):
    seen, order = set(), []
    def visit(v):
        seen.add(v)
        for nxt in graph[v]:
            if nxt not in seen:
                visit(nxt)
        order.append(v)
    for v in graph:
        if v not in seen:
            visit(v)
    return order[::-1]
```

Natija faqat siklsiz graf uchun to‘g‘ri, shuning uchun amalda u yuqoridagi sikl tekshiruvi bilan birga ishlatiladi.

## Qanday tanlash kerak

- **Qadamlar soni bo‘yicha eng qisqa yo‘l** kerak — BFS.
- **Sikllar, komponentlar, topologik tartib, barcha yo‘llarni ko‘rib chiqish** kerak — DFS.
- Qirralarning **vazni** bor — ikkalasi ham mos emas, Deykstra algoritmi yoki uning analoglari kerak.
- Graf juda chuqur — rekursiv DFS stek limitiga urilishi mumkin, uni aniq stekka o‘tkazing.

## Keng tarqalgan xatolar

- Ko‘rilgan cho‘qqilar to‘plamini unutish — siklli grafda aylanish cheksiz bo‘lib qoladi.
- Bog‘lanmagan grafda faqat bitta komponentni aylanish. Har bir ko‘rilmagan cho‘qqidan boshlang.
- Vaznli grafda BFS ishlatib, natijani eng qisqa deb hisoblash.
- Katta siyrak graf uchun qo‘shnilik matritsasini qurib, xotirani behuda sarflash.

## FAQ

### Qaysi biri tezroq — BFS yoki DFS?

Asimptotik jihatdan bir xil: O(V + E). Farq aylanish tartibi va xotira sarfida. BFS navbatda butun «qatlam»ni saqlaydi, DFS esa faqat joriy yo‘lni.

### DFS’ni rekursiyasiz yozish mumkinmi?

Ha. Rekursiyani aniq stek bilan almashtiring: boshlang‘ich cho‘qqini ro‘yxatga qo‘ying, siklda oxirgisini chiqarib, uning ko‘rilmagan qo‘shnilarini qo‘shing. Aylanish tartibi rekursiv variantdan biroz farq qilishi mumkin, lekin ko‘pchilik vazifalar uchun bu muhim emas.

### BFS labirintda yo‘l topish uchun mos keladimi?

Ha, agar barcha qadamlar bir xil narxga ega bo‘lsa. To‘r kataklari — cho‘qqilar, qo‘shni o‘tish mumkin bo‘lgan kataklar — qirralar, va BFS eng kam qadamli yo‘lni topadi.
