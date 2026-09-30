# Tile

The **second-layer card** (owner, 2026-09-29): a white surface that sits on
a `Card`. Task tiles, decision options, and anything else card-like inside a
card use it, so they all share one look. Built in code first; this doc is
the brief for the Figma master.

## Anatomy

| part | value | token |
|---|---|---|
| fill | white | `color.tile.background` → `surface.default` |
| glass catch | 2px top + left, 1px bottom + right, inside stroke | `color.tile.border` → white |
| inner shadow | x 1, y 1, blur 8 | `color.tile.inner-shadow` → `#f0f0f0` at 60% |
| drop shadow | x 0.5, y 0.5, blur 2, spread 2 | `color.tile.shadow` → `#e4e4e8` at 30% |
| corners | 12 | `radius.panel` |

The catch is drawn as inset shadows, not a CSS border, so it behaves like
Figma's inside stroke: padding and content don't move.

Tuned against the `#f6f6f8` card fill. The card is the most grey it can be
before it stops looking white, and the most contrast it can give the tile.

## Props

| prop | values | default | notes |
|---|---|---|---|
| `as` | `div` · `article` · `section` · `li` | `div` | the element it renders |
| `padding` | `none` · `xs` (8) · `sm` (12) · `md` (16) | `none` | `none` when the content lays itself out, as `TaskTile` does |
| `radius` | `lg` (12) · `md` (8) | `lg` | `md` for small tiles, e.g. `ChartLegendGroup` |
| `interactive` | boolean | `false` | hover lift, see below |

## Interactive

For a tile that works as one control. On hover it lifts toward the pointer:
- it rises 2px and grows 1% on a small spring;
- the drop shadow becomes two layers in `color.tile.lift-shadow` (zinc 900
  at 12%): a close `0 2 6 −1` and a wide `0 12 24 −6`;
- the inner shadow eases to blur 6.

The resting 30% grey can't show height on the card, which is why the lift
has its own colour. Leave `interactive` off for tiles that only hold things.
Under reduced motion there is no lift or grow, only the shadow change.

## Used by

- `TaskTile`: every task tile is an interactive `Tile`.
- `ChartTooltip`: wears the fill, catch and inner shadow, but keeps its own
  floating drop shadow.

## Not to be confused with

- `Card` is the first layer, on the page.
- `SelectableCard` is a form control.
