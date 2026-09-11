# IconButton

A **square** icon-only button. Same glass skin, variants, sizes and states as
[`Button`](./Button.md) — one centred icon (or the spinner), no label.

```tsx
<IconButton icon={<XIcon/>} aria-label="Close" variant="secondary" size="md" />
```

| prop | values | default |
|---|---|---|
| `variant` | `primary` · `secondary` · `tertiary` | `secondary` |
| `size` | `xs` `sm` `md` `lg` `xl` `2xl` — see below, two are variant-restricted | `md` |
| `icon` | `ReactNode` — **required** | — |
| `loading` | `boolean` — spinner replaces the icon, interaction blocked | `false` |
| `asChild` | `boolean` | `false` |

**`aria-label` (or `aria-labelledby`) is required** — enforced by the type. All
other button props pass through.

## Size = the matching Button height (square)

1440 migration: unified across variant, same as `Button` — `primary` used to
be its own taller scale (36/40/44/56), now it matches `secondary`/`tertiary`
exactly at `sm`/`md`/`lg`/`xl`. `xs` (renamed from `2sm`) is
`secondary`/`tertiary`-only, `2xl` is `primary`-only.

| `size` | square | icon |
|---|---|---|
| `xs` | 28 × 28 (**24 × 24 for `tertiary`**) | 12 |
| `sm` | 28 × 28 | 14 |
| `md` | 32 × 32 | 16 |
| `lg` | 36 × 36 | 18 |
| `xl` | 40 × 40 | 20 |
| `2xl` | 44 × 44 | 20 |

Icon is `1em` (the component sets `font-size`). Radius = `radius/button/<size>`,
a flat scale shared by every variant — same as `Button`.

## Everything else = Button

Fill / border / shadow / focus border / hover / disabled / `loading` all come
from Button's `.surface` (shared CSS module) keyed by `[data-variant]`. No
IconButton-specific tokens. `tertiary` IconButton is a bare icon with the
brand-on-active + focus-ring behaviour.

## Figma

Component set **`IconButton`** — cloned from `Button`: originally 48 variants
(`variant`(3) × `size`(4) × `state`(4)), square, `iconSwap` + `loading` props,
label + trailing icon removed.

**1440 migration**: expanded to 60 variants to reach full parity with
`Button`'s current structure — `primary`'s existing `sm`/`md`/`lg`/`xl` were
resized down from the old scale (36/40/44/56) to the unified one (28/32/36/40,
both the outer frame and the inner icon/Loading instances), and 12 new
variants added by cloning the nearest existing one (`secondary`/`2sm` off
`secondary`/`sm`, `tertiary`/`2sm` off `tertiary`/`sm`, `primary`/`2xl` off
`primary`/`xl`) rather than building from scratch — `2sm` here is the
variant's name as it existed at the time; it was later renamed to `xs`, see
above. Radius rebound to the same flat `radius/button/<size>` scale `Button`
uses. Verified: box size, icon size, and radius checked against the expected
table for all 60 variants.

## a11y

`<button>` with a required accessible name. `loading` sets `aria-busy`. If it
also navigates, use `asChild` with an `<a>` and keep the `aria-label`.
