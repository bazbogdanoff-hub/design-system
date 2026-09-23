# Menu

A dropdown panel holding `MenuRow`s. **L1** — Figma + React, both built this
session.

```tsx
const [open, setOpen] = useState(false);

<span style={{ position: 'relative' }}>
  <button onClick={() => setOpen(true)}>Open</button>
  <Menu open={open} onClose={() => setOpen(false)}>
    <MenuRow selected>Option A</MenuRow>
    <MenuRow>Option B</MenuRow>
  </Menu>
</span>
```

| prop | type | default | notes |
|---|---|---|---|
| `variant` | `default` \| `card` | `default` | `default` — a plain bordered/shadowed dropdown shell, for `Select`/`Input`-triggered menus. `card` — reuses the real `Card` component for its shell, for `Filter`-triggered menus |
| `size` | `sm` \| `md` \| `lg` | `md` | cascades to every `MenuRow` inside — match whatever size triggered this menu |
| `open` | `boolean` — required | | |
| `onClose` | `() => void` — required | | called on outside-click or Escape |
| `children` | `ReactNode` — required | | `MenuRow`s |

Renders `null` when `open` is `false` — no need to conditionally mount it at
the call site.

## Two shells, one row system

The task that produced this ("context menu for input… and also for filters
that are actual filter component… but holds same rows") asked for two
visually distinct containers sharing one row anatomy, not two components.
`variant="card"` wraps the row list in a real `<Card padding="none">` (Card's
own inset glass + radius, matching how a `Filter`'s menu should look like a
card); `variant="default"` is a lighter plain shell (fill + border, no Card)
for `Select`/`Input`. Both share the same elevation on the Menu wrapper —
`0 4px 8px` / `0 12px 32px` tinted with `--color-alpha-black-15` and
`--color-alpha-black-25` — so the drop shadow is identical across variants.
The Table header also stacks above the body (`z-index`) so filter menus
aren't painted under the rows. Both feed the identical `MenuRow` children —
switching shells never means switching row markup.

## Positioning — anchored, not floating-UI

`position: absolute; top: 100%; left: 0` relative to the consumer's own
`position: relative` wrapper (`Select` sets this up internally). No collision
detection or auto-flip — a real popover-positioning system (viewport-edge
flipping, scroll containment) is out of scope for what this design system's
screens currently need. Closes on outside-click (`mousedown` listener) or
Escape (`keydown` listener), both attached/detached via a `useEffect` keyed
on `open`. This is a dropdown, not a modal — no portal, no scrim, page stays
interactive underneath (that's `Overlay`'s job, not this one's).

## Figma

`Menu` (`10315:21998`) — 6 variants: `variant`(default/card) × `size`(sm/md/
lg). Both shells replicate their reference component's exact bound tokens
(fill/border/radius/effect) rather than nesting a live instance — same
"can't `insertChild` into a slot 2+ instance-levels deep" restriction that
drove `Table`'s own root construction, and the same fix. Each shell holds a
`rows (convert to Slot)` frame with 2 demo `MenuRow` instances (`default` +
`selected`) to show real content at rest.
