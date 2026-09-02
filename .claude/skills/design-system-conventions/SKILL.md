---
name: design-system-conventions
description: >-
  The single source of truth for THIS design system's naming and structure —
  token names (color, spacing, radius, type), the primitive → semantic →
  component tier model, Figma collection/variable/component naming, and how every
  name maps 1:1 to code (DTCG JSON → CSS custom properties → TypeScript). Use this
  skill WHENEVER you name, rename, audit, or create a token, variable, style,
  component, variant, or prop — in Figma OR in this repo — or when judging whether
  an existing name is "correct." Read it before writing any token file or
  component so names match across Figma and code. If you're touching the design
  system and unsure what something should be called, this skill decides. Trigger
  words: token, variable, semantic token, primitive, alias, Figma variable,
  component naming, variant property, design system audit, rename, token
  architecture.
---

# Design System Conventions

This is the contract. Figma and the code library must agree on every name, because
the goal is a design system where a Figma variable and a code token are the same
thing under two skins. When they drift, the system stops being a system.

## The tier model — why names have layers

| Tier | Purpose | Example | Consumed by |
|---|---|---|---|
| **Primitive** | A raw value with no meaning. "What color is this." | `color.indigo.600` → `#4f46e5` | Only the semantic tier (and the brand alias). Never components. |
| **Semantic** | A decision with intent. "What is this for." | `color.background.brand.default` → `{color.brand.600}` | Every component. This is the real API. |
| **Component** | A per-component override point. | `color.button.primary.background.default` → `{color.background.brand.default}` | One component. |

**Why the semantic tier is non-negotiable:**
- **Theming** — light→dark is ~50 semantic remappings, not 500 edits scattered through components. The component says `color.text.default`; the *mode* decides if that resolves to `zinc.900` or `zinc.50`.
- **Intent survives redesign** — `color.text.danger` says why it exists. `red.700` doesn't. A rebrand edits the mapping once.
- **Fewer wrong choices** — a designer picks from ~50 meaningful tokens, not 250 raw swatches.

**Hard rule:** components (Figma or code) reference **semantic or component tokens only**, never primitives. A component bound to `color.blue.500` is a bug to be logged and fixed.

**The one blessed primitive→primitive alias:** `color.brand.{50…950}` points at `color.indigo.{50…950}` (in `tokens/brand.color.json`). This keeps "brand" swappable and lets the unused Tailwind hues be pruned later without touching the semantic layer. No other primitive is ever an alias.

**Component tier — what's scaffolded now:** `button`, `card`, `input`, `badge`, `table`, `modal` (the logistics-CRM baseline). Add a component's tokens when you start building that component, not before. Full list + rationale in [references/component-tokens.md](references/component-tokens.md).

## Naming grammar

Read left → right, general → specific:

```
color · <property> · <role> · <prominence> · <state>
```

| Slot | Required | Allowed values (this vocabulary is frozen — do not invent synonyms) |
|---|---|---|
| `property` | yes | `background`, `surface`, `text`, `border`, `icon` |
| `role` | no (omit = neutral) | `brand`, `success`, `warning`, `danger`, `info` |
| `prominence` | no (omit = base) | `subtle`, `muted`, `strong`, `emphasis` |
| `state` | no (omit = rest) | `hover`, `active`, `focus`, `disabled`, `selected` |

- **`background` vs `surface`:** `background` = the app canvas / page / large fills. `surface` = a raised container that sits *on* the background (card, menu, popover, sheet). If it casts a shadow or has a border to separate it from the page, it's a `surface`.
- **`on-*`:** a foreground color engineered to contrast with a specific filled surface — `color.text.on-brand`, `color.icon.on-danger`. Use it whenever text/icon sits on a colored fill, not on the canvas.
- **Prominence is an ordered scale:** `subtle` < `muted` < *(base)* < `strong` < `emphasis`. Don't mix in `light`/`dark`/`soft`/`bold` — they're not in the vocabulary.
- **Never put a literal hue in a semantic name.** `color.background.blue` is wrong; that meaning belongs in a primitive or a role (`info`).

