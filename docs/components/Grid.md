# Grid

A 16-column CSS grid with a token gutter — for dashboard / content layout inside
a [`Page`](./Page.md). Defaults match Page's layout guide (16 cols / gutter 16 /
offset 16 / stretch). **L1 layout primitive.**

```tsx
<Grid>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
</Grid>

<Grid>
  <Grid.Item span={8}><Card>{/* chart */}</Card></Grid.Item>
  <Grid.Item span={8}><Card>{/* list */}</Card></Grid.Item>
</Grid>

<Grid>
  <Grid.Item span={8}><Card>{/* chart */}</Card></Grid.Item>
  <Grid.Item span={4}><Card>{/* list */}</Card></Grid.Item>
  <Grid.Item span={4}><Card>{/* activity */}</Card></Grid.Item>
</Grid>
```

| | prop | |
|---|---|---|
| `Grid` | `columns` | column count (default **16**) |
| | `gap` | gutter — `space/*` (none·4·8·12·16·20), default **`lg`** (16) |
| `Grid.Item` | `span` | columns to span, 1–`columns`. Default = full width |
| | `spanSm` | span at the `tablet` tier (below 1280) — defaults to `span` |
| | `spanWide` | span at the `wide` tier (≥1600 × ≥820) — defaults to `span` |
| | `start` | 1-based start column |

Uneven splits are just different spans — `4·4·4·4`, `8·8`, `8·4·4`, `4·12`.
Every item has `min-width: 0` so its content can shrink (text truncation, tables).
Columns stretch equally (`minmax(0, 1fr)`), so `span={4}` stays ~25% of the
content track as the page width changes.

Inside a `Page`, Grid also falls back to `--page-cols` / the guide if
`--grid-cols` isn't set.

## `Grid` vs `Stack columns`

- **`Stack direction="row" columns`** — quick, equal-width row. No column math.
- **`Grid`** — when widths are uneven, must line up across rows, or you want a
  consistent 16-col rhythm across the whole page.

## Column widths (1440 design width, `space/16` gutter + offset)

Approx track widths with collapsed sidebar (64) vs expanded (180):

| | sidebar 64 (`Page` inner ~1316) | sidebar 180 (inner ~1200) |
|---|---|---|
| **1 col** | ~67 | ~60 |
| span 4 | ~286 | ~255 |
| span 8 | ~588 | ~526 |
| span 12 | ~890 | ~797 |
| span 16 | full | full |

## Tiers

The two tier overrides are plain media queries repeating `tierQueries` from
`lib/breakpoints.ts` — CSS cannot read the constant, so change one, change
both. See [AppShell](./AppShell.md#breakpoints) for what the tiers are.

`spanSm={16}` stacks an item under its neighbour. **Only do that on a page
that scrolls.** A fixed-height page (one grid row, `overflow: hidden`) has
no room for a second row, and the stacked item overlaps the first.

At 1920 the root is 20px (see [AppShell](./AppShell.md#scale--fluid-in-rem)),
so every px width here is 1.25× and the layout has the room of a 1536 screen
at 16px. The wide tier opens the sidebar expanded (225 at 20px).

## Figma

Page carries a native `layoutGrids` overlay (16 columns, gutter/offset 16,
stretch) — not a separate guide frame. Screen content lays out on that grid;
React `Grid` is the code counterpart.
