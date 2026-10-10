---
title: What Is GraphQL and How It Works
description: A plain explanation of GraphQL: schema, queries, mutations, subscriptions and resolvers with examples, plus the REST problems it was built to solve.
summary: GraphQL is an API query language where the client describes exactly which fields it needs and gets them in one request through a single endpoint, while the server defines available data in a strictly typed schema.
---
## What GraphQL is

**GraphQL** is a query language for APIs and a server-side runtime for executing those queries. It was created at Facebook for its mobile apps and open-sourced in 2015.

The core idea: **the client says what data it needs**. Instead of many endpoints like `/users/1` and `/users/1/orders`, there is one address (usually `/graphql`) that receives a query describing the shape of the response. The server returns JSON in exactly that shape.

## The problems it solves

- **Over-fetching** — an endpoint returns more fields than the screen needs. On mobile networks that is wasted traffic.
- **Under-fetching** — one screen needs several sequential requests: the user, then their orders, then the products.
- **Different clients, different needs.** Web, iOS and Android want different field sets, and the backend ends up multiplying endpoint versions.
- **No single contract.** In GraphQL the schema is mandatory and always describes what is available.

## The schema

The schema is the contract between client and server. It is written in SDL (Schema Definition Language):

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

`!` means the field cannot be `null`. `[Order!]!` is a required list of required items.

## Queries

A query reads data. The client picks fields, including nested ones:

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

The response mirrors the query:

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

The user and their orders arrive in one request, with no extra fields.

## Mutations

Mutations change data: create, update, delete. After the change you can immediately ask for the fields you need from the result:

```graphql
mutation {
  createOrder(userId: "1", total: 99000) {
    id
    status
  }
}
```

## Subscriptions

Subscriptions deliver real-time updates. The client subscribes to an event, and the server pushes data when it happens. They usually run over WebSocket and fit order statuses, notifications and chats.

## Resolvers

A **resolver** is a server function that knows how to get the value of a specific field. The schema says "what exists", resolvers say "where to get it".

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

The server parses the query, validates it against the schema and calls resolvers only for the requested fields. Data can come from a database, another API or a cache — the client does not care.

## What matters in practice

- **The N+1 problem.** Ask for a list of a hundred users with their orders, and a naive resolver makes a hundred separate database queries. The fix is batching, for example with the DataLoader library.
- **Caching is harder.** All requests go via POST to one URL, so HTTP caching works worse than in REST. Teams use client-side caches (Apollo Client, urql) and persisted queries.
- **Protection from heavy queries.** Limit query depth and complexity, or a client can request a huge nested tree.
- **Errors.** Responses often come with HTTP 200 while errors sit in the `errors` field. Set up monitoring with that in mind.
- **Introspection.** You can query the schema from the server; autocomplete and type generation tools are built on this.

Official documentation: [graphql.org](https://graphql.org/learn/).

## FAQ

### Is GraphQL a database?

No. GraphQL is an API layer between the client and any data sources. Behind it can be PostgreSQL, MongoDB, REST services or all of them at once.

### Does GraphQL replace REST?

Not necessarily. It is a different approach with its own trade-offs. Many projects use both: REST for simple and public endpoints, GraphQL for complex client screens.

### Which languages can I use for a GraphQL server?

Almost any popular one: JavaScript/TypeScript, Python, Go, Java, Kotlin, PHP, C# and others. Each has mature libraries.