### How the grammar becomes a real path

The token files are DTCG JSON, where a token is a *leaf* (`{ "$value": … }`) and
cannot also be a group. That forces two rules:

1. **`role` + `prominence` combine into one kebab segment** when there's no state:
   `color.background.brand-subtle`, `color.background.danger-subtle`. Not a nested
   `brand` → `subtle`.
2. **A token with interaction states becomes a group; the rest state is `default`:**
   `color.background.brand.default` / `.hover` / `.active`. Only tokens that
   actually have states get this treatment — right now that's just
   `color.background.brand` and `color.background.danger` at the semantic tier.
   Everything else is a flat leaf (`color.text.subtle`, `color.border.focus`).

So `color.background.brand` is a **group**, and code/Figma reference
`color.background.brand.default` for the rest state — never bare `color.background.brand`.

### `$type` is declared once

`"$type": "color"` sits on the `color` group in `tokens/primitives.color.json`
only. The other token files omit it — Style Dictionary infers type through the
alias chain. Re-adding it elsewhere triggers a (harmless but noisy) collision warning.

The full catalogue of approved tokens with values lives in the reference files —
each is the checklist for its part of the Figma audit. If a token you need isn't
in one, that's a conventions change: add it to the catalogue first, then create
it everywhere.

- **[references/color-tokens.md](references/color-tokens.md)** — primitives, `color.*` semantic + component tokens
- **[references/component-tokens.md](references/component-tokens.md)** — per-component colour tokens, Figma↔React component mapping
- **[references/typography-tokens.md](references/typography-tokens.md)** — `font.*` primitives, composite `text.*` styles
- **[references/layout-tokens.md](references/layout-tokens.md)** — `space.*` scale (no semantic tier), `radius.*` primitive → semantic → component

Typography has its own grammar: `text.<group>.<size>` where group ∈
`display | heading | body | label` (plus flat `text.overline` / `caption` /
`code`) and size ∈ `xs … xl` (display: `md … xl`). A `text.*` token is a
composite (family + size + weight + line-height + tracking). Shape comes from
`text.*`; colour comes from `color.text.*`; never conflate them.

## One name, every surface

A token has exactly one canonical path. Every surface is a mechanical transform of it:

| Surface | Form of `color.background.brand.hover` |
|---|---|
| Canonical path | `color.background.brand.hover` |
| DTCG file | `tokens/semantic.color.json` → `color → background → brand → hover → { "$value": "{color.brand.700}" }` |
| CSS custom property | `--color-background-brand-hover` |
| TS constant (`build/tokens.js`) | `ColorBackgroundBrandHover` |
| Figma variable | collection **Semantic**, variable **`color/background/brand/hover`** |

**Transform rules:** canonical dots → `/` for Figma, `-` for CSS, PascalCase for
the TS constant. The `color` segment is kept on every surface, including Figma, so
the mapping stays 1:1 and unambiguous when non-color tokens join later.

## Repo layout

```
design-system/
├── tokens/
│   ├── primitives.color.json      DTCG — full Tailwind palette, raw hex. Generated.
│   ├── brand.color.json           DTCG — color.brand.* → color.indigo.*. Generated.
│   ├── semantic.color.json        DTCG — the colour API (aliases into primitives). Hand-written.
│   ├── component.color.json       DTCG — per-component colour (aliases into semantic). Hand-written.
│   ├── semantic.color.dark.json   added later; same keys as semantic, dark aliases
│   ├── primitives.type.json       DTCG — font families, size/weight/line-height/tracking. Hand-written.
│   ├── semantic.type.json         DTCG — composite text.* styles (aliases into font.*). Hand-written.
│   ├── primitives.layout.json     DTCG — radius.* scale + space.* scale. Hand-written.
│   ├── semantic.layout.json       DTCG — radius.container/panel/control/chip/pill. Hand-written.
│   └── component.layout.json      DTCG — radius.button/card/input/…. Hand-written.
├── scripts/
│   ├── generate-primitives.mjs        tailwindcss/colors → primitives + brand json
│   ├── generate-typography-css.mjs    semantic.type.json → build/typography.css classes
│   └── generate-preview.mjs           build/*.css → preview/index.html
├── build/                         generated — tokens.css, typography.css, tokens.js, tokens.d.ts. Never hand-edited.
├── src/components/<Component>/     React + TS component library
├── style-dictionary.config.mjs    tokens/ → build/
└── CHANGELOG-renames.md           every rename: old → new, date, surfaces updated
```

