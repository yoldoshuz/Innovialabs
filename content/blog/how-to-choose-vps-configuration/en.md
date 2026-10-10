---
title: How to Choose VPS Specs: CPU, RAM, Disk and Bandwidth
description: How to estimate VPS CPU, RAM, disk and bandwidth for a website, API, database or bot, how NVMe differs from SSD, and how to resize without overpaying.
summary: Start with a modest plan that has comfortable RAM headroom and NVMe storage, watch real load for a week, and then increase only the resource that actually hits its limit.
---
## The short answer

You do not guess a VPS configuration, you **size it from measurements**. Start with a modest plan that clearly fits your stack, turn on monitoring, and after a week or two of real traffic increase whatever is actually running out. Most of the time the first bottleneck is **memory**, not CPU.

## What each resource means

- **vCPU** — virtual cores. They matter for computation: handling requests, builds, compression, report generation. Check whether cores are dedicated or shared: on shared cores, performance depends on your neighbors.
- **RAM** — memory for the application, database, cache and the system. When it runs out, the system starts swapping or kills processes, and the service slows down or crashes.
- **Disk** — size and type. For databases and heavy writes, disk speed often matters more than core count.
- **Bandwidth** — network throughput and traffic limits. It matters for serving files, video and large API responses.

## Estimating typical workloads

These are starting points, not exact rules: much depends on the stack and the code.

| Workload | What to watch first | Where to start |
|---|---|---|
| CMS or static website | RAM for the web server and PHP or Node.js | Smallest plan, then adjust |
| API or backend | CPU and RAM per worker | Modest plan, grow with request volume |
| Database | RAM for data cache and disk speed | More memory, NVMe required |
| Telegram bot | RAM; little CPU unless there is heavy processing | Entry-level plan |
| Everything on one server | Sum the needs of all services | Extra RAM headroom |

Practical rules:
- **Add up every service.** Web server, application, database, Redis, job queue: each takes its share of memory.
- **Leave memory headroom** for peaks and system processes. A server running at the edge fails at the worst moment.
- **Databases love memory.** The more data fits in cache, the less often they hit the disk.
- **A bot or a simple site** rarely needs much. Do not buy capacity "for future growth" in advance.

## NVMe or SSD

Both are solid-state, but they connect differently. **NVMe** uses the PCIe bus and usually gives noticeably lower latency and more I/O operations than a **SATA SSD**. For databases, queues and anything with frequent small reads and writes, NVMe is clearly better. For a static site the difference is barely visible.

On a VPS today, HDD storage is worth considering only for archives and rarely accessed data.

## Measuring real load

On Linux, standard commands give you the basic picture:

```bash
free -h        # memory usage and whether swap is in use
df -h          # disk usage
uptime         # load average
htop           # live view of processes, CPU and memory
```

For ongoing visibility, set up monitoring with graphs so you see not just the current moment but peaks by time of day and day of week.

What to look for:
- **Memory near the limit and swap growing** — add RAM.
- **CPU constantly busy** with memory fine — add cores or optimize the code.
- **High I/O wait (iowait)** — you need a faster disk or more memory for the database cache.
- **Bandwidth hitting the limit** — move static files and media to a CDN or object storage.

## Resizing without overpaying

- **Pick a provider with flexible plan changes.** Scaling up usually takes minutes and a reboot, but shrinking a disk is often impossible without migrating.
- **Do not oversize the disk upfront.** It is easier to grow than to shrink.
- **Split services when they get in each other's way.** Moving the database to its own server is sometimes cheaper than endlessly growing one machine.
- **Optimize first, pay second.** Caching, database indexes and compressed static assets often help more than the next plan up.
- **Review your plan periodically.** Load changes, but unused resources stay on the bill.

## FAQ

### How much RAM does a WordPress site need?

It depends on plugins, traffic and caching. A small site with caching runs on entry-level plans, but you need to count the database and PHP together. Start modest and watch memory usage for a week.

### Can I run a website, a database and a bot on one VPS?

Yes, for small projects that is normal. Make sure total memory stays below the limit and back up the database. When services start interfering with each other, split them across servers.

### What matters more for a database: CPU or disk?

Usually memory and disk. The more working data fits in RAM, the lower the disk load, and when the database does hit the disk, NVMe noticeably cuts latency.
