# @fingerprintjs/eslint-config-dx-team

## 3.0.0

### Major Changes

- Move `eslint` and `typescript-eslint` to peer dependencies

  Under strict package managers (pnpm v10+), transitive dependencies are no longer exposed at the project root, which broke `eslint` bin resolution and `import ... from 'typescript-eslint'` in consuming projects. Declaring them as peers guarantees a single, project-controlled instance of each and avoids "multiple ESLint instances" errors.

  **Breaking change:** consumers must now install `eslint` and `typescript-eslint` themselves (plus `typescript`, which `typescript-eslint` requires as a peer):

  ```bash
  pnpm install -D eslint typescript-eslint typescript
  ```

  The redundant `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` direct dependencies were also removed (they are provided by the `typescript-eslint` umbrella package). `eslint-config-prettier`, `eslint-plugin-prettier`, and `globals` remain bundled. ([3832930](https://github.com/fingerprintjs/dx-team-toolkit/commit/38329309267ff0e53e35583410aaaf311cc4ad59))

## 2.0.0

### Major Changes

- Migrate to ESLint v10 flat config

  This is a breaking change. ESLint v10 dropped support for the legacy `.eslintrc` format entirely.

  **Migration steps:**

  1. Replace `.eslintrc.js` (or `.eslintrc.json`) with a flat config file.

     **`eslint.config.js`** (CommonJS):

     ```js
     const dxTeamConfig = require("@fingerprintjs/eslint-config-dx-team");
     module.exports = [...dxTeamConfig];
     ```

     **`eslint.config.mjs`** (ESM):

     ```js
     import dxTeamConfig from "@fingerprintjs/eslint-config-dx-team";
     export default [...dxTeamConfig];
     ```

  2. Fix new lint errors from the updated `@typescript-eslint/strict` preset (upgraded from v6 to v8):
     - `@typescript-eslint/no-empty-object-type` - bans `{}` and `Object` as types
     - `@typescript-eslint/no-require-imports` - bans `require()` calls
     - `@typescript-eslint/no-unsafe-function-type` - bans `Function` as a type
     - `@typescript-eslint/no-unused-expressions` - bans unused expressions
     - `@typescript-eslint/no-wrapper-object-types` - bans `String`, `Number`, `Boolean` wrapper types
     - `@typescript-eslint/prefer-namespace-keyword` - requires `namespace` over `module` keyword
     - `@typescript-eslint/ban-ts-comment` - now requires a minimum description of 10 characters ([cfba9d4](https://github.com/fingerprintjs/dx-team-toolkit/commit/cfba9d436a5ed7059cc5c3d14dab8d17b181347c))

## 1.0.0

### Major Changes

- Add a type-checked ESLint config and enable stricter default lint rules. ([1ccb466](https://github.com/fingerprintjs/dx-team-toolkit/commit/1ccb466ce2b744cac595070759e6e2ae659fd7cc))

## 0.2.0

### Minor Changes

- Feat: Add `@typescript-eslint/consistent-type-assertions` eslint rule to discourage type casting ([2e299c9](https://github.com/fingerprintjs/dx-team-toolkit/commit/2e299c9e04c36fab6e3e53a6da330b3df9e891de))

## 0.1.0

### Minor Changes

- [#42](https://github.com/fingerprintjs/dx-team-toolkit/pull/42) [`4463c71`](https://github.com/fingerprintjs/dx-team-toolkit/commit/4463c71ee1594383bf08265354b756fef52261dd) Thanks [@ilfa](https://github.com/ilfa)!
  - update usage example in the readme
  - add eslint and and eslint packages as a dependencies

## 0.0.2

### Patch Changes

- [#33](https://github.com/fingerprintjs/dx-team-toolkit/pull/33) [`648fc68`](https://github.com/fingerprintjs/dx-team-toolkit/commit/648fc680c0aaafca941ee6b28334d22c1f017cab) Thanks [@TheUnderScorer](https://github.com/TheUnderScorer)! - Init package