Build: `npm run tokens` (regenerates primitives, builds `build/`, generates typography classes).

- **`tokens/semantic.color.json` + `component.color.json` are the source of truth** for decisions. `primitives.color.json` + `brand.color.json` are generated from Tailwind for now — once the palette is pruned (target: a few months out), delete the script + `tailwindcss` devDep and hand-maintain `primitives.color.json`.
- Figma variables are kept in sync *to* these files, not the reverse, once the cleanup is done.
- **`build/` is disposable.** Regenerated from `tokens/`. Components import from `build/tokens.css` (CSS vars) — never from `tokens/` directly.

## Figma structure

| Collection | Modes | Holds | Variable naming | Published? |
|---|---|---|---|---|
| **Primitives** | 1 (`Value`) | full Tailwind palette + `color/brand/*` (aliased to `color/indigo/*`) | `color/zinc/50`, `color/indigo/600`, `color/brand/600` | No — hide from publishing |
| **Semantic** | `Light` now; `Dark` added later | aliases into Primitives | `color/background/brand/default`, `color/text/subtle` | Yes |
| **Component** | mirrors Semantic | aliases into Semantic | `color/button/primary/background/default` | Yes |

Gotchas:
- Modes are **per collection** — Primitives and Semantic *must* be separate collections, or you can't theme.
- Every Semantic and Component variable is an **alias**, never a raw hex. A raw value there is an audit finding (the two known exceptions: `color/background/overlay`, and `color/button/ghost/background/default` = transparent).
- Figma caps modes per collection by plan (~4 on Pro, ~40 Enterprise). "Light now, dark-ready" means: build the Semantic collection so adding a `Dark` mode is only filling in alias targets — no renaming, no restructuring.
- Group with `/`. Figma renders `color/background/brand/default` as a nested tree; the string is still the canonical mapping key. Figma variable path = DTCG path with `/` for `.`.
- The Tailwind hues nobody references get deleted from the Primitives collection during the prune — the audit flags which are unused.

## Component & variant naming

**Figma:**
- Component name = the code component name, PascalCase: `Button`, `TextField`, `Badge`.
- Use `/` only for a real category with 2+ members: `Form/TextField`, `Form/Select`. Not `Buttons/Button`.
- One **component set** per component. Variant **properties** are lowercase; **values** are lowercase-kebab:
  - `variant`: `primary` | `secondary` | `tertiary` | `ghost` | `danger`
  - `size`: `sm` | `md` | `lg`
  - boolean props: `leadingIcon`, `trailingIcon` (Figma booleans, prefix reads as a noun)
- Don't encode interaction state (`hover`, `focus`) as a variant unless the component is a *documentation* board. State is CSS pseudo-classes in code.

**Code:**
```
src/components/Button/
├── Button.tsx          props mirror Figma variant props exactly
├── Button.types.ts     ButtonProps — variant, size, leadingIcon, ...
├── Button.module.css   uses --color-* semantic vars only
└── index.ts
```
- A Figma variant prop and its React prop have the **same name and same values**: Figma `variant=primary` ↔ `<Button variant="primary">`.
- Standard HTML/React props (`disabled`, `onClick`, `type`) are not duplicated as Figma variants — `disabled` maps to Figma's `state=disabled` for visuals only.

## When you rename anything

Renames are cheap in Figma (instances follow) but they break code imports, token
pipelines, and docs. Every rename gets a line in `CHANGELOG-renames.md`:

```
2026-09-02  color.bg.primary → color.background.brand    figma ✓  tokens/semantic.color.json ✓  build ✓  src ✓
```

Do the rename on **all** surfaces in the same batch, or log which surfaces are
still pending. A half-renamed token is worse than the old name.
