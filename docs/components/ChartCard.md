# ChartCard

The card shell every chart sits in — title + filters/action on one row, the
chart body below. The legend gets its own right-aligned row unless the card
is wide enough to hold everything together (see [Legend
breakpoint](#legend-breakpoint)). **L2 pattern** — composes
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
| `legend` | `ChartLegendItem[]` — optional | renders a `ChartLegend`; omit for a single-series chart |
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
Card (padding md, height: 100%, flex column)
└─ div.header  (row, wrap, gap space/16, container-type: inline-size)
│  ├─ h3.title       (order 1) — {title}
│  ├─ div.legendRow  (order 3 narrow / 2 wide) — <ChartLegend/>
│  └─ div.trailing   (order 2 narrow / 3 wide, margin-left: auto)
│     ├─ div.filters (row, gap space/12) — {filters}
│     └─ {action}
└─ div.body (flex: 1, min-height: 0) — {children}
```

## Legend breakpoint

Below the fold, `.legendRow` carries `flex: 1 0 100%` — claiming the full
row width forces it onto its own fresh line no matter how much room
`title`/`trailing` leave behind, and its own `justify-content: flex-end`
right-aligns the legend on that line. `.header`'s `container-type:
inline-size` (set on `.card`) lets a `@container (min-width: 480px)` query
drop that `flex-basis` and reorder `.legendRow` back in between `title` and
`trailing`, so the legend rejoins the header row once the **card itself**
(not the viewport) is wide enough to hold title + legend + filters/action
together comfortably. A card in a narrow dashboard column stays stacked
even on a wide screen; the same card full-width on a report page joins the
row — it's a property of the card's own size, not a page-level breakpoint.

## Sizing

The card root takes `height: 100%` and `.body` takes `flex: 1; min-height: 0`
so the chart body stretches to fill whatever height the card is given by its
own container — the header/legend/filters row keeps its natural height, the
chart gets the rest. This only produces a real (non-zero) height if
something above `ChartCard` actually constrains it (a fixed-height wrapper,
a grid cell, `style={{ height }}`) — an unconstrained `ChartCard` collapses
to its header's height. See [`BarChart`'s responsive sizing
notes](./BarChart.md#responsive-sizing) for how the chart itself measures
and fills that space.
