# Button

One component, three emphases. **L1 primitive.**

```tsx
<Button variant="primary" size="lg" leadingIcon={<PlusIcon/>} onClick={…}>
  Create shipment
</Button>
```

| prop | values | default |
|---|---|---|
| `variant` | `primary` (brand glass) · `secondary` (neutral glass) · `tertiary` (text) | `secondary` |
| `size` | `2sm` `sm` `md` `lg` `xl` `2xl` — see below, two are variant-restricted | `md` |
| `leadingIcon` / `trailingIcon` | `ReactNode` — both allowed at once | — |
| `loading` | `boolean` — spinner in the leading slot, interaction blocked, label stays | `false` |
| `asChild` | `boolean` — render as `<a>` / router `<Link>` | `false` |

Standard button props (`disabled`, `onClick`, `type`, `aria-*`) pass through. Root
is `<button type="button">`; `asChild` swaps the element and sets `aria-disabled`
instead of `disabled`.

## Sizes (1440 migration: unified across variant, two exceptions)

Height/padding/gap/label-style/radius are now the **same for every variant**
at a given size — no longer a per-variant relative scale. `2sm` is
`secondary`/`tertiary`-only (`primary` doesn't have it); `2xl` is
`primary`-only. Not enforced at the type level (same approach the old
per-variant scale used — a design constraint, not a compile-time one).

| `size` | height | gap | label style | radius |
|---|---|---|---|---|
| `2sm` | 28 (**24 for `tertiary`**) | `space/4` | `text/label/xs` | `radius/button/2sm` (6) |
| `sm` | 28 | `space/4` | `text/label/sm` | `radius/button/sm` (6) |
| `md` | 32 | `space/6` | `text/label/md` | `radius/button/md` (8) |
| `lg` | 36 | `space/6` | `text/label/lg` | `radius/button/lg` (8) |
| `xl` | 40 | `space/8` | `text/label/xl` | `radius/button/xl` (8) |
| `2xl` | 44 | `space/8` | `text/label/xl` | `radius/button/2xl` (12) |

One more exception: `primary`'s gap is a flat `space/6` at **every** size
(overrides the table above) — `secondary`/`tertiary` are the ones that scale
their gap 4/6/8 with size. `radius/button/*` is a flat per-size scale, shared
by every variant — no more `radius/button/{variant}/{size}`.
*(Heights are literal px in the CSS for now — `size/control/*` tokens are a TODO.)*

## Appearance per variant

| | fill | border (rest) | shadow | text / icon |
|---|---|---|---|---|
| `primary` | `color/button/primary/background/default` → `.hover` | 1.5px top-left `…/border/default` → `.hover` → **full white `.active`** | `Viginette/2xs primary` ↔ `…hover` (inner-shadow colour = `…/shadow/default`/`hover`) | `#ffffff` / `#ffffff` |
| `secondary` | `color/button/secondary/background/default` (state-invariant) | 1.5px top-left `color/card/border` → **full `color/card/border-active`** | `Viginette/2xs` ↔ `…hover` | `text/strong` / `icon/default` |
| `tertiary` | none | none | none | `color/button/tertiary/text/default`; **underline on hover**, `…/text/active` (brand) + underline on active/focus |

## States (CSS, not variants)

`:hover` → shadow deepens (secondary/primary) or underline (tertiary). `:focus-visible`
and `:active` are **identical** — full border for the glass variants, a 2px brand
outline for tertiary. `:disabled` (and `loading`) → 0.7 opacity, no pointer.

## Figma

Component set **`Button`** — `variant` (3) × `size` (6: `2sm`/`sm`/`md`/`lg`/`xl`/`2xl`,
though `secondary`/`tertiary` skip `2xl` and `primary` skips `2sm`) × `state`
(4: default/hover/active/disabled) = 60 variants, plus `leadingIcon` /
`trailingIcon` (bool) + `leadingIconSwap` / `trailingIconSwap` + `loading`
(bool). The `Loading` layer is child 0; when `loading` is on it shows and (per
convention) the code hides the icons — Figma can't invert a boolean, so there
a designer just avoids combining `loading` with an icon.

**1440 migration** (owner, manual): sizes were unified across variant (was a
per-variant relative scale — e.g. `primary` used to be 36/40/44/56 while
`secondary`/`tertiary` were 28/32/36/40) and two exception sizes added:
`2sm` (`secondary`/`tertiary` only) and `2xl` (`primary` only). Claude then:
rebound all 60 variants' corner radius to the new flat `radius/button/<size>`
scale (deleting the 9 now-orphaned `radius/button/{variant}/{size}`
variables), resynced `Button.module.css`'s sizing rules to match (unified
per-size blocks + the `primary` flat-gap and `tertiary` `2sm`-height
exceptions), and fixed two `tokens-to-figma.mjs` generator bugs found along
the way — its component-radius regex didn't match digit-leading segments
like `2sm`/`2xl`, and its primitive-radius enum was missing `4xl`/`5xl`
(added earlier in the same migration, never previously exercised).

## a11y

Real `<button>` — focus, Enter/Space, `disabled` native. `loading` sets
`aria-busy`. For an icon-only button use `IconButton` (it requires an
`aria-label`).
