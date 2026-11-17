# Standards

Rules for code in this repository. They apply to people and coding agents alike.

## Scripts are TypeScript

Write every script in TypeScript (`.ts`), including the scripts that GitHub Actions in `.github/actions/` run. Don't add new `.js` or `.mjs` scripts.

- Run scripts with Node.js directly (`node main.ts`), using its built-in type stripping. Set up Node.js 24 or later in the action.
- Use only type syntax that Node.js can strip: no `enum`, `namespace` or parameter properties. Set `erasableSyntaxOnly` in the action's `tsconfig.json` so `tsc` catches them.
- Import local files with the `.ts` extension (`import { x } from './x.ts'`).
- Type-check the script in CI with `tsc`.

See [`changeset-determine-step`](.github/actions/changeset-determine-step) and [`seed-identification-events`](.github/actions/seed-identification-events) for examples.

Config files that tools load by a fixed name (such as `eslint.config.mjs` or `commitlint.config.cjs`) and the published packages in `packages/` are exempt.
