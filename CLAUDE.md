# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A standalone Next.js 14 data formatter and viewer. Users paste JSON or CSV and get pretty-printing, a sortable/filterable table view, and quick actions (copy, download). No backend. No auth.

**Stack:** Next.js 14 (app router), TypeScript strict mode, Tailwind CSS, shadcn/ui (button, badge, input, tabs only), next-themes, highlight.js, Vitest + React Testing Library.

## Bootstrapping (run once if project not yet initialized)

```bash
npx create-next-app@latest json-formatter --typescript --tailwind --app --no-src-dir
npm install next-themes highlight.js
npx shadcn@latest init   # neutral base color, CSS variables yes
npx shadcn@latest add button badge input tabs
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react
```

## Commands

```bash
npm run dev          # start dev server
npm run build        # Next.js production build
npm test             # run Vitest once
npm run test:watch   # Vitest in watch mode
npm run test:coverage  # run with v8 coverage report
npm run type-check   # tsc --noEmit
```

Add these scripts to `package.json` (not included by default):
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"type-check": "tsc --noEmit"
```

## Architecture

```
app/
  page.tsx          # single page — owns all useState (mode, parsedData, error)
  layout.tsx        # root layout, font + dark mode class
components/
  Toolbar.tsx       # mode tabs, action buttons, stat pill
  InputPanel.tsx    # textarea + sample loaders
  PrettyPanel.tsx   # syntax-highlighted JSON output
  TablePanel.tsx    # filterable, sortable table
  ErrorBanner.tsx   # parse error display
lib/
  parse.ts          # detectFormat, parseJSON, parseCSV, coerce — pure functions, no React
  format.ts         # prettyPrint, toCSV — pure functions, no React
  types.ts          # ParsedData, ColumnType, shared types
tests/
  lib/parse.test.ts
  lib/format.test.ts
  components/TablePanel.test.tsx
  components/ErrorBanner.test.tsx
  setup.ts          # imports @testing-library/jest-dom
```

State flows down from `app/page.tsx`. `lib/` is decoupled from all UI — test it first.

## Vitest config

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**', 'components/**'],
      thresholds: { lines: 80, functions: 80 },
    },
  },
})
```

## Parsing rules (`lib/parse.ts`)

- Auto-detect: strings starting with `{` or `[` → JSON, else CSV
- JSON: `JSON.parse` wrapped in try/catch; surface error message
- CSV: handle quoted fields with commas, trim whitespace, skip blank lines; pad short rows with `null`
- Type coercion for CSV: `""` / `"null"` / `"NULL"` → `null`; `"true"`/`"false"` (any case) → boolean; numeric strings → number
- JSON object (not array) → treat as single-row table
- JSON array of primitives → disable table tab

## Code constraints

- No `any` types
- Components cap at ~120 lines — split if larger
- `lib/` files have no React imports
- No `console.log` in final code
- No backend, API routes, server actions, file upload, persistence, schema validation, Excel support, or URL sharing

## CI (`.github/workflows/ci.yml`)

Runs `type-check → test → build` on every push to `main` and all PRs. Keep it green.
