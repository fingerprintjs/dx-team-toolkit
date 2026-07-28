/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.+test.tsx?$',
  collectCoverageFrom: ['./src/**/**.{ts,tsx}'],
  coverageReporters: ['lcov', 'json-summary', ['text', { file: 'coverage.txt', path: './' }]],
  // The GitHub Actions under `.github/actions/**` run as plain TypeScript on Node
  // (type-stripping), so their sources use explicit `.ts` import extensions and
  // `import type`. Strip the extension for Jest's resolver, and transpile in
  // `isolatedModules` mode so TS's `allowImportingTsExtensions` restriction (a
  // type-check-only error) does not fail the run.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: { allowImportingTsExtensions: true, noEmit: false },
      },
    ],
  },
}
