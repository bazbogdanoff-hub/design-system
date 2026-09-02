# Card

A surface that groups related content — a padded box, nothing more. Always the
glass look. Sections, dividers, footers, clickable behaviour are the consumer's
composition, or a specific card type built on top (see [architecture.md](../architecture.md)).

## API

```tsx
<Card padding="none|sm|md|lg" asChild>{children}</Card>
```

| prop | values | default | Figma variant |
|---|---|---|---|
| `padding` | `none` `sm` `md` `lg` | `md` | `padding` |
| `asChild` | `boolean` | `false` | — |

`className`, `style`, `...divProps` pass through to the root. No `elevation`, no
`interactive`/hover — a clickable-card state comes later, with alpha tokens.

## Appearance (fixed — no variants beyond padding)

| aspect | token / value |
|---|---|
| fill | `color/card/background/default` → `color/surface/card` → `#fcfcfc` |
| radius | `radius/card` → `radius/container` → 16 |
| border | an **inner-shadow effect**, not a stroke — `inner shadow · white · X 1.5 · Y 1.5 · blur 0 · spread 0`, colour → `color/card/border` (→ `color/border/highlight` → `#ffffff`). A stroke inflates a hug-sized auto-layout frame; an effect doesn't. |
| vignette | `inner shadow · #f0f0f0 · X 4 · Y 4 · blur 16 · spread 0` — "vignette xs", **not a token** |
| padding | `space/12` · `space/16` · `space/20` |

## Figma build

- Component set **`Card`** — **one variant property**: `padding` (`none|sm|md|lg`) → **4 variants** in a row.
- Open auto-layout frame (VERTICAL, gap 0), no `SLOT` property — instances append
  content directly. Empty by default.
- Base variant: width **320**, height **hug**.
- Bindings:
  - fill → `color/card/background/default`
  - corner radius → `radius/card`
  - stroke: **top 1.5 / left 1.5 / right 0 / bottom 0**, colour → `color/card/border`
  - effect: your `vignette xs` inner-shadow (`#f0f0f0`, offset 4/4, blur 16, spread 0)
- Showcase content (subheading + 2 body lines + Button) lives on a **docs board**,
  dropped into Card instances there — not in the component.

## a11y

Plain `<div>` (or via `asChild`, whatever element the consumer picks). Purely
presentational — no roles, no focus handling.
