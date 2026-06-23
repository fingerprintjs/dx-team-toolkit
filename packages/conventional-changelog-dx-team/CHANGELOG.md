# @fingerprintjs/conventional-changelog-dx-team

## 0.2.0

### Minor Changes

- Convert to ESM and upgrade `conventional-changelog-conventionalcommits` dependency from `^7.0.2` to `^9.0.0`.

  `conventional-changelog-conventionalcommits` v8+ is ESM-only with an async `createPreset` API. The package now uses `import` instead of `require` and exports a default function (instead of exporting the preset config object directly) to match the async preset interface expected by semantic-release v24+.

  This preset now requires Node.js >=20.

  The changelog sections and commit-type-to-semver mappings are unchanged. ([80f5663](https://github.com/fingerprintjs/dx-team-toolkit/commit/80f5663e8c56a5c6f968adb69a4a5a8969d8ddda))

## 0.1.0

### Minor Changes

- [#31](https://github.com/fingerprintjs/dx-team-toolkit/pull/31) [`9b130e9`](https://github.com/fingerprintjs/dx-team-toolkit/commit/9b130e98ea6f1ce4b443718ca987e53382d5080d) Thanks [@ilfa](https://github.com/ilfa)! - Init package
