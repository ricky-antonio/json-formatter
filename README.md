# Unfold

A fast, client-side tool for formatting and exploring JSON and CSV data. Paste or upload a file and get instant pretty-printing, a sortable/filterable table, and an interactive tree explorer.

**Live:** [json-formatter.rickycodes.dev](https://json-formatter.rickycodes.dev)

## Features

- **Pretty print** — syntax-highlighted JSON output
- **Table view** — sortable columns, full-text filter, typed cell colors
- **Tree view** — expand/collapse nodes individually or all at once
- **File upload** — drag or select `.json` / `.csv` files
- **Copy & download** — one-click export of formatted output
- **Light / dark mode** — follows system preference, toggle to override
- No backend, no auth, no data leaves your browser

## Stack

- Next.js 14 (App Router), TypeScript strict mode
- Tailwind CSS, shadcn/ui, next-themes
- highlight.js for syntax highlighting
- Vitest + React Testing Library (57 tests)

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run tests once
npm run test:watch # watch mode
npm run type-check # tsc --noEmit
npm run build      # production build
```
