---
'@fingerprintjs/eslint-config-dx-team': minor
---

Honor the consuming repo's `.gitignore`. ESLint flat config does not read `.gitignore` on its own, so git-ignored paths (build output, dependencies, and anything a CI step excludes) were still linted. The config now applies the repo's root `.gitignore` via `@eslint/compat`'s `includeIgnoreFile`, guarded so repos without a `.gitignore` are unaffected.
