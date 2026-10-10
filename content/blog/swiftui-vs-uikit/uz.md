---
title: SwiftUI yoki UIKit: yangi iOS ilova uchun nimani tanlash
description: SwiftUI va UIKit taqqoslovi: deklarativ va imperativ yondashuv, minimal iOS versiyasi, yetuklik, moslik va mavjud UIKit kodini ko‘chirish yo‘llari.
summary: Yangi iOS ilova uchun ko‘p hollarda SwiftUI’dan boshlash va nazorat yetmagan joylarda UIKit’ni nuqtaviy ulash maqsadga muvofiq; mavjud UIKit loyihasi qayta yozilmaydi, unga SwiftUI’da yangi ekranlar qo‘shiladi.
---

## Qisqa javob

Yangi ilova uchun standart oqilona tanlov — asos sifatida **SwiftUI** va SwiftUI imkoniyatlari yoki nazorati yetmagan joylarda **nuqtaviy UIKit**.

UIKit asosiy freymvork sifatida quyidagi hollarda o‘zini oqlaydi:

- iOS’ning eski versiyalarini qo‘llab-quvvatlash kerak bo‘lsa;
- interfeys juda nostandart komponentlarga qurilgan bo‘lsa: murakkab matn muharrirlari, g‘ayrioddiy o‘tishlar, o‘z joylashuviga ega og‘ir ro‘yxatlar;
- jamoa UIKit’da kuchli bo‘lsa-yu, muddatlar qayta o‘rganishga imkon bermasa.

Agar ilova allaqachon UIKit’da yozilgan bo‘lsa, u **to‘liq qayta yozilmaydi**: yangi ekranlar SwiftUI’da qilinadi va mavjud kodga joylashtiriladi.

## Deklarativ va imperativ yondashuv

**UIKit**’da siz elementlarni yaratasiz, ularga havolalarni saqlaysiz va har safar ma’lumot o‘zgarganda ularni qo‘lda yangilaysiz:

```swift
final class CounterViewController: UIViewController {
    private var count = 0
    private let button = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        button.addTarget(self, action: #selector(didTap), for: .touchUpInside)
        view.addSubview(button)
        updateTitle()
        // va tugma uchun Auto Layout cheklovlari
    }

    @objc private func didTap() {
        count += 1
        updateTitle()
    }

    private func updateTitle() {
        button.setTitle("Bosildi: \(count)", for: .normal)
    }
}
```

**SwiftUI**’da siz interfeys berilgan holatda qanday ko‘rinishini tasvirlaysiz, yangilashni esa freymvork o‘z zimmasiga oladi:

```swift
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        Button("Bosildi: \(count)") {
            count += 1
        }
    }
}
```

Kod kamroq, ma’lumot va interfeysning nomuvofiqligi kamroq uchraydi. Buning narxi — to‘g‘ridan-to‘g‘ri nazoratning kamligi: ba’zan ko‘rinish nima uchun qayta chizilgani yoki kutilmagan tarzda ishlaganini tushunish qiyin.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | SwiftUI | UIKit |
|---|---|---|
| Yondashuv | deklarativ | imperativ |
| Kod hajmi | kamroq | ko‘proq |
| Yetuklik | faol rivojlanmoqda, iOS versiyalari orasida xatti-harakat o‘zgarishi mumkin | ko‘p yillik, oldindan aytib bo‘ladigan, tayyor yechimlar ko‘p |
| Nozik nazorat | cheklangan | to‘liq |
| Apple platformalari | moslashtirish bilan iOS, iPadOS, macOS, watchOS uchun umumiy kod | iOS va iPadOS |
| iOS versiyasiga bog‘liqlik | kuchli: yangi API’lar yangi iOS’ga bog‘langan | kuchsiz |

## Minimal iOS versiyasi ko‘p narsani hal qiladi

SwiftUI imkoniyatlari Xcode versiyasi bilan emas, **foydalanuvchi qurilmasidagi iOS versiyasi** bilan belgilanadi. Yangi API’lar yangi iOS bilan birga chiqadi va eski versiyalarga ko‘chirilmaydi. Shuning uchun:

- minimal iOS versiyasi qancha yuqori bo‘lsa, aylanma yechimlar shuncha kam va SwiftUI bilan ishlash shuncha qulay;
- minimal versiya past bo‘lsa, ko‘plab qulay vositalarni `if #available` tekshiruvlariga o‘rash yoki UIKit kodi bilan almashtirish kerak bo‘ladi.

iPhone foydalanuvchilari odatda tez yangilanadi, lekin eski modellar qo‘llab-quvvatlash chegarasiga yetadi, ayrim hududlarda esa ishlatilgan qurilmalar ommabop. Minimal versiyani belgilashdan oldin auditoriyangiz analitikasini ko‘ring.

## SwiftUI va UIKit qanday birga ishlaydi

Freymvorklarni aralashtirish — odatiy va rasman qo‘llab-quvvatlanadigan amaliyot:

- **SwiftUI ichida UIKit** — `UIViewRepresentable` va `UIViewControllerRepresentable` orqali. Kamera, murakkab matn maydonlari, uchinchi tomon SDK ko‘rinishlari shunday joylashtiriladi.
- **UIKit ichida SwiftUI** — `UIHostingController` orqali:

```swift
let profile = UIHostingController(rootView: ProfileView(user: user))
navigationController?.pushViewController(profile, animated: true)
```

## UIKit loyihasini qanday ko‘chirish

1. **Hammasini birdaniga qayta yozmang.** To‘liq qayta yozish — yangi funksiyalarsiz o‘tgan oylar demak.
2. **Yangi ekranlarni SwiftUI’da qiling** va `UIHostingController` orqali ko‘rsating. Navigatsiyani dastlab UIKit’da qoldiring.
3. **Pastdan yuqoriga ko‘chiring**: yacheykalar, kichik komponentlar, sozlamalar ekranlari, keyin murakkab ekranlar.
4. **Biznes-mantiqni interfeysdan ajrating**: modellar va servislar ekranni qaysi freymvork chizayotganiga bog‘liq bo‘lmasligi kerak.
5. **Navigatsiyani SwiftUI’ga eng oxirida o‘tkazing,** ekranlarning katta qismi ko‘chirilgandan keyin.

## Ko‘p uchraydigan xatolar

- **Juda past minimal iOS bilan SwiftUI** — har bir ekranda aylanma yechimlar paydo bo‘ladi.
- **Piksel uchun SwiftUI bilan kurashish**, tayyor UIKit komponentini o‘rash o‘rniga.
- **View ichidagi biznes-mantiq** — uni testlash va ko‘chirish qiyinlashadi.
- **Ishlab turgan ilovani** faqat moda uchun qayta yozish.

## FAQ

### UIKit eskirganmi?

Yo‘q. Apple UIKit’ni rivojlantirishda davom etmoqda, iOS’dagi SwiftUI esa ko‘p jihatdan unga tayanadi. Ikkala freymvork ham qo‘llab-quvvatlanadi va ko‘pchilik yirik ilovalar ularni birga ishlatadi.

### Bitta ilovada SwiftUI va UIKit’ni aralashtirsa bo‘ladimi?

Ha, bu odatiy ssenariy. Apple aynan shu maqsadda `UIHostingController` va `Representable` protokollarini taqdim etadi.

### Boshlovchi iOS dasturchi nimani o‘rganishi kerak?

Ishlaydigan ekranlarni tezroq yaratish uchun SwiftUI’dan boshlang, keyin UIKit asoslarini o‘zlashtiring: ko‘plab mavjud loyihalar va uchinchi tomon SDK’lari unda yozilgan.
