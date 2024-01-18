# Tsconfig dx-team preset

This package provides a custom preset
for [typescript](https://www.typescriptlang.org/), specifically designed
for the DX team at FingerprintJS.

## Installation

To install this package, use the following command:

```bash
pnpm install @fingerprintjs/tsconfig-dx-team
```

## Configuration

To use this preset in your project, add the following configuration to your project's tsconfig.json configuration file:

```json
{
  "extends": "@fingerprintjs/tsconfig-dx-team/tsconfig.json",
  "compilerOptions": {
    // Specify other configuration
    "outDir": "dist/src",
    "module": "es6",
    "moduleResolution": "node",
    "target": "es2020",
    // Don't forget to specify jsx for react projects - https://www.typescriptlang.org/docs/handbook/jsx.html
    "jsx": "react-jsx"
  },
  "files": [
    "./src/index.ts"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts"
  ]
}


```

## License

This project is licensed under the MIT license. See
the [LICENSE](https://github.com/fingerprintjs/dx-team-toolkit/blob/main/LICENSE) file for more info.
