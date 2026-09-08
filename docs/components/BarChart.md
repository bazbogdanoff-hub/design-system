# BarChart

A stacked bar chart. **L1 primitive.** Built following the `dataviz` skill's
procedure — form, then color (validated), then marks, then interaction, then
accessibility.

```tsx
<BarChart
  data={[
    { category: 'Mon', values: { onTrack: 18, atRisk: 3 } },
    { category: 'Tue', values: { onTrack: 14, atRisk: 2 } },
    // …
  ]}
  series={[
    { key: 'onTrack', label: 'On track', color: 'var(--color-chart-1)' },
    { key: 'atRisk', label: 'At risk', color: 'var(--color-background-warning-strong)' },
  ]}
  aria-label="Deliveries by day, on track vs at risk, last 7 days"
/>
```

| prop | values | default |
|---|---|---|
| `data` | `{ category, values: Record<string, number> }[]` | — |
| `series` | `{ key, label, color }[]` — stacking order, **bottom to top** | — |
| `height` | `number` — total SVG height in px, **includes the x-axis label band**. Omit to fill whatever height the container gives it (the usual case — put `BarChart` in a sized flex/grid area, e.g. `ChartCard`'s body) | fills container |
| `valueFormatter` | `(value: number) => string` | `String(v)` |
| `aria-label` | `string` — overall chart description for assistive tech | generic fallback |

`color` on each series is any CSS color value — pass a token var. No color
is hardcoded inside `BarChart`; it's a generic primitive, reusable for any
2+-series stacked bar.

## Colors used in the "Deliveries" example

`color.chart.1` (brand.500, the existing categorical placeholder — already
the right blue) for `onTrack`, `color.background.warning-strong` (orange.500,
already used by `SeverityBadge`'s `attention` level) for `atRisk`. Validated
with the dataviz skill's `validate_palette.js`: PASS on lightness band,
chroma floor, and CVD separation (ΔE 32.5); a contrast WARN on the orange
against the card surface (2.73:1, below 3:1) is satisfied by this chart
always showing visible axis/tooltip labels, never color-alone.

No new tokens needed — this is a status-style 2-value pairing (on-track vs.
at-risk), not a generic N-category series, so it reuses existing semantic
tokens directly rather than occupying a slot in the generic `color.chart.*`
categorical ramp (per the skill: status colors are reserved, never folded
into "series N").

## Marks (fixed, per the skill's mark specs)

- Bars **<=24px thick**, **4px rounded top corners on the outer (topmost)
  segment only** — the baseline stays square, matching "grows from a single
  baseline."
- **2px surface-color gap** between every stacked segment (removed from each
  non-topmost segment's own height, not drawn as a stroke).
- Gridlines: 1px hairline, `color.border.subtle`, solid, recessive.
- No inline value labels — matches the reference screenshot (an interior
  stacked segment has no free end to label anyway; the legend + tooltip
  carry the values, axis ticks carry the scale).

## Interaction

Hover **or** keyboard focus (same details either way) on a day's column —
the whole column is the hit target (bigger than the bars themselves, per the
skill), not each segment individually, because **one tooltip shows every
series** at that category rather than requiring the pointer to land on a
specific segment.

## Accessibility

- Each day-column hit target: `role="img"`, `tabIndex={0}`,
  `aria-label="Mon: On track 18, At risk 3"` — the same information the
  tooltip shows, reachable without hovering.
- A **visually-hidden `<table>`** (screen-reader only, `.srOnlyTable` —
  `clip`/`overflow`, never `display:none`) mirrors the full dataset: one row
  per category, one column per series. This is the "table view" the dataviz
  skill requires as every chart's accessibility twin.
- **Not yet built**: a *visible* table-view toggle button (the hidden table
  satisfies the accessibility requirement, but a sighted user currently has
  no UI to switch to a table). Flagged as a known gap, not blocking.

## Scale

Y-axis max/step picked by `niceScale()` (`src/lib/niceScale.ts` — shared with
[`LineChart`](./LineChart.md), which uses the same file's `niceScaleRange`
for its non-zero-baseline axis) — rounds the data max up to a clean step
(5/10/20/25/50…) rather than using the raw max, so gridlines land on round
numbers. Always zero-based here, since a bar's filled height must start at 0
to read as a magnitude — see `LineChart.md` for why its own scale doesn't.

## Responsive sizing

`useContainerSize` (`src/lib/useContainerSize.ts` — also shared with
`LineChart`) measures the wrapper's real rendered pixel size via
`ResizeObserver` and sets the
SVG's `width`/`height` attributes to match 1:1 — deliberately not a fixed
`viewBox` scaled via CSS `width:100%; height:auto`, which would scale text
along with the plot area and make axis labels illegible on a narrow card.
Text stays a constant size regardless of card width; only the plot geometry
(bar thickness, band width, gridline span) grows or shrinks.

For the container measurement to produce a real (non-zero) size, every
ancestor up to a fixed-size box needs an actual height — `BarChart`'s own
`.wrapper` stretches via `height: 100%`, `ChartCard`'s `.body` stretches via
`flex: 1; min-height: 0`, and `ChartCard`'s root takes `height: 100%` from
whatever sizes the card (e.g. a dashboard grid cell). Below `MIN_HEIGHT`
(140px, pre-measurement/degenerate-container fallback) the chart won't
shrink further — comfortably tested down to a 420×260 card, where the
chart body gets ~174px and header/legend/filters/bars stay clear of each
other with no overlap or clipping.

## Not built yet

Only the stacked variant exists — grouped (side-by-side) bars, a line-chart
sibling, and the visible table-view toggle are all follow-ups, not gaps in
this specific chart.
