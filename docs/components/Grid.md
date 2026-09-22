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
| | `spanSm` | span below `lg` (sidebar-collapse / narrow) — optional |
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

## Figma

Page carries a native `layoutGrids` overlay (16 columns, gutter/offset 16,
stretch) — not a separate guide frame. Screen content lays out on that grid;
React `Grid` is the code counterpart.
