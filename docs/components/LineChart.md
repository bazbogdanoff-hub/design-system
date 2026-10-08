# LineChart

A line chart with an optional area fill - one smooth line per series. **L1
primitive.** Built following the `dataviz` skill's procedure - form, then
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
| `data` | `{ category, values: Record<string, number> }[]` | - |
| `series` | `{ key, label, color }[]` | - |
| `area` | `boolean` - fills under the line(s) | `true` for 1 series, `false` for 2+ |
| `height` | `number` - total SVG height in px, **includes the x-axis label band**. Omit to fill whatever height the container gives it. When set, the wrapper takes it too, so a parent can place the chart (e.g. `ChartCard bodyAlign="end"`) instead of it filling the space | fills container |
| `valueFormatter` | `(value: number) => string` | `String(v)` |
| `reference` | `{ value, label }` - a goal drawn as a dashed line, labelled at its left end, listed in the tooltip; the y-range always takes it in | - |
| `onSelect` | `(index: number) => void` - makes each category's column a button (click, Enter, Space); a selectable column washes on hover | - |
| `aria-label` | `string` - overall chart description for assistive tech | generic fallback |

`color` on each series is any CSS color value - pass a token var. Shares
`BarChart`'s already-validated categorical palette (`color.chart.1` /
`color.background.warning-strong`), so no new validation pass was needed for
the single-series "Fuel cost" example.

## Non-zero baseline - a deliberate difference from BarChart

`BarChart`'s filled bars must start at 0 - a shorter bar reads as "less,"
and that only holds if every bar starts from the same zero baseline. A
line's mark is its *position*, not a filled magnitude, so `LineChart` scales
its y-axis to the data's own rounded min/max (via `niceScaleRange`, not
`BarChart`'s zero-based `niceScale`) - cramming a trend that moves within a
narrow band down near a flat line at the bottom of a from-zero axis would
make the trend unreadable. The area fill (`.area`, 10% opacity) is a soft
visual glow reinforcing the line, not a from-zero magnitude encoding - it
fills down to the plot's own bottom edge, whatever value that happens to be,
matching the Figma reference exactly. Documented here so a from-zero
assumption carried over from `BarChart` doesn't read as a bug.

## Marks (per the skill's mark specs)

- **A 2.5px glass line** (owner, 2026-09-30), round caps/joins, one per
  series: a 0.5px catch of light on top (the series colour mixed with white,
  as the chart marks' catch), the 1.5px line, and a 0.5px vignette below (mixed
  with black, as their inner shadow). Drawn as three strokes; the catch and
  vignette are offset along the curve's **normal** (`offsetPath`, the curve
  sampled per segment), not straight up and down - a vertical shift thins to
  nothing on steep segments.
- **>=8px hover/focus markers** (`r=4` circles, i.e. 8px diameter) - the
  floor the skill sets for point markers.
- Gridlines: 1px hairline, `color.border.default` (subtle vanished on the
  #f6f6f8 card), solid, recessive.
- The `reference` goal: 1.5px dashed `color.border.strong`, its label at the
  left end - a trend heads toward its goal, so the start is where the line is
  furthest from it and the label stays clear.
- X labels thin themselves when they would collide: every n-th is drawn,
  counted back from the last so the latest category is always named, the
  end labels anchored inward. The tooltip and the table still carry every
  category.
- No inline value labels - values surface via the hover/focus tooltip and
  the axis ticks, not printed on the chart.

## Interaction - mandatory for line/area, per the skill

Unlike a bar (whose column *is* the mark you point at), a line has no area
to land a pointer on at an arbitrary x position other than the hairline
itself - so the skill requires a crosshair + tooltip by default, not as an
enhancement. Hover **or** keyboard focus on a category's hit target (the
full plot-height column, same discrete-per-category model as `BarChart` -
chosen for consistency between the two charts' keyboard nav, rather than
continuous pointer tracking) shows: a vertical crosshair **on the category's vertex**, an 8px marker
per series on its point, and one tooltip listing every series' value at
that category (and the `reference`, when set). The marker used to sit at
the column's centre - off the point, so the dot and the tooltip disagreed;
since 2026-09-30 everything sits on the vertex, the x labels too. The
tooltip stays on one line and opens inward near either end of the chart.

**Touch** (owner, 2026-10-08; `lib/touchScrub.ts`): drag to read, tap to
open. A finger sliding sideways moves the crosshair and tooltip with it and
they clear when it lifts; a drag never fires `onSelect`. Up or down still
scrolls the page (`touch-action: pan-y`). A tap fires `onSelect` and shows no
tooltip; focus shows one only from the keyboard.

The curve's control points are held between the two points they join
(2026-10-08), so a sharp dip never overshoots below its lowest value into
the axis. The value labels' column fits its longest label, at most 48.

An empty `data` (still loading) draws an empty frame rather than throwing.

## Accessibility

- Each category hit target: `role="img"` (`role="button"` with `onSelect`), `tabIndex={0}`,
  `aria-label="Mon: Fuel cost €1,180"` - the same information the tooltip
  shows, reachable without hovering.
- A **visually-hidden `<table>`** mirrors the full dataset, identical
  pattern to `BarChart`'s table-view twin. It is hidden inside a clipped
  `div`, not on the table itself: a table won't shrink below its rows, and a
  "1px" table still stretched the page's scroll height (a 26-row table added
  ~700px of empty scroll to the dashboard).
- No legend by default for the single-series case (2+ series still get one -
  pass `legend` on `ChartCard` as usual - the skill's "legend always
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
opposed to the single clean line each) aren't designed yet - a consumer can
still force `area` on for 2+ series, but two overlapping 10%-opacity fills
reading as a third, muddier color where they intersect is a known rough
edge, not a considered design.
