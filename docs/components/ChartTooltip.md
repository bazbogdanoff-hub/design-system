# ChartTooltip

Hover/focus readout for a chart. **L1 primitive** — a presentational box;
the chart owns positioning and hover/focus state.

```tsx
<ChartTooltip
  title="Mon"
  rows={[
    { key: 'atRisk', label: 'At risk', value: '3', color: 'var(--color-background-warning-strong)' },
    { key: 'onTrack', label: 'On track', value: '18', color: 'var(--color-chart-1)' },
  ]}
  style={{ left: '20%', top: '10%', transform: 'translate(-50%, calc(-100% - 8px))' }}
/>
```

| prop | values | default |
|---|---|---|
| `title` | `string` — the hovered category | — |
| `rows` | `{ key, label, value, color }[]` — `value` is pre-formatted by the caller | — |
| `style` | `CSSProperties` — positioning, set by the chart | — |

**Every series at once** — one tooltip lists every series at the hovered
category, so the pointer never has to land precisely on a segment/line.
**Value leads** (`Strong`, high-contrast), **label follows** (secondary) —
the legend's hierarchy inverted, since here the reader already has the
category and wants the numbers. Rows key their series with a short **line**,
not a filled box (a box at tooltip density is data-weight ink doing a
label's job — the legend still uses a rect).

`role="tooltip"`, `pointer-events: none` (never blocks the hover target
under it). No token exists yet for a floating-surface elevation shadow —
hand-tuned for now, same pattern as Button's glass shadow.
