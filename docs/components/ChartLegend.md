# ChartLegend

The identity channel for a chart with 2+ series — a swatch + label per
series, never color-alone. **L1 primitive.**

```tsx
<ChartLegend
  items={[
    { key: 'onTrack', label: 'On track', color: 'var(--color-chart-1)' },
    { key: 'atRisk', label: 'At risk', color: 'var(--color-background-warning-strong)' },
  ]}
/>
```

| prop | values | default |
|---|---|---|
| `items` | `{ key, label, color }[]` — `color` is any CSS color value, usually a token var | — |

A single-series chart needs no legend — the chart's title already says
what's plotted (per the dataviz skill). Swatch is a small rect (mirrors a
bar/area mark — a line chart's legend would use a short line instead, not
built yet). Label is `text/body/xs` (12px) on `color/text/strong` — sized
down from the general-purpose `text/body/sm` and darkened from
`color/text/default`, a deliberate legend-specific decision (dense, next to
a title that's already doing the heavy lifting) rather than the docs-wide
default for small text. Always plain text on a text token, never colored
itself; identity comes from the swatch beside it.
