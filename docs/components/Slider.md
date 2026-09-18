# Slider

A single-thumb range control. **L1** — built React-first, no reference
screenshot this time; ported into Figma right after (see **Figma** below).

```tsx
<Slider aria-label="Volume" defaultValue={30} />
<Slider size="lg" aria-label="Zoom" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
<Slider size="sm" aria-label="Disabled" defaultValue={50} disabled />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (8px track) · `md` (12px) · `lg` (16px) | `md` | originally shared with `ProgressBar`; `ProgressBar` was independently resized to 6/10/12px on 2026-09-13 for dense-context fit (see `ProgressBar.md`) — `Slider`'s own scale is unchanged |
| `value` / `defaultValue` / `onChange` | native `<input type="range">` props | — | controlled or uncontrolled, see below |
| `min` / `max` / `step` | native | `0` / `100` / — | forwarded as-is |
| `disabled` | `boolean` | — | |

Every other native `<input>` prop passes through. `aria-label` or
`aria-labelledby` is required — same TS-enforced union `ProgressBar`/
`IconButton` use — since a bare range input has no visible text of its own
for a screen reader to announce.

## A real `<input type="range">`, not a div built from scratch

Keyboard (arrow keys, Home/End, Page Up/Down), dragging, and the `slider`
ARIA role all come from the browser for free. The input is rendered fully
transparent except for its thumb; the visible track + fill are a plain
decorative `<span>` pair underneath — the **same track/fill shape
`ProgressBar` already uses** (a track holding a `width: {percent}%` fill),
not the input's own `::-webkit-slider-runnable-track`/
`::-moz-range-progress`. Deliberate: a vendor-prefixed pseudo-element
background is one more fragile, engine-specific surface than a plain div,
for no benefit once the thumb still needs its own
`::-webkit-slider-thumb`/`::-moz-range-thumb` styling either way.

## Controlled or uncontrolled — always rendered controlled internally

`value`+`onChange` (controlled) or `defaultValue` (uncontrolled) both work.
Internally the native input is **always** given a `value` (never
`defaultValue`) — backed by state seeded once from `defaultValue` when the
consumer isn't driving `value` — so there's always a real current value to
compute the decorative fill's width from, and no React
controlled/uncontrolled warning.

## Thumb is always 8px bigger than its own track

`sm` 16px, `md` 20px, `lg` 24px thumb against an 8/12/16px track — a
comfortable drag target bigger than the line it sits on, at every size.
White fill + `color.border.brand` border + a soft shadow; hover deepens the
border to `color.background.brand.hover`, `:focus-visible` adds a
`color.background.brand-subtle` ring around the thumb (the input's own
default focus outline is suppressed in favor of this, the one visible focus
indicator). `disabled` mutes the fill to `color.text.disabled` and the
thumb border to `color.border.subtle`.

## A real gotcha hit while building this: never comma-combine `::-webkit-*` with `::-moz-*`

```css
/* WRONG — Chrome drops this ENTIRE rule, both halves, silently */
.slider[data-size='sm']::-webkit-slider-thumb,
.slider[data-size='sm']::-moz-range-thumb { width: 16px; height: 16px; }
```

An unrecognized vendor pseudo-element invalidates the **whole selector
list** for a plain style rule (this isn't the forgiving-selector-list
behavior `:is()`/`:where()` get) — so a rule pairing a `::-webkit-*` and a
`::-moz-*` selector with a comma silently vanishes in Chrome, since it
can't parse the `::-moz-*` half. Every paired rule in `Slider.module.css`
is two separate rules instead. First surfaced as "every size renders
identically" (all size-specific track/thumb dimensions were silently
dropped) before being root-caused.

## Figma

**`Slider`** (`10282:25857`) — 3 variants, one `size` axis (`sm`/`md`/`lg`),
matching React's own 3 sizes exactly (no `state` axis — hover/focus/disabled
are a code-only concern; Figma's form is a static reference, same
precedent as `EmptyState`/`FileDropper`'s hand-built row states). Layers:
`track` (rectangle, `radius/full`, `color/surface/sunken`) + `fill`
(rectangle, same radius, `color/background/brand/default`, sized to a
representative 40% — the same "just show one plausible reference value"
choice `ProgressBar`'s own variants make) + `thumb` (ellipse, white fill,
2px `color/border/brand` stroke, small drop shadow, centered on the fill's
trailing edge) — all bound to the exact tokens React uses.
