---
title: "Express vs NestJS vs Fastify: Choosing a Node.js Framework"
description: Comparing Express, NestJS and Fastify: architecture, performance, TypeScript support, structure for large teams and a minimal endpoint in each one.
summary: Express is the simple, flexible choice for small services, Fastify is fast with built-in schema validation, and NestJS offers a strict modular architecture for large teams and long-lived projects.
---
## The short answer

- **Express** — for a small API, a prototype, or when you want full control over the structure.
- **Fastify** — when performance, JSON Schema validation and a clean plugin system matter.
- **NestJS** — when the project is large, the team is growing and you need a shared architecture with modules, DI and TypeScript.

All three run on Node.js and solve the same problem: handling HTTP requests. They differ in how many decisions they make for you.

## Express: minimalism

Express is the best-known Node.js framework. It has routing, middleware and little else.

```javascript
import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000);
```

**Pros:** low entry barrier, a huge number of examples and middleware, complete freedom.

**Cons:** you design the project structure, validation, error handling and typing yourself. In a large team without conventions, code quickly becomes inconsistent.

## Fastify: speed and schemas

Fastify was built with a focus on performance and low overhead. Its key feature is **JSON Schema** for validating input and serializing responses.

```javascript
import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", {
  schema: {
    response: { 200: { type: "object", properties: { status: { type: "string" } } } },
  },
}, async () => ({ status: "ok" }));

await app.listen({ port: 3000 });
```

**Pros:** high speed, a built-in logger, validation out of the box, a well-designed plugin system with encapsulation.

**Cons:** a smaller ecosystem than Express, and the plugin model takes time to learn.

## NestJS: architecture for teams

NestJS is a framework on top of Express or Fastify (you pick the adapter). It defines the architecture: **modules, controllers, services, dependency injection**, decorators. TypeScript is the primary language.

```typescript
import { Controller, Get, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Controller("health")
class HealthController {
  @Get()
  check() {
    return { status: "ok" };
  }
}

@Module({ controllers: [HealthController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

**Pros:** the same structure across all modules, easy testing thanks to DI, ready-made solutions for validation, auth, queues, WebSocket, GraphQL and microservices.

**Cons:** more boilerplate, a steep learning curve for those new to DI and decorators, overkill for small services.

## Comparison table

| Criterion | Express | Fastify | NestJS |
|---|---|---|---|
| Architecture | Free-form | Plugins | Modules, DI |
| Performance | Sufficient | High | Depends on adapter |
| TypeScript | Community types | Good support | Primary language |
| Validation | Third-party libraries | Built-in JSON Schema | Pipes and class-validator |
| Learning curve | Low | Medium | Above average |
| Large teams | Needs your own rules | Fine | A strength |

## How to choose

1. **Estimate the project's size and lifespan.** A small service or bot — Express or Fastify. A product that will evolve for years — NestJS.
2. **Look at the team.** If they have Angular or Spring experience, NestJS will feel familiar. If the team is small and wants simplicity — Express.
3. **Check load requirements.** If throughput per instance matters, look at Fastify or NestJS with the Fastify adapter.
4. **Do not chase benchmarks.** In real APIs, time usually goes to the database and external services rather than the framework itself.

## Common mistakes

- Using NestJS for a three-endpoint microservice and drowning in boilerplate.
- Building a large project on Express with no conventions for structure, validation and errors.
- Mixing Express middleware and Fastify plugins without understanding the differences.
- Picking a framework by popularity rather than by the project's needs.

## FAQ

### Can I move from Express to NestJS later?

Yes, but it effectively means rewriting the HTTP layer and the structure. It is easier to pick NestJS up front if you expect the team and features to grow.

### Is NestJS slower than Express?

NestJS adds a thin abstraction layer, but in practice the difference is rarely noticeable. If speed matters, NestJS can run on the Fastify adapter.

### Which framework is easiest for beginners?

Express: few concepts and lots of learning material. After it, it is easier to understand what problems Fastify and NestJS solve.
