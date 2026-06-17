---
"@fingerprintjs/eslint-config-dx-team": major
---

Migrate to ESLint v10 flat config

This is a breaking change. ESLint v10 dropped support for the legacy `.eslintrc` format entirely.

**Migration steps:**

1. Replace `.eslintrc.js` (or `.eslintrc.json`) with a flat config file.

   **`eslint.config.js`** (CommonJS):
   ```js
   const dxTeamConfig = require('@fingerprintjs/eslint-config-dx-team')
   module.exports = [...dxTeamConfig]
   ```

   **`eslint.config.mjs`** (ESM):
   ```js
   import dxTeamConfig from '@fingerprintjs/eslint-config-dx-team'
   export default [...dxTeamConfig]
   ```

2. Fix new lint errors from the updated `@typescript-eslint/strict` preset (upgraded from v6 to v8):
   - `@typescript-eslint/no-empty-object-type` - bans `{}` and `Object` as types
   - `@typescript-eslint/no-require-imports` - bans `require()` calls
   - `@typescript-eslint/no-unsafe-function-type` - bans `Function` as a type
   - `@typescript-eslint/no-unused-expressions` - bans unused expressions
   - `@typescript-eslint/no-wrapper-object-types` - bans `String`, `Number`, `Boolean` wrapper types
   - `@typescript-eslint/prefer-namespace-keyword` - requires `namespace` over `module` keyword
   - `@typescript-eslint/ban-ts-comment` - now requires a minimum description of 10 characters
