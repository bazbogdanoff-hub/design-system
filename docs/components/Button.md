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
| `size` | `sm` `md` `lg` `xl` | `md` |
| `leadingIcon` / `trailingIcon` | `ReactNode` — both allowed at once | — |
| `loading` | `boolean` — spinner in the leading slot, interaction blocked, label stays | `false` |
| `asChild` | `boolean` — render as `<a>` / router `<Link>` | `false` |

Standard button props (`disabled`, `onClick`, `type`, `aria-*`) pass through. Root
is `<button type="button">`; `asChild` swaps the element and sets `aria-disabled`
instead of `disabled`.

## Sizes (px height differs per variant — it's a *relative* scale)

| `size` | secondary / tertiary | primary | label style |
|---|---|---|---|
| `sm` | 28 | 36 | `text/label/xs` · `md` (primary) |
| `md` | 32 | 40 | `text/label/sm` · `lg` |
| `lg` | 36 | 44 | `text/label/md` · `lg` |
| `xl` | 40 | 56 | `text/label/lg` · `xl` |

Radius follows the height: `radius/button/{variant}/{size}` — 6 for the smallest, 8 mid, 12 for the two tall primary sizes.
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

Component set **`Button`** — `variant` (3) × `size` (4) × `state` (4:
default/hover/active/disabled) = 48 variants, plus `leadingIcon` / `trailingIcon`
(bool) + `leadingIconSwap` / `trailingIconSwap` + `loading` (bool). The `Loading`
layer is child 0; when `loading` is on it shows and (per convention) the code
hides the icons — Figma can't invert a boolean, so there a designer just avoids
combining `loading` with an icon.

## a11y

Real `<button>` — focus, Enter/Space, `disabled` native. `loading` sets
`aria-busy`. For an icon-only button use `IconButton` (it requires an
`aria-label`).
