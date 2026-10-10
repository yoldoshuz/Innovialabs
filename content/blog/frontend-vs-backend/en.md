---
title: Frontend vs Backend: What Is the Difference
description: What frontend and backend mean, their typical technologies, what each side does and how they talk through APIs, shown on a food delivery service.
summary: The frontend is everything users see and click in a browser or app; the backend is the server-side logic, data and integrations. The two are connected through an API.
---
## The difference in short

- **Frontend** — the client side: the interface that runs in a browser or mobile app. Buttons, forms, animations, adapting to the screen.
- **Backend** — the server side: business logic, the database, authentication, payments, integrations with external services.

A simple analogy is a restaurant. The frontend is the dining room and the menu — what the guest interacts with. The backend is the kitchen and the storeroom — the order is prepared there, but the guest never sees it. The waiter between them is the **API**.

## Example: a food delivery service

Here is who does what when you order lunch:

| User action | Frontend | Backend |
|---|---|---|
| Opens the app | Shows restaurants, cards, filters | Returns nearby restaurants from the database |
| Adds a dish to the cart | Updates the counter and total on screen | May save the cart, check availability |
| Enters a promo code | Shows the field and an error message | Checks if the code is valid, recalculates the price |
| Pays | Opens the payment form | Creates the order, talks to the payment provider |
| Tracks the courier | Draws the map and status | Receives coordinates and pushes updates |

Note that **checks that affect money and data** (price, discounts, access rights) are always done on the backend. The frontend can repeat them for convenience, but it cannot be trusted — users can modify code in their browser.

## Typical technologies

**Frontend:**
- HTML, CSS, JavaScript and TypeScript;
- frameworks and libraries: React, Vue, Angular, Svelte, plus Next.js and Nuxt on top of them;
- for mobile apps — Swift, Kotlin, Flutter, React Native.

**Backend:**
- languages: JavaScript/TypeScript (Node.js), Python, PHP, Go, Java, C# and others;
- frameworks: Express, NestJS, Django, FastAPI, Laravel, Spring;
- databases: PostgreSQL, MySQL, MongoDB, Redis;
- infrastructure: servers, Docker, queues, file storage.

The stack should be chosen based on the task, the team and load requirements, not on what is trendy.

## How they communicate: the API

An **API** is an agreement on which requests the frontend can send and which responses it will get. Most often it is **REST** or **GraphQL** over HTTP, with data in **JSON**.

A frontend request for the list of restaurants:

```http
GET /api/restaurants?lat=41.31&lng=69.24
```

And the backend's response:

```json
[
  { "id": 12, "name": "Plov Center", "deliveryMinutes": 35 },
  { "id": 47, "name": "Green Bowl", "deliveryMinutes": 25 }
]
```

A good API is documented and stable, so frontend and backend can be built in parallel once the format is agreed.

## What fullstack means

A **fullstack developer** works on both sides. That is convenient for small projects and MVPs. Larger products usually split the roles: frontend developers go deeper into interfaces, browser performance and accessibility, while backend developers focus on architecture, databases and security.

## Common mistakes clients make

- **Estimating a project from mockups.** A polished interface is only part of the work. Order logic, roles, integrations and the admin panel often take more effort than the screens.
- **Keeping important logic only on the frontend.** A discount calculated in the browser is easy to fake.
- **Not agreeing on the API early.** Teams end up waiting for each other and deadlines slip.
- **Forgetting the admin panel.** Someone has to manage content, orders and users — that is backend and interface work too.

## FAQ

### Which matters more for a business — frontend or backend?

Both are needed. The frontend decides whether the product is convenient and whether customers buy; the backend decides whether orders, payments and data work reliably. The weaker side limits the whole product.

### Can a website work without a backend?

Yes, if it is static: a business card site, a landing page, documentation. Contact forms can then go through a third-party service. As soon as you need accounts, orders or a catalog from a database, you need a backend.

### Why can a website and a mobile app share one backend?

Because the backend returns data through an API, not finished screens. The website and the iOS and Android apps call the same endpoints and each shows the data in its own interface.
