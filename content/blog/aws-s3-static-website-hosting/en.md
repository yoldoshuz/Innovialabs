---
title: How to Host a Static Website on AWS S3 and CloudFront
description: Set up a private S3 bucket, access policy, a CloudFront distribution with HTTPS and your own domain, and understand what drives the cost of this hosting.
summary: Site files live in a private S3 bucket, CloudFront serves them over HTTPS through Origin Access Control, ACM issues a free certificate in us-east-1, and your domain's DNS points to CloudFront. You pay only for actual storage, requests and traffic.
---
## The short answer: how it fits together

- **S3** stores the site files. The bucket stays **private**.
- **CloudFront**, the AWS CDN, reads from the bucket through **Origin Access Control (OAC)** and serves visitors over HTTPS.
- **ACM** (AWS Certificate Manager) issues a free SSL certificate for your domain.
- **DNS** (Route 53 or your current provider) points the domain to CloudFront.

This works for any static site: a landing page, documentation, or a build from Astro, Hugo or Next.js static export.

## Step 1. Create the bucket and upload files

1. In the S3 console, create a bucket such as `example-com-site` in a convenient region.
2. Keep **Block all public access** enabled. You do not need "Static website hosting": CloudFront reads the bucket directly through the API.
3. Upload the built site with the AWS CLI:

```bash
aws s3 sync ./out s3://example-com-site --delete
```

## Step 2. Request a certificate in ACM

For CloudFront, the certificate must be issued in **us-east-1 (N. Virginia)**, wherever your bucket is. Request a public certificate for `example.com` and `www.example.com`, choose DNS validation and add the CNAME records it gives you. The status changes to "Issued" once validation passes.

## Step 3. Create the CloudFront distribution

- **Origin**: your bucket (the bucket's REST endpoint, not its website endpoint).
- **Origin access**: Origin access control settings; create a new OAC.
- **Viewer protocol policy**: Redirect HTTP to HTTPS.
- **Alternate domain names**: `example.com` and `www.example.com`.
- **Custom SSL certificate**: the one from step 2.
- **Default root object**: `index.html`.

After creation, CloudFront shows a ready-made bucket policy.

## Step 4. Bucket access policy

The policy lets only your distribution read objects. Paste it into **Permissions → Bucket policy** with your own values:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-com-site/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/EDFDVBD6EXAMPLE"
        }
      }
    }
  ]
}
```

## Step 5. Connect the domain

- **Route 53**: create an A record of type **Alias** pointing to the distribution. This works for the root domain too.
- **Another DNS provider**: for `www`, add a CNAME to an address like `d1234abcd.cloudfront.net`. The root domain cannot use a CNAME, so you need ALIAS/ANAME support or CNAME flattening (Cloudflare offers it), or a redirect from the root to `www`.

## Subfolders and single-page apps

The S3 REST endpoint does not turn `/about/` into `/about/index.html` by itself. A small **CloudFront Function** on the viewer request event fixes it:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var last = uri.split("/").pop();
  if (uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
  } else if (last.indexOf(".") === -1) {
    request.uri = uri + "/index.html";
  }
  return request;
}
```

For an SPA (React or Vue without SSR), set **Custom error responses** so that 403 and 404 return `/index.html` with status 200. Without `s3:ListBucket` permission, a missing file returns 403 rather than 404.

## Deploying updates

```bash
aws s3 sync ./out s3://example-com-site --delete
aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"
```

Better still, give build files hashed names with long cache times and invalidate only HTML.

## What it costs

Rates depend on region and change over time, so it matters more to know what makes up the bill:

- **S3 storage**: a typical site is small, so this line is barely noticeable;
- **CloudFront data transfer and HTTPS requests**: the main cost, growing with traffic;
- **CloudFront requests to S3** on cache misses (transfer from S3 to CloudFront itself is not charged);
- **invalidations** beyond the free allowance;
- **Route 53**: a monthly fee per hosted zone plus queries, if DNS is on AWS.

ACM certificates used with CloudFront are free, and CloudFront has a free tier. A small site usually costs little, but always set up an **AWS Budgets** alert.

## Common mistakes

- The certificate is not in us-east-1, so CloudFront cannot see it.
- The bucket's website endpoint is used as the origin together with OAC, which does not work.
- `AccessDenied` errors: wrong `SourceArn` in the policy or no default root object.
- Making the bucket public "just in case", so files are reachable around CloudFront.
- Forgetting to invalidate after a deploy, so visitors see the old version.

## FAQ

### Can I skip CloudFront?

S3 static website hosting works on its own, but only over HTTP and only with a public bucket. For a custom domain with HTTPS you need CloudFront.

### Can I host a Next.js site this way?

Only if it builds as a static export (`output: "export"`). Server rendering, API routes and middleware need compute: Lambda, a container or a platform such as Amplify.

### Is it cheaper than Vercel or Netlify?

It depends on traffic and plan. AWS gives more control and strict pay-per-use billing but needs more setup. For a small site, either option is inexpensive.
