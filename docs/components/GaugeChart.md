# GaugeChart

A half-ring gauge - the donut's glass opened into an arc from nine o'clock
over the top to three. **L1 primitive.** Built in code first (owner,
2026-09-30) for the dashboard's fleet health; the Figma master follows from
this page.

```tsx
<GaugeChart
  data={[
    { key: 'clear', label: 'Clear', value: 54, color: 'var(--color-chart-severity-low)' },
    { key: 'attention', label: 'Attention', value: 3, color: 'var(--color-chart-severity-attention)' },
    { key: 'warning', label: 'Warning', value: 2, color: 'var(--color-chart-severity-warning)' },
    { key: 'critical', label: 'Critical', value: 1, color: 'var(--color-chart-severity-critical)' },
  ]}
  value="95%"
  caption="fit to run · 57 / 60"
  onSelect={(key) => openBand(key)}
  aria-label="Trucks, trailers and drivers by their worst open problem"
/>
```

| prop | values | default |
|---|---|---|
| `data` | `{ key, label, value, color }[]` - segments left to right; zero values skipped | - |
| `value` | `ReactNode` - the headline in the bowl | - |
| `caption` | `ReactNode` - under the headline | - |
| `onSelect` | `(key) => void` - makes each segment a button | - |
| `valueFormatter` | `(value) => string` | `String(v)` |
| `legend` | `boolean` - segment names under the arc, in the legend tile | `true` |
| `aria-label` | `string` | - |

## Geometry (all at the 16px root, scaling with it)

- **Band** 28px - thicker than the donut's 24, thin enough that the bowl
  holds the headline (48 → 32 → 28, owner).
- **Arc** the widest half ring that fits, up to a 100px outer radius.
- **Segments** are filled ring sectors with 6px rounded corners and a 4px
  gap, **not** round-capped strokes: at this thickness a round cap swells a
  one-in-sixty segment into a blob a quarter of the arc long.
- **Minimum segment** 16px of arc, borrowed from the largest: one in sixty
  is ~6px - less than its own corners - and collapses into a splinter. The
  exact values stay in the legend and on hover.

## Glass

The donut's `GlassFilter`, its catch at half the donut's (~1px at 28px).

## Text

Headline `heading.xl` (28) - one step under the donut's `display.md`; the
bowl is smaller than the donut's middle. Caption `label.sm`, subtle.

## Interaction

Hover or focus dims the other segments and puts that segment's value and
name in the bowl. The legend names the segments only; values live on hover
and in the screen-reader table.
