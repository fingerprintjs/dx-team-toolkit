module.exports = {
  extends: ['./index.js', 'plugin:@typescript-eslint/strict-type-checked', 'prettier'],
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
}
