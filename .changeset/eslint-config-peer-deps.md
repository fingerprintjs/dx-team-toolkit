---
'@fingerprintjs/eslint-config-dx-team': major
---

Move `eslint` and `typescript-eslint` to peer dependencies

Under strict package managers (pnpm v10+), transitive dependencies are no longer exposed at the project root, which broke `eslint` bin resolution and `import ... from 'typescript-eslint'` in consuming projects. Declaring them as peers guarantees a single, project-controlled instance of each and avoids "multiple ESLint instances" errors.

**Breaking change:** consumers must now install `eslint` and `typescript-eslint` themselves (plus `typescript`, which `typescript-eslint` requires as a peer):

```bash
pnpm install -D eslint typescript-eslint typescript
```

The redundant `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` direct dependencies were also removed (they are provided by the `typescript-eslint` umbrella package). `eslint-config-prettier`, `eslint-plugin-prettier`, and `globals` remain bundled.
