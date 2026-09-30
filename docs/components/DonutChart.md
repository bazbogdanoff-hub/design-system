# DonutChart

A part-of-a-whole ring — slices of one total, the total in the middle.
**L1 primitive.** Built in code first (owner, 2026-09-29); this page is what
the Figma master is built from. (Written 2026-09-30: the component's source
pointed here before the page existed.)

```tsx
<DonutChart
  data={[
    { key: 'critical', label: 'Critical', value: 2, color: 'var(--color-chart-severity-critical)' },
    { key: 'warning', label: 'Warning', value: 3, color: 'var(--color-chart-severity-warning)' },
  ]}
  caption="due today"
  emptyCaption="nothing due"
  aria-label="Open tasks due today, by severity"
/>
```

| prop | values | default |
|---|---|---|
| `data` | `{ key, label, value, color }[]` — clockwise from the top; zero values skipped | — |
| `caption` | `ReactNode` — under the total | — |
| `emptyCaption` | `ReactNode` — shown when every value is 0 | `caption` |
| `valueFormatter` | `(value) => string` | `String(v)` |
| `aria-label` | `string` | — |

## Marks

- Ring 24px thick at the 16px root (owner: 24, down from 14% of the size),
  scaling with the root. Every slice is its own round-capped block with a
  3px gap each side.
- The glass recipe (`lib/glassFilter.tsx`), as `BarChart`'s blocks: the catch
  scales with the ring (8% of its thickness, 2–3px — a 1px catch on a thick
  ring reads as clay) and the inner shadow by thickness / 16.
- The ring is rotated −90° to start at twelve, so `GlassFilter` gets
  `frameRotation={-90}` — its offsets turn back so the light still falls from
  the top left.
- Empty: a flat recessed ring.

## Interaction

Hovering or focusing a slice dims the others and puts that slice's value and
name in the middle — no floating tooltip. Pair with `ChartLegend` /
`ChartLegendGroup` for identity; a screen-reader table carries the values.

## Sizing

Fills its container; the ring is the largest square that fits.
