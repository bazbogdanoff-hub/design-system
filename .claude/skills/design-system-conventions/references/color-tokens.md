# Color token catalog

The approved list. This is the checklist the Figma audit runs against: every color
in Figma must resolve to one of these tokens, every token here must exist as a
Figma variable, and the machine-readable source of truth is the DTCG files in
`tokens/`.

- [Primitives](#primitives)
- [Semantic tokens](#semantic-tokens)
- [Component tokens](#component-tokens)
- [Choosing the right token](#choosing-the-right-token)
- [Adding or changing a token](#adding-or-changing-a-token)

---

## Primitives

`tokens/primitives.color.json` + `tokens/brand.color.json` · Figma collection
**Primitives** (1 mode) · **generated** by `npm run gen:primitives`.

- The **entire Tailwind v3 palette** is imported: 22 hues
  (`slate gray zinc neutral stone red orange amber yellow lime green emerald teal
  cyan sky blue indigo violet purple fuchsia pink rose`) × 11 steps
  (`50 100 200 300 400 500 600 700 800 900 950`), plus `color.white` / `color.black`.
- This is **scaffolding for the design phase.** Pick freely while designing; the
  audit tracks which hues the semantic layer actually references. Months out, the
  unused hues get deleted, the generator + `tailwindcss` devDep removed, and
  `primitives.color.json` becomes hand-maintained.
- Naming: `color.<hue>.<step>`. A primitive is a raw hex — never an alias, with
  the single exception below.

**Brand ramp** — `color.brand.<step>` → `{color.indigo.<step>}`. The one blessed
primitive→primitive alias. Swap the `BRAND_HUE` const in
`scripts/generate-primitives.mjs` to re-brand. Semantic tokens reference
`color.brand.*`, never `color.indigo.*` directly.

**Product overrides** (2–3 expected, TBD in Figma) — bespoke hexes for a specific
card/button look that aren't on the Tailwind scale. When specified, they go in
`primitives.color.json` under their own group (e.g. `color.accent.*`) as raw
values, and a semantic token aliases them. Not invented yet.

---

## Semantic tokens

`tokens/semantic.color.json` · Figma collection **Semantic** (mode `Light` now,
`Dark` later). **Every entry is an alias into a primitive.** The "Dark →" column
is the intended direction for when Dark mode is built — not built yet.

Structure notes:
- Tokens with interaction states are a **group** with `.default` as the rest state:
  `color.background.brand.default` / `.hover` / `.active`.
- `role`+`prominence` with no state is **one kebab segment**: `background.brand-subtle`.

### `color.background.*` — canvas & large fills

| Token | Light → | Use for | Dark → |
|---|---|---|---|
| `background.default` | `zinc.50` | page / app canvas | `zinc.950` |
| `background.subtle` | `zinc.100` | inset zones, striped rows, panels flush with the page | `zinc.900` |
| `background.emphasis` | `zinc.900` | high-contrast fills: tooltips, inverse callouts | `zinc.50` |
| `background.disabled` | `zinc.100` | disabled control fill | `zinc.800` |
| `background.overlay` | `#09090bb3` *(raw)* | modal / drawer scrim | `#09090bcc` |
| `background.brand.default` | `brand.600` | primary button, active nav item, selected state | `brand.500` |
| `background.brand.hover` | `brand.700` | hover of `background.brand` | `brand.400` |
| `background.brand.active` | `brand.800` | pressed / active | `brand.300` |
| `background.brand-subtle` | `brand.100` | tinted brand fill: selected row, badge, info banner | `brand.950` |
| `background.danger.default` | `red.600` | destructive button | `red.500` |
| `background.danger.hover` | `red.700` | hover of `background.danger` | `red.400` |
| `background.danger-subtle` | `red.100` | error banner / callout / badge fill | `red.950` |
| `background.success` | `green.600` | solid success badge / button | `green.500` |
| `background.success-subtle` | `green.100` | success banner / badge fill | `green.950` |
| `background.warning` | `amber.500` | solid warning badge | `amber.400` |
| `background.warning-subtle` | `amber.100` | warning banner / badge fill | `amber.950` |
| `background.info` | `blue.600` | solid info badge | `blue.500` |
| `background.info-subtle` | `blue.50` | info banner fill *(still 50 — brand/success/warning/danger moved to 100 for badges; revisit for parity)* | `blue.950` |

### `color.surface.*` — raised containers

A `surface` sits *on* the `background`. Shadow or separating border → it's a surface.

| Token | Light → | Use for | Dark → |
|---|---|---|---|
| `surface.default` | `white` | card, panel, modal, menu, sheet | `zinc.900` |
| `surface.subtle` | `zinc.50` | nested surface, table header row | `zinc.800` |
| `surface.raised` | `white` | surface with elevation shadow: popover, dropdown | `zinc.800` |
| `surface.sunken` | `zinc.100` | wells, code blocks, inset track | `zinc.950` |

*(In dark mode surfaces are **lighter** than the canvas — expected.)*

### `color.text.*`

| Token | Light → | Use for | Dark → |
|---|---|---|---|
| `text.default` | `zinc.900` | **main headings** — h1/h2, page titles | `zinc.50` |
| `text.strong` | `zinc.800` | **subheadings** — h3–h6, section/card titles | `zinc.100` |
| `text.subtle` | `zinc.500` | **body text** — the default reading colour for paragraphs and UI copy | `zinc.300` |
| `text.muted` | `zinc.400` | muted / de-emphasised — hints, placeholders, timestamps, captions | `zinc.500` |
| `text.disabled` | `zinc.300` | disabled control text | `zinc.600` |
| `text.brand` | `brand.700` | links, brand-colored labels | `brand.300` |
| `text.danger` | `red.700` | validation errors, destructive labels | `red.300` |
| `text.success` | `green.700` | success messages | `green.300` |
| `text.warning` | `amber.700` | warning messages | `amber.300` |
| `text.info` | `blue.700` | informational messages | `blue.300` |
| `text.on-brand` | `white` | text on `background.brand*` | `white` |
| `text.on-emphasis` | `zinc.50` | text on `background.emphasis` | `zinc.900` |
| `text.on-danger` | `white` | text on `background.danger*` | `white` |

### `color.border.*`

| Token | Light → | Use for | Dark → |
|---|---|---|---|
| `border.default` | `zinc.200` | inputs, cards, dividers | `zinc.700` |
| `border.subtle` | `zinc.100` | faint separators | `zinc.800` |
| `border.strong` | `zinc.300` | emphasized / hover borders | `zinc.600` |
| `border.brand` | `brand.600` | selected input, active tab | `brand.400` |
| `border.danger` | `red.600` | invalid input | `red.400` |
| `border.focus` | `brand.500` | focus ring | `brand.400` |
| `border.highlight` | `white` | white edge catch for glass / raised surfaces | `white` |
| `border.highlight-active` | `brand.500` | focused/active glass surface — full 1.5px primary border replacing the white catch | `brand.400` |

### `color.icon.*`

| Token | Light → | Use for | Dark → |
|---|---|---|---|
| `icon.default` | `zinc.700` | standalone UI icons | `zinc.300` |
| `icon.subtle` | `zinc.500` | decorative / secondary icons | `zinc.400` |
| `icon.brand` | `brand.600` | brand-accented icons | `brand.400` |
| `icon.danger` | `red.600` | error / destructive icons | `red.400` |
| `icon.success` | `green.600` | success icons | `green.400` |
| `icon.on-brand` | `white` | icon on a brand fill | `white` |
| `icon.on-emphasis` | `zinc.50` | icon on `background.emphasis` | `zinc.900` |

---

## Component tokens

`tokens/component.color.json` · Figma collection **Component**. Every entry
aliases a **semantic** token. Full path is `color.<component>.…`; CSS is
`--color-<component>-…`. Scaffolded set: `button`, `card`, `input`, `badge`,
`table`, `modal`. See [component-tokens.md](component-tokens.md) for the full
mapping and the rule for adding a new component.

---

## Product additions (from the CRM audit)

| token | → | why |
|---|---|---|
| `color.surface.card` | `color.extra.card` = `#fcfcfc` | card fill is a warm near-white, off the Tailwind scale. `color.extra.*` is the product-override primitive group. |
| `color.background.warning-strong` | `orange.500` | the alert system has an **orange** warning pill/icon distinct from amber `warning`. `-strong` = the orange variant. |
| `color.background.warning-strong-subtle` | `orange.50` | orange pill fill |
| `color.text.warning-strong` | `orange.700` | orange pill text |
| `color.icon.warning-strong` | `orange.600` | orange pill icon |
| `color.chart.1 … 8` | `brand/cyan/amber/emerald/rose/violet/sky/lime` @ 500–600 | categorical placeholder palette — **revisit when the real chart component is built** |

`color.badge.warning-strong.{background,text}` is the component-tier pair for the orange pill.

## Choosing the right token

1. **What is it painting?** → `property`: large area behind content (`background`),
   raised container (`surface`), letterforms (`text`), a 1px line (`border`), a glyph (`icon`).
2. **Does it carry status meaning?** → `role`: destructive = `danger`, positive =
   `success`, caution = `warning`, neutral information = `info`, "this is us /
   primary action" = `brand`. No status = omit.
3. **How loud, relative to its siblings?** → `prominence`: `subtle` < `muted` <
   *(base)* < `strong` < `emphasis`.
4. **A hover/pressed/focus/disabled variation of another token?** → add the `state`
   (and the token becomes a `.default`/`.hover`/… group).
5. **Does the thing it sits on have a colored fill?** → use an `on-*` text/icon token.

If two tokens both seem right, a distinction is missing from the catalog — raise
it rather than guessing.

## Adding or changing a token

The catalog is the gate:

1. Confirm no existing token covers the need (§ Choosing the right token).
2. Add the row here first — name, light alias, "use for", dark direction.
3. Add it to `tokens/semantic.color.json` (or `component.color.json`) as an alias.
4. `npm run build:tokens`, confirm it resolves.
5. Create the Figma variable `color/<path>` in the matching collection, aliased, in the `Light` mode.
6. If it renames/replaces an existing token, log it in `CHANGELOG-renames.md`.

Never create a Figma variable or CSS var that isn't in this catalog. That's how
the chaos started.
