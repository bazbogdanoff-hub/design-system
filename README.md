# Logistics CRM Design System

Design tokens + React component library. Figma and this repo share one set of
names — see [`.claude/skills/design-system-conventions/`](.claude/skills/design-system-conventions/SKILL.md)
for the contract.

## Token pipeline

```
tokens/*.json  (DTCG, source of truth)
   │  npm run tokens
   ▼
build/tokens.css   CSS custom properties  ← components import this
build/tokens.js    resolved JS constants
build/tokens.d.ts  type declarations
```

- `npm run gen:primitives` — regenerate `primitives.color.json` + `brand.color.json` from the Tailwind palette
- `npm run build:tokens` — DTCG → `build/`
- `npm run tokens` — both

### Tiers

| File | Tier | Rule |
|---|---|---|
| `tokens/primitives.color.json` | primitive | raw hex, generated (full Tailwind palette) |
| `tokens/brand.color.json` | primitive | `color.brand.*` → `color.indigo.*` (the one allowed alias) |
| `tokens/semantic.color.json` | semantic | aliases into primitives — **the colour API** |
| `tokens/component.color.json` | component | aliases into semantic — per-component override points |
| `tokens/primitives.type.json` | primitive | Plus Jakarta Sans; size/weight/line-height/tracking scales |
| `tokens/semantic.type.json` | semantic | composite `text.*` styles — 19 named styles |
| `tokens/primitives.layout.json` | primitive | `radius.*` scale + `space.*` scale (4px grid, rem) |
| `tokens/semantic.layout.json` | semantic | `radius.container/panel/control/chip/pill` |
| `tokens/component.layout.json` | component | `radius.card/button/input/…` |

Components reference **semantic or component** tokens only, never primitives —
except `space.*`, which has no semantic tier (the scale is the API).
Type: shape from `text.*`, colour from `color.text.*` — kept separate.

`npm run preview` → `preview/index.html`, a self-contained swatch + type sheet.

## Status

Bootstrapping. Colour tokens defined; spacing / radius / typography and the
component library are next. The Tailwind palette import is scaffolding to be
pruned once the semantic layer is stable.

## Skills

`.claude/skills/` holds the working procedures for this repo:

- **design-system-conventions** — the naming + structure contract (done)
- **figma-audit** — read-only inventory of the Figma file → `audit/findings.json` + `audit/report.md` (done)
- **figma-safe-edit** — builds Figma collections from `tokens/*.json`, and applies approved findings, batched + checkpointed via figmosha2 (done)

### Figma bridge

`scripts/figma/fig.mjs` talks to **figmosha2** at `C:\Users\Dell\IdeaProjects\figmosha2`
(`bridge.mjs` — a Node port, no Python). Per session: open the file in Figma
Desktop, run the *Figmosha Bridge* plugin, `node <figmosha2>\bridge.mjs`, then
`node scripts/figma/fig.mjs scripts/figma/ping.js`.
