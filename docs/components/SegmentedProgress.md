# SegmentedProgress

Progress as a row of equal segments, one per counted item — the Tasks
header's "11 / 36". **Built in code first (owner, 2026-09-28); the Figma
master follows** from this spec.

Not [`ProgressBar`](./ProgressBar.md): that is a continuous track + fill for
ratios and time. Use this one when the thing being counted is discrete and
small enough to show one segment each.

```tsx
<SegmentedProgress aria-label="Tasks completed" value={11} max={36} />
```

| prop | type | notes |
|---|---|---|
| `value` | `number` | filled segments, clamped into `[0, max]` |
| `max` | `number` | segment count — one per item, not a percentage |
| `aria-label` / `aria-labelledby` | `string` | required, one or the other |

## Anatomy

| part | spec |
|---|---|
| row | `display: flex`, fills the width, `gap` `space/2` (2px) |
| segment | `flex: 1` (equal share), height 16 (1rem), radius `radius/md` (6) |
| filled | the **primary Button's glass**: `button.primary.background.default`, **1px** top-left catch `button.primary.border.default` (Button's own is 1.5px — too heavy at this height), inner shadow `button.primary.shadow.default` (2/2/12), drop shadow `0 1px 8px` black 20% |
| empty | flat `surface.recessed` — sunk into the card it sits on |

Segments share the width equally, so a large `max` makes them thin — around
40 is the practical ceiling in a full-width card at 1440.

`role="progressbar"` with `aria-valuenow` / `aria-valuemax` on the row; the
segments themselves are `aria-hidden`.
