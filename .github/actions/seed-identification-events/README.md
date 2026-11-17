# `seed-identification-events` action

Create identification events in a Fingerprint workspace so that tests searching for recent events always find some.

Test workspaces keep data for 30 days and get no other traffic. Server SDK functional tests that search for recent events would otherwise find nothing once the data expires. Run this action in a separate job before those tests.

## How It Works

The action runs the JS agent (v4, from the CDN) in the Chrome that GitHub-hosted Ubuntu runners already have, driven by [`playwright-core`](https://playwright.dev/docs/api/class-playwright) (no browser download). It alternates two kinds of browser context, so the workspace gets both:

- a regular context, which the agent reports as incognito;
- a persistent-profile context, which the agent reports as non-incognito.

Every event has the page URL `https://dx-team-toolkit-events.test/`, so you can tell seeded events from real ones.

## Usage

Run the action in its own job and make the test job depend on it with `needs:`:

```yaml
name: Functional tests

on:
  pull_request:

permissions:
  contents: read

jobs:
  seed:
    name: Seed identification events
    runs-on: ubuntu-latest
    steps:
      - uses: fingerprintjs/dx-team-toolkit/.github/actions/seed-identification-events@v1
        with:
          public-api-key: ${{ secrets.FINGERPRINT_PUBLIC_KEY }}

  test:
    name: Test (${{ matrix.version }})
    needs: seed
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: ['3.9', '3.12']
    steps:
      - uses: actions/checkout@v7
      - run: ./run-functional-tests.sh
```

The action does not need a checkout of your repository.

## Inputs

<!-- prettier-ignore -->
| Input            | Required | Default | Description                                                           |
|------------------|----------|---------|-----------------------------------------------------------------------|
| `public-api-key` | Yes      | -       | Public API key of the workspace environment to create events in.      |
| `region`         | No       | `us`    | Workspace region: `us`, `eu` or `ap`.                                 |
| `count`          | No       | `5`     | Number of events to create. Must be a positive integer.               |

## Requirements

- A GitHub-hosted `ubuntu-*` runner, which ships with Google Chrome. Self-hosted runners need Chrome installed.
- Outbound access to `fpjscdn.net` and the Fingerprint API for the workspace region.

## Permissions

None. The action does not use the `GITHUB_TOKEN`.
