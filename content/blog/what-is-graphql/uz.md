---
title: GraphQL nima va u qanday ishlaydi
description: GraphQL haqida sodda tushuntirish: sxema, so‘rovlar, mutatsiyalar, obunalar va rezolverlar misollar bilan hamda u REST’ning qaysi muammolarini hal qiladi.
summary: GraphQL — API uchun so‘rovlar tili bo‘lib, unda klient o‘ziga qaysi maydonlar kerakligini o‘zi tavsiflaydi va ularni yagona endpoint orqali bitta so‘rovda oladi, server esa mavjud ma’lumotlarni qat’iy tiplangan sxemada tavsiflaydi.
---
## GraphQL nima

**GraphQL** — API uchun so‘rovlar tili va serverda ularni bajaruvchi muhit. U Facebook’da mobil ilovalar uchun yaratilgan va 2015-yilda ochiq kodga aylangan.

Asosiy g‘oya: **klient o‘ziga qanday ma’lumot kerakligini o‘zi aytadi**. `/users/1`, `/users/1/orders` kabi o‘nlab endpointlar o‘rniga bitta manzil (odatda `/graphql`) bo‘ladi, unga javob shaklini tavsiflovchi so‘rov yuboriladi. Server aynan shu shakldagi JSON qaytaradi.

## U qanday muammolarni hal qiladi

- **Over-fetching** — endpoint ekranga kerakligidan ko‘proq maydon qaytaradi. Mobil internetda bu ortiqcha trafik.
- **Under-fetching** — bitta ekran uchun ketma-ket bir nechta so‘rov kerak: foydalanuvchi, keyin buyurtmalari, keyin mahsulotlar.
- **Turli klientlar — turli ehtiyojlar.** Veb, iOS va Android turli maydonlar to‘plamini xohlaydi, backend esa endpoint versiyalarini ko‘paytirishga majbur bo‘ladi.
- **Yagona kontrakt yo‘q.** GraphQL’da sxema majburiy va doim nima mavjudligini tavsiflaydi.

## Sxema

Sxema — klient va server o‘rtasidagi kontrakt. U SDL (Schema Definition Language) tilida yoziladi:

```graphql
type User {
  id: ID!
  name: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: String!
}

type Query {
  user(id: ID!): User
}

type Mutation {
  createOrder(userId: ID!, total: Float!): Order!
}

type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}
```

`!` maydon `null` bo‘la olmasligini bildiradi. `[Order!]!` — majburiy elementlardan iborat majburiy ro‘yxat.

## So‘rovlar (Query)

Query ma’lumotlarni o‘qiydi. Klient maydonlarni, jumladan ichma-ich maydonlarni tanlaydi:

```graphql
query {
  user(id: "1") {
    name
    orders {
      id
      total
    }
  }
}
```

Javob so‘rov shaklini takrorlaydi:

```json
{
  "data": {
    "user": {
      "name": "Aliya",
      "orders": [{ "id": "10", "total": 250000 }]
    }
  }
}
```

Foydalanuvchi va uning buyurtmalari ortiqcha maydonlarsiz bitta so‘rovda keldi.

## Mutatsiyalar (Mutation)

Mutatsiyalar ma’lumotlarni o‘zgartiradi: yaratadi, yangilaydi, o‘chiradi. O‘zgarishdan keyin natijaning kerakli maydonlarini darhol so‘rash mumkin:

```graphql
mutation {
  createOrder(userId: "1", total: 99000) {
    id
    status
  }
}
```

## Obunalar (Subscription)

Obunalar real vaqtda yangilanishlarni beradi. Klient hodisaga obuna bo‘ladi, server esa hodisa yuz berganda ma’lumot yuboradi. Odatda WebSocket ustida ishlaydi va buyurtma statuslari, bildirishnomalar, chatlar uchun mos.

## Rezolverlar

**Rezolver** — ma’lum maydon qiymatini qanday olishni biladigan server funksiyasi. Sxema «nima bor»ni aytadi, rezolverlar esa «qayerdan olish»ni.

```javascript
const resolvers = {
  Query: {
    user: (_, { id }) => db.users.findById(id),
  },
  User: {
    orders: (user) => db.orders.findByUserId(user.id),
  },
};
```

Server so‘rovni tahlil qiladi, sxema bo‘yicha tekshiradi va faqat so‘ralgan maydonlar uchun rezolverlarni chaqiradi. Ma’lumot bazadan, boshqa API’dan yoki keshdan kelishi mumkin — klient uchun bu farqsiz.

## Amaliyotda nima muhim

- **N+1 muammosi.** Yuzta foydalanuvchi ro‘yxatini buyurtmalari bilan so‘rasangiz, sodda rezolver bazaga yuzta alohida so‘rov yuboradi. Yechim — batching, masalan DataLoader kutubxonasi orqali.
- **Keshlash murakkabroq.** Barcha so‘rovlar bitta manzilga POST orqali boradi, shuning uchun HTTP kesh REST’dagidan yomonroq ishlaydi. Klient keshi (Apollo Client, urql) va persisted queries ishlatiladi.
- **Og‘ir so‘rovlardan himoya.** So‘rov chuqurligi va murakkabligini cheklash kerak, aks holda klient ulkan ichma-ich daraxtni so‘rashi mumkin.
- **Xatolar.** Javob ko‘pincha HTTP 200 bilan keladi, xatolar esa `errors` maydonida bo‘ladi. Monitoringni shuni hisobga olib sozlang.
- **Introspeksiya.** Sxemani serverdan so‘rash mumkin, avtoto‘ldirish va tip generatsiyasi vositalari shunga asoslangan.

Rasmiy hujjatlar: [graphql.org](https://graphql.org/learn/).

## FAQ

### GraphQL — bu ma’lumotlar bazasimi?

Yo‘q. GraphQL — klient va istalgan ma’lumot manbalari o‘rtasidagi API qatlami. Uning ortida PostgreSQL, MongoDB, REST servislar yoki barchasi birga turishi mumkin.

### GraphQL REST’ni almashtiradimi?

Shart emas. Bu o‘z afzallik va kamchiliklariga ega boshqa yondashuv. Ko‘p loyihalar ikkalasini ishlatadi: oddiy va ommaviy endpointlar uchun REST, murakkab klient ekranlari uchun GraphQL.

### GraphQL serverni qaysi tillarda yozish mumkin?

Deyarli barcha mashhur tillarda: JavaScript/TypeScript, Python, Go, Java, Kotlin, PHP, C# va boshqalar. Har biri uchun yetuk kutubxonalar bor.
