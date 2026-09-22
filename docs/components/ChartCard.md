# ChartCard

The card shell every chart sits in — title + legend + filters/action on
**one header row**, chart body below. **L2 pattern** — composes
[`Card`](./Card.md) (`padding="md"`, never detached).

```tsx
<ChartCard
  title="Deliveries"
  legend={[
    { key: 'onTrack', label: 'On track', color: 'var(--color-chart-1)' },
    { key: 'atRisk', label: 'At risk', color: 'var(--color-background-warning-strong)' },
  ]}
  filters={<Filter size="sm" showCaret leadingIcon={<CalendarIcon/>}>Last 7 days</Filter>}
  action={<IconButton variant="secondary" size="sm" aria-label="Expand chart" icon={<ExpandIcon/>} />}
>
  <BarChart data={data} series={series} />
</ChartCard>
```

| prop | type | notes |
|---|---|---|
| `title` | `ReactNode` | card heading, `text/heading/md` |
| `legend` | `ChartLegendItem[]` — optional | renders a `ChartLegend` on the same header row; omit for a single-series chart |
| `filters` | `ReactNode` — optional | `Filter` instance(s), grouped with `action` at the header's right edge |
| `action` | `ReactNode` — optional | a single trailing icon action next to the filters — e.g. an expand/"view full chart" `IconButton` |
| `children` | `ReactNode` | the chart itself — `BarChart`, or any future chart type |

`className`, `style`, `...divProps` pass through to the `Card` root.

## Per-chart filters — a deliberate exception

The dataviz skill's own guidance is "filters live in one shared row above
all charts, never inside a chart card." This component intentionally does
the opposite, matching the reference mockups: each chart scopes its own
date-range/dimension independently (a "Deliveries" card and a "Fuel cost"
card can show different countries at once). Noted here so it doesn't read
as an oversight of the skill's advice — it's a conscious per-product choice,
not a mistake.

## Anatomy

```
Card (padding md, height: 100%, flex column, box-sizing border-box)
└─ div.header  (row, space-between, gap space/16 — never wraps)
│  ├─ h3.title        — {title}
│  ├─ div.legendRow   — <ChartLegend/> (flex:1, centered in the free space)
│  └─ div.trailing
│     ├─ div.filters  — {filters}
│     └─ {action}
└─ div.body (flex: 1, min-height: 0) — {children}
```

Header uses `justify-content: space-between` so the gaps between title,
legend, and filters are automatic (no fixed middle padding). Legend stays
on that same row at every card width — no container-query wrap.

## Sizing

The card root takes `height: 100%` and `.body` takes `flex: 1; min-height: 0`
so the chart body stretches to fill whatever height the card is given by its
own container — the header row keeps its natural height, the chart gets the
rest. This only produces a real (non-zero) height if something above
`ChartCard` actually constrains it (a fixed-height wrapper, a grid cell,
`style={{ height }}`) — an unconstrained `ChartCard` collapses to its
header's height. See [`BarChart`'s responsive sizing
notes](./BarChart.md#responsive-sizing) for how the chart itself measures
and fills that space.
