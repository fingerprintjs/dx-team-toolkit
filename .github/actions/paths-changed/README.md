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
| `paths`             | Yes      | -                    | Newline-separated positive git glob pathspecs.            |

## Outputs

<!-- prettier-ignore -->

| Output          | Description                                              |
|-----------------|----------------------------------------------------------|
| `changed`       | `'true'` when any watched path changed.                  |

## Filter Syntax

`paths` accepts positive [git glob pathspecs](https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec)
such as `src/**`, `*.md`, and `package.json`.

## Permissions

Grant `contents: read` so the job can check out the repo and fetch the comparison ref.
