# LineChart

A line chart with an optional area fill — one smooth line per series. **L1
primitive.** Built following the `dataviz` skill's procedure — form, then
color (validated, reuses `BarChart`'s already-validated palette), then
marks, then interaction, then accessibility.

```tsx
<LineChart
  data={[
    { category: 'Mon', values: { cost: 1180 } },
    { category: 'Tue', values: { cost: 1220 } },
    // …
  ]}
  series={[{ key: 'cost', label: 'Fuel cost', color: 'var(--color-chart-1)' }]}
  valueFormatter={(v) => `€${v.toLocaleString()}`}
  aria-label="Fuel cost by day, last 7 days"
/>
```

| prop | values | default |
|---|---|---|
| `data` | `{ category, values: Record<string, number> }[]` | — |
| `series` | `{ key, label, color }[]` | — |
| `area` | `boolean` — fills under the line(s) | `true` for 1 series, `false` for 2+ |
| `height` | `number` — total SVG height in px, **includes the x-axis label band**. Omit to fill whatever height the container gives it | fills container |
| `valueFormatter` | `(value: number) => string` | `String(v)` |
| `aria-label` | `string` — overall chart description for assistive tech | generic fallback |

`color` on each series is any CSS color value — pass a token var. Shares
`BarChart`'s already-validated categorical palette (`color.chart.1` /
`color.background.warning-strong`), so no new validation pass was needed for
the single-series "Fuel cost" example.

## Non-zero baseline — a deliberate difference from BarChart

`BarChart`'s filled bars must start at 0 — a shorter bar reads as "less,"
and that only holds if every bar starts from the same zero baseline. A
line's mark is its *position*, not a filled magnitude, so `LineChart` scales
its y-axis to the data's own rounded min/max (via `niceScaleRange`, not
`BarChart`'s zero-based `niceScale`) — cramming a trend that moves within a
narrow band down near a flat line at the bottom of a from-zero axis would
make the trend unreadable. The area fill (`.area`, 10% opacity) is a soft
visual glow reinforcing the line, not a from-zero magnitude encoding — it
fills down to the plot's own bottom edge, whatever value that happens to be,
matching the Figma reference exactly. Documented here so a from-zero
assumption carried over from `BarChart` doesn't read as a bug.

## Marks (per the skill's mark specs)

- **2px line**, round caps/joins, one per series.
- **>=8px hover/focus markers** (`r=4` circles, i.e. 8px diameter) — the
  floor the skill sets for point markers.
- Gridlines: 1px hairline, `color.border.subtle`, solid, recessive.
- No inline value labels — values surface via the hover/focus tooltip and
  the axis ticks, not printed on the chart.

## Interaction — mandatory for line/area, per the skill

Unlike a bar (whose column *is* the mark you point at), a line has no area
to land a pointer on at an arbitrary x position other than the hairline
itself — so the skill requires a crosshair + tooltip by default, not as an
enhancement. Hover **or** keyboard focus on a category's hit target (the
full plot-height column, same discrete-per-category model as `BarChart` —
chosen for consistency between the two charts' keyboard nav, rather than
continuous pointer tracking) shows: a vertical crosshair at that x, an
8px marker per series at its line's y, and one tooltip listing every
series' value at that category.

## Accessibility

- Each category hit target: `role="img"`, `tabIndex={0}`,
  `aria-label="Mon: Fuel cost €1,180"` — the same information the tooltip
  shows, reachable without hovering.
- A **visually-hidden `<table>`** mirrors the full dataset, identical
  pattern to `BarChart`'s table-view twin.
- No legend by default for the single-series case (2+ series still get one
  — pass `legend` on `ChartCard` as usual — the skill's "legend always
  present for >=2 series" rule is unchanged from `BarChart`).

## Shared with BarChart

`useContainerSize` (`src/lib/useContainerSize.ts`) and the axis-tick helpers
(`src/lib/niceScale.ts`, home to both `niceScale` and this file's
`niceScaleRange`) moved out of `BarChart`'s own folder into `src/lib` when
this component was built, since both charts need the same
container-measurement and clean-tick-rounding logic. `BarChart`'s imports
were updated to the shared location; no behavior changed there.

## Not built yet

Multi-series overlapping lines render correctly, but `area` defaults off
for 2+ series specifically because *stacked/overlapping* area fills (as
opposed to the single clean line each) aren't designed yet — a consumer can
still force `area` on for 2+ series, but two overlapping 10%-opacity fills
reading as a third, muddier color where they intersect is a known rough
edge, not a considered design.
