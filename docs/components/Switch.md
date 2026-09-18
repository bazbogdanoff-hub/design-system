# Switch

A boolean on/off toggle. **L1** — Figma built an earlier session, React
ported this session.

```tsx
<Switch aria-label="Notifications" defaultChecked />
<Switch size="lg" aria-label="Auto-retry" checked={autoRetry} onCheckedChange={setAutoRetry} />
<Switch aria-label="Locked" disabled />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (32×18) · `md` (40×22) · `lg` (48×26) | `md` | exact Figma track/thumb geometry |
| `checked` / `defaultChecked` / `onCheckedChange` | see below | — | controlled or uncontrolled |
| `disabled` | `boolean` | — | |

Every other native `<button>` prop passes through. `aria-label` or
`aria-labelledby` is required — same TS-enforced union `IconButton`/
`ProgressBar`/`Slider` use — since the track has no visible text of its own
for a screen reader to announce.

## A real `<button role="switch">`, not a styled div

HTML has no native switch element (unlike `Checkbox`/`Radio`, which wrap real
`<input>`s and get keyboard/click semantics for free). `Switch` is a real
`<button type="button" role="switch" aria-checked>` — Space/Enter toggle it
natively, and `aria-checked` carries the current state to assistive tech.

## Controlled or uncontrolled — always rendered from one `currentChecked`

Same split `Slider` uses for `value`/`defaultValue`: pass `checked` +
`onCheckedChange` to drive it yourself, or `defaultChecked` to let it manage
its own state (seeded once, then owned internally). There's no native
`change` event to mirror the way `Checkbox`/`Radio` can — `onCheckedChange`
fires with the next boolean directly, the same name Radix's own `Switch`
uses for the same reason.

## Track color alone carries state — the thumb never changes

The thumb is a plain white circle in every state (`color.switch.thumb`,
fixed). Only the track recolors: `color.switch.track.off` (zinc.100) →
`.on` (brand.600) → `.on-hover` (brand.700) → `.disabled` (zinc.100, flat
regardless of checked). There's no border at all — confirmed via the Figma
reference read-back (`strokes: []` on every one of the 18 variants).

## Sizes are literal px, not a token family

`size.switch.*` doesn't exist — same "no token yet" precedent `Slider`'s own
`sm`/`md`/`lg` track thicknesses set. Read straight off the Figma masters:

| size | track | thumb | padding |
|---|---|---|---|
| `sm` | 32×18 | 14×14 | 2px |
| `md` | 40×22 | 18×18 | 2px |
| `lg` | 48×26 | 22×22 | 2px |

The padding is a flat 2px at every size, and — a clean coincidence of that —
the thumb's travel distance (track width − thumb − 2×padding) always equals
the thumb's own size. The CSS uses this directly: `transform:
translateX(var(--thumb-size))` when checked, a real transition Figma's
static reference doesn't model.

## Figma

**`Switch`** (`10221:13885`) — 18 variants: `size`(sm/md/lg) × `checked`
(false/true) × `state`(default/hover/disabled). Pill track (`radius/full`) +
ellipse thumb; `checked` is modeled via `primaryAxisAlignItems` MIN (off) /
MAX (on) rather than a position override — the thumb is the track's only
auto-layout child. Built autonomously in an earlier session (owner away);
this session ported it to React and verified the geometry/token bindings via
a read-only bridge inspection (another agent was concurrently resizing
`ProgressBar` in the same live file, so no Figma writes this pass).
