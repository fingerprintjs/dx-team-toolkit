# `paths-changed` action

Detect whether a pull request or push touched any of a set of path globs — **without**
breaking required status checks.

## The problem it solves

GitHub lets you skip a workflow when only irrelevant files change by adding a `paths:`
filter to the trigger:

```yaml
on:
  pull_request:
    paths:
      - 'src/**'
```

But if that workflow's check is marked as **required** in branch protection, a PR that
touches none of those paths (for example a `README.md`-only change) will never run the
check — and GitHub blocks the merge forever, waiting for a status that will never report.

Teams keep re-implementing the same workaround by hand (see the ad-hoc `git diff` jobs in
`fastly-compute-proxy` and the `dorny/paths-filter` job in `fingerprintjs/docs`). This
action packages that pattern so nobody has to write it again.

## How it works

1. **Do not** put a `paths:` filter on your trigger, so the workflow always runs and the
   required check always reports a status.
2. Run this action to detect whether any watched path actually changed.
3. Gate the expensive steps on the `changed` output. When nothing relevant changed, the
   job still completes successfully and the required check goes green.

## Inputs

<!-- prettier-ignore -->

| Input               | Required | Default            | Description                                                                                          |
|---------------------|----------|--------------------|------------------------------------------------------------------------------------------------------|
| `paths`             | Yes      | -                  | Newline-separated list of positive picomatch glob patterns to watch.                                 |
| `base`              | No       | _(auto)_           | Base ref of the comparison. Defaults to the PR base branch / previous commit.                        |
| `ref`               | No       | _(auto)_           | Head ref of the comparison. Defaults to the current ref.                                             |
| `working-directory` | No       | `.`                | Relative path under `$GITHUB_WORKSPACE` to run the detection in.                                     |
| `token`             | No       | `${{ github.token }}` | Token used to fetch changed files for pull request events via the API.                            |

## Outputs

<!-- prettier-ignore -->

| Output          | Description                                                                          |
|-----------------|--------------------------------------------------------------------------------------|
| `changed`       | `'true'` if any of the watched paths changed, otherwise `'false'`.                   |
| `changed-files` | Space-separated, shell-escaped list of the changed files that matched the patterns.  |

## Example: a required check that only runs heavy work when relevant files change

```yaml
name: Check broken links

on:
  pull_request: # no `paths:` filter — the workflow always runs

permissions:
  contents: read
  pull-requests: read

jobs:
  check-broken-links:
    name: Check broken links # mark THIS job as the required status check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: filter
        uses: fingerprintjs/dx-team-toolkit/.github/actions/paths-changed@v1
        with:
          paths: |
            mintlify/**
            package.json
            pnpm-lock.yaml
            .github/workflows/**

      - name: Check broken links
        if: steps.filter.outputs.changed == 'true'
        run: pnpm check:broken-links
```

A `README.md`-only PR now still runs the `check-broken-links` job, skips the heavy step,
reports success, and is mergeable.

## Example: gate a whole downstream job

```yaml
on:
  pull_request:

permissions:
  contents: read
  pull-requests: read

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      run-e2e: ${{ steps.filter.outputs.changed }}
    steps:
      - uses: actions/checkout@v4
      - id: filter
        uses: fingerprintjs/dx-team-toolkit/.github/actions/paths-changed@v1
        with:
          paths: |
            src/**
            plugins/**
            .github/workflows/**

  e2e:
    needs: changes
    if: needs.changes.outputs.run-e2e == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: ./run-e2e.sh
```

> **Note:** when you gate a whole job with `if:` and that job is a required check, GitHub
> treats the skipped job as passed. Gating individual steps (the first example) is the most
> robust because the job always runs to completion.

## Notes

- Built on top of [`dorny/paths-filter`](https://github.com/dorny/paths-filter), which
  handles the `pull_request` vs `push` diff semantics and shallow checkouts.
- For `pull_request` workflows, grant `pull-requests: read`. If the workflow also checks
  out the repository, grant `contents: read`.
- The `paths` input accepts positive [picomatch](https://github.com/micromatch/picomatch)
  glob patterns such as `src/**`, `*.md`, and `{package.json,pnpm-lock.yaml}`. This action
  wraps one [`dorny/paths-filter`](https://github.com/dorny/paths-filter) filter, so do not
  use GitHub trigger-style ordered exclusion patterns like `!src/**/*.md` here. Use
  `dorny/paths-filter` directly when you need advanced filter YAML, change-type rules such
  as `added|modified`, or exclusion semantics.
