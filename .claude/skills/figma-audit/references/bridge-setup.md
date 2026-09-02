# Talking to Figma via figmosha2

The chain: `fig.mjs → HTTP bridge (127.0.0.1:8787) → figmosha2 plugin (in Figma
Desktop) → Figma Plugin API → back`. The plugin runs whatever JavaScript you send.
**No dry-run, no undo** — but this skill only sends *read* snippets, so that risk
belongs to `figma-safe-edit`, not here.

## Setup (already done — verify, don't redo)

- figmosha2 cloned to **`C:\Users\Dell\IdeaProjects\figmosha2`**.
- **`bridge.mjs`** there is a Node port of the upstream `bridge.py` (no Python).
  `npm install` (just `ws`) already run.
- Repo helper: **`scripts/figma/fig.mjs`** + **`scripts/figma/ping.js`**.
- Plugin imported in Figma Desktop once from
  `C:\Users\Dell\IdeaProjects\figmosha2\plugin\manifest.json`.

## Every session — bring the bridge up

1. Target file open in **Figma Desktop** (not the browser).
2. Figma: **Plugins → Development → Figmosha Bridge** — leave the window open.
3. A terminal: `node C:\Users\Dell\IdeaProjects\figmosha2\bridge.mjs` — leave running.
4. Verify: `node scripts/figma/fig.mjs scripts/figma/ping.js` → prints the file
   name, pages, collections. If it errors:
   - exit 2 → bridge not running (step 3)
   - exit 3 → plugin not open in Figma (step 2), or file open in the browser not desktop

## Snippet contract

A snippet is the **body of an async function** — the plugin wraps it as
`return (async () => { <snippet> })()`. So it **must end with `return <value>`**.
In scope: `figma`, `print(...)`, and `h` (figmosha helpers — `h.bF`, `h.bN`,
`h.variantsOf`, `h.sel`, …; read-only skills don't need them).

```js
// scripts/figma/ping.js style
await figma.loadAllPagesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
return { file: figma.root.name, collections: cols.map((c) => c.name) };
```

`fig.mjs` prints the returned value as JSON to stdout (or `--out <file>`);
`print(...)` lines go to stderr.

## Guardrails for this skill

- **Read only.** No `.name =`, `.setValueForMode`, `.setBoundVariable`,
  `figma.variables.create*`, `.remove()`, `h.bF/bS/bN`, `h.setText`, `h.frame`.
- One collection / one page / one query per call. Always `--out audit/raw/<name>.json`,
  then read back slices — never hold a full dump in context.
- Prefer `*Async` APIs (`getLocalVariablesAsync`, `getVariableByIdAsync`,
  `getLocalPaintStylesAsync`); sync variants are deprecated.
- `page.findAllWithCriteria({ types: [...] })` beats `findAll` with a predicate.
- `await figma.loadAllPagesAsync()` before touching non-current pages.

## HTTP contract (for reference / debugging)

| | |
|---|---|
| `POST /exec` | `{code, timeout?}` → `{ok, result, value, logs, elapsed_ms}` · 500 `{ok:false, error, hint?, stack}` · 503 no plugin · 504 timeout |
| `GET /status` | `{plugin_connected, pending}` |
| `GET /` | banner |

Requests with an `Origin` header are rejected (browser CSRF guard); `Host` is
pinned to `localhost:8787` / `127.0.0.1:8787`.
