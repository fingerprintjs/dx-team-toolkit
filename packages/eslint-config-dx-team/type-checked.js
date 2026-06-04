/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config')
const tseslint = require('typescript-eslint')
const base = require('./index.js')

module.exports = defineConfig([
  ...base,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
])
