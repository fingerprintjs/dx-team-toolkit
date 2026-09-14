# Contributing

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) v9

## Setup

```sh
pnpm install
```

## Development

### Project structure

This is a **pnpm workspace monorepo** with two types of artifacts:

- **npm packages** in `packages/` - shared configs for ESLint, Prettier, TypeScript, commitlint, and changesets
- **GitHub Actions** in `.github/actions/` - custom composite and TypeScript actions
- **Reusable workflows** in `.github/workflows/` - shared CI/CD workflows consumed by other repositories

### Scripts

| Command | Description |
|---|---|
| `pnpm run build` | Build all npm packages |
| `pnpm run build:actions` | Bundle TypeScript GitHub Actions into `dist/` using `@vercel/ncc` |
| `pnpm run test` | Run tests with Jest |
| `pnpm run test:coverage` | Run tests with coverage report |
| `pnpm run lint` | Run ESLint |
| `pnpm run lint:fix` | Run ESLint with autofix |

### Commit conventions

This repository uses [conventional commits](https://www.conventionalcommits.org/) enforced by commitlint via a husky `commit-msg` hook.

### Building GitHub Actions

If you modify a TypeScript GitHub Action under `.github/actions/`, you **must** run `pnpm run build:actions` and commit the resulting `dist/` files. The `check-dist` CI check will fail if the committed dist is out of sync with the source.

## Releasing

This repository contains two types of publishable artifacts, each with its own release process.

### npm packages

npm packages are released automatically via [changesets](https://github.com/changesets/changesets). To release a new version:

1. Create a changeset in your PR by running `pnpm exec changeset`.
2. Merge the PR to `main`.
3. Changesets will open a "Version Packages" PR. Merging that PR publishes the updated packages to npm.

### GitHub Actions and reusable workflows

Actions and reusable workflows are consumed by other repositories via major git tags (e.g. `@v1` or `@v2`). To release a new version:

1. Merge your PR with the action/workflow changes to `main`.
2. Choose the major version to release, then create and push a semver tag from the merge commit. For example, to
   release `v2`:
   ```sh
   git tag v2.0.0
   git push origin v2.0.0
   ```
3. Go to **Actions > Update Main Version** and run the workflow with:
   - **target**: the tag you just pushed (e.g. `v2.0.0`)
   - **major_version**: the matching major version (e.g. `v2`)

   This moves that major tag to point at the new release, so consumers referencing that major version pick up the change.
