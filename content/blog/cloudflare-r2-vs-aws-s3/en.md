---
title: Cloudflare R2 vs AWS S3: Storage Costs and Egress Fees
description: Comparing Cloudflare R2 and AWS S3 pricing with a focus on egress fees, plus API compatibility, performance and which workloads fit each service best.
summary: The key difference is that R2 charges nothing for egress, while S3 bills every gigabyte served to the internet. R2 wins for files users download often; S3 wins for data processed inside AWS or kept in low-cost archive tiers.
---
## The short answer

- **Cloudflare R2** when files are served heavily to the internet: media, user uploads, downloads, public datasets. Egress is free; you pay for storage and operations.
- **AWS S3** when data is processed by AWS services (EC2, Lambda, Athena), you need archive storage classes, or you rely on IAM and AWS event integrations.

Both are object stores with an S3-compatible API, so code and tooling are largely the same.

## What you pay for

| Cost item | AWS S3 | Cloudflare R2 |
|---|---|---|
| Storage | Per GB-month, price depends on storage class | Per GB-month, Standard and Infrequent Access classes |
| Writes and listings | Billed as PUT/COPY/POST/LIST requests | Class A operations |
| Reads | Billed as GET and similar requests | Class B operations |
| **Egress to the internet** | **Billed per GB** | **Not billed** |
| Cross-region transfer | Billed | No separate transfer fee |
| Retrieval from colder classes | Billed | Billed for Infrequent Access |
| Free tier | Yes | Yes, monthly |

Exact rates vary by region and change from time to time, so check the pricing pages.

## Why egress decides everything

Egress fees are invisible at launch and grow fast with popularity. A simple calculation: a 100 MB file downloaded 10,000 times is about 1 TB of outbound traffic.

- On **S3**, you pay for every gigabyte of that terabyte plus 10,000 GET requests.
- On **R2**, you pay only for 10,000 read operations.

The higher your ratio of data downloaded to data stored, the more R2 saves. If data sits for years and is rarely read, egress hardly matters, and storage price and archive tiers decide, where S3 offers more choice.

One AWS detail: transfer from S3 to CloudFront is not charged, so S3 plus CloudFront lowers costs. You then pay CloudFront for delivery instead.

## API compatibility

R2 implements the S3 API, and most SDKs and tools (AWS SDK, AWS CLI, rclone) work once you change the endpoint and keys:

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

await r2.send(new PutObjectCommand({ Bucket: "media", Key: "a.jpg", Body: file }));
```

There are differences: R2 permissions use API tokens rather than IAM policies, and some S3 features are missing or behave differently. Before migrating, check every operation your code uses against Cloudflare's documentation.

## Performance

- **S3** lives in a region you choose. Latency is lowest for services in the same AWS region.
- **R2** picks placement automatically, with optional location hints. Public files are best served through your own domain, so Cloudflare's cache applies.

For end users, the CDN in front of storage and the distance to your backend usually matter more than the storage itself.

## Which workloads benefit from each

**R2:**
- images, video and user uploads displayed on your site;
- distributing apps, updates and datasets;
- multi-cloud setups where servers at several providers read the same data;
- sites already running behind Cloudflare.

**S3:**
- data processed inside AWS: analytics, ETL, machine learning;
- long-term archives and backups that are rarely read;
- projects needing S3 events, fine-grained IAM policies and compliance features.

You can combine them: keep originals and archives in S3 and serve public copies from R2.

## Hidden costs

- **Many small objects**: in both services, operation charges can exceed storage charges.
- **NAT Gateway on AWS**: if servers in a private subnet reach S3 through NAT, that traffic is billed. Use a VPC gateway endpoint for S3.
- **Minimum storage duration and retrieval fees** on colder classes in both services.

## FAQ

### Is R2 always cheaper than S3?

No. If data rarely leaves for the internet and is processed inside AWS, the difference is small, and for archives S3 with Glacier classes can be cheaper.

### Will my S3 code work unchanged?

Usually you only change the endpoint and keys and set the region to `auto`. Still, test every operation you use, since some S3 features are not supported on R2.

### How do I move data from S3 to R2?

Cloudflare provides migration tools: a one-time copy of a whole bucket and gradual copying of objects as they are requested. rclone works as well.
