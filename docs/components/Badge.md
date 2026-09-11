# Badge

A small status/label pill — subtle tinted fill, bold label, optional leading
icon. Semantic `tone`, not colour. For a fixed severity scale (low / attention /
warning / critical) use `SeverityBadge`, which composes this. See
[architecture.md](../architecture.md).

## API

```tsx
<Badge tone="neutral|brand|success|warning|danger" size="xs|sm|md|lg" icon={<Icon/>} asChild>
  In transit
</Badge>
```

| prop | values | default | Figma |
|---|---|---|---|
| `tone` | `neutral` `brand` `success` `warning` `warning-strong` `danger` | `neutral` | variant `tone` |
| `size` | `xs` `sm` `md` `lg` | `md` | variant `size` |
| `icon` | `ReactNode` — leading icon | — | component property `Icon` (bool + instance-swap) |
| `asChild` | `boolean` | `false` | — |

`className`, `style`, `...spanProps` pass through to the root. No border, no
elevation, no interaction states — a badge is presentational.

## Anatomy

Root `<span>`, `display: inline-flex`, `vertical-align: middle` (badges sit in
running text and table cells). Optional icon box, then the label. Hug in both
axes.

## Appearance

Per **`size`** (padding + gap bind `space/*`; radius `radius/badge/<size>` — 6 for
`xs`/`sm`, 8 for `md`/`lg`):

| `size` | label style | padding | gap | radius | icon | height |
|---|---|---|---|---|---|---|
| `xs` | `text/label/xs` — 12 / bold / **wide tracking** | `space/4` vertical, `space/6` horizontal | `space/4` (4) | `radius/badge/sm` (reused — no separate `xs` radius token) — 6 | 12 (1em) | ~22 |
| `sm` | `text/label/sm` — 13 / bold | `space/6` (6, all sides) | `space/4` (4) | `radius/badge/sm` — 6 | 13 (1em) | ~27 |
| `md` | `text/label/md` — 14 / bold | `space/8` (8, all sides) | `space/6` (6) | `radius/badge/md` — 8 | 14 (1em) | ~32 |
| `lg` | `text/label/lg` — 16 / bold | `space/10` (10, all sides) | `space/6` (6) | `radius/badge/lg` — 8 | 16 (1em) | ~38 |

`xs` is the odd size out in two ways, both because it composes `text/label/xs`
specifically: its padding is **asymmetric** (4 vertical / 6 horizontal, not one
uniform value like every other size), and it's the only size where the CSS
overrides `letter-spacing` in addition to `font-size` — `label/xs` is uniquely
`wide`-tracked in this system's type scale; `sm`/`md`/`lg` are all `normal`, so
they get away with a font-size-only override against the shared base rule.
`xs` also doesn't get its own radius token — Figma bound it to the existing
`radius/badge/sm` variable (identical 6px value) rather than create a parallel
`radius/badge/xs`, and the code mirrors that rather than inventing one.

Per **`tone`** (each pair is a component token → semantic `-subtle` / status text):

| `tone` | `--color-badge-<tone>-background` | `--color-badge-<tone>-text` |
|---|---|---|
| `neutral` | `background.subtle` — zinc 100 | `text.subtle` — zinc 500 |
| `brand` | `background.brand-subtle` — indigo 100 | `text.brand` — indigo 700 |
| `success` | `background.success-subtle` — green 100 | `text.success` — green 700 |
| `warning` | `background.warning-subtle` — amber 100 | `color.amber.600` — amber 600 (one step lighter than `text.warning`, to separate from `warning-strong`) |
| `warning-strong` | `background.warning-strong-subtle` — orange 100 | `text.warning-strong` — orange 700 |
| `danger` | `background.danger-subtle` — red 100 | `text.danger` — red 700 |

Icon colour = `currentColor` (the tone's text colour). The icon box is `1em`
square — same as the label font-size (12 / 13 / 14 / 16 for `xs`/`sm`/`md`/`lg`).

### Height is stable with or without an icon

`text/label/*` runs at line-height `tight` (1.15), so the label box (~14 / 15 /
16 / 18px) is *larger* than the `1em` icon. Toggling the icon changes the badge
**width only** — never the height. The badge stays hug in both axes; heights land
around xs 22 / sm 27 / md 32 / lg 38. Figma and CSS match (both use the token
line-height; no trim, no hardcoded value).

## Figma build

- Component set **`Badge`** — variant props `tone` (6, including `warning-strong`)
  × `size` (4: `xs`/`sm`/`md`/`lg`) = 24 variants.
- `icon` is a **component property**, not a variant axis: a `BOOLEAN` (default
  `false`) toggling a leading instance-swap slot.
- Auto-layout HORIZONTAL, hug × hug, centre align. Fill → `color/badge/<tone>/background`,
  radius → `radius/badge/<size>`, label style `text/label/<size>` + colour
  `color/badge/<tone>/text`, icon vector fill → `color/badge/<tone>/text`.
- No stroke, no effects.
- **Naming collision in the file**: at least one other, unrelated component is
  also named "Badge" (id `4234:7995`, a `Color`-only variant set with no
  `tone`/`size` — not this component). Any `findOne`/by-name lookup for
  "Badge" can silently grab the wrong one; the real one used here is
  `10036:11182`. Same issue exists for "Row" — see its doc.

## a11y

Presentational `<span>`, no role. When the badge is the only signal of a live
status (not restated in nearby text), the consumer adds `aria-label` or a
visually-hidden prefix. Decorative icon only — no `alt`.
