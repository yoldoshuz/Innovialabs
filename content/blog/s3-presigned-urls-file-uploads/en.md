---
title: Direct File Uploads to Object Storage with Presigned URLs
description: Why browser uploads should go straight to S3-compatible storage instead of through your server, and how to set expiry, size limits and CORS correctly.
summary: Your server hands the browser a short-lived signed link and the file goes straight to storage, bypassing the backend; size and type limits live in the signature (best via presigned POST), and CORS allows uploads only from your domain.
---

## How it works

The classic "browser → your server → storage" flow makes the backend receive every byte, keep connections open and pay for the traffic twice. A **presigned URL** is a link carrying a cryptographic signature that your server creates with its own access keys. The browser receives it and uploads the file **directly to S3-compatible storage** (AWS S3, Cloudflare R2, MinIO and others).

Your keys never reach the client: the signature allows exactly one action on one object, and only until it expires.

## Why it beats proxying

| | Through the server | Presigned URL |
|---|---|---|
| Backend load | Receives and forwards the whole file | Only issues a signature |
| Request body limits | You hit proxy and platform limits | Storage limits apply |
| Serverless | Request size and execution time limits | Works without caveats |
| Speed for the user | Two hops | One, to the storage endpoint |
| Control | Full, but expensive | Via signature conditions and post-upload checks |

Proxying makes sense only when the file must be processed before it is stored (for example, streaming antivirus scanning) or when storage is not reachable from the internet.

## The flow

1. The client tells your server the file name, type and size.
2. The server checks the user's permissions, generates the **object key** itself (never trusting the file name) and signs the link.
3. The browser uploads the file using the link.
4. The client reports success, the server verifies the object (`HeadObject`: size, type) and only then records it in the database.

## Expiry and size: use presigned POST

A **presigned PUT** has an expiry, but you cannot restrict a size range with it. A **presigned POST** lets you put conditions into a policy that storage enforces itself: size range, content type, key prefix. Example with the AWS SDK for JavaScript v3:

```ts
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({ region: process.env.S3_REGION });

export async function createUpload(userId: string, contentType: string) {
  const key = `uploads/${userId}/${crypto.randomUUID()}`;
  return createPresignedPost(s3, {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Conditions: [
      ["content-length-range", 1, 10 * 1024 * 1024], // up to 10 MB
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 300, // seconds
  });
}
```

On the client, append every entry from `fields` to a `FormData`, and the **file last**:

```ts
const { url, fields } = await fetch("/api/upload").then((r) => r.json());
const form = new FormData();
Object.entries(fields).forEach(([k, v]) => form.append(k, v as string));
form.append("file", file);
await fetch(url, { method: "POST", body: form });
```

Keep the expiry short: the link only needs to live until the upload starts. Presigned POST support varies across S3-compatible providers, so check yours. If POST is unavailable, use PUT and verify size after upload, deleting objects that exceed the limit.

## CORS setup

Without CORS the browser blocks the request to the storage domain. Allow only your own origins and the methods you need:

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["POST", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

`ETag` belongs in `ExposeHeaders` if you use multipart uploads: the client has to read it from the response to each part.

## Common mistakes

- **Public bucket.** Signed uploads do not need public access. Serve files through signed links or a CDN too.
- **Key derived from the file name.** It leads to overwriting other objects and character issues. Generate keys on the server.
- **`AllowedOrigins: ["*"]`** in production.
- **Trusting the client.** Type and size in the request are only a claim. Verify the object after upload.
- **No cleanup.** Abandoned uploads pile up. Add a lifecycle rule for the temporary prefix and for incomplete multipart uploads.

## FAQ

### What about very large files?

Use **multipart upload**: the file is split into parts, each gets its own signed link, and the server completes the upload at the end. Individual parts can be retried if the connection drops.

### Does this work with Cloudflare R2 or MinIO?

Yes, they support the S3 API and signatures, so the same SDK works with a different endpoint. The set of supported operations and conditions differs, so check the provider's documentation.

### How do I serve private uploaded files?

The same way: the server checks permissions and generates a short-lived presigned read link (`GetObject`). For public assets like avatars, a CDN in front of storage is more convenient.
