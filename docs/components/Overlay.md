# Overlay

The modal **scrim + centering layer** - `position: fixed; inset: 0`, portalled
to `<body>`, filled with `color/modal/scrim`. Whatever you pass as `children`
is the modal panel; `Overlay` only darkens the interface, centers the panel,
and dismisses. **L1.**

```tsx
const [open, setOpen] = useState(false);

<Overlay open={open} onClose={() => setOpen(false)}>
  <div role="dialog" aria-modal="true" aria-label="Confirm delete">
    …your modal panel…
  </div>
</Overlay>
```

| prop | type | default | notes |
|---|---|---|---|
| `open` | `boolean` | - | mounts the scrim + portal while `true` |
| `onClose` | `() => void` | - | fired on backdrop click and Escape - wire it to your `open` state |
| `children` | `ReactNode` | - | the modal panel |
| `align` | `'center' \| 'top'` | `'center'` | where the panel sits when shorter than the viewport |
| `closeOnBackdropClick` | `boolean` | `true` | |
| `closeOnEscape` | `boolean` | `true` | |
| `lockScroll` | `boolean` | `true` | locks body scroll while open |
| `onExited` | `() => void` | - | called once the exit animation has finished and the overlay is gone. Keep the dialog mounted, set `open` false, and unmount it here, or the exit is cut off |

| `scrim` | `'default'` \| `'strong'` | `'default'` | `strong` is `color/modal/scrim-strong` (alpha-black/80) - for a full-screen picture, where the room should go dark (owner, 2026-10-01) |

Other `div` props pass through to the scrim element.

## Scrim token

`color/modal/scrim` → `color/background/overlay` → **`color/alpha-black/40`**
(`#00000066`). Repointed from a zinc-950 tint at ~70% - lightened and
de-tinted so the interface stays readable behind the modal. Any future drawer
/ lightbox uses the same `background/overlay`.

## What it handles / doesn't

**Now:** backdrop-click + Escape to close (a backdrop click must both press
*and* release on the scrim - a drag that starts on the panel won't dismiss),
body scroll-lock, focus moves into the panel on open and is restored to the
trigger on close, portal to `<body>`, and an enter/exit animation (the scrim fades, the panel rises in and sinks out; it stays mounted through the exit, see `onExited`).

**Not yet** - these come with the `Dialog` panel component:
- **Focus trapping** - Tab can currently leave the panel. Until `Dialog`
  lands, add a trap yourself if the modal is long-lived.
- **`role="dialog"` / `aria-modal` / labelling** - put these on *your* panel,
  not the scrim. `Overlay` is `role`-less chrome.

## Tall panels

The scrim is a scroll container (`overflow-y: auto`) and the panel is centered
with `margin-block: auto`, not `align-items: center` - so a panel taller than
the viewport scrolls from its top edge instead of being clipped. `align="top"`
pins it to the top (drop the auto margins) for panels that are usually tall.

## Phone: the page's padded area

On the `phone` tier the scrim pads its panel into the page's own padded
area (owner, 2026-10-06; it was a flat 20 from 2026-10-05): 22 from the
sides and top (the shell's 10 plus the page's 12), and 12 above the page
card's bottom, so the tab bar stays clear. The device's safe-area inset
wins where larger. It caps the panel at that room (`max-width` and
`max-height: 100%`); a tall one scrolls inside itself instead of the scrim
scrolling it, so a `Modal` keeps its header and footer in view.

## z-index

Raw `z-index: 1000` for now - there's no layer-token scale yet. Add a `z/*`
family when `Popover` / `Menu` / `Tooltip` / `Toast` land and stacking between
overlays actually needs arbitration.

## Figma

**`Overlay`** - a screen-sized `COMPONENT` (1440×780; instances resize to
their screen): scrim fill bound to `color/modal/scrim`, auto-layout centered
both axes, `space/24` padding, one `content` **Slot** for the modal. The
"screen + modal" states in the file are a dashboard duplicate with an
`Overlay` instance on top.
