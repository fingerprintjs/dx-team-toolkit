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

### Type-checked config

For projects with a `tsconfig.json`, you should opt into stricter type-aware rules (e.g. `strict-boolean-expressions`, `no-floating-promises`, `no-misused-promises`, `switch-exhaustiveness-check`):

```js
module.exports = {
  extends: ['@fingerprintjs/eslint-config-dx-team/type-checked'],
}
```

This requires `parserOptions.project` to resolve to your `tsconfig.json`. If your tsconfig is not in the project root, override it:

```js
module.exports = {
  extends: ['@fingerprintjs/eslint-config-dx-team/type-checked'],
  parserOptions: {
    project: './path/to/tsconfig.json',
  },
}
```

## Dependencies

To simplify dependencies update in project this package has eslint and eslint packages as a dependencies. Please don't add any of them as a dependencies for you project:

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

> [!NOTE]
> If you run into `command not found` when running `pnpm lint`, this is likely because pnpm 9 [hoisted packages matching `*eslint*` by default](https://github.com/pnpm/pnpm/issues/8378), but [pnpm 10 removed that default](https://github.com/orgs/pnpm/discussions/8945). To restore the behavior, add the following to your `.npmrc`:
> ```
> public-hoist-pattern[]=*eslint*
> public-hoist-pattern[]=*prettier*
> ```
>
> The long-term fix is migrating this package to [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files), where plugins are [`import`ed directly](https://eslint.org/docs/latest/use/configure/plugins) instead of resolved by name from the project root. This eliminates the need for hoisting entirely — in fact, this is [the reason pnpm 10 removed the default](https://github.com/pnpm/pnpm/issues/8378).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
