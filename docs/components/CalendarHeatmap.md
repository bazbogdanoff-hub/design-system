# CalendarHeatmap

Counts per day across the coming weeks — a day's glass fuller the more
falls on it, empty days recessed. **L1 primitive.** Built in code first
(owner, 2026-09-30) for the dashboard's document expiries; the Figma master
follows from this page. Its companion `CalendarHeatmapLead` holds what has
already fallen off the calendar.

```tsx
<ChartCard
  title="Document expiries"
  titleAccessory={<CalendarHeatmapLead label="Lapsed" count={8} onSelect={openLapsed} unit={['document', 'documents']} />}
>
  <CalendarHeatmap
    days={[{ date: '2026-10-07', count: 2 }]}
    weeks={5}
    layout="calendar"
    onSelect={(date) => openDay(date)}
    unit={['document', 'documents']}
    detail={(date) => rowsFor(date)}
    aria-label="Documents expiring per day over the next 5 weeks"
  />
</ChartCard>
```

| prop | values | default |
|---|---|---|
| `days` | `{ date: 'YYYY-MM-DD', count }[]` — days not listed count 0 | — |
| `start` | `Date` — first day shown; earlier days of its week stay blank | today |
| `weeks` | `number` — weeks shown, Monday to Sunday | `12` |
| `layout` | `strip` — weeks as columns, weekdays down the side (a long look ahead in little room) · `calendar` — weeks as rows under the weekdays, each square large enough for its day number | `strip` |
| `onSelect` | `(date) => void` — makes a day with a count a button | — |
| `unit` | `[singular, plural]` | `['item', 'items']` |
| `detail` | `(date) => ChartTooltipRow[]` — extra tooltip rows, e.g. which documents | — |
| `aria-label` | `string` | — |

`CalendarHeatmapLead`: `label` (not drawn — names the square for screen
readers and on hover), `count`, `onSelect?`, `unit?`. A 1.25rem square in
the danger glass holding the count; recessed and quiet at 0. It sits in the
card header (`ChartCard titleAccessory`), not in the plot.

## Levels

Three steps, not four (owner, 2026-09-30): 1, 2, then 3 or more. The fill
mixes `color.chart.1` into `color.chart.window` — 58%, 75%, 100% — the middle
a touch lighter than halfway so the three read evenly apart. The shadows
step down with the fill: at full strength a drop shadow outweighs a pale
tint, the muddy look. The palest step's inner shadow is a darker step of its
own colour, not a mix with black, so a clean tint stays clean.

## Today

Dressed as a `Tile` — the task card's white glass, lifted where every other
empty day is sunk. A today that has a count keeps its fill and takes only
the tile's drop shadow. (A brand outline was tried first and read as out of
place.)

## Strip layout

One grid holds the weekday labels, the month row and a column per week;
each week is a subgrid of the seven day rows, so the squares size the rows
and the rows line up with their labels. A week belongs to the month its
Thursday falls in (the ISO rule): each month is named once, over a line
running the length of its weeks — the gap between two lines is where one
month ends.

## Calendar layout

Weekdays across, weeks down; squares carry their day number (the first of a
month reads "1 Oct"). On a fill the number is white with a soft shadow in a
darker step of the cell's own colour.

## Footer

The Fewer … More scale in the legend frame every chart uses
(`ChartLegendGroup`'s tile), full width, content set to the right.

## Accessibility

Every day is labelled ("Wed 7 Oct: 2 documents"); selectable days are
buttons. The tooltip lists the count and any `detail` rows.
