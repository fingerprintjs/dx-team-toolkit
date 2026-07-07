# ESLint dx-team preset

This package provides a custom preset for [eslint](https://github.com/eslint/eslint), specifically designed for the DX team at FingerprintJS.

## Requirements

- ESLint v10
- `typescript-eslint` v8
- Prettier v3

## Installation

`eslint`, `typescript-eslint`, and `prettier` are peer dependencies, so install them alongside the config:

```bash
pnpm install -D @fingerprintjs/eslint-config-dx-team eslint typescript-eslint prettier
```

## Configuration

Create an `eslint.config.js` in your project root:

```js
const dxTeamConfig = require('@fingerprintjs/eslint-config-dx-team')

module.exports = [
  ...dxTeamConfig,
  // project-specific overrides
]
```

Or with ESM (`eslint.config.mjs`):

```js
import dxTeamConfig from '@fingerprintjs/eslint-config-dx-team'

export default [
  ...dxTeamConfig,
  // project-specific overrides
]
```

### Type-checked config

For projects with a `tsconfig.json`, opt into stricter type-aware rules (e.g. `strict-boolean-expressions`, `switch-exhaustiveness-check`):

```js
const dxTeamConfig = require('@fingerprintjs/eslint-config-dx-team/type-checked')

module.exports = [
  ...dxTeamConfig,
  // If your tsconfig is not in the project root, override the path:
  {
    languageOptions: {
      parserOptions: {
        project: './path/to/tsconfig.json',
      },
    },
  },
]
```

Or with ESM (`eslint.config.mjs`):

```js
import dxTeamConfig from '@fingerprintjs/eslint-config-dx-team/type-checked'

export default [
  ...dxTeamConfig,
  // If your tsconfig is not in the project root, override the path:
  {
    languageOptions: {
      parserOptions: {
        project: './path/to/tsconfig.json',
      },
    },
  },
]
```

## Dependencies

`eslint` and `typescript-eslint` are declared as **peer dependencies**. Your project imports both directly (ESLint provides the CLI/bin you run, and your `eslint.config` typically imports `typescript-eslint`), and both need to resolve to a single instance to avoid "multiple ESLint instances" errors — so you must install them in your project:

- `eslint`
- `typescript-eslint`

Everything else is bundled by this package — **don't** add these to your project:

- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `globals`

> **Note:** Under strict package managers such as pnpm v10+, transitive dependencies are no longer hoisted to the project root, which is why `eslint` and `typescript-eslint` must be declared as peers rather than bundled.

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
