---
title: How to Create Your First AWS Lambda Function
description: Build an AWS Lambda function step by step, expose it over HTTP, set permissions and read logs, and see what you actually pay for with each invocation.
summary: Create a function in the Lambda console, turn on a Function URL or connect API Gateway, give the role only the permissions it needs and read logs in CloudWatch. You pay for the number of invocations and for run time weighted by allocated memory.
---

## The short version: four steps

**AWS Lambda** runs your code in response to an event — an HTTP request, a file in S3, a message in a queue — with no server to manage. The shortest path to a working HTTP endpoint:

1. Create a function and write the handler.
2. Expose it over HTTP with a **Function URL** or **API Gateway**.
3. Check permissions: what the function can do and who can call it.
4. Find the logs in **CloudWatch Logs**.

## Step 1. Create the function

In the console, open Lambda → **Create function** → Author from scratch. Give it a name such as `hello-fn`, pick a Node.js runtime and an architecture. The console creates an **execution role** with basic permission to write logs.

Replace the code in `index.mjs`:

```javascript
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? "world";
  console.log("request", { name });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
```

Click **Deploy**, then create a test event on the **Test** tab and run it. The result shows the output, duration and memory used — exactly the values that drive the price.

Look at Configuration → General as well: the default **timeout** is short, and **memory** also determines how much CPU the function gets.

## Step 2. An HTTP endpoint

There are two main options:

| | Function URL | API Gateway (HTTP API) |
|---|---|---|
| Setup | A couple of clicks in the function settings | A separate service with routes and stages |
| Routing | One address per function | Many paths and methods to different functions |
| Protection | `NONE` or `AWS_IAM`, CORS | Authorizers, JWT, throttling |
| Custom domain | Through CloudFront | Built in |
| Cost | Lambda only | Lambda plus API Gateway request charges |

For a first function, a Function URL is enough: Configuration → Function URL → Create. Auth type `NONE` makes the address public — anyone who knows it can call the function on your bill. That is fine for learning; for production prefer `AWS_IAM` or API Gateway with authorization.

Test it:

```bash
curl "https://<your-id>.lambda-url.<region>.on.aws/?name=Tashkent"
```

## Step 3. Permissions

Lambda has two separate sides to permissions:

- **Execution role** — what the function itself may do. If it reads a file from S3, give the role a policy for that bucket and action only, not full access.
- **Resource-based policy** — who may invoke the function. Creating a Function URL with `NONE` adds a permission for public invocation.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/uploads/*"
    }
  ]
}
```

**Least privilege** is not a formality: a leaked key or a bug only reaches what the role can touch.

## Step 4. Logs

Everything the function writes with `console.log`, plus the START, END and REPORT lines, goes to the log group `/aws/lambda/hello-fn`. The REPORT line shows duration, billed duration and peak memory.

```bash
aws logs tail /aws/lambda/hello-fn --follow
```

Set a **retention period** on the log group right away: by default logs are kept forever, and storage is not free.

## How pricing works

A Lambda bill has two parts:

- **Requests** — every time the function is invoked.
- **Duration** — execution time multiplied by allocated memory (gigabyte-seconds).

Lambda has a permanent free monthly allowance for requests and compute; check current values on the [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/) page. API Gateway, log storage and outbound traffic are billed separately.

In practice: do not over-allocate memory, but do not starve the function either — sometimes more memory makes it so much faster that the total does not grow. The arm64 architecture is usually cheaper per gigabyte-second. To cap the damage from a flood of requests, set **reserved concurrency**.

## FAQ

### Function URL or API Gateway — which one?

For a single endpoint, a webhook or a prototype, a Function URL is enough. If you need several routes, token-based authorization, throttling or a custom domain without extra services, choose API Gateway.

### What is a cold start and does it matter?

On the first call or after idle time, Lambda spins up a new execution environment and the response is slower. For webhooks and background jobs this is rarely noticeable; for latency-sensitive APIs, lightweight dependencies and provisioned concurrency help.

### How do I avoid a big bill because of a public URL?

Use `AWS_IAM` auth or API Gateway with throttling, set reserved concurrency and create a budget with alerts in AWS Budgets.
