# DX Team Toolkit

> **Note**
> This repository isn’t part of our core product. It’s kindly shared “as-is” without any guaranteed level of support from Fingerprint. We warmly welcome community contributions.

## Reusable configurations

This monorepo stores reusable configurations for tools like ESLint, Prettier, etc. used by the DX team at Fingerprint.

|     | Package                                                                                                    | Published version                                                                                                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Eslint: [@fingerprintjs/eslint-config-dx-team](packages/eslint-config-dx-team)                             | <a href="https://www.npmjs.com/package/@fingerprintjs/eslint-config-dx-team"><img src="https://img.shields.io/npm/v/@fingerprintjs/eslint-config-dx-team.svg" alt="Current NPM version @fingerprintjs/eslint-config-dx-team"></a>                            |
| 3   | Prettier: [@fingerprintjs/prettier-config-dx-team](packages/prettier-config-dx-team)                       | <a href="https://www.npmjs.com/package/@fingerprintjs/prettier-config-dx-team"><img src="https://img.shields.io/npm/v/@fingerprintjs/prettier-config-dx-team.svg" alt="Current NPM version @fingerprintjs/prettier-config-dx-team"></a>                      |
| 4   | Typescript: [@fingerprintjs/tsconfig-dx-team](packages/tsconfig-dx-team)                                   | <a href="https://www.npmjs.com/package/@fingerprintjs/tsconfig-dx-team"><img src="https://img.shields.io/npm/v/@fingerprintjs/tsconfig-dx-team.svg" alt="Current NPM version @fingerprintjs/tsconfig-dx-team"></a>                                           |
| 5   | Conventional Commits: [@fingerprintjs/commit-lint-dx-team](packages/commit-lint-dx-team)                   | <a href="https://www.npmjs.com/package/@fingerprintjs/commit-lint-dx-team"><img src="https://img.shields.io/npm/v/@fingerprintjs/commit-lint-dx-team.svg" alt="Current NPM version @fingerprintjs/commit-lint-dx-team"></a>                                  |
| 6   | Commits Analyzer: [@fingerprintjs/conventional-changelog-dx-team](packages/conventional-changelog-dx-team) | <a href="https://www.npmjs.com/package/@fingerprintjs/conventional-changelog-dx-team"><img src="https://img.shields.io/npm/v/@fingerprintjs/conventional-changelog-dx-team.svg" alt="Current NPM version @fingerprintjs/conventional-changelog-dx-team"></a> |

## Reusable workflows

