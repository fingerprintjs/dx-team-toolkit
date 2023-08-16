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
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/coverage-diff.yml@v1
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
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/docs-and-coverage.yml@v1
```

### 3. Analyze commits

- Checks with `commitlint` that all commit messages made in rules of `Semantic release`.
- Generates release preview: next version and release notes.

#### Prerequisites:
1. Project uses `Semantic release` for a release workflow

#### Example of usage:
```yaml
name: Analyze Commit Messages
on: 
  pull_request:

permissions:
  pull-requests: write
  contents: write
jobs:
  analyze-commits:
    name: Generate docs and coverage report
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/analyze-commits.yml@v1
```

### 4. Build typescript project

- Builds project
- Runs linter, unit tests and checks generated types
- Creates an artifact that can be reused in other jobs

#### Prerequisites:
1. NodeJS project
2. `yarn build` command builds the project
3. `yarn lint` lints code
4. `yarn test` runs tests
5. `yarn test:dts` checks compiled types, usually command looks like `tsc --noEmit --isolatedModules dist/index.d.ts`

#### Inputs

| Input Parameter              | Required | Type    | Default    | Description |
|------------------------------|----------|---------|------------|-------------|
| `yarnFlags`                  | No       | String  | `""`       | Additional flags for the `yarn install` command. |
| `artifactName`               | No       | String  | `""`       | Name of the artifact to upload. If not provided, the artifact upload step will be skipped. |
| `artifactPath`               | No       | String  | `"./dist"` | Path of the files to upload as artifact. |
| `checkoutPersistCredentials` | No       | Boolean | `true`     | Whether to persist credentials for checkout. |

#### Examples of usage:

Build project
```yaml
name: Build project and run CI checks
on: 
  pull_request:

jobs:
  build-and-check:
    name: Build project and run CI checks
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/build-typescript-project.yml@v1
```

Build project and run functional tests
```yaml
name: Build project and run functional tests
on: 
  pull_request_target:
jobs:
  build-and-check:
    name: Build project and run CI checks
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/build-typescript-project.yml@v1
    with:
      yarnFlags: '--ignore-engines'
      artifactName: 'node-sdk-artifact'
      artifactPath: './dist'
  run-functional-tests:
    needs: build-and-check
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [ 10, 12, 14, 16, 17, 18, 19, 20 ]
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - uses: actions/download-artifact@v3
        with:
          name: node-sdk-artifact
          path: ./dist
      - name: Run tests
        run: yarn test:functional
```
