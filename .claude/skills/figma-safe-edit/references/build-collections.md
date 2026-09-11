# Building collections from tokens

`tokens-to-figma.mjs` reads `tokens/*.json`, resolves the alias chains, and writes
four idempotent snippets to `migration/`. They turn this repo into Figma
variables + text styles. Run them **in order** — each depends on the previous.

| # | file | makes | depends on |
|---|---|---|---|
| 1 | `build-01-primitives.js` | **Primitives** collection: 255 `color/*` (COLOR), 24 `radius/*` + `space/*` (FLOAT). All `hiddenFromPublishing`. | — |
| 2 | `build-02-semantic.js` | **Semantic** collection, `Light` mode: `color/*` + `radius/*` semantic vars, each an alias into Primitives. Plus one raw: `color/background/overlay`. | 1 |
| 3 | `build-03-component.js` | **Component** collection: `color/<c>/*` + `radius/<c>` vars, each an alias into Semantic. Plus one raw: `color/button/ghost/background/default` (transparent). | 2 |
| 4 | `build-04-text-styles-{1..5}.js` | 21 `text/*` Figma text styles (Plus Jakarta Sans), **5 per file** (last file gets the remainder). Not variables. | fonts installed |

Run (exact order from `migration/build-manifest.json` → `runOrder` — the number
of text-style files grows as the type scale does; always run every
`build-04-text-styles-N.js` the manifest lists, not just 1–4):

```
node .claude/skills/figma-safe-edit/scripts/tokens-to-figma.mjs
node scripts/figma/fig.mjs migration/build-01-primitives.js
node scripts/figma/fig.mjs migration/build-02-semantic.js
node scripts/figma/fig.mjs migration/build-03-component.js
node scripts/figma/fig.mjs migration/build-04-text-styles-1.js
node scripts/figma/fig.mjs migration/build-04-text-styles-2.js
node scripts/figma/fig.mjs migration/build-04-text-styles-3.js
node scripts/figma/fig.mjs migration/build-04-text-styles-4.js
node scripts/figma/fig.mjs migration/build-04-text-styles-5.js
```

**Why text styles are sliced:** `createTextStyle()` is cheap alone (~10ms) but
~15+ in a single exec call hangs the plugin — figmosha2 can't resume a timed-out
exec, and a killed client leaves the plugin still grinding, which duplicates
styles. 5 per call is safe. `createVariable` does NOT have this problem —
build-01 does 279 in one call fine.

## Reading the return values

Each snippet returns a small object — check it after every run:

- `build-01` → `{collection, created, updated, expected}`. `created + updated`
  should equal `expected` (279). A short count means a `createVariable` threw.
- `build-02` / `03` → `{created, updated, aliased, skipped, missing, drift}`.
  **`missing` must be empty** — a non-empty `missing` means a primitive/semantic
  the alias points at doesn't exist yet (ran out of order, or build-01 was
  incomplete). **A non-empty `drift` is not a failure** — it lists variables
  Figma and code already disagree on (left untouched, not overwritten); read
  each entry (`figmaCurrentlyPointsTo` vs. `codeExpects`) and decide by hand
  whether to update the token file to match Figma, or fix Figma to match code.
  Never re-run expecting `drift` to resolve itself — it won't, on purpose.
- `build-04` → `{created, updated, skipped, names, missingFonts, missingVars}`.
  **`missingFonts` and `missingVars` must both be empty.** A non-empty
  `missingFonts` means "Plus Jakarta Sans" (weights 500/600/700/800) needs
  adding to the Figma file — Menu → Assets, or install it — then re-run.
  **Drift-safe like build-02/03, not like build-01**: a style already matching
  code (font/size/line-height/letter-spacing/case/description/bindings, with a
  small float tolerance for Figma's own PERCENT rounding) is left **completely
  untouched** and counted in `skipped` — no `loadFontAsync` call, no property
  writes at all. This isn't just an optimization: repeatedly redefining an
  already-correct style for a **variable font** (one resolved via a weight
  axis, like this file's Plus Jakarta Sans, rather than a static per-weight
  file) has been observed to destabilize that weight's render cache in the
  live file — glyphs render corrupted (missing/warped, e.g. hyphens vanishing)
  on any transparent-fill layer using it, and neither reopening the file nor a
  version-history revert clears it (only a full Figma Desktop restart did).
  `skipped` should equal the file's style count on any run where nothing
  actually changed — if it doesn't, something re-touched a style that didn't
  need it.

## Idempotency — how re-running is safe

Every snippet looks a variable/style up **by name** first: not found → create;
found → depends which build. `build-01` always updates the found variable to
match code (primitives are meant to be 100% code-driven, never hand-tuned in
Figma) — it has no `skipped`/`drift` concept, every existing primitive gets
rewritten every run (harmless for a plain color/float value, no font-cache
risk). `build-02`/`03` are more careful, because these ARE sometimes
hand-tuned in Figma ahead of a code change (a shade re-tune, a rename): found
+ already matches what code expects → no-op; found + Figma has something
**else** → left alone entirely and reported in `drift`, never silently
overwritten. `build-04` (text styles) is drift-safe the same way build-02/03
are, for a different reason — see the font-cache-corruption note above: found
+ already matches (within float tolerance) → no-op, counted in `skipped`;
otherwise the full apply runs and it's counted `updated`. Only a variable or
style that's brand-new to Figma, or one that's genuinely different from what
code expects, gets written. So re-running after a partial failure
finishes the job; running twice with nothing changed changes nothing; running
after Figma has drifted ahead of code reports that drift instead of erasing
it. Names are the identity — don't rename a generated variable by hand and
then re-run, or you'll get a duplicate.

## Gotchas

- `figma.variables.createVariable(name, collection, type)` — pass the collection
  **object**. If the installed API wants the id, change `coll` → `coll.id` in the
  generated files (or in `tokens-to-figma.mjs` and regenerate).
- FLOAT values are **px numbers** — `tokens-to-figma.mjs` converts `rem`→px
  (×16). `radius/2xl` = `16`, `space/16` = `16`, `radius/full` = `9999`.
- The `Light` mode: build-02/03 rename the collection's first mode to `Light` if
  there isn't one. Adding `Dark` later is a separate step (new mode + a second
  alias pass from `tokens/semantic.color.dark.json`).
- These snippets **only create/update** — they never delete. Removing the old
  messy collections is a `figma-safe-edit` Mode B `delete`/`merge` batch, after
  the screens are repointed onto these new variables.
- Text styles: `textCase = 'UPPER'` is set for `text/overline` so you don't hand-
  apply uppercase.

## After building

The new collections sit **alongside** whatever was there. Next: run `figma-audit`
again (it now sees both old and new), triage the `duplicate` / `component-binding`
findings, and let Mode B repoint screens from the old variables to these, then
delete the old ones.
