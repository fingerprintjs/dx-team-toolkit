/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const path = require('node:path')
const { defineConfig, includeIgnoreFile } = require('eslint/config')
const tseslint = require('typescript-eslint')
const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')

// Flat config does not read .gitignore. Honor the consuming repo's root .gitignore so
// git-ignored paths (build output, dependencies) are not linted. Only .gitignore is read,
// not .git/info/exclude. Guarded because a repo may not have a .gitignore at the cwd.
const gitignorePath = path.resolve('.gitignore')
const gitignoreConfig = fs.existsSync(gitignorePath) ? [includeIgnoreFile(gitignorePath)] : []

module.exports = defineConfig([
  { ignores: ['**/build/**', '**/dist/**'] },
  ...gitignoreConfig,
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
      /*
        A variable first argument can replace the base: an absolute URL, `//host`, or a backslash.
        https://url.spec.whatwg.org/#url-parsing
        Where resolving against the base is intended, disable it on that line with a reason.
      */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "NewExpression[callee.name='URL'][arguments.length>=2][arguments.0.type!='Literal'], CallExpression[callee.object.name='URL'][callee.property.name='parse'][arguments.length>=2][arguments.0.type!='Literal']",
          message:
            'new URL(path, base) and URL.parse(path, base) ignore base when path is absolute or starts with // or a backslash. Build from a fixed origin and assign pathname and search, or append the path without parsing it.',
        },
      ],
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
