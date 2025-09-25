module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/eslint-recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['build/*', 'dist/*'],
  rules: {
    semi: ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'prefer-const': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    curly: [2, 'all'],
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
}
