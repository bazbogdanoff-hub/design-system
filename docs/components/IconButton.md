# IconButton

A **square** icon-only button. Same glass skin, variants, sizes and states as
[`Button`](./Button.md) — one centred icon (or the spinner), no label.

```tsx
<IconButton icon={<XIcon/>} aria-label="Close" variant="secondary" size="md" />
```

| prop | values | default |
|---|---|---|
| `variant` | `primary` · `secondary` · `tertiary` | `secondary` |
| `size` | `sm` `md` `lg` `xl` | `md` |
| `icon` | `ReactNode` — **required** | — |
| `loading` | `boolean` — spinner replaces the icon, interaction blocked | `false` |
| `asChild` | `boolean` | `false` |

**`aria-label` (or `aria-labelledby`) is required** — enforced by the type. All
other button props pass through.

## Size = the matching Button height (square)

| `size` | secondary / tertiary | primary | icon |
|---|---|---|---|
| `sm` | 28 × 28 | 36 × 36 | 14 / 18 |
| `md` | 32 × 32 | 40 × 40 | 16 / 20 |
| `lg` | 36 × 36 | 44 × 44 | 18 / 20 |
| `xl` | 40 × 40 | 56 × 56 | 20 / 22 |

Icon is `1em` (the component sets `font-size`). Radius = `radius/button/{variant}/{size}`,
same as Button.

## Everything else = Button

Fill / border / shadow / focus border / hover / disabled / `loading` all come
from Button's `.surface` (shared CSS module) keyed by `[data-variant]`. No
IconButton-specific tokens. `tertiary` IconButton is a bare icon with the
brand-on-active + focus-ring behaviour.

## Figma

Component set **`IconButton`** — cloned from `Button`: 48 variants
(`variant` × `size` × `state`), square, `iconSwap` + `loading` props, label +
trailing icon removed.

## a11y

`<button>` with a required accessible name. `loading` sets `aria-busy`. If it
also navigates, use `asChild` with an `<a>` and keep the `aria-label`.
