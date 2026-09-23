# RouteTrack

A route as one wide band: pinned stops joined by segments, the travelled part
filled, and a vehicle marker riding the head of the fill. Built from Figma's
`RouteCard` (`10746:21164`) — specifically its `Point` / `Circle part` /
`Line part` / `Truck pointer` internals, which have no separate code
equivalents and are not exported.

## API

```tsx
<RouteTrack
  stops={[{ place: 'Portland', process: 'Loaded' }, { place: 'Sumas', process: 'Delivery' }]}
  progress={0.5}
  aria-label="Route of SH-1042"
/>
```

| prop | type | default | notes |
|---|---|---|---|
| `stops` | `RouteTrackStop[]` | — | two or more; one stop isn't a route |
| `progress` | `number` | — | `0`–`1` across the whole route, clamped |
| `hideVehicle` | `boolean` | `false` | for a route not yet started, or finished |
| `aria-label` / `aria-labelledby` | `string` | — | **one is required** |

```ts
interface RouteTrackStop {
  id?: string;        // React key; falls back to the index
  place: ReactNode;   // where — the bold line
  process?: ReactNode; // what happens there — the quiet line
  icon?: ReactNode;   // overrides the default MapPin
}
```

`className`, `style`, `...divProps` pass through to the root.

## Geometry

**Stops are evenly spaced.** With four stops the second sits at `0.333`, not
wherever it falls on the real map. `progress` is distance along the whole
route, and the component derives which segment the vehicle is in and how far
across it. A stop counts as *reached* once the vehicle is at or past it, which
is why the origin is filled the moment a trip starts.

The band **scrolls horizontally rather than compressing** — stops keep their
label widths and a long route runs off the edge. Deliberately not
`ScrollableArea`, which is `overflow-y` only and owns a recessed background
this band doesn't want.

## Appearance

Every surface is the `Button` treatment, which is what Figma authored — not a
liberty taken in code:

| part | tokens |
|---|---|
| reached pin, filled segment, marker | `color.button.primary.{background,border,icon}.default` + the `#6570e1` vignette |
| unreached pin, empty segment | `color.button.secondary.{background,border,icon}.default` + the `#f0f0f0` vignette |
| `place` | `text.body.xs` / `color.text.strong` |
| `process` | `text.body.2xs` / `color.text.subtle` |

Drawing dimensions are raw px because they are sizes, not spacing: the pin is
a 36px circle around a 16px icon, the segment bar is 14px tall, and the marker
overlaps the band by 8px. Gaps between siblings are `space.*`.

## Not these

- **`TableProgressStages`** — the same idea shrunk into a table cell: bare
  dots, no labels, whole segments only, no marker. It stays as it is.
- **`ProgressBar`** — a continuous 0–100% readout with no named places.

## Known gaps

- **Two stop states, not four.** Figma's `Circle part` offers `Active` and
  `default` only, so *passed* and *current* look identical, as do *next* and
  *far off*. If the four-state model is wanted, it's a Figma change first.
- **`Circle part`'s variant value is `Active`, capitalised.** The convention
  is lowercase-kebab. Renaming it is a Figma-side fix.
- **`RouteCard` has no component properties in Figma**, so the frame is a
  single frozen example — it can't show a second progress value or an empty
  route.
