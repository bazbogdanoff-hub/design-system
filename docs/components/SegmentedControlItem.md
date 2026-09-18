# SegmentedControlItem

One option inside a `SegmentedControl`. **L1** — Figma + React, both built
this session.

```tsx
<SegmentedControlItem selected>List</SegmentedControlItem>
<SegmentedControlItem>Grid</SegmentedControlItem>
<SegmentedControlItem disabled>Map</SegmentedControlItem>

{/* sidebar module switcher — bare color pills, no label */}
<SegmentedControlItem tone="brand" position="start" selected />
<SegmentedControlItem tone="danger" position="middle" />
<SegmentedControlItem tone="success" position="end" />
```

| prop | type | notes |
|---|---|---|
| `children` | `ReactNode` | the option's label — omit for the sidebar switcher's bare color pills |
| `selected` | `boolean` | shows the elevated card-colored pill + brand-colored text |
| `tone` | `'brand'` \| `'success'` \| `'danger'` | when set, `selected` renders a solid `tone`-colored fill instead of the neutral glass surface — the sidebar module switcher only |
| `position` | `'start'` \| `'middle'` (default) \| `'end'` | only meaningful alongside `tone` — rounds whichever outer corner touches the panel this item sits flush against |

Every other native `<button>` prop passes through (`onClick`, `disabled`, …).

## A real radio button, not a styled `<li>`

`role="radio"` on a real `<button>`, meant to sit inside a `SegmentedControl`
(`role="radiogroup"`) — natively focusable/clickable, `aria-checked` carries
`selected`. `radio`/`radiogroup` over `tab`/`tablist`: this models "pick
exactly one of N visible choices," not "switch which content panel is
showing" — the same single-choice semantics `MenuRow` models with
`menuitemradio`, just outside a menu popup here.

## Sizing — ancestor context, not a prop

No `size` prop — reads `data-size` off the nearest `SegmentedControl`
ancestor, the same ancestor-context cascade `MenuRow`/`TableRow` already use.

## Selected — a real nested `Button`, not a hand-drawn fill

An earlier version of `selected` was a flat color swap (a solid background +
brand-colored text, no shadow). Owner correction: it should look like an
actual secondary `Button` sitting on the track — glass shadow, white catch
border, "just as if you'd nested a Button instance inside." So that's
literally what both sides now do:

- **Figma**: the `selected` variant's content isn't a plain frame with a
  fill anymore — it's a real `Button` instance (`size=X, variant=secondary,
  state=default`, both icon slots turned off) nested inside a zero-padding
  hug wrapper. The wrapper's own width/height is whatever the nested Button
  reports, so there's no independent height value that could drift from
  Button's own scale.
- **React**: `selected` applies `Button.module.css`'s own
  `.surface[data-variant='secondary']` class directly (cross-imported, same
  reuse `IconButton`/`Select` already do with `Button.module.css`/
  `Input.module.css`) instead of a `color.segmentedControl.item.background/
  text.selected` token pair — those tokens were removed since nothing binds
  them anymore. `color.segmentedControl.item.*` now only defines
  `default`/`hover`/`disabled`; `selected` is Button's own tokens, unmodified.

This also fixed a real bug in the original flat-fill version: the hand-built
`selected` frame was sized independently from its `default`/`hover` siblings
and could render slightly taller than the track that clipped it. Rebuilding
it as a genuine `Button` instance removed the independent sizing path
entirely — `Button`'s own height at each size (28/32/36) is exactly
`size.control`'s own scale, the same scale this component already uses, so
there's no separate number left to get out of sync. Verified via
`getBoundingClientRect()` in a live harness: the selected item sits with an
equal 2px margin above and below inside the track at every size, no overflow.

## `tone` — a neutral glass recipe, not a color wash

Unselected `tone` items (any tone, `state=default`) all render the exact
same look regardless of which tone is set — a two-layer glass fill (a flat
zinc fill + a black-alpha wash on top), a zinc border, and a matching inset
shadow, all via `component.color.json`'s `segmentedControl.item.xs.default`
tokens. `tone` only actually changes anything once `selected` is true — the
unselected state never carries a module's color, that's what makes it read
as "not currently picked." `state=hover` is the identical recipe one step
lighter (400 vs. 500) across all three of fill/border/inner-shadow, plus a
bump in the black-alpha overlay's own opacity (`.15` → `.25`) for a firmer
"being pressed" read — see `segmentedControl.item.xs.hover`.

## `position` {#position}

Only meaningful alongside `tone`. `middle` (default) keeps the item's plain
uniform corner; `start`/`end` round the one outer corner that touches the
panel the switcher sits flush against, using `radius.panel` — the same
token `SidebarSection` uses for its own "nested card" corners, so the
switcher's rounded end visually agrees with the panel below it. Without
`tone` set, `position` has no effect (the generic List/Grid/Map track has no
concept of "flush against a panel edge").

## Figma

`SegmentedControlItem` (`10323:16971`) — 39 variants: `size`(sm/md/lg/xs) ×
`tone`(neutral/brand/success/danger) × `position`(start/middle/end) ×
`state`(default/hover/disabled/selected), not a full cross-product — `xs`
is the only size with real `tone`/`position` variation (the original 3
sizes all carry `tone=neutral, position=middle` as filler values for
property-key consistency). Text uses the same `text/label/{size}` styles
`Button` uses at its own matching size step — this item is meant to read as
a same-height sibling of a same-size `Button` in a toolbar. The 3 non-`xs`
`selected` variants nest a real `Button` instance (see above) rather than
being hand-drawn; the `xs` `selected` variants are a solid `tone`-colored
fill instead (see `component.color.json`'s `sidebar.<tone>.fill`/`.accent`).
