# Row

A single list row for `ScrollableArea` (fleet-problem lists, `Next task`
reference lists, etc.) — **L1 primitive**, one fixed anatomy, not a generic
`Slot` like `Card`.

```tsx
<Row
  size="md"
  leading={{ icon: <TruckIcon /> }}
  heading="RG-101"
  description={
    <LabelGroup>
      <Label>TK-4021</Label>
      <Label>TL-88</Label>
      <Label>Dumont</Label>
    </LabelGroup>
  }
  status={<SeverityBadge level="warning">Warning</SeverityBadge>}
  action={<Button size="sm">Resolve</Button>}
  onClick={() => openDetail(id)}
/>
```

| prop | type | notes |
|---|---|---|
| `size` | `sm` \| `md` (default) \| `lg` | controls padding (8/10/12px) and the heading/description text-size pairing |
| `leading` | `{ icon: ReactNode } \| { children: ReactNode }`, plus optional `tone` — optional | always renders as an `IconCell`, sized to match `size`. Omit for no leading element |
| `heading` | `ReactNode` | required |
| `description` | `ReactNode` | required. Always rendered as a size-matched `LabelGroup` with Labels defaulting to `color="subtle"`. Pass a bare `<LabelGroup>` (Row fills `size` + `color`) or a string/node (Row wraps it in one `Label`). Explicit `color` on a `Label` or on the group still wins. |
| `status` | `ReactNode` — optional | trailing, left side — usually `Badge` or `SeverityBadge` |
| `action` | `ReactNode` — optional | trailing, right side — usually `Button` and/or `IconButton` |
| `onClick` | `() => void` — optional | presence alone makes the row interactive (hover/focus, keyboard-reachable) |

## Anatomy

```
div.row [data-size] [data-interactive]
├─ IconCell (size matches `size`)         — optional, `leading`
├─ div.text (flex:1, min-width:0)
│  ├─ p.heading        · text/label/{size} · color/text/strong
│  └─ div.description  · always a size-matched LabelGroup (Labels → subtle)
└─ div.trailing                            — only if status or action given
   ├─ div.status  — {status}
   └─ div.action  — {action}
```

Cross-axis alignment is `flex-start` (top), not `center` — owner's call: whatever
lands in `leading`/`status`/`action` sticks to the row's top edge rather than
centering against the text block. Matches the Figma master
(`counterAxisAlignItems: MIN`).

## Why `leading` is a typed prop, not a `Slot`, but `status`/`action` are

Two different rules from [architecture.md](../architecture.md)'s "how content
attaches" table apply to the same component:

- **`leading` can only ever be an `IconCell`.** A generic `Slot` would be the
  wrong tool — its whole point is "anything goes here," which is exactly the
  flexibility this position doesn't have. `Row` owns the `IconCell`
  instantiation itself and exposes only what `IconCell` needs (its own
  icon-xor-children union, plus `tone`) — a *typed prop*, same category as
  `TaskCard`'s `position` (which similarly owns and sizes its own `IconCell`
  rather than accepting one as content).
- **`status`/`action` genuinely accept open, unbounded content** — `Badge`,
  `SeverityBadge`, `Button`, `IconButton`, any combination. That's the real
  "named slot" case, same mechanism as `FilterBar`'s `filters` `Slot`.

## Why `status`/`action` are two props, not one `trailing` slot

