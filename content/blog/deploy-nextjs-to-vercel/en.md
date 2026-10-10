---
title: How to Deploy a Next.js Site to Vercel with a Custom Domain
description: Step by step: connect a Git repository to Vercel, set environment variables, use preview deployments, attach your own domain and check free plan limits.
summary: Push the project to GitHub, GitLab or Bitbucket, import the repository into Vercel, add environment variables and attach your domain under Settings → Domains. From then on, every push to the main branch updates the live site automatically.
---
## The short answer: four steps

1. Your code lives in a Git repository on GitHub, GitLab or Bitbucket.
2. In Vercel, click **Add New → Project**, pick the repository, and Vercel detects Next.js on its own.
3. Add **environment variables** and run the first deployment.
4. Under **Settings → Domains**, add your domain and create the DNS records at your registrar.

After that, every push to the main branch ships to **production**, and every other branch and pull request gets its own **preview URL**.

## Prepare the project

Before connecting Vercel, make sure that:

- `npm run build` passes locally;
- the lockfile (`package-lock.json`, `pnpm-lock.yaml` or `yarn.lock`) is committed, since Vercel uses it to pick the package manager;
- `.env*.local` files are in `.gitignore` and not in the repository;
- the Node.js version you need is set in `engines` in `package.json` or in project settings.

## Connect the repository

1. Sign in to Vercel with your Git provider and grant access to the repository.
2. Click **Import** next to it.
3. In a monorepo, set the **Root Directory** to the folder containing the app.
4. Leave the build command and output directory alone: Vercel sets them for Next.js automatically.
5. Click **Deploy**.

The first build takes a few minutes and gives you an address like `project-name.vercel.app`.

## Environment variables

Variables live under **Settings → Environment Variables** and are set separately for three environments: **Production**, **Preview** and **Development**.

Keep in mind:

- Variables prefixed with `NEXT_PUBLIC_` are baked into client-side JavaScript at build time and visible to every visitor. **Secrets** such as API keys and database passwords must never use that prefix.
- Changing a variable requires a **new deployment**; the running site keeps the old values until then.
- Point Preview at a test database and test keys, not production ones.

To get the same variables locally, use the Vercel CLI:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
```

## Preview deployments

Each branch and pull request gets its own URL with the latest version. It is the easiest way to show changes to a client or test them before merging, without touching the live site. The link appears as a comment on the pull request and in the **Deployments** tab.

You can restrict preview URLs to your team under **Deployment Protection**. Check it if previews contain unreleased content.

## Attach your own domain

Open **Settings → Domains** and add a domain such as `example.com`. You have two options:

- **Keep DNS at your registrar** and add the records Vercel shows: usually an A record for the root domain and a CNAME for `www`.
- **Delegate the domain to Vercel** by changing nameservers at the registrar, so Vercel manages all DNS.

| Type | Name | Value |
|---|---|---|
| A | `@` | IP address shown in the Vercel dashboard |
| CNAME | `www` | target shown in the Vercel dashboard |

Always copy values from your project's dashboard, because Vercel updates them from time to time. Pick one primary address, for example `example.com`, and redirect `www` to it. Vercel issues the SSL certificate automatically once DNS points to it.

If you switch nameservers, recreate every existing record first, especially **MX** and **TXT** records for email, or your domain's mail will stop working.

## Free plan limits

The **Hobby** plan is meant for personal, non-commercial projects. A company website, online store or client project requires the paid **Pro** plan under Vercel's terms.

Hobby limits build time, serverless function duration, bandwidth, image optimization and other resources. The exact numbers change, so check the current values in the documentation ([vercel.com/docs/limits](https://vercel.com/docs/limits)) and watch the **Usage** tab. Heavy images, frequent rebuilds and server rendering of pages that could be static use up limits fastest.

## Common mistakes

- **Builds locally, fails on Vercel.** Often a filename case issue: Windows and macOS ignore case, the Linux build does not, so `Header.tsx` is not found by an import of `./header`.
- **A variable is `undefined`.** It is missing for that environment, the site was not redeployed, or it is used in the browser without the `NEXT_PUBLIC_` prefix.
- **A secret with the `NEXT_PUBLIC_` prefix** ends up in public code.
- **Preview connected to the production database**, so testing changes real data.
- **Old A records left at the registrar** next to the new ones, so the domain alternates between the old host and Vercel.

## FAQ

### Can I deploy without GitHub?

Yes, with `vercel --prod` from the Vercel CLI. Without Git integration, though, you lose automatic deployments on every push and preview URLs for branches.

### How long does it take for the domain to work?

Usually minutes to a few hours, depending on the TTL of old records. The certificate is issued automatically once Vercel sees the correct DNS records; the status is shown under Settings → Domains.

### Is the free plan fine for a company website?

Not under Vercel's terms: Hobby is for non-commercial use. A commercial site needs Pro or a different host.
