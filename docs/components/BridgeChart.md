# BridgeChart

A profit bridge drawn as statement rows: one row per line, a floating bar on
one value scale, the amount on the right, and the comparison period as a
recessed band behind each bar. **L1 primitive.** Built in code first (owner,
2026-10-05) for the Finance dashboard's "Where the money went" and Truck
profit; the Figma master follows from this page. The money sibling of
[`TimelineChart`](./TimelineChart.md): the same rows, glass bars and band.

```tsx
<BridgeChart
  rows={[
    { key: 'rev', label: 'Revenue', from: 0, to: 51500, tone: 'total', value: '€51.5k',
      compare: { from: 0, to: 66100 } },
    { key: 'fuel', label: 'Fuel', from: 51500, to: 38900, tone: 'cost', value: '€12.6k',
      compare: { from: 66100, to: 52200 }, onSelect: () => openFuel() },
    // ...
    { key: 'profit', label: 'Profit', from: 0, to: 5000, tone: 'gain', value: '€5.0k' },
  ]}
  valueFormatter={(v) => `€${Math.round(v / 1000)}k`}
  periodLabel="September"
  compareLabel="August"
  aria-label="September: revenue, each cost line and profit, against August"
/>
```

| prop | values | default |
|---|---|---|
| `rows` | `BridgeRow[]` - see below | - |
| `valueFormatter` | `(v: number) => string` - axis ticks and tooltip amounts | rounded number |
| `periodLabel` / `compareLabel` | tooltip names of the two periods | "This period" / "Last period" |
| `aria-label` | `string` | - |

`BridgeRow`: `key`, `label`, `from`, `to` (the bar's ends on the scale; either
may be negative), `tone`, `value` (the amount, formatted), `compare?`
(`{ from, to }`, the band), `details?` (extra tooltip lines, e.g. per km and
share of revenue), `onSelect?` (makes the row a button).

## Two uses

- **Bridge:** Revenue from 0; each cost from the running total down by its
  amount; Profit from 0 to what is left. A loss month draws Profit left of
  0 in `loss`.
- **Ranked:** every bar from 0, profit right in `gain`, loss left in `loss`
  (Truck profit, worst first).

## Anatomy

- **Three columns** shared by the axis row and every line: a 7.5rem label,
  the track, a 5.5rem amount. Rows 2.25rem.
- **Axis:** 4 to 8 round ticks (steps of 1, 2, 2.5 or 5 per power of ten)
  over one scale that always holds 0, the tightest fit to the data: the
  shared `niceScaleRange` rounded €151k up to €200k. With negatives, the zero gridline is
  `border.strong`; the others `border.default`.
- **Band:** 1.25rem, `bridgeChart.compare` (the TimelineChart window's grey,
  its own token).
- **Bar:** 0.75rem, the glass recipe at the pill's weight. Grows in from the
  end it starts at (a cost from the right); reduced motion: off.
- **Amount:** `text/label/sm`, `color.text.default`, tabular figures, right
  aligned.
- **Tick labels** (2026-10-08): as close as they fit, from the axis's
  measured width (a label needs about 3.5rem); zero always keeps its own,
  and the gridlines stay at every tick.
- **Phone** (owner, 2026-10-08): each line one block, a divider between
  lines. The label and the amount share a line, the bar the full width under
  them. No axis and no gridlines: the amount carries the number. Every bar
  (and the last period's band) starts at the left, as zero, its length its
  amount; a loss's amount is `color.text.danger`, a gain's
  `color.text.success`.

## Colour (owner, 2026-10-05; validated)

| tone | token | primitive |
|---|---|---|
| `total` | `bridgeChart.total` → `chart.total` | `brand.600` |
| `cost` | `bridgeChart.cost` → `chart.1` | `brand.400` |
| `gain` | `bridgeChart.gain` → `chart.gain` | `emerald.500` |
| `loss` | `bridgeChart.loss` → `chart.loss` | `rose.600` |

Costs are a lighter step of the total, as the owner asked. The first try
(costs `brand.300` or `.200` under a `brand.400` total) failed the dataviz
validator: normal-vision ΔE 11.8, below 15. `brand.600` total with
`brand.400` costs passes every check on the card (ΔE 18.4). Contrast below
3:1 against the card is met by the always-visible amount column.

## Tooltip and accessibility

Hover or focus: this period, the comparison and any `details`. Rows with
`onSelect` are buttons named by their label and those figures. A
screen-reader table in a clipped `div` lists every line.
