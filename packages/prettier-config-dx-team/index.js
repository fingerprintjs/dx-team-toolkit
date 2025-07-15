module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  svelteSortOrder: 'options-scripts-markup-styles',
  proseWrap: 'never',
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
      },
    },
  ],
}
