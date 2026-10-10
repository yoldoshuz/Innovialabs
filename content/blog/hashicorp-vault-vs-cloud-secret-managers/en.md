---
title: HashiCorp Vault vs AWS, GCP and Azure Secret Managers
description: HashiCorp Vault compared with AWS Secrets Manager, GCP Secret Manager and Azure Key Vault: dynamic secrets, rotation, policies, audit, cost and operations.
summary: If your infrastructure lives in one cloud and the team is small, use that cloud's built-in secret manager; Vault pays off with multi-cloud or your own servers, when you need dynamic secrets, and when the team can afford to run it.
---
## The short answer

- **Cloud secret managers** (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) are managed services: nothing to deploy, with permissions and auditing built into the cloud. The best choice for a team that lives in one cloud.
- **HashiCorp Vault** is a dedicated secrets platform: dynamic credentials, encryption as a service, one policy model across any environment. More powerful and flexible, but you have to operate it or pay for the managed version.

The real question is not "which is better" but "how many different environments do you have, and who will run this?"

## Comparison by key criteria

| Criterion | HashiCorp Vault | AWS Secrets Manager | GCP Secret Manager | Azure Key Vault |
|---|---|---|---|---|
| Dynamic secrets | Yes, for databases, clouds, PKI and more | No, storage and rotation only | No | No |
| Rotation | Leases and TTLs, automatic revocation | Built in via Lambda; managed for some AWS services | Schedule that notifies Pub/Sub; you write the rotation logic | Automatic for keys; for secrets via Event Grid events and your own function |
| Access policies | Own HCL policies, many auth methods | IAM and resource policies | IAM | Azure RBAC |
| Audit | Audit devices you configure and retain | CloudTrail | Cloud Audit Logs | Diagnostic logs to Azure Monitor |
| Outside its cloud | Anywhere: clouds, own servers, Kubernetes | Mostly within AWS | Mostly within GCP | Mostly within Azure |
| Operational burden | High (self-hosted) or medium (managed) | Minimal | Minimal | Minimal |

## Dynamic secrets

This is Vault's defining feature. Instead of one permanent database password, the app asks Vault for **temporary credentials** at startup. Vault creates a database user with the right permissions and a limited lifetime (**TTL**). When the lease expires, Vault deletes the user.

What you get:

- each app instance has its own login, so the logs show who did what;
- a leaked password stops working quickly;
- rotation is built into the model.

Cloud managers store **static** secrets and rotate them on a schedule, which is enough for many projects. Clouds get a similar effect through roles, such as IAM authentication to managed databases.

## Rotation and audit in practice

In cloud managers, rotation is easiest for the cloud's own services, such as managed databases. For a third-party API key you will usually write a function that creates a new key with the provider and stores it as a new secret version.

Cloud audit logs arrive with the rest of the cloud's logging. In Vault you enable auditing explicitly and decide where the log goes and how long to keep it.

## Cost and team burden

Exact prices change, so compare by factors:

- **Cloud managers** charge per stored secret and/or per API call. The bill grows if the app reads a secret on every request — cache values in memory. On AWS, Parameter Store can be cheaper for simple configuration.
- **Self-hosted Vault** means servers, a cluster for high availability, backups, upgrades, the unseal procedure, monitoring, and people who know how to recover it at 3 a.m. The main cost is engineering time.
- **Managed Vault** (HCP Vault) removes the operations work, but for a small number of secrets it usually costs more than cloud managers.

Check the license too: Vault is distributed under the Business Source License. If you need a fully open-source option, there is the **OpenBao** fork.

## What to choose

| Situation | Recommendation |
|---|---|
| Small team, everything in one cloud | That cloud's built-in secret manager |
| One VPS or a few servers, no cloud | CI/CD and hosting secrets; Vault is overkill for now |
| Several clouds, or cloud plus own servers | Vault (managed or self-hosted) as a single source |
| Strict database access and audit requirements, a platform team in place | Vault with dynamic secrets |
| Kubernetes in any cloud | Cloud manager or Vault, plus External Secrets Operator to sync into the cluster |

Starting with a cloud manager and moving to Vault later is a normal path, and a small one if the app reads secrets through environment variables or a config layer.

## Common mistakes

- Deploying Vault for a dozen static secrets.
- Self-hosted Vault without backups or a recovery plan: losing the unseal keys means losing every secret.
- One shared "access to everything" token instead of per-application policies.
- Fetching a secret from the cloud on every HTTP request instead of caching it.

## FAQ

### Can I use Vault and a cloud manager at the same time?

Yes. A common split is the cloud manager for cloud-service secrets and Vault for dynamic credentials and non-cloud environments. Just agree on which secret lives where to avoid two sources of truth.

### Is Azure Key Vault suitable for certificates and encryption keys?

Yes, Key Vault was designed for secrets, cryptographic keys and certificates. On AWS and GCP, encryption keys usually live in a separate service — KMS — rather than in the secret manager.

### How hard is it to migrate between secret managers?

Moving the values themselves takes a script. Rewriting access policies, rotation and CI/CD integrations is the harder part. The less your code knows about a specific store, the easier the move.
