---
name: figma-audit
description: >-
  Read-only inventory and gap analysis of the Figma file against
  design-system-conventions. Walks variable collections, styles, components and
  colour usage via the figmosha2 bridge, then produces audit/findings.json (the
  machine-readable migration plan) and audit/report.md. Use this skill BEFORE any
  Figma cleanup or token migration, and whenever the user asks what's wrong with
  their Figma variables/components/naming, wants a design-system compliance check,
  a list of raw/off-palette colours, mis-bound components, or duplicate
  variables. This skill NEVER mutates Figma — it only reads. The fixing is done
  separately by figma-safe-edit, which consumes this skill's findings.json.
  Trigger words: audit, inventory, Figma variables, naming check, design system
  compliance, raw colours, unbound, mis-bound, duplicates, migration plan,
  what's wrong with my Figma file.
---

# Figma Audit

Produce a complete, trustworthy picture of the current Figma file and every way
it diverges from `design-system-conventions`. Output is a plan, not a change.

**This skill is read-only.** No `set`, no rename, no rebind, no delete. If a fix
is obvious, record it as a proposed action in `findings.json` — do not apply it.
Applying is `figma-safe-edit`'s job, gated on user approval.

## Before you start

1. **Bring the bridge up** — see [references/bridge-setup.md](references/bridge-setup.md)
   ("Every session"): target file open in Figma Desktop, Figmosha Bridge plugin
   running, `node C:\Users\Dell\IdeaProjects\figmosha2\bridge.mjs` running.
2. **Smoke test:** `node scripts/figma/fig.mjs scripts/figma/ping.js` — must
   print the file name, pages, and collections before you go further.
3. **Load `design-system-conventions`** — it is the yardstick. Every finding is
   "current Figma state" vs "what that skill says it should be."
4. Create `audit/` with subdir `audit/raw/`. `audit/raw/` is gitignored (large
   dumps); `audit/findings.json` and `audit/report.md` are committed.

## Token budget — read this

Figma node trees are enormous. A careless audit burns the whole context window on
JSON you'll never look at directly. Rules:

- **Every extraction writes to a file in `audit/raw/`.** You then read back only
  the slices you need. Never hold a full page dump in context.
- **Work one unit at a time**: one collection, then the next; one page's colour
  scan, then the next. Checkpoint after each.
- **Metadata before detail.** Get the list of pages / collections / component
  names first (cheap). Only expand a node when a finding depends on its internals.
- **No screenshots / image exports** during the audit. This is a data pass.
- **Let the script do the diffing.** `scripts/audit-report.mjs` compares the raw
  dumps against the conventions catalogue — you don't reason over every row by hand.

## Phases

Run in order. Each writes files and prints a one-line summary.

### 1 · Connect & orient  → `audit/raw/overview.json`
Confirm the bridge, capture: file name/key, page list (id + name + child count),
variable collection list (id, name, modes, variable count), counts of local
paint/text/effect styles, count of components + component sets. Nothing deeper yet.

### 2 · Variables & styles  → `audit/raw/variables.json`, `audit/raw/styles.json`
For every collection: every variable — `id`, `name`, `resolvedType`,
`variableCollectionId`, and per mode either the raw value or the alias target
(resolve alias `id` → target `name`). For every style: `id`, `name`, `type`, the
paint(s)/value, and any `boundVariables`.
See [references/extraction-snippets.md](references/extraction-snippets.md).

### 3 · Components  → `audit/raw/components.json`
Every `COMPONENT_SET` and standalone `COMPONENT`: `id`, `name`, page, published
status, `componentPropertyDefinitions` (variant property names + values), and for
sets the child component names. Don't traverse component internals yet.

### 4 · Colour usage  → `audit/raw/usage-<page>.json` (one file per page)
Per page, every node carrying a visible SOLID fill or stroke. For each: node
`id`, `name`, `type`, the resolved colour hex, and the binding —
`variable:<name>` / `style:<name>` / `raw`. This is the expensive phase: do it
one page at a time, write, clear, next page.

### 5 · Analyse  → `audit/findings.json` + `audit/report.md`
Run `node .claude/skills/figma-audit/scripts/audit-report.mjs`. It cross-checks
the raw dumps against `design-system-conventions` (the catalogue in
`references/color-tokens.md` and the token JSON in `tokens/`) and emits findings
in every category below. Read `report.md`.

### 6 · Triage
Walk `report.md` with the user. For each finding confirm or adjust `proposed`
and `action`, set `status` to `approved` / `skip` / `manual`. The result is the
input to `figma-safe-edit`.

## Finding categories

| category | what it flags |
|---|---|
| `variable-naming` | variable name ≠ conventions grammar (`color/bg/primary` → `color/background/brand/default`) |
| `variable-raw-value` | a **Semantic** or **Component** variable holding a raw hex instead of an alias |
| `variable-off-catalog` | a semantic/component variable whose name isn't in the approved catalogue at all |
| `collection-structure` | primitives + semantics in one collection; modes on the wrong collection; missing `Light` mode |
| `component-binding` | a component node bound to a **primitive** (or raw colour) instead of a semantic/component token |
| `raw-color` | a node with a raw SOLID fill/stroke, no variable, no style |
| `off-palette-color` | a raw colour that doesn't match any Tailwind primitive (candidate for a product-override token, or a mistake) |
| `style-not-variable` | a paint/text style that should be a variable |
| `component-naming` | component name breaks the PascalCase / `Category/Component` rule |
| `variant-naming` | variant property or value casing/name inconsistent (`Size` vs `size`, `Type` vs `variant`) |
| `duplicate` | two variables / components that are the same thing under different names |
| `unused-primitive` | a Tailwind hue no semantic token references — prune candidate |

## Output contract — `audit/findings.json`

```json
{
  "generatedAt": "ISO-8601",
  "figmaFile": { "name": "...", "key": "..." },
  "summary": { "variables": 0, "components": 0, "nodesScanned": 0, "byCategory": {} },
  "findings": [
    {
      "id": "VAR-001",
      "category": "variable-naming",
      "severity": "high | medium | low",
      "target": { "kind": "variable | style | component | node", "id": "123:45", "page": "Page 1" },
      "current": "color/bg/primary",
      "proposed": "color/background/brand/default",
      "rationale": "one line, cite the convention",
      "action": "rename | rebind | create-and-bind | convert-style-to-variable | merge | delete | manual-review",
      "status": "proposed"
    }
  ]
}
```

`figma-safe-edit` reads this file, takes only `status: "approved"`, and batches
the work. Keep IDs stable across re-runs so triage decisions survive a re-audit
(the script matches on `target.id` + `category`).

## Re-running

Safe any time — it's read-only. Re-run after `figma-safe-edit` applies a batch to
confirm the findings cleared and nothing regressed.
