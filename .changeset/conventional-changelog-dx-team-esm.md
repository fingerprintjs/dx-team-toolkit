---
"@fingerprintjs/conventional-changelog-dx-team": minor
---

Convert to ESM and upgrade `conventional-changelog-conventionalcommits` dependency from `^7.0.2` to `^9.0.0`.

`conventional-changelog-conventionalcommits` v8+ is ESM-only with an async `createPreset` API. The package now uses `import` instead of `require` and exports a default function (instead of exporting the preset config object directly) to match the async preset interface expected by semantic-release v24+.

This preset now requires Node.js >=20.

The changelog sections and commit-type-to-semver mappings are unchanged.