The rule (owner): status content (badges) always sits left of action content
(buttons) within the trailing area. Rather than rely on children order as a
convention a consumer could get wrong, the ordering is structural — `status`
and `action` are separate props, always rendered in that order. Each stays
freeform *within itself* (nothing stops `status` from holding more than one
badge). This generalizes the split `TaskCard`'s own footer already draws
between its `SeverityBadge` and its `action` — see
[`TaskCard`'s anatomy](./TaskCard.md).

## Figma: `hasStatus`/`hasAction` gate the Slots' own visibility

In React, an unset `status`/`action` prop costs nothing — the conditional
render (`status != null && <div>...`) means no gap, no space, nothing.
Figma's `Slot`s don't get that for free: even empty, each one holds its 20×20
`minWidth`/`minHeight` floor (added so an empty Slot is still draggable — see
above), and `trailing`'s `itemSpacing` gap still applies around it. Left
alone, a row using only `status` reserved an extra ~28px it visually didn't
need.

Fixed with two boolean component properties on the `Row` set —
`hasStatus`/`hasAction` (both default `true`) — each bound directly to the
matching Slot's own `visible` property
(`slot.componentPropertyReferences.visible = <propKey>`). An invisible child
is excluded from auto-layout's space/gap math entirely, same as `display:
none`, so toggling one off collapses its reserved space and closes the gap —
now matching what React already did for free. This is the same boolean→
visibility mechanism `leading`/`hasLeading` already uses, just applied to a
`Slot` instead of an owned instance — confirmed to work identically: a
`Slot`'s visibility binds the same way any other node's does, `Slot`-ness
only matters for *content* swapping, not for this.

**Consumers of a real instance need to flip these explicitly** — leaving a
Slot empty is not enough on its own; the boolean has to go with it, or the
reserved space stays. Every existing instance built before this fix (e.g. the
`ScrollableArea` fleet-problem rows, which use `status` but never `action`)
needed `hasAction` set to `false` by hand after the fact.

## States

No fill by default — matches `color/scrollableArea/row/*`: rows in a
recessed scroll track stay transparent, same reasoning as `table.row`.

| state | treatment | token |
|---|---|---|
| hover | flat fill | `color/scrollableArea/row/shadow/hover` → `background/overlay-subtle` |
| focus-visible | 1px inset border | `color/scrollableArea/row/border/focus` → `border/focus` (brand.500) |
| every state | permanent 1px bottom divider | `color/scrollableArea/row/border/divider` → `border/default` (zinc.200) |

Hover is a plain `background-color`, not `box-shadow` — an earlier version
used an inset-shadow "flood the box" trick (still how the token's own name
reads), but the token itself is a translucent alpha-black wash, so a flat
fill layers on top of whatever's beneath exactly the same way and is simpler.
Focus stays `box-shadow` (inset, not `outline`) so it doesn't affect layout;
so does the divider, and in CSS they stack fine as two comma-separated
`box-shadow` layers on the same element.

### Figma: the divider must be a stroke, never an effect

React's divider and Figma's are the *same visual*, built two different ways,
and that difference matters. In CSS, `box-shadow: inset 0 -1px 0 0 <color>`
was the obvious choice — cheap, stacks with the focus ring, no layout impact.
The literal Figma equivalent — an `INNER_SHADOW` effect on the row frame —
looked identical and worked fine in every screenshot, but caused a real,
reproducible Figma rendering bug: **an effect on a frame with no fill
corrupts text rendering for that frame's descendants** (glyphs render
missing/warped — hyphens vanish, letters warp — specifically for this file's
variable-font weight). Cost a full debugging session to isolate, because
neither closing the file nor a full Figma Desktop restart ever cleared it —
only reverting past the point the effect was added did (it's saved into the
document, not an in-memory cache). The fix: a real per-side stroke instead —
`strokeBottomWeight = 1`, every other side's weight `= 0`, `strokeAlign:
'INSIDE'`, `strokesIncludedInLayout: false` (same recipe as `Card`'s own
inset-stroke technique) — renders perfectly on the identical no-fill frame.
**Strokes on a no-fill frame are fine; effects on one are not.** If a future
state ever seems to need an effect on `Row` (or anything else built on a
transparent frame), don't — find a stroke or fill-based equivalent instead.

Only applied when `onClick` is passed (`data-interactive`) — a purely
informational row renders as plain content, no button semantics, no hover
cue. Disabled was considered and deliberately skipped for now — nothing in
the current use cases needs it; easy to add later.

## Sizing

| `size` | heading (`text/label/*`) | description (`text/body/*`) | as `LabelGroup` |
|---|---|---|---|
| `lg` | `lg` — 15px | `sm` — 13px | `LabelGroup size="sm"` |
| `md` | `md` — 14px | `xs` — 12px | `LabelGroup size="xs"` |
| `sm` | `sm` — 13px | `2xs` — 10px, **wide tracking** | `LabelGroup size="2xs"` |

In Figma the `description` node **is** a nested `LabelGroup` instance (all 18
variants), size-matched per the last column — Row instances override the 3
inner `Label` texts. In React, `Row` clones a bare `<LabelGroup>` description
to inject that `size` (last column), so a consumer never types the mapping.
`LabelGroup`'s 2xs step was added specifically so `sm` could match exactly.

Finalized against real content (owner, checked live against the `ScrollableArea`
fleet-problem list) — description is deliberately **2 steps** below heading on
the label scale, not 1: this row's description is often dense,
alphanumeric-code-heavy content (flight/reference numbers), which reads better
noticeably smaller rather than just "a bit smaller." `sm`'s description needed
a size below `body/xs` (12px, the previous floor) — added `text/body/2xs`
(10px) rather than inventing an 11px step purely to keep the arithmetic exact;
it reuses the existing `font.size.10` primitive (already used by `overline`)
and, like `text/label/xs`, gets **wide letter-spacing** instead of `body`'s
usual `normal` — the same legibility reasoning label/xs already established
for small text carrying a lot of uppercase content.

## A real gotcha: `action`/`status` clicks bubble into `onClick`

`Row` doesn't call `stopPropagation` on nested clicks — a `Button` inside
`action` will also fire the row's own `onClick` (confirmed live: clicking a
nested "Resolve" button logged both the button's own handler and the row's).
This is deliberate — `Row` can't know which nested interactions should
suppress the row-level click and which shouldn't — but it means **a
consumer whose action shouldn't also "open" the row must call
`e.stopPropagation()` in their own handler.** Not handled automatically;
flagging so it isn't rediscovered as a surprise bug later.

## a11y

`role="button"` + `tabIndex={0}` + Enter/Space handling, only when `onClick`
is passed — plain, non-interactive `<div>` otherwise. Not a native
`<button>` on purpose: `action`/`leading` can hold real interactive elements
(`Button`, `IconButton`), which can't legally nest inside a `<button>`.
