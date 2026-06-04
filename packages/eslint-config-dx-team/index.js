/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config')
const tseslint = require('typescript-eslint')
const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')

module.exports = defineConfig([
  { ignores: ['**/build/**', '**/dist/**'] },
  ...tseslint.configs.strict,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      semi: ['error', 'never'],
      'linebreak-style': ['error', 'unix'],
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      'array-callback-return': 'error',
      curly: [2, 'all'],
      eqeqeq: ['error', 'always'],
      'no-cond-assign': ['error', 'except-parens'],
      'no-constructor-return': 'error',
      'no-dupe-else-if': 'error',
      'no-fallthrough': 'error',
      'no-promise-executor-return': 'error',
      'no-prototype-builtins': 'error',
      'no-self-assign': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-extra-boolean-cast': 'error',
      'no-unneeded-ternary': 'error',
      'no-implicit-coercion': 'error',
      'no-self-compare': 'error',
      'no-constant-binary-expression': 'error',
      /*
        Type-casting should be avoided if possible,
        or require an explicit eslint-disable-next-line directive with an explanation why it's necessary there
      */
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
    },
  },
  prettierConfig,
])
