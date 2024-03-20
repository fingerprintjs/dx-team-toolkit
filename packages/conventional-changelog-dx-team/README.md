# Conventional changelog dx-team preset

This package provides a custom preset
for [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog), specifically designed
for the DX team at FingerprintJS. It is configured for use
with [semantic-release](https://github.com/semantic-release/semantic-release) and includes customizable release rules
and categories for changes.

## Installation

To install this package, use the following command:

```bash
pnpm install -D @fingerprintjs/conventional-changelog-dx-team
```

## Configuration

To use this preset in your project, add the following configuration to your project's semantic-release file:

```js
module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        'config': '@fingerprintjs/conventional-changelog-dx-team',
        'releaseRules': '@fingerprintjs/conventional-changelog-dx-team/release-rules'
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        'config': '@fingerprintjs/conventional-changelog-dx-team',
      }
    ],
  ]
};
```

## Commit Examples

### Will trigger a release

#### Bugfix (patch)

`fix: Fixed logic bug`

#### New feature (minor)

`feat: Added new feature`

#### Breaking change (major)

```
feat: upgrade runtime to Node 20 

BREAKING CHANGE: use node 20
```

### Will not trigger a release

- `docs: Updated documentation`
- `perf: Performance improvements`
- `build: add test pipeline`
- `test: improve test coverage`
- `chore: updated dependencies`
- `refactor: refactored code for readability`

## License

This project is licensed under the MIT license. See
the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
