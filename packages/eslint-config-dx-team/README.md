# ESLint dx-team preset

This package provides a custom preset for [eslint](https://github.com/eslint/eslint), specifically designed for the DX team at FingerprintJS.

## Installation

To install this package, use the following command:

```bash
pnpm install -D @fingerprintjs/eslint-config-dx-team
```

## Configuration

To use this preset in your project, add the following configuration to your project's eslint configuration file:

```js
module.exports = {
  extends: ['@fingerprintjs/eslint-config-dx-team'],
}
```

## Dependencies

To simplify dependencies update in project this package has eslint and eslint packages as a dependencies. Please don't add any of them as a dependencies for you project:

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
