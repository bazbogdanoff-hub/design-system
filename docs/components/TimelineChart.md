# TimelineChart

Trips across time - one row per item, a glass bar from its start to its end
over a recessed band for its window, a "now" line through every row. **L1
primitive.** Built in code first (owner, 2026-09-30) for the dashboard's
"Today's trips"; the Figma master follows from this page.

```tsx
<TimelineChart
  items={[
    {
      key: id,
      label: 'SH-1046',
      sublabel: 'Wrocław → Łódź',
      start: pickupWindowStart,
      end: eta,
      window: { start: deliveryWindowStart, end: deliveryWindowEnd },
      tone: 'default',
      onSelect: () => navigate(`/fleet/shipments/${id}`),
    },
  ]}
  aria-label="Today's trips: pickup to ETA against each delivery window"
/>
```

| prop | values | default |
|---|---|---|
| `items` | `TimelineItem[]` - see below | - |
| `range` | `{ start, end }` - the visible span | every item's times, padded to whole hours |
| `now` | `Date` - where the "now" line sits | the current time |
| `timeFormatter` | `(d: Date) => string` - axis and tooltip times | 24-hour `HH:mm` |
| `aria-label` | `string` | - |

`TimelineItem`: `key`, `label`, `sublabel?`, `start`, `end`, `window?`,
`tone?` (`default` on its way · `danger` will miss its window · `pending`
not departed yet, paler), `onSelect?` (makes the row a button).

## Anatomy

- **Two columns** shared by the axis row and every trip row: a 10rem label
  column and the track, so ticks line up with bars.
- **Axis** - a tick every 3 hours (6 when the span is over 30 h), on whole
  hours. A tick close to "now" keeps its gridline but drops its label, so the
  "Now" flag never sits on it; "close" is 30% of the tick spacing, not a
  fixed hour (a 6-hour axis on a narrow card still collided at 1.3 h).
- **Midnights** inside the span get a dashed line and the weekday ("Thu").
- **Now** - a 2px brand line through every row, its flag on the axis.
- **Window** - a 1.25rem recessed band, `color.chart.window` (a step darker
  than `surface.recessed`; the recessed grey vanished as the tooltip's
  swatch on white).
- **Bar** - 0.75rem, the glass pattern (`src/glass.css`) at the pill's
  weight; `danger` wears `color.chart.severity.critical`, `pending` is at
  45% opacity. Grows in from its start on mount (reduced motion: off).

## Phone

On the `phone` tier (owner, 2026-10-05) the label column moves above the
bar, so the track takes the whole width: one caption line, "code · route"
(the sublabel gets a " · " in front), then a 1.25rem track. The caption
wears the card's fill, so gridlines and the "now" line pass behind it, not
through the text. Desktop and tablet are unchanged. How many rows to show
is the caller's: the dashboard lists 5 on phone, late first, with a link
to the rest.

## Tooltip

On hover or focus: Pickup, ETA and Window, each on one line. Times off today
carry their weekday ("Thu 11:48"); a window names its day once ("Thu
09:48–13:48"). Opens inward near either end of the track.

## Drawn in HTML, not SVG

So the glass is the same CSS recipe as the progress pill - no SVG filters
to rasterise.

## Accessibility

Rows with `onSelect` are buttons whose name carries the label, pickup, ETA,
window and "will miss its window" when late. A screen-reader table (hidden
in a clipped `div`, see `LineChart.md`) lists every trip.
