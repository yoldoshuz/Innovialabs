---
title: Cloud Regions and Availability Zones Explained
description: What cloud regions and availability zones are, how region choice affects latency, price and data rules, and why spreading a service across zones matters.
summary: A region is a cloud provider's geographic location, and availability zones are isolated data centers inside it. Pick a region by proximity to users, price and legal requirements, and use several zones so your service survives the failure of one data center.
---

## The short answer

Major cloud providers split their infrastructure into two levels:

- **Region**: a geographic location such as "Frankfurt" or "Mumbai", containing several data centers.
- **Availability zone**: one or more data centers inside a region with independent power, cooling and networking. Zones are far enough apart that a local incident does not affect the others, and close enough for fast connections between them.

Resources like a virtual machine or a database are created in a specific zone of a specific region. Separately, there are CDN **edge locations**: cache delivery points. There are many more of them, but servers and databases are not hosted there.

## How the region affects latency

Signals in fiber cannot travel faster than physics allows, so the distance between user and server adds latency to every request. For a site making dozens of requests per page, that adds up.

Practical rules:

- choose the region closest to your **main audience**, not to your team's office;
- measure latency with real tests, because network routes do not always follow the map;
- serve static files and media through a CDN, so a distant region matters less;
- keep the application and its database **in the same region**: cross-region database queries slow everything down.

## How the region affects price

The same resources cost differently in different regions, depending on local electricity, land and connectivity costs. Also:

- not every service and machine type is available in every region, especially newer ones;
- traffic **between regions** is usually billed;
- some providers also charge for traffic **between zones** within a region, which is worth factoring into your architecture.

Compare the cost of your actual configuration in the provider's calculator across several suitable regions.

## Region and data requirements

Where your data physically lives is a legal question. Many countries have personal data localization rules. For example, Uzbekistan's legislation requires personal data of its citizens to be stored on servers located in Uzbekistan. If such rules apply to you, a foreign region will not work for that data, and you will need a local provider or a hybrid setup.

Make these decisions together with a lawyer: the technical details depend on exactly what data you process.

## Why availability zones matter

A single data center can fail: a power outage, a network fault, a fire. If your whole service lives in one zone, it goes down with it. Spreading across zones reduces that risk:

- **Several application instances** in different zones behind a load balancer.
- **A database with a replica** in another zone and automatic failover (usually a Multi-AZ option on managed databases).
- **Backups** in storage that replicates across zones on its own.

The next level is **multiple regions**. It protects against a whole region failing but is much more complex: long-distance data replication, consistency, cost. It is justified for services where downtime is critical.

## Common mistakes

- Picking a region out of habit or from a tutorial without checking latency to your users.
- Placing the application and the database in different regions.
- Deploying everything in a single zone and calling the service fault-tolerant.
- Leaving paid cross-zone and cross-region traffic out of the budget.
- Storing personal data abroad without checking legal requirements.

## FAQ

### How many availability zones does a small project need?

To start, one zone with regular backups is often enough. Once downtime starts costing money, it makes sense to move to two or three zones, at least for the database and the application.

### Can I change regions later?

Yes, but it is a migration: moving data, reconfiguring networking, DNS and integrations. The more data and services you have, the harder it gets, so choose the region deliberately from the start.

### How is an availability zone different from an edge location?

An availability zone is a full-fledged site for servers, databases and storage. An edge location is a CDN point for caching and fast content delivery; it runs only lightweight tasks such as caching and edge functions.
