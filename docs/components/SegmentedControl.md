# SegmentedControl

A track of mutually-exclusive options — "choose exactly one of N visible
choices" (e.g. List/Grid/Map). **L1** — Figma + React, both built this
session, replacing an old pre-token "Switch"/"Switch item" pair found
elsewhere in the file (see below).

```tsx
const [view, setView] = useState('list');

<SegmentedControl size="md">
  <SegmentedControlItem selected={view === 'list'} onClick={() => setView('list')}>
    List
  </SegmentedControlItem>
  <SegmentedControlItem selected={view === 'grid'} onClick={() => setView('grid')}>
    Grid
  </SegmentedControlItem>
  <SegmentedControlItem selected={view === 'map'} onClick={() => setView('map')}>
    Map
  </SegmentedControlItem>
</SegmentedControl>
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` \| `md` \| `lg` \| `xs` | `md` | same height scale as `Button` (`size.control.*`) — cascades to every `SegmentedControlItem` inside. `xs` is a distinct track recipe for the sidebar module switcher only |
| `collapsed` | `boolean` | | `xs`-only: the sidebar's own collapsed/expanded state — shrinks every item's height from 24 to 16. No effect at any other size |
| `children` | `ReactNode` — required | | `SegmentedControlItem`s |

Renders a real `<div role="radiogroup">`; each item is a real
`<button role="radio">` (see [SegmentedControlItem.md](./SegmentedControlItem.md)).

## `xs` — a different track entirely, not a 4th step on the same scale

`sm`/`md`/`lg` share one look: a recessed gray track (`space-2` padding,
`color.background.subtle`) with items floating on top. `xs` — built for the
sidebar's module switcher — is the opposite: transparent, no padding, no
track-level radius, a 1px item gap, each item carrying its own edge
rounding via `position` (see [SegmentedControlItem.md](./SegmentedControlItem.md#position)).
`collapsed` only exists at this size, for the same reason `Sidebar` and
`SidebarSection` both have their own `collapsed` axis — it's the mechanism
this whole component family uses for "smaller in the collapsed sidebar,"
not a separate size step.

## Why this replaces "Switch"/"Switch item," not `Switch`

The file already had an unrelated pre-token "Switch" (`6033:16788`) +
"Switch item" (`4227:6728`) pair — a 3-segment view-switcher used repeatedly
in old screen headers, built before this system's tokens existed (raw hex
fills, a legacy stroke/shadow "glass" treatment bound to variables from the
old shim collections, `ExtraBold`/`SemiBold` weight-swap for
selected/unselected). Inspected its structure (padding, radius, the "one
pill floats above a recessed track" shape) and rebuilt the same functional
pattern on this system's own tokens and sizes — but under new names,
**`SegmentedControl`/`SegmentedControlItem`**, because `Switch` already
means something else in this system (`10221:13885`, the boolean on/off
toggle) and reusing it here would collide. The old pair is left in place,
untouched — not a rename, a fresh replacement; nothing currently using the
old one was repointed.

## Sizing — `size.control`, not `size.input`

Uses the existing `size.control.{sm,md,lg}` (28/32/36px) — the same scale
`Button` uses, deliberately, since a view-switcher like this typically sits
in a toolbar next to `Button`/`Filter`, and should align with them at a
matching size step. `Input`'s own scale (`size.input.*`, resized up a step
in an earlier session) was not used here — the two scales are intentionally
independent (see `Input.md`).

## Figma

`SegmentedControl` (`10323:16996`) — 5 variants: `size`(sm/md/lg/xs) ×
`collapsed`(false/true, `xs` only — the 3 non-`xs` sizes all carry
`collapsed=false` as a filler value for property-key consistency, no visual
effect). The 3 original sizes: a recessed track
(`color.segmentedControl.track.background` → `color.background.subtle`,
zinc.100) holding `SegmentedControlItem` instances, `space.2` padding on all
sides, radius `radius.segmentedControl.{size}` (mirrors
`radius.button.{size}` — chip/control/control), built from 3 plain frames
combined via `combineAsVariants`, the same technique `Menu`/`Pagination`
used. The 2 `xs` variants: a transparent, unpadded, unrounded track
(`collapsed=true`: 48×16 · `collapsed=false`: 164×24) holding 3 real
`SegmentedControlItem` instances at `position`(start/middle/end), built by
cloning the sidebar's own live module switcher rather than constructed from
scratch.
