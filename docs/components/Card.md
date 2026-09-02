# Card

A surface that groups related content. Compound: `Card` + `Card.Section`.

## Anatomy

```
Card                         container — fcfcfc fill, 16px radius, glass inner-shadow
└─ Card.Section  (×N)         a content region; own spacing, optional divider / muted bg
   └─ (your content)
```

`Card` provides the surface + radius + glass effect + outer padding. Each
`Card.Section` is a vertical stack of content with its own internal gap; a
divider line sits between adjacent sections when asked.

## Props

### `Card`

| prop | values | default | Figma variant | notes |
|---|---|---|---|---|
| `padding` | `none` `sm` `md` `lg` | `md` | `padding` | outer padding: none / 16 / 20 / 24 (`space/16‑24`) |
| `elevation` | `raised` `flat` | `raised` | `elevation` | `raised` = glass inner-shadow + border; `flat` = border only |
| `interactive` | `boolean` | `false` | `interactive` (bool) | hover bg (`color/surface/subtle`) + `cursor: pointer`; use for whole-card links |
| `asChild` | `boolean` | `false` | — | render as another element (`<a>`, router `<Link>`) |

Standard: `className`, `style`, `...divProps` pass through to the root.

### `Card.Section`

| prop | values | default | Figma variant | notes |
|---|---|---|---|---|
| `spacing` | `none` `sm` `md` `lg` | `md` | `spacing` | internal gap: 0 / 8 / 12 / 16 (`space/8‑16`) |
| `divider` | `boolean` | `false` | `divider` (bool) | 1px bottom border (`color/border/subtle`) — omit on the last section |
| `muted` | `boolean` | `false` | `muted` (bool) | subtle fill (`color/surface/subtle`) — e.g. a footer/toolbar row |

Standard div props pass through.

## Tokens

| target | token / value |
|---|---|
| Card fill | `color/card/background/default` → `color/surface/card` (`#fcfcfc`) |
| Card fill (interactive hover) | `color/card/background/hover` → `color/surface/subtle` |
| Card border | `color/card/border` → `color/border/default` |
| Card radius | `radius/card` → `radius/container` (16) |
| **Card glass effect** | `box-shadow: inset 4px 4px 16px #f0f0f0` — **NOT a token.** From the Figma `INNER_SHADOW`. `flat` elevation drops it. |
| Card outer padding | `space/16` · `space/20` · `space/24` |
| Section gap | `space/8` · `space/12` · `space/16` |
| Section divider | `1px solid color/border/subtle` |
| Section muted fill | `color/surface/subtle` |

## Figma build

- **Rename** `Card` → keep `Card`; `Card Section` → `Card.Section` (or nest: component name `Section`, published under `Card/`).
- **`Card` component set** — variant props: `padding` (`none|sm|md|lg`), `elevation` (`raised|flat`); boolean prop `interactive`.
  - Drop `Show header/content/footer` and `Slot count` — in code you compose `Card.Section` children freely; those Figma helpers don't map to props. Keep a couple of example instances on a docs board instead.
  - Base: fill `color/card/background/default`, corner radius `radius/card`, stroke 1px `color/card/border`, effect = your existing `INNER_SHADOW` (leave it — the `raised` variant has it, `flat` doesn't).
  - Auto-layout VERTICAL, gap 0, padding per `padding` variant.
- **`Card.Section` component set** — `spacing` (`none|sm|md|lg`), booleans `divider`, `muted`. A `SLOT` for content.
  - Auto-layout VERTICAL, gap per `spacing`; padding 0 (the Card owns outer padding); optional bottom `Border` rectangle bound to `color/border/subtle`; optional fill `color/surface/subtle` when `muted`.

## a11y

Plain `<div>`. When `interactive`, the consumer supplies the semantics
(`asChild` + `<a>`/`<button>`, or `role` + `tabIndex` + key handlers) — the
component only provides the hover affordance, not the interaction.
