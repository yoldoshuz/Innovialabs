---
title: Terraform State Management: Remote Backends, Locking and Workspaces
description: Why Terraform state matters, how to set up a remote backend with locking, split state per environment, import existing resources and fix drift.
summary: State is the map between your code and real infrastructure. Keep it in a remote backend with locking and encryption, split it by environment and component, and fix mismatches with plan, import and refresh instead of editing the file by hand.
---

## What state is and why it matters

**State** (`terraform.tfstate`) is the file where Terraform records how resources in code map to real cloud objects: IDs, attributes, dependencies. Without it Terraform does not know what already exists and would try to create everything again on the next `apply`.

Three rules follow from that:

- **State is a critical artifact.** Losing it does not delete infrastructure, but it detaches that infrastructure from management.
- **State contains secrets.** Database passwords, keys and other sensitive attributes may be stored in plain text.
- **Only one process should modify state at a time.** Two concurrent `apply` runs can corrupt it.

## A remote backend with locking

Local state is fine for experiments only. A team needs a **remote backend**: shared storage that everyone and the CI can reach.

What a good backend provides:

| Requirement | Why |
|---|---|
| **Locking** | Prevents two runs from changing state at once |
| **Encryption** | Protects the secrets inside state |
| **Versioning** | Lets you roll back to a previous state version |
| **Access control** | Limits who can read and modify state |

An AWS S3 example:

```hcl
terraform {
  backend "s3" {
    bucket       = "company-terraform-state"
    key          = "prod/network/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

The locking mechanism depends on the backend and Terraform version: older S3 setups used a DynamoDB table. Check the documentation for your version. Alternatives include GCS, Azure Blob, Terraform Cloud/HCP and GitLab-managed state.

Create the state bucket itself separately (by hand or with a dedicated configuration) and enable versioning on it.

## Splitting state by environment and component

One huge state for everything causes trouble: slow `plan` runs, a large blast radius for mistakes, lock contention.

Two main approaches:

- **Separate directories per environment** (`envs/dev`, `envs/prod`) with different backend `key` values. Environments are explicitly isolated and can have different access rights.
- **Workspaces** — several states for one configuration, switched with `terraform workspace select`. Handy for identical copies, but it is easy to apply changes to the wrong environment.

For production most teams prefer **separate directories or separate backend configurations** and keep workspaces for temporary, identical stacks. Within an environment it helps to split state by layer: network, data, applications. Connect them through `terraform_remote_state` or by passing outputs.

## Importing existing resources

A resource created by hand can be brought under management without recreating it:

```hcl
import {
  to = aws_s3_bucket.assets
  id = "company-assets"
}
```

The flow: describe the resource in code (or generate configuration with `terraform plan -generate-config-out=...`), run `plan`, confirm there are no changes or only expected ones, then `apply`. Older versions offer the `terraform import` command.

## Drift: when reality diverges from code

**Drift** means changes made outside Terraform — someone edited a firewall rule in the console.

1. Run `terraform plan -refresh-only` to see how reality differs from state.
2. Decide which is right: the code or the manual change.
3. If the manual change is right, move it into code. If the code is right, run a normal `apply`.
4. Run `plan` on a schedule in CI to catch drift early.

To rename resources use a `moved` block or `terraform state mv`; to stop managing an object without destroying it use a `removed` block or `terraform state rm`.

## Common mistakes

- Committing `terraform.tfstate` to Git.
- Editing state by hand in a text editor.
- Running `force-unlock` without confirming the other process has actually finished.
- Giving every developer write access to production state.

## FAQ

### Can I store state in Git?

Better not: it may contain secrets, and Git provides no locking, so concurrent changes lead to conflicts and corrupted state.

### What if the state is lost?

If the backend had versioning, restore the previous version. If not, you will need to re-import existing resources into a new state, one by one or with `import` blocks.

### Workspaces or separate directories?

Separate directories give explicit isolation and different access rights, which is why they are usually chosen for production. Workspaces suit identical temporary environments.
