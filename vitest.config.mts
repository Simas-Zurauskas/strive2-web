import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Vitest for `client/`.
 *
 * `.mts`, not `.ts`, on purpose: this package has no `"type": "module"`, so
 * Vite's native config loader reads a `.ts` config as CommonJS and warns that
 * the ESM `import`/`export` in it is unsupported — a warning it says will
 * become the default failure mode in a future major. The explicit ESM
 * extension is the documented fix and keeps the run output clean.
 *
 * This repo had no test runner at all before this config — `yarn test` printed
 * `Command "test" not found`. It is deliberately minimal, and deliberately
 * `node` rather than `jsdom`: nothing here renders React. The logic under test
 * is pure (a reducer, a sort, a storage wrapper), and the storage wrapper takes
 * an injected `Storage` precisely so that stays true. Adding `jsdom` and
 * `@testing-library/react` would be the way to assert rendered output, and is a
 * known gap rather than an oversight — see R1 in
 * `wiki-strive/tasks/002-in-app-announcements-panel/PLAN.md`.
 */
// `client/tsconfig.json` declares exactly one alias, `@/*` -> `./src/*`.
// Vitest does not read tsconfig paths, so it is mirrored here; without it every
// `@/…` import in a test resolves as a bare package name and fails to load.
const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src');

export default defineConfig({
  resolve: {
    alias: { '@': srcDir },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    reporters: ['default'],
  },
});
