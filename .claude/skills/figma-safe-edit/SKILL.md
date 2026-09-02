---
name: figma-safe-edit
description: >-
  Applies design-system changes to the Figma file through the figmosha2 bridge —
  the WRITE counterpart to figma-audit. Two modes: (1) build clean
  Primitives/Semantic/Component variable collections + text styles straight from
  this repo's tokens/*.json, and (2) apply the approved findings in
  audit/findings.json (rename / rebind / create-and-bind / merge / delete).
  figmosha2 has NO UNDO, so this skill works only on a duplicated file or a Figma
  branch, saves a named version before every batch, makes every operation
  idempotent, and journals everything. Use it AFTER figma-audit, once findings
  are triaged, or when the user wants the token collections generated in Figma.
  Trigger words: apply findings, fix Figma, rename variables in Figma, rebind,
  migrate, build collections from tokens, generate Figma variables, push tokens
  to Figma, execute the migration plan.
---

# Figma Safe Edit

Turns a plan into changes in the Figma file. Everything here mutates a live file
that **cannot be undone through figmosha2** — the safety scaffolding below is not
optional.

## Hard preconditions — check every one, every run

1. **Not the real file.** The target open in Figma Desktop is a **duplicate** or a
   **Figma branch**, never the canonical file. Ask the user to confirm which, by
   name. If they can't confirm, stop.
2. **Bridge up + smoke test** — `node scripts/figma/fig.mjs scripts/figma/ping.js`
   returns the expected file. Confirm the file name matches the duplicate/branch.
3. **A clean starting version** — run the checkpoint snippet
   (`h`-free: `return await figma.saveVersionHistoryAsync("safe-edit: baseline")`)
   so there's a labelled point to roll back to in Figma's version history.
4. **`migration/` exists** (gitignored bar `migration/journal.jsonl` +
   `migration/plan.md`).

If any fails, do not send a single write.

## Two modes

### Mode A — build collections from `tokens/*.json`

The repo tokens are the source of truth; this generates their Figma
counterparts. Use when the file has no clean collections yet, or to (re)create
them alongside the messy ones before repointing.

```
node .claude/skills/figma-safe-edit/scripts/tokens-to-figma.mjs
```

Emits idempotent snippet files into `migration/`:

| file | creates |
|---|---|
| `build-01-primitives.js` | **Primitives** collection · every `color/*`, `radius/*`, `space/*`, `font/*` primitive |
| `build-02-semantic.js` | **Semantic** collection (`Light` mode) · `color/*` + `radius/*` semantic vars, each an alias |
| `build-03-component.js` | **Component** collection · `color/<c>/*` + `radius/<c>` vars, each an alias |
| `build-04-text-styles.js` | the 19 `text/*` Figma text styles |

Run them **in order**, one per `fig.mjs` call, verifying after each
([references/build-collections.md](references/build-collections.md) explains what
each does and how it stays idempotent — re-running updates, never duplicates).

### Mode B — apply `audit/findings.json`

```
node .claude/skills/figma-safe-edit/scripts/plan.mjs
```

Reads findings with `status: "approved"`, orders them into dependency-safe
batches, writes `migration/plan.md` (human) + `migration/batches.json` (machine).
Batch order is fixed because dependencies only flow one way:

1. `collection-structure` — create/rename collections, add the `Light` mode
2. primitive `variable-naming` / creation
3. semantic `variable-naming`, `variable-raw-value` (raw → alias)
4. component `variable-naming`, bindings
5. `component-binding` — repoint nodes off primitives onto semantic tokens
6. `raw-color` / `create-and-bind` — bind loose node fills
7. `component-naming`, `variant-naming`
8. `style-not-variable`
9. `merge`, then `delete` / `unused-primitive` — **last**, nothing references them by now

## The batch loop

For each batch in order:

1. **Checkpoint** — `return await figma.saveVersionHistoryAsync("safe-edit: before <batch>")`.
2. **Apply** — one `fig.mjs` call per batch of operations. Each operation follows
   the recipe in [references/operations.md](references/operations.md) and is
   **idempotent**: read current state, skip if already done, else change, then
   read back and include the before/after in the return value.
   **Batch size:** ≤20 for variable renames/rebinds/creates. **≤5 for
   `createTextStyle` and node-tree-walking ops** — heavy operations hang a long
   exec, and figmosha2 can't resume a timeout (a killed client leaves the plugin
   still running, which can double-apply). When in doubt, smaller.
3. **Journal** — append every operation's result to `migration/journal.jsonl`
   (`{ts, batch, findingId, action, targetId, before, after, ok, note}`).
4. **Verify** — the snippet's return value already carries before/after; confirm
   each op's `after` matches `proposed`. Any mismatch → stop the batch, report.
5. **Gate** — batches 5, 9 (node rebinds, deletes) and anything touching >50
   nodes: report the plan to the user and wait for "go" before sending.

Never let a batch run unattended past a failure. A half-applied batch is
recoverable (idempotent re-run); a blindly-continued one may not be.

## After all batches

1. Re-run **figma-audit**. Confirm the applied findings are gone and nothing
   regressed (new findings).
2. For every rename, add a line to `CHANGELOG-renames.md` with the Figma column ✓.
3. Summarise: batches run, ops applied, ops skipped (already-done), failures,
   the version-history labels to roll back to if needed.

## Never

- Run against the canonical file.
- `figma.currentPage.selection`-based edits — always target by id from the plan.
- Delete before every reference is repointed (the plan orders this; don't reorder).
- Bundle unrelated changes into one batch "to save time" — batches are the
  rollback granularity.
- Continue after an unexplained verify mismatch.
