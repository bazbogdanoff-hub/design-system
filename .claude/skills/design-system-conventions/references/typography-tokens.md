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
user's browser font-size setting.) The scale itself didn't change in the 1440
migration — `text.*` roles were remapped onto different existing steps, no new
sizes needed (`64` and a couple of others just went unused; see below).

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
| `text.display.xl` | 48 | bold | none | tighter | hero / auth / empty-state headline |
| `text.display.lg` | 36 | bold | none | tighter | |
| `text.display.md` | 32 | bold | tight | tight | |
| `text.heading.xl` | 28 | bold | tight | tight | page title |
| `text.heading.lg` | 24 | semibold | snug | tight | |
| `text.heading.md` | 20 | semibold | snug | tight | section / card title |
| `text.heading.sm` | 18 | semibold | snug | normal | |
| `text.heading.xs` | 16 | semibold | snug | normal | subsection / group label |
| `text.body.lg` | 15 | medium | normal | normal | |
| `text.body.md` | 14 | medium | normal | normal | **default body / table cell** |
| `text.body.sm` | 13 | medium | normal | normal | |
| `text.body.xs` | 12 | medium | normal | normal | dense secondary text |
| `text.label.xl` | 16 | **semibold** | tight | normal | xl / primary button |
| `text.label.lg` | 15 | **semibold** | tight | normal | |
| `text.label.md` | 14 | **semibold** | tight | normal | button / input / tab label |
| `text.label.sm` | 13 | **semibold** | tight | normal | table header / chip / badge |
| `text.label.xs` | 12 | **semibold** | tight | wide | |
| `text.overline` | 10 | extrabold | snug | wider | all-caps kicker (`text-transform: uppercase`) |
| `text.caption` | 12 | medium | normal | normal | helper text, timestamps, footnotes |
| `text.code` | 12 | medium (mono) | normal | normal | inline IDs, JSON, tracking numbers |

Weight tiers: display + `heading.xl` are **bold**, lower headings **semibold**;
body is **medium**; the whole **`label` ramp is `semibold`** (was briefly
`bold` mid-project, then reconsidered back to `semibold` — owner's call,
system-wide); `overline` is **extrabold**.

**1440 migration** — every size above shifted down, non-uniformly: `display`/
`heading` lose close to the full 25% viewport-scale cut (they have headroom),
`body`/`label` lose only 6–11% (protecting legibility), and the bottom of the
scale (`label.xs`, `caption`, `overline`) holds at a floor and doesn't shrink
further. Every new value reuses an existing `font.size.*` step — roles just
slide onto the next size down, nothing new was invented (`64` and the old
`heading`/`body`/`label` top values are now unused). `label.md`/`label.sm`
were later nudged up one more step each (14/13 instead of the initial 13/12)
to give the ramp a clean unbroken 16·15·14·13·12 countdown instead of a floor
collision at 12.

### Label ramp — tight line-height, no trim

`text/label/*` is the single-line UI ramp (button / input / tab / table-header /
chip / badge). It runs at **line-height `tight` (1.15)** — small enough that the
label box, not the content around it, sets a component's height: a `1em` leading
icon fits inside the box, so toggling an icon never changes the badge/button
height. `body` / `heading` / `display` keep `normal`/`snug` (multi-line text
needs the leading).

We briefly used `leadingTrim: CAP_HEIGHT` here — reverted, it clipped descenders
(a 14px label measured ~10px). Tight line-height gives the same predictable box
without amputating the glyphs. No trim on any style.

`32` is used by `display.md`; the other in-between sizes (`15`, `13`) sit in
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
