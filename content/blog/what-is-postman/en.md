---
title: What Is Postman and How to Test an API With It
description: A plain explanation of Postman for managers, QA and junior developers: sending GET and POST requests, headers, body, authorization and reading responses.
summary: Postman is an app for sending requests to an API by hand and seeing what the server returns: you set the method, URL, headers and body, press Send and read the status code, timing and response data.
---
## What Postman is

**Postman** is an API client. It lets you send a request to a server and see the reply without writing code and without a finished website or app in front of the API.

Who gets value from it:

- **Managers** — confirm that a promised API feature actually works and see what it returns.
- **QA engineers** — test the backend separately from the web or mobile frontend.
- **Junior developers** — explore an unfamiliar API before writing an integration.

Postman runs as a desktop app for Windows, macOS and Linux and in the browser. Most features need a free account.

## Anatomy of a request

| Part | What it is | Example |
|---|---|---|
| **Method** | What you want to do | GET reads, POST creates |
| **URL** | Address of the resource | `https://api.example.com/users` |
| **Params** | Query parameters after `?` | `?page=2&limit=20` |
| **Headers** | Metadata about the request | `Content-Type: application/json` |
| **Body** | Data you send | JSON with the new user's fields |
| **Authorization** | Who you are | a token or username and password |

## Sending a GET request

1. Click **New → HTTP** or the "+" next to the tabs.
2. Keep the method as **GET**.
3. Paste a URL such as `https://api.example.com/users`.
4. Add parameters on the **Params** tab if needed — Postman appends them to the URL.
5. Click **Send**.

The server's response appears below.

## Sending a POST request

POST usually creates something: a user, an order, a lead.

1. Choose **POST** and enter the URL.
2. Open the **Body** tab and pick a format.
3. For JSON choose **raw** and the **JSON** type, then type the data:

```json
{
  "name": "Aziza",
  "email": "aziza@example.com"
}
```

4. Click **Send**.

Body formats you will meet:

- **raw → JSON** — the most common choice for modern APIs.
- **form-data** — for file uploads or form fields.
- **x-www-form-urlencoded** — classic HTML forms and some older APIs.
- **binary** — a single file as-is.

The API documentation tells you which one to use. If there is none, ask the developer.

## Headers

Headers give the server extra context. The ones you will see most:

- **Content-Type** — the format of the request body. Postman sets it for you when you choose JSON in the Body tab.
- **Accept** — the format you want back.
- **Authorization** — credentials. Easier to set through the dedicated tab.

## Authorization

On the **Authorization** tab choose the type your API documentation specifies:

- **Bearer Token** — paste the token and Postman adds `Authorization: Bearer <token>`.
- **API Key** — a key in a header or a query parameter; the API defines the field name.
- **Basic Auth** — username and password.
- **OAuth 2.0** — Postman can run the token flow for you.

Do not paste production tokens into requests you share with colleagues — that is what variables and environments are for.

## Reading the response

In the response pane, look at four things:

- **Status code** — the main signal of success or failure.
- **Time** — how long the server took.
- **Size** of the response.
- **Body** — the data itself. **Pretty** mode formats JSON for reading.

The response **Headers** tab shows the server's headers, and **Cookies** shows cookies.

| Code | Meaning |
|---|---|
| 200, 201 | Success; 201 means a resource was created |
| 400 | Bad request: wrong fields or format |
| 401 | Not authenticated: missing or invalid token |
| 403 | Authenticated but not allowed |
| 404 | Not found or wrong URL |
| 500 and above | Server-side error |

## Handy extras

- **Import cURL**: paste a cURL command via **Import** and Postman turns it into a ready request.
- **Code generation**: the `</>` icon shows the same request in JavaScript, Python, PHP and more.
- **Saving**: keep requests in a collection so you never rebuild them from scratch.

## FAQ

### Do I need to know how to code to use Postman?

No. To send requests and read responses you only need to understand what a request consists of. Coding becomes useful later, if you want to write automated checks.

### How is Postman different from testing in a browser?

A browser address bar sends only GET requests with no control over headers or body. Postman lets you use any method, set headers, auth and data, and inspect the response in detail.

### Is it safe to store tokens in Postman?

Requests and collections sync to the Postman cloud. Keep secrets in variables marked as secret and in local current values of an environment, not in the request body or shared collection descriptions.