- [1. Run tests and show coverage diff](#1-run-tests-and-show-coverage-diff)
- [2. Generate docs and coverage report and publish to the Github Pages using `gh-pages` branch](#2-generate-docs-and-coverage-report-and-publish-to-the-github-pages-using-gh-pages-branch)
- [3. Analyze commits](#3-analyze-commits)
- [4. Build typescript project](#4-build-typescript-project)
- [5. Release TypeScript project](#5-release-typescript-project)
- [6. Release Server SDK](#6-release-server-sdk)
- [7. Report Workflow Status](#7-report-workflow-status)
- [8. Create PR to Main on Release](#8-create-pr-to-main-on-release)
- [9. Create Prerelease Branch and Force Push](#9-create-prerelease-branch-and-force-push)

### 1. Run tests and show coverage diff

#### Prerequisites:

1. Javascript/Typescript based project configured with `yarn`
2. `yarn build` command builds the project
3. `yarn test:coverage` runs tests and prepares coverage report in `./coverage/coverage.txt`

#### Inputs

| Input Parameter   | Required | Type   | Default    | Description                                    |
| ----------------- | -------- | ------ | ---------- | ---------------------------------------------- |
| `runAfterInstall` | No       | String | `""`       | Commands to run after installing dependencies. |
| `testScript`      | No       | String | `npx jest` | The test script to run.                        |
| `nodeVersion`     | No       | String | `lts/*`    | Node version to use                            |

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

> **Note**: By default, this workflow prepares the `gh-pages` folder by moving the contents of `./docs`
> and `./coverage/lcov-report` into it. If you need a different structure, you can override the default behavior by
> passing the appropriate commands in the `prepare-gh-pages-commands` input parameter.

#### Inputs

| Input Parameter             | Required | Type    | Default                                                                      | Description                                                                                                                                                        |
| --------------------------- | -------- | ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prepare-gh-pages-commands` | No       | String  | <pre>mv docs ./gh-pages<br>mv coverage/lcov-report ./gh-pages/coverage</pre> | Commands to prepare the content of the `gh-pages` folder. The `gh-pages` folder will be created automatically. Only specify the commands for moving files into it. |
| `skip-docs-step`            | No       | Boolean | `false`                                                                      | Skip the documentation generation step.                                                                                                                            |
| `run-after-install`         | No       | String  | `""`                                                                         | Commands to run after installing dependencies.                                                                                                                     |
| `node-version`              | No       | String  | `lts/*`                                                                      | Node version to use                                                                                                                                                |

#### Example of usage with default behavior:

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

This example uses the default commands to prepare the content of the gh-pages folder, which moves the `docs` and
`coverage/lcov-report` folders into the `gh-pages` folder.

#### Example of usage with custom behavior:

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
    with:
      prepare-gh-pages-commands: |
        mv docs/* ./gh-pages
        mv coverage/lcov-report ./gh-pages/coverage
```

In this example, we're explicitly passing the `prepare-gh-pages-commands` parameter with the commands to move the `docs`
and `coverage/lcov-report` folders into the `gh-pages` folder. You can customize these commands to fit your project's
structure.

### 3. Analyze commits

- Checks with `commitlint` that all commit messages made in rules of `Semantic release`.
- Generates release preview: next version and release notes.

#### Prerequisites:

1. Project uses `Semantic release` for a release workflow

#### Inputs

| Input Parameter                 | Required | Type   | Default | Description                                                                                                                                      |
|---------------------------------|----------|--------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `nodeVersion`                   | No       | String | `lts/*` | Node version to use                                                                                                                              |
| `installSharedCommitLintConfig` | No       | Bool   | `false` | Whether to install our shared commit lint config. If set to `true` it will run `npm i @fingerprintjs/commit-lint-dx-team@latest` before linting. |

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
    name: Analyze commit messages
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

| Input Parameter   | Required | Type   | Default    | Description                                                                                |
| ----------------- | -------- | ------ | ---------- | ------------------------------------------------------------------------------------------ |
| `yarnFlags`       | No       | String | `""`       | Additional flags for the `yarn install` command.                                           |
| `artifactName`    | No       | String | `""`       | Name of the artifact to upload. If not provided, the artifact upload step will be skipped. |
| `artifactPath`    | No       | String | `"./dist"` | Path of the files to upload as artifact.                                                   |
| `runAfterInstall` | No       | String | `""`       | Commands to run after installing dependencies.                                             |
| `nodeVersion`     | No       | String | `lts/*`    | Node version to use                                                                        |

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
        node-version: [10, 12, 14, 16, 17, 18, 19, 20]
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - uses: actions/download-artifact@v4
        with:
          name: node-sdk-artifact
          path: ./dist
      - name: Run tests
        run: yarn test:functional
```

### 5. Release TypeScript project

#### Description

This workflow handles the release process for a TypeScript project. It builds the project, runs CI checks, and performs
a semantic release.

#### Prerequisites:

1. NodeJS project
2. The workflow requires the `production` environment to be configured in your repository settings.
3. Compatible with the `build-typescript-project.yml` workflow
4. Secrets `GH_RELEASE_TOKEN` and `NPM_AUTH_TOKEN` should be set in the `production` environment

#### Workflow Secrets

The workflow expects the following secrets to be provided:

| Secret Name        | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `GH_RELEASE_TOKEN` | GitHub token for creating releases                               |
| `APP_PRIVATE_KEY`  | GitHub App private key for creating GitHub token for the release |
| `NPM_AUTH_TOKEN`   | NPM authentication token for publishing packages                 |

#### Inputs

| Input Parameter            | Required | Type    | Default | Description                                               |
| -------------------------- | -------- | ------- | ------- | --------------------------------------------------------- |
| `runAfterInstall`          | No       | String  | `""`    | Commands to run after installing dependencies.            |
| `distFolderNeedForRelease` | No       | Boolean | `false` | Flag that we need `dist` folder to start release process. |
| `nodeVersion`              | No       | String  | `lts/*` | Node version to use                                       |
| `appId`                    | No       | String  | `""`    | GitHub App Id for creating GitHub token for the release   |

#### Usage

```yaml
name: release
on:
  push:
    branches:
      - main
      - test
jobs:
  release-workflow:
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/release-typescript-project.yml@v1
    with:
      appId: ${{ vars.APP_ID }}
    secrets:
      APP_PRIVATE_KEY: ${{ secrets.APP_PRIVATE_KEY }}
      NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
```

In this example, the workflow is triggered on a push event to the `main` or `test` branches. The secrets are
automatically picked up from the `production` environment.

Make sure you've configured the `production` environment and the required secrets: `GH_RELEASE_TOKEN`
and `NPM_AUTH_TOKEN` (if you want to release to NPM) in your repository settings.

### 6. Release Server SDK

#### Description

This workflow handles the release process for server projects across multiple programming languages like Java, DotNET,
Python, Golang, and PHP. It sets up the required environment, prepares the project, and executes a semantic release to
determine the next version number and generate release notes based on commit messages.

#### Prerequisites:

1. The project is written in one of the supported languages: Java, DotNET, Python, Golang, or PHP.
2. The workflow requires the `production` environment to be configured in your repository settings.

#### Workflow Inputs

The workflow accepts the following input parameters:

| Input Parameter                  | Required | Type   | Default | Description                                                                                                    |
| -------------------------------- | -------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| `language`                       | Yes      | String | -       | Programming language for the project. Supported are `java`, `dotnet`, `python`, `golang`, `flutter` and `php`. |
| `language-version`               | Yes      | String | -       | Version of the programming language to set up.                                                                 |
| `prepare-command`                | No       | String | -       | Command(s) to run for project preparation, such as installing dependencies.                                    |
| `java-version`                   | No       | String | `11`    | Version of Java to set up.                                                                                     |
| `semantic-release-extra-plugins` | No       | String | -       | Additional plugins to install for the semantic-release action.                                                 |
| `appId`                          | No       | String | -       | GitHub App Id for creating GitHub token for the release                                                        |

#### Workflow Secrets

The workflow expects the following secrets to be provided:

| Secret Name        | Description                                                      | Required For    |
| ------------------ | ---------------------------------------------------------------- | --------------- |
| `APP_PRIVATE_KEY`  | GitHub App private key for creating GitHub token for the release | All projects    |
| `GH_RELEASE_TOKEN` | GitHub token used for making releases and other operations.      | All projects    |
| `PYPI_TOKEN`       | PyPI token used for publishing Python packages.                  | Python projects |
| `NUGET_API_KEY`    | NuGet API key for publishing .NET packages.                      | DotNET projects |

#### Example of usage:

Below is an example showcasing the workflow setup for releasing a Python SDK:

```yaml
name: 'Release Python SDK'
on:
  push:
    branches:
      - main
      - test

jobs:
  release-server-sdk-python:
    name: 'Publish new version'
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/release-server-sdk.yml@v1
    with:
      appId: ${{ vars.APP_ID }}
      language: python
      language-version: '3.9'
      prepare-command: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install wheel
        pip install twine
    secrets:
      APP_PRIVATE_KEY: ${{ secrets.APP_PRIVATE_KEY }}
      PYPI_TOKEN: ${{ secrets.PYPI_TOKEN }}
```

**Note**: Ensure you've configured the appropriate environment and secrets based on the programming language of your project. For a Python project, for instance, the `PYPI_TOKEN` must be available.

### 7. Report Workflow Status

This reusable workflow sends notifications reporting the status of a GitHub Actions workflow. Currently, it sends these
notifications to Slack using the `ravsamhq/notify-slack-action`. The workflow requires the status of a job and a
notification title to be provided as inputs.

#### Prerequisites:

1. A configured Slack webhook URL. You'll set this up in your Slack workspace and then save it as a secret in your
   GitHub repository.

#### Workflow Inputs

The workflow accepts the following input parameters:

| Input Parameter      | Required | Type   | Description                                                             |
| -------------------- | -------- | ------ | ----------------------------------------------------------------------- |
| `job_status`         | Yes      | String | The status of the job. Valid values: 'success', 'failure', 'cancelled'. |
| `notification_title` | Yes      | String | The title of the notification message to be sent to Slack.              |

#### Workflow Secrets

The workflow expects the following secrets to be provided:

| Secret Name         | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | Slack webhook URL. This secret is used to send notifications to Slack. |

#### Example of usage:

```yaml
name: Your Workflow Name
on:
  push:

jobs:
  test-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        # ... other steps ...

  report-status:
    needs: test-job
    if: always()
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/report-workflow-status.yml@v1
    with:
      notification_title: 'Notification: your job run with {status_message} result'
      job_status: ${{ needs.test-job.result }}
    secrets:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

Make sure you've set up the required `SLACK_WEBHOOK_URL` secret in your repository's settings. Adjust the values in the
example as needed for your use case.

### 8. Create PR to Main on Release

This reusable workflow creates a Pull Request (PR) to the `main` branch in case of the prerelease or from `main` branch
to another specified branch.

#### Prerequisites:

1. The project must use git tags to denote releases.
2. A GitHub Token must be configured for repository access.

#### Inputs

| Input Parameter | Required | Type    | Default | Description                            |
| --------------- | -------- | ------- | ------- | -------------------------------------- |
| `target_branch` | Yes      | String  | -       | The branch for which the PR is created |
| `tag_name`      | No       | String  | -       | The name of the release tag            |
| `prerelease`    | No       | Boolean | `false` | Whether the release is a pre-release   |

#### Examples of usage:

```yaml
name: Create PR

on:
  release:
    types:
      - published

jobs:
  create-pr:
    name: Create PR
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/create-pr.yml@v1
    with:
      target_branch: ${{ github.event.release.prerelease && 'main' || 'rc' }}
      tag_name: ${{ github.event.release.tag_name }}
      prerelease: ${{ github.event.release.prerelease }}
```

### 9. Create Prerelease Branch and Force Push

This reusable workflow creates a new branch from the `main` branch and performs a force push to overwrite it. It's
designed to reset a branch to a specific state before a release. The workflow uses a GitHub App token for
authentication, ensuring actions are performed securely and can be traced back to the app.

#### Prerequisites:

1. A GitHub App installed in your repository with permissions to push to branches.
2. The App's private key and App ID stored as secrets/vars in your GitHub repository.

#### Workflow Inputs

The workflow accepts the following input parameters:

| Input Parameter | Required | Type   | Description                                      |
| --------------- | -------- | ------ | ------------------------------------------------ |
| `branch_name`   | Yes      | String | The name of the branch to create and force push. |
| `appId`         | Yes      | String | The GitHub App ID used for the release process.  |

#### Workflow Secrets

The workflow expects the following secret to be provided:

| Secret Name       | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `APP_PRIVATE_KEY` | The GitHub App's private key, used to request a GitHub token. |

#### Example of Usage:

```yaml
name: Reset Prerelease Branch
on:
  workflow_dispatch:

jobs:
  reset-feature-branch:
    uses: fingerprintjs/dx-team-toolkit/.github/workflows/reset-prerelease-branch.yml@v1
    with:
      branch_name: 'test'
      appId: ${{ vars.APP_ID }}
    secrets:
      APP_PRIVATE_KEY: ${{ secrets.APP_PRIVATE_KEY }}
```

Ensure you've set up the required `APP_PRIVATE_KEY` secret in your repository's settings. Adjust the values in the example as needed for your use case.
