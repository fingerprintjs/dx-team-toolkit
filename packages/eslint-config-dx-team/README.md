# ESLint dx-team preset

This package provides a custom preset for [eslint](https://github.com/eslint/eslint), specifically designed for the DX team at FingerprintJS.

## Requirements

- Prettier v3+

## Installation

To install this package, use the following command:

```bash
pnpm install -D @fingerprintjs/eslint-config-dx-team prettier
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

To simplify dependencies update in project this package has eslint and eslint packages as a dependencies. Please don't add any of them as a dependencies for you project:

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `globals`
- `typescript-eslint`

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
