# DX Team Toolkit

## Reusable workflows

### 1. Run tests and show coverage diff

#### Prerequisites:
1. Javascript/Typescript based project configured with `yarn`
2. `yarn build` command builds the project
3. `yarn test:coverage` runs tests and prepares coverage report in `./coverage/coverage.txt`

#### Example of usage:
```yaml
name: Check coverage for PR

on:
  pull_request:

jobs:
  run-tests-check-coverage:
    name: Run tests & check coverage
    permissions:
      checks: write
      pull-requests: write
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/coverage-diff.yml@main
```

### 2. Generate docs and coverage report and publish to the Github Pages using `gh-pages` branch

#### Prerequisites:
1. Javascript/Typescript based project configured with `yarn`
2. `yarn build` command builds the project
3. `yarn test:coverage` runs tests and prepares coverage report in `./coverage/coverage.txt`
4. `yarn docs` generate documentation using typedoc in `./docs` folder

#### Example of usage:
```yaml
name: Generate docs and coverage report

on:
  push:
    branches:
      - main

jobs:
  generate-docs-and-coverage:
    name: Generate docs and coverage report
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/docs-and-coverage.yml@main
```
