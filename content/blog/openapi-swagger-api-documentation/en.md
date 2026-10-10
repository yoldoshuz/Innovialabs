---
title: How to Document an API with OpenAPI and Swagger
description: How to describe an API in OpenAPI, generate docs and typed clients from the spec, and keep the documentation in sync with the code.
summary: Describe your API in one OpenAPI file (YAML or JSON), render it with Swagger UI or Redoc, generate clients from it, and check automatically in CI that it still matches the code.
---
## The short answer

**OpenAPI** is the standard format for describing HTTP APIs: which endpoints exist, what parameters they take, what they return and how they are secured. **Swagger** is a set of tools around that format: Swagger UI renders interactive docs, Swagger Editor helps you write the spec. The format itself used to be called Swagger, which is why the names get mixed up.

The working model is simple: one spec is the single source of truth. Docs, clients and request validation all come from it.

## What a spec looks like

A minimal YAML example:

```yaml
openapi: 3.0.3
info:
  title: Orders API
  version: 1.0.0
paths:
  /orders/{id}:
    get:
      summary: Get an order
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: Order found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"
        "404":
          description: Order not found
components:
  schemas:
    Order:
      type: object
      required: [id, status]
      properties:
        id:
          type: integer
        status:
          type: string
          enum: [new, paid, shipped]
```

The key sections:

- **info** — API name and version.
- **paths** — endpoints and HTTP methods.
- **components/schemas** — reusable data models referenced via `$ref`.
- **securitySchemes** — how authentication works (Bearer token, API key, OAuth2).

## What one spec gives you

- **Documentation.** Swagger UI or Redoc turn the file into a readable page where you can send test requests from the browser.
- **Typed clients.** Generators such as OpenAPI Generator or openapi-typescript produce types and SDKs for TypeScript, Kotlin, Swift, Python and more. Frontend and mobile teams stop writing models by hand.
- **Mocks.** You can spin up a fake server from the spec and start frontend work before the backend is ready.
- **Validation.** Middleware checks incoming requests and responses against the schema.

## Code-first vs spec-first

| | Code-first | Spec-first |
|---|---|---|
| Where the spec comes from | Generated from code (annotations, decorators, validation schemas) | Written by hand before the code |
| Speed to start | Faster | Slower |
| Agreement between teams | After implementation | Before implementation |
| Drift risk | Low if generation is automatic | Needs CI checks |
| Best for | Small teams, a single backend | Public APIs, several teams, partner integrations |

Many frameworks support code-first out of the box: FastAPI builds the spec from Python types, NestJS from decorators, and Express or Fastify have plugins based on validation schemas.

Spec-first pays off when the contract matters more than the implementation: frontend, mobile and partners agree on the API up front and work in parallel.

## Keeping docs in sync with code

1. **One source of truth.** Either the spec is generated from code, or the code is validated against the spec. Never maintain two independent descriptions.
2. **CI checks.** A linter such as Spectral or Redocly CLI catches spec errors. A separate step compares the generated spec with the committed one.
3. **Contract tests.** Tests send requests and check responses against the schema.
4. **Breaking change detection.** Spec diff tools flag a removed field or changed type before release.
5. **Versioning.** Breaking changes only with a new API version or a transition period for the old behavior.

## Common mistakes

- **No examples.** Add `example` values to schemas — docs become far easier to read.
- **Only success responses.** Errors like 400, 401, 404 and 422 are part of the contract too.
- **Duplicated schemas.** Move models into `components` and reference them with `$ref`.
- **Empty descriptions.** A `description` should explain meaning, not repeat the field name.
- **Hand-written docs in Notion or Word.** They go stale after the first release.

The official format specification: [spec.openapis.org](https://spec.openapis.org/oas/latest.html).

## FAQ

### What is the difference between OpenAPI and Swagger?

OpenAPI is the API description format itself. Swagger is a set of tools (UI, Editor, Codegen) that work with that format. Before version 3 the format was called the Swagger Specification.

### Which OpenAPI version should I use?

Use the newest version your tools support. Before choosing, check that your client generator and documentation library can handle it.

### Does OpenAPI work for GraphQL or WebSockets?

No, OpenAPI describes REST-style HTTP APIs. GraphQL has its own schema, and event-driven or WebSocket APIs have a separate standard called AsyncAPI.
