# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Hastati is a VSCode extension (TypeScript) providing two text alignment commands:
- `hastati.alignText` — inserts spaces before each selection so all selections start at the same (rightmost) column
- `hastati.alignCursors` — moves all cursors to the leftmost selection start column (no text modification)

## Commands

```bash
npm run compile    # compile TypeScript once
npm run watch      # compile in watch mode (default dev task)
npm run lint       # ESLint on src/
npm test           # compile + lint + run tests via @vscode/test-electron
```

To publish: `vsce package` or `vsce publish` (requires `vsce` installed globally).

## Architecture

Everything lives in `src/extension.ts`. The `activate` function registers both commands as `context.subscriptions`. There are no external runtime dependencies — only the VSCode API.

- `alignText` uses `editor.edit(editBuilder => ...)` to insert spaces at `sel.start`
- `alignCursors` directly reassigns `editor.selections` without an edit

Tests are in `src/test/extension.test.ts` (Mocha, run inside the VSCode Extension Host via `@vscode/test-electron`). The compiled output goes to `out/`.
