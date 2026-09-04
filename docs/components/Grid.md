# Grid

A 12-column CSS grid with a token gutter — for dashboard / content layout inside
a [`Page`](./Page.md). **L1 layout primitive.**

```tsx
<Grid gap="lg">
  <Grid.Item span={4}><StatCard … /></Grid.Item>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
  <Grid.Item span={4}><StatCard … /></Grid.Item>
</Grid>

<Grid gap="lg">
  <Grid.Item span={8}><Card>{/* chart */}</Card></Grid.Item>
  <Grid.Item span={4}><Card>{/* list */}</Card></Grid.Item>
</Grid>
```

| | prop | |
|---|---|---|
| `Grid` | `columns` | column count (default 12) |
| | `gap` | gutter — `space/*` (none·4·8·12·16·20), default `md` |
| `Grid.Item` | `span` | columns to span, 1–`columns`. Default = full width |
| | `spanSm` | span below `lg` (sidebar-collapse / narrow) — optional |
| | `start` | 1-based start column |

Uneven splits are just different spans — `8`+`4`, `3`+`3`+`6`, `5`+`4`+`3`.
Every item has `min-width: 0` so its content can shrink (text truncation, tables).

## `Grid` vs `Stack columns`

- **`Stack direction="row" columns`** — quick, equal-width row. No column math.
- **`Grid`** — when widths are uneven, must line up across rows, or you want a
  consistent 12-col rhythm across the whole page.

## Column widths (1440 design width, `space/16` gutter)

| | sidebar 64 (`Page.Body` inner 1316) | sidebar 240 (inner 1140) |
|---|---|---|
| **1 col** | 95 | 80 |
| span 3 | 317 | 273 |
| span 4 | 428 | 369 |
| span 5 | 539 | 466 |
| span 6 | 650 | 562 |
| span 8 | 872 | 755 |

## Figma

`Content grid — layout guide` — `sidebar=collapsed | expanded`, showing the 12
columns and example span layouts (4·4·4, 8·4, 3·3·6, 5·4·3) with pixel widths.
A guide — screen frames lay their content on this grid.
