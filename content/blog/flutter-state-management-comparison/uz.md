---
title: Flutter’da holatni boshqarish: Provider, Riverpod yoki BLoC
description: Flutter’da Provider, Riverpod va BLoC taqqoslanadi: kod misollari, test qilish qulayligi, shablon kod hajmi, jamoada ishlash va loyiha hajmiga qarab tanlash.
summary: Provider kichik ilovalar uchun mos, Riverpod ko‘pchilik yangi loyihalar uchun oqilona standart tanlov, BLoC esa qat’iy qoidalar va kuzatiladigan hodisalar oqimi kerak bo‘lgan katta jamoalarda o‘zini oqlaydi.
---

## Qisqa javob

Uchala yondashuv ham bitta vazifani hal qiladi: ma’lumotlarni vidjetlardan tashqarida saqlash va ular o‘zgarganda interfeysni qayta chizish. Farq — qat’iylik darajasida va bu qat’iylikning narxida.

- **Provider** — eng sodda, `InheritedWidget` ustidagi yupqa qatlam. Kichik ilovalar va prototiplar uchun yaxshi.
- **Riverpod** — o‘sha muallifdan, lekin `BuildContext`’ga bog‘liq emas, ko‘p xatolarni kompilyatsiya bosqichida ushlaydi va testlarda almashtirishni osonlashtiradi. Oqilona standart tanlov.
- **BLoC** — holat faqat hodisalar yoki Cubit metodlari orqali o‘zgaradi. Kod ko‘proq, ammo katta jamoalar uchun bashorat qilinadigan arxitektura.

Bitta vidjetga tegishli lokal holat (ro‘yxat ochiqmi, maydonga nima yozilgan) uchun bularning hech biri kerak emas — `setState` yetarli.

## Kodda qanday ko‘rinadi

Bitta vazifa — xaridlar savati — uch xil usulda.

**Provider** va `ChangeNotifier`:

```dart
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];
  List<Item> get items => List.unmodifiable(_items);

  void add(Item item) {
    _items.add(item);
    notifyListeners();
  }
}

// ilova ildizi
ChangeNotifierProvider(create: (_) => CartModel(), child: const App());

// vidjet ichida
final count = context.watch<CartModel>().items.length;
```

**Riverpod** va `Notifier`:

```dart
final cartProvider =
    NotifierProvider<CartNotifier, List<Item>>(CartNotifier.new);

class CartNotifier extends Notifier<List<Item>> {
  @override
  List<Item> build() => [];

  void add(Item item) => state = [...state, item];
}

// ConsumerWidget ichida
final items = ref.watch(cartProvider);
ref.read(cartProvider.notifier).add(item);
```

**BLoC** yengil ko‘rinishda — Cubit:

```dart
class CartCubit extends Cubit<List<Item>> {
  CartCubit() : super(const []);

  void add(Item item) => emit([...state, item]);
}

BlocBuilder<CartCubit, List<Item>>(
  builder: (context, items) => Text("${items.length}"),
);
```

To‘liq Bloc hodisa klasslari (`ItemAdded`, `ItemRemoved`) va `on<Event>` ishlovchilarini qo‘shadi. Kod ko‘payadi, lekin holatning har bir o‘zgarishi nomga ega bo‘ladi va loglarda oson kuzatiladi.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | Provider | Riverpod | BLoC |
|---|---|---|---|
| O‘rganish qiyinligi | Past | O‘rta | O‘rta–yuqori |
| Shablon kod | Minimal | Biroz | Eng ko‘p |
| `BuildContext`’ga bog‘liqlik | Ha | Yo‘q | Ha (blokka murojaat uchun) |
| Provayder topilmasa xato | Ishlash vaqtida | Oldinroq aniqlanadi | Ishlash vaqtida |
| Test qilish | Model klassi to‘g‘ridan-to‘g‘ri | `ProviderContainer` va almashtirishlar | `bloc_test`, holatlar ketma-ketligi |
| Asinxron ma’lumot | Qo‘lda | Tayyor `FutureProvider`, `AsyncValue` | Hodisalar va yuklanish holatlari |
| Jamoa hajmi | 1–3 dasturchi | Istalgan, kelishuvlar bilan | Katta jamoalar, qat’iy jarayon |

## Test qilish qulayligi

