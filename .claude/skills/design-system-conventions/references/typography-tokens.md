# Typography token catalog

Same tier model as colour. **Primitives** = `font.*` (families, sizes, weights,
line-heights, tracking). **Semantic** = `text.*` — composite styles, one per
Figma text style, that bundle five primitives.

- [Primitives](#primitives)
- [Semantic text styles](#semantic-text-styles)
- [How a component uses type](#how-a-component-uses-type)
- [Build output](#build-output)

Typeface: **Plus Jakarta Sans** (weights 500/600/700/800), mono fallback for code.

---

## Primitives

`tokens/primitives.type.json` · Figma collection **Primitives** (`FLOAT` for
size/weight/line-height, `STRING` for family, `FLOAT` in em for tracking).

### `font.family`
| token | value |
|---|---|
| `font.family.sans` | Plus Jakarta Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif |
| `font.family.mono` | ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace |

### `font.size` — named by px, valued in rem
`10 12 13 14 15 16 18 20 24 28 32 36 48 64` → `0.625rem … 4rem`
(px name, rem value: `font.size.15` = `0.9375rem`. rem so the scale respects the
user's browser font-size setting.)

### `font.weight`
`medium` 500 · `semibold` 600 · `bold` 700 · `extrabold` 800
(400 Regular is available in the family but unused — body runs at 500 for the
denser, more "premium" feel you asked for.)

### `font.lineHeight` — unitless multiplier
`none` 1 · `tight` 1.15 · `snug` 1.3 · `normal` 1.5 · `relaxed` 1.65

### `font.letterSpacing` — em
`tighter` -0.02 · `tight` -0.01 · `normal` 0 · `wide` 0.01 · `wider` 0.03

*(line-height + tracking scales are a proposed default — adjust once you see them on screen.)*

---

## Semantic text styles

`tokens/semantic.type.json` · Figma collection **Component** or a **Text styles**
set (Figma text styles, named `text/<group>/<size>`). Each is a DTCG `typography`
composite. **One weight per role** — the other weights at that size are reached
by overriding `font-weight` with a `font.weight.*` primitive when genuinely needed.

| token | size | weight | line-height | tracking | use |
|---|---|---|---|---|---|
| `text.display.xl` | 64 | bold | none | tighter | hero / auth / empty-state headline |
| `text.display.lg` | 48 | bold | none | tighter | |
| `text.display.md` | 36 | bold | tight | tight | |
| `text.heading.xl` | 32 | bold | tight | tight | page title |
| `text.heading.lg` | 28 | semibold | snug | tight | |
| `text.heading.md` | 24 | semibold | snug | tight | section / card title |
| `text.heading.sm` | 20 | semibold | snug | normal | |
| `text.heading.xs` | 18 | semibold | snug | normal | subsection / group label |
| `text.body.lg` | 16 | medium | normal | normal | |
| `text.body.md` | 15 | medium | normal | normal | **default body / table cell** |
| `text.body.sm` | 14 | medium | normal | normal | |
| `text.body.xs` | 13 | medium | normal | normal | dense secondary text |
| `text.label.lg` | 16 | semibold | snug | normal | |
| `text.label.md` | 14 | semibold | snug | normal | button / input / tab label |
| `text.label.sm` | 13 | semibold | snug | normal | table header / chip |
| `text.label.xs` | 12 | semibold | snug | wide | |
| `text.overline` | 10 | extrabold | snug | wider | all-caps kicker (`text-transform: uppercase`) |
| `text.caption` | 12 | medium | normal | normal | helper text, timestamps, footnotes |
| `text.code` | 13 | medium (mono) | normal | normal | inline IDs, JSON, tracking numbers |

Weight tiers follow your spec: display 64–24 top out at **bold**; body/label/small
12–20 can go up to **extrabold** (used only by `overline`).

### Label ramp — leading trim (Figma-only)

`text/label/*` Figma styles carry `leadingTrim: CAP_HEIGHT`. `label` is the
single-line UI ramp (button / input / tab / table-header / chip / badge text);
trimming the leading to cap height means the style drops into an auto-layout
frame with a predictable box and **no per-component line-height override**.
`body` / `heading` / `display` are **not** trimmed (multi-line text needs the
leading). DTCG has no `leadingTrim` field, so this lives only on the Figma
style — in code the equivalent is `line-height: 1` on a single-line label, or
just centring the label in a fixed-height control.

`32` is used by `heading.xl`; the other in-between sizes (`15`, `13`) sit in
`body`/`label` where a half-step matters.

---

## How a component uses type

Shape from `text.*`, colour from `color.text.*` — never mix the two.

```css
.card-title {
  /* shape */
  font: var(--text-heading-md-font-weight) var(--text-heading-md-font-size) / var(--text-heading-md-line-height) var(--text-heading-md-font-family);
  letter-spacing: var(--text-heading-md-letter-spacing);
  /* colour */
  color: var(--color-text-default);
}
```

or, the common case, a utility class + a colour var:

```css
.card-title { color: var(--color-text-default); }
```
```html
<h3 class="text-heading-md card-title">…</h3>
```

## Build output

`npm run tokens` produces:
- `build/tokens.css` — `--font-*` primitives and `--text-<role>-<size>-*` expanded
  props (font-family / font-size / font-weight / line-height / letter-spacing).
- `build/typography.css` — one `.text-<role>-<size>` utility class per semantic
  style (generated by `scripts/generate-typography-css.mjs`).
- `build/tokens.js` / `.d.ts` — the same as constants.

## Figma mapping

- `font.*` primitives → Primitives collection variables. Bind them into the
  text styles' properties (Figma supports variable-bound typography).
- `text.*` → Figma **text styles** named `text/heading/md` etc. — `/` for `.`,
  same as colour variables.
- A text layer gets a text style (`text/body/md`) **and** a colour variable
  (`color/text/default`).
