---
description: Manual deployment workflow for the Opero website. Use only when explicitly invoked to commit all uncommitted files with a thorough message, handle pre-commit failures, and push the current branch to its remote.
---

# Deploy

Use this skill when the user is ready to ship the current Opero website work.

## Goal

Commit all uncommitted files with a thorough, accurate commit message, fix any pre-commit failures that appear, and push the branch to the configured remote.

Do not use this skill unless explicitly invoked. Do not force-push. Do not discard or revert user work.

## Workflow

1. Inspect the repository state:
   - `git status --short --branch`
   - `git diff --stat`
   - `git diff --cached --stat`
   - targeted diffs for important source, content, config, public asset, or skill files.

2. Understand what will be shipped:
   - Identify page/content changes.
   - Identify dependency/config/build changes.
   - Identify generated or public assets.
   - Identify quality-gate or skill changes.
   - Watch for accidental files such as `:Zone.Identifier`, logs, caches, local env files, or oversized generated artifacts.

3. Stage all intended uncommitted work:
   - Use `git add -A`.
   - If accidental generated/local files are present, remove them from the index or add an appropriate ignore rule without deleting user work.

4. Create a thorough commit message from the actual diff:
   - Use a concise subject line.
   - Include a body with the main changes grouped by area.
   - Mention quality gates, SEO/performance/static-generation changes, dependencies, or deployment-impacting changes when relevant.
   - Do not invent changes that are not in the diff.

5. Commit:
   - Let pre-commit hooks run normally.
   - If hooks fail or modify files, inspect the failure, make the smallest appropriate fix, stage again, and retry.
   - Repeat until the commit succeeds or there is a real blocker that needs user input.

6. Push:
   - Use `git push` when the branch has an upstream.
   - If no upstream exists, use `git push -u origin <current-branch>`.
   - Never force-push unless the user explicitly requests it.

7. Final response:
   - Report the commit hash and commit subject.
   - Confirm push target.
   - Summarize hook results and any fixes made during the deploy loop.
   - Mention if any files were intentionally excluded.

## Commit Message Shape

Prefer this structure:

```text
Short subject describing the shipment

- Add or update ...
- Configure ...
- Verify ...
```

Keep the message specific to the actual uncommitted changes. For small changes, a shorter body is fine, but the message should still be clear enough for a non-technical stakeholder to understand what shipped.