**Provider.** `ChangeNotifier` — oddiy Dart klassi, unga unit-test yozish oson. Bog‘liqliklar bilan qiyinroq: ularni konstruktor orqali qo‘lda uzatishga to‘g‘ri keladi.

**Riverpod.** Kuchli tomoni — almashtirishlar (overrides). Repozitoriyni ishlab chiqarish kodiga tegmasdan soxta versiyaga almashtirish mumkin:

```dart
final container = ProviderContainer(
  overrides: [repositoryProvider.overrideWithValue(FakeRepository())],
);
addTearDown(container.dispose);

container.read(cartProvider.notifier).add(item);
expect(container.read(cartProvider), [item]);
```

**BLoC.** `bloc_test` paketi testni «kirishda shu hodisa — chiqishda shu holatlar ro‘yxati» shaklida yozish imkonini beradi. Bu murakkab ssenariylarda ayniqsa qulay: yuklanish, xato, qayta urinish.

## Jamoaviy ish va ko‘lam

Katta loyihalarda asosiy muammo kutubxona tanlovi emas, balki **turli uslublar**. Har kim o‘zicha yozsa, istalgan yondashuv tartibsizlikka aylanadi.

- BLoC tuzilmani majburlaydi: hodisa, ishlovchi, holat. Yangi dasturchi mantiqni qayerdan izlashni biladi.
- Riverpod moslashuvchanroq, shuning uchun jamoa kelishib olishi kerak: provayderlar qayerda turadi, qanday nomlanadi, qachon `Notifier`, qachon `FutureProvider` ishlatiladi.
- Katta loyihada Provider ko‘pincha o‘nlab maydonli, keng qayta chizishlarga sabab bo‘ladigan ulkan `ChangeNotifier`’larga olib keladi.

## Loyiha hajmiga qarab tanlash

1. **Prototip, MVP, bir nechta ekran** — Provider yoki Riverpod. G‘oyani tez tekshirish muhim.
2. **O‘rta hajmdagi mahsulot, kichik jamoa** — Riverpod: BLoC’dan kamroq kod, yaxshi testlar va tayyor asinxronlik.
3. **Yirik ilova, bir nechta jamoa, qat’iy kod-revyu** — BLoC yoki qat’iy uslub qo‘llanmasi bilan Riverpod. Ko‘pincha jamoa allaqachon yaxshi biladigan narsa hal qiladi.
4. **Mavjud loyiha** — modaga ergashib hammasini qayta yozmang. Yangi modullarni yangi yondashuvda qiling, eskilarini bosqichma-bosqich ko‘chiring.

## Ko‘p uchraydigan xatolar

- **Biznes-mantiq vidjetlar ichida.** API so‘rovlari va validatsiya model, notifier yoki bloc’da turishi kerak.
- **Hammasi global.** Bitta ekrandagi forma holatini butun ilova uchun global qilish shart emas.
- **Ortiqcha qayta chizishlar.** Vidjet faqat kerakli maydonga javob berishi uchun selektorlardan foydalaning: `context.select`, `ref.watch(provider.select(...))`, `BlocSelector`.
- **Uchala yondashuvni aralashtirish** — aniq sababsiz bitta loyihada.

## FAQ

### Riverpod va BLoC’ni birga ishlatsa bo‘ladimi?

Texnik jihatdan ha, lekin bu qo‘llab-quvvatlashni qiyinlashtiradi: bog‘liqliklarni ulashning ikki usuli va ikki xil fikrlash modeli paydo bo‘ladi. Sabab bo‘lsa, masalan migratsiya, yangi kod qaysi yondashuvda yozilishini qayd etib qo‘ying.

### Riverpod’da kod generatsiyasi majburiymi?

Yo‘q, ixtiyoriy. Annotatsiyalar orqali generatsiya provayder e’lonlarini qisqartiradi, ammo `build_runner` bosqichini qo‘shadi. Kichik loyihalarga ko‘pincha qo‘lda e’lon qilish yetarli.

### Provider eskirganmi?

Yo‘q, u qo‘llab-quvvatlanadi va ishonchli vosita bo‘lib qolmoqda. Shunchaki o‘rta va katta yangi loyihalarda Riverpod odatda shunga yaqin soddalik bilan ko‘proq imkoniyat beradi.
