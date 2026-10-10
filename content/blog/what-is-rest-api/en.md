---
title: What Is a REST API: Simple Explanation with Examples
description: REST API in plain words: resources, endpoints, HTTP verbs, JSON, statelessness and status codes, explained with an online store product catalog.
summary: A REST API is an agreement for programs to exchange data over HTTP: every object is a resource with its own address, and the action on it is set by GET, POST, PUT, PATCH or DELETE.
---
## The essentials

An **API** is the way one program asks another to do something or return data. **REST** is a popular style for building such APIs on top of HTTP, the same protocol your browser uses.

Picture an online store's product catalog. The mobile app, the website and a Telegram bot all take products from one source: the server. To make all three understand the server the same way, it exposes a REST API, a set of addresses and rules for getting, creating, updating or deleting a product.

## Resources and endpoints

A **resource** is any entity the system works with: a product, a category, an order, a user.

An **endpoint** is the address where a resource is available:

- `/products` — all products (a collection);
- `/products/42` — a specific product with id 42;
- `/categories/5/products` — products in category 5.

Addresses use **nouns**, not verbs. Not `/getProducts`, but `/products`. What to do with the resource is defined by the HTTP method.

## HTTP methods: what we do with a resource

| Method | Action | Example |
|---|---|---|
| GET | Read | `GET /products/42` |
| POST | Create | `POST /products` |
| PUT | Replace entirely | `PUT /products/42` |
| PATCH | Update partially | `PATCH /products/42` |
| DELETE | Delete | `DELETE /products/42` |

The same address `/products/42` with different methods means different actions. That is what makes a REST API predictable.

## JSON: the data format

Most often the server and client exchange data as **JSON**, a simple text format that both people and programs read easily.

A request to create a product:

```http
POST /products
Content-Type: application/json

{
  "name": "Electric kettle",
  "price": 250000,
  "categoryId": 5
}
```

The server's response:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 43,
  "name": "Electric kettle",
  "price": 250000,
  "categoryId": 5
}
```

## Stateless: the server does not remember previous requests

The **stateless** principle means every request is self-contained. The server keeps no "conversation session" between requests; the client sends everything needed each time, such as an authorization token in a header:

```http
GET /orders
Authorization: Bearer <token>
```

Why it matters: any of several servers can handle any request. The system is easier to scale and to recover after failures.

## Status codes: the result in one number

The server reports the outcome with a three-digit code:

- **2xx** — success: `200 OK`, `201 Created`, `204 No Content`.
- **3xx** — redirection.
- **4xx** — client error: `400 Bad Request` (invalid data), `401 Unauthorized` (not authenticated), `404 Not Found` (no such resource).
- **5xx** — server error: `500 Internal Server Error`.

The client checks the code first and only then reads the response body.

## Where you meet REST APIs

- A mobile app loads the feed and the cart.
- A website accepts payment through a payment provider.
- A CRM receives leads from the website.
- A warehouse syncs stock with a marketplace.

Almost every integration between systems today is a series of API calls, and REST is the most common style among them.

## Common misconceptions

- **"REST is just JSON over HTTP."** Resources, correct methods and status codes matter too.
- **"Everything can be done with POST."** It can, but you lose predictability, caching and clarity for other developers.
- **"An error can be returned with 200."** This breaks client logic: they treat the request as successful.

## FAQ

### How is a REST API different from GraphQL?

In REST every resource has its own address and the server defines the response shape. In GraphQL there is usually one address, and the client describes which fields it needs.

### Do I need to code to use a REST API?

To try requests, tools like Postman or curl are enough. To integrate an API into a product, you need a developer.

### Is a REST API secure?

The style itself does not guarantee security. HTTPS, token-based authorization, permission checks and input validation do.
