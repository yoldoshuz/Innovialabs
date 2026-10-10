---
title: What Is Object Storage and How It Differs from a File System
description: How object storage works: buckets, objects and metadata, S3-compatible APIs, storage classes and when to keep files there instead of on the server disk.
summary: Object storage keeps files as separate objects with a key and metadata inside buckets and serves them over an HTTP API, usually S3-compatible; it scales almost without limit and is independent of any server, so user uploads, media and backups belong there rather than on the disk.
---
## The short answer

**Object storage** is a service where files are not kept in folders on a disk but as **objects** inside **buckets** (containers). Each object has a unique key, its content and **metadata**. You work with it not through a file system but through an **HTTP API**: put, get, delete, list.

The best-known example is Amazon S3. Its API has become a de facto standard, and many providers offer **S3-compatible** storage: Google Cloud Storage (in interoperability mode), Cloudflare R2, DigitalOcean Spaces, Backblaze B2, MinIO for self-hosting, and others.

## Buckets, objects and metadata

- **Bucket** — a top-level container with its own access settings, region and storage policies.
- **Object** — a file plus its description. The key can look like a path: `uploads/2026/avatar-123.jpg`. But it is just a string: there are no real folders, and "folders" in a console are only a view of key prefixes.
- **Metadata** — content type (`Content-Type`), cache headers and custom key–value pairs.

Objects are generally **not edited in place**: to change a file, you upload it again in full.

## How it differs from a file system

| | Server disk (file system) | Object storage |
|---|---|---|
| **Structure** | Folder hierarchy | Flat key space within a bucket |
| **Access** | Through the OS, only from that server | Over an HTTP API from anywhere |
| **Changes** | Append to or edit parts of a file | Replace the whole object |
| **Capacity** | Limited by disk size | Practically unlimited, grows automatically |
| **Durability** | Depends on one server and its backups | Data is replicated by the provider |
| **Good for** | OS, databases, temporary files | Media, uploads, backups, static assets, archives |

Databases and programs that need fast random access to parts of a file still run on regular disks.

## S3-compatible APIs

Compatibility means the same SDKs and tools work with different providers — only the endpoint and access keys change. For example, with the AWS CLI:

```bash
# upload a file
aws s3 cp ./report.pdf s3://my-bucket/reports/report.pdf

# list objects under a prefix
aws s3 ls s3://my-bucket/reports/

# the same CLI against another S3-compatible provider
aws s3 ls s3://my-bucket/ --endpoint-url https://storage.example-provider.com
```

For private files, use **pre-signed URLs**: temporary links that let a user download or upload one specific object without access keys.

## Storage classes

Providers offer several **storage classes** for different needs:

- **Standard (hot)** — for frequently accessed files.
- **Infrequent access** — cheaper storage, but reads cost more and there may be a minimum storage period.
- **Archive (cold)** — the cheapest storage, but retrieval can take minutes to hours and costs extra.

**Lifecycle rules** automatically move older objects to cheaper classes or delete them. The available classes and terms differ between providers, so check their documentation.

## When to keep files in object storage

- **User uploads**: avatars, documents, product photos.
- **Site media**: images and video, especially combined with a CDN.
- **Backups** of databases and servers.
- **Logs and archives** that must be kept for a long time.
- **Several servers or containers** need to see the same files.
- **Serverless applications** that have no persistent disk.

The main practical benefit: the server becomes disposable. You can rebuild or scale it without losing files.

## Common mistakes

- **A bucket made public by accident.** Keep buckets private by default and grant access selectively.
- **Access keys in front-end code.** For browser uploads, use pre-signed URLs.
- **Ignoring egress.** With many providers, charges for downloading data matter more than storage itself. A CDN in front of storage helps.
- **Archive class for frequently read files.** Retrieval fees eat the storage savings.
- **No versioning for important data.** Turn on object versioning so you can recover an accidentally overwritten file.

## FAQ

### Can I mount object storage as a regular disk?

There are tools that mount a bucket as a folder, but it is an emulation: operations are slower and partial writes work poorly. Applications should talk to storage directly through its API or an SDK.

### How is object storage different from Google Drive or Dropbox?

Drive and Dropbox are products for people: syncing, sharing, a friendly interface. Object storage is infrastructure for software: an API, fine-grained permissions, storage classes and integration with CDNs and cloud services.

### How safe is my data there?

Major providers keep multiple copies across devices and facilities, so losing data to hardware failure is unlikely. That does not protect against accidental deletion, though — you still need versioning and separate backups.
