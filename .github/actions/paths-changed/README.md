# `paths-changed` action

Detect changed files without using workflow-level `paths:` filters.

Use this when a required check should always report, but its expensive steps only need to
run for some files. Let the workflow run on every PR, then gate the expensive steps on this
action's `changed` output.

## Gate Steps

```yaml
name: Check broken links

on:
  pull_request:

permissions:
  contents: read
  pull-requests: read

jobs:
  check-broken-links:
    name: Check broken links
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: changes
        uses: fingerprintjs/dx-team-toolkit/.github/actions/paths-changed@v1
        with:
          paths: |
            mintlify/**
            package.json
            pnpm-lock.yaml
            .github/workflows/**

      - name: Check broken links
        if: steps.changes.outputs.changed == 'true'
        run: pnpm check:broken-links
```

## Gate a Downstream Job

Use a small always-running job to expose the `changed` output, then skip heavier jobs from
there.

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      run-e2e: ${{ steps.changes.outputs.changed }}
    steps:
      - uses: actions/checkout@v4
      - id: changes
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

## Inputs

<!-- prettier-ignore -->

| Input               | Required | Default              | Description                                               |
|---------------------|----------|----------------------|-----------------------------------------------------------|
| `paths`             | Yes      | -                    | Newline-separated positive picomatch globs.               |
| `base`              | No       | _(auto)_             | Base ref. Defaults to the PR base branch / previous push commit. |
| `ref`               | No       | _(auto)_             | Head ref. Defaults to the current ref.                    |
| `working-directory` | No       | `.`                  | Checkout path under `$GITHUB_WORKSPACE`.                  |
| `token`             | No       | `${{ github.token }}` | Token for pull request file lookup.                       |

## Outputs

<!-- prettier-ignore -->

| Output          | Description                                              |
|-----------------|----------------------------------------------------------|
| `changed`       | `'true'` when any watched path changed.                  |
| `changed-files` | Space-separated, shell-escaped matching changed files.   |

## Filter Syntax

`paths` accepts positive [picomatch](https://github.com/micromatch/picomatch) globs such
as `src/**`, `*.md`, and `{package.json,pnpm-lock.yaml}`.

This action wraps one [`dorny/paths-filter`](https://github.com/dorny/paths-filter) filter.
Use `dorny/paths-filter` directly for advanced YAML, change-type rules such as
`added|modified`, or exclusion logic like `!src/**/*.md`.

## Permissions

For `pull_request` workflows, grant `pull-requests: read`. If the job checks out the repo,
also grant `contents: read`.
