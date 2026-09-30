// Squash merges use the PR title as the subject, so accept the shapes PR titles often have:
// - any subject case ("feat: Add X")
// - a ticket ID in place of the type ("INTER-123: add X")
// https://commitlint.js.org/reference/rules.html
module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+|[A-Z]+-\d+)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w+|[A-Z]+-\d+)(?:\((.*)\))?!: (.*)$/,
    },
  },
  rules: {
    'body-max-line-length': [2, 'always', 200],
    'header-max-length': [2, 'always', 200],
    'footer-max-line-length': [2, 'always', 400],
    'subject-case': [0],
    'type-case': [0],
    'type-enum': [0],
  },
}
