# Badge

A small status/label pill — subtle tinted fill, bold label, optional leading
icon. Semantic `tone`, not colour. For a fixed severity scale (low / attention /
warning / critical) use `SeverityBadge`, which composes this. See
[architecture.md](../architecture.md).

## API

```tsx
<Badge tone="neutral|brand|success|warning|danger" size="sm|md|lg" icon={<Icon/>} asChild>
  In transit
</Badge>
```

| prop | values | default | Figma |
|---|---|---|---|
| `tone` | `neutral` `brand` `success` `warning` `danger` | `neutral` | variant `tone` |
| `size` | `sm` `md` `lg` | `md` | variant `size` |
| `icon` | `ReactNode` — leading icon | — | component property `Icon` (bool + instance-swap) |
| `asChild` | `boolean` | `false` | — |

`className`, `style`, `...spanProps` pass through to the root. No border, no
elevation, no interaction states — a badge is presentational.

## Anatomy

Root `<span>`, `display: inline-flex`, `vertical-align: middle` (badges sit in
running text and table cells). Optional icon box, then the label. Hug in both
axes.

## Appearance

Per **`size`** (padding + gap bind `space/*`; radius is `radius/badge` → 6px for
all sizes):

| `size` | label style | padding (all sides) | gap | icon | height |
|---|---|---|---|---|---|
| `sm` | `text/label/sm` — 13 / bold | `space/6` (6) | `space/4` (4) | 13 (1em) | ~27 |
| `md` | `text/label/md` — 14 / bold | `space/8` (8) | `space/6` (6) | 14 (1em) | ~32 |
| `lg` | `text/label/lg` — 16 / bold | `space/8` (8) | `space/6` (6) | 16 (1em) | ~34 |

Per **`tone`** (each pair is a component token → semantic `-subtle` / status text):

| `tone` | `--color-badge-<tone>-background` | `--color-badge-<tone>-text` |
|---|---|---|
| `neutral` | `background.subtle` — zinc 100 | `text.subtle` — zinc 500 |
| `brand` | `background.brand-subtle` — indigo 100 | `text.brand` — indigo 700 |
| `success` | `background.success-subtle` — green 100 | `text.success` — green 700 |
| `warning` | `background.warning-subtle` — amber 100 | `text.warning` — amber 700 |
| `danger` | `background.danger-subtle` — red 100 | `text.danger` — red 700 |

Icon colour = `currentColor` (the tone's text colour). The icon box is `1em`
square — same as the label font-size (16 / 14 / 13).

### Height is stable with or without an icon

`text/label/*` runs at line-height `tight` (1.15), so the label box (~18 / 16 /
15px) is *larger* than the `1em` icon. Toggling the icon changes the badge
**width only** — never the height. The badge stays hug in both axes; heights land
around sm 27 / md 32 / lg 34. Figma and CSS match (both use the token
line-height; no trim, no hardcoded value).

## Figma build

- Component set **`Badge`** — variant props `tone` (5) × `size` (3) = 15 variants.
- `icon` is a **component property**, not a variant axis: a `BOOLEAN` (default
  `false`) toggling a leading instance-swap slot.
- Auto-layout HORIZONTAL, hug × hug, centre align. Fill → `color/badge/<tone>/background`,
  radius → `radius/badge`, label style `text/label/<size>` + colour
  `color/badge/<tone>/text`, icon vector fill → `color/badge/<tone>/text`.
- No stroke, no effects.

## a11y

Presentational `<span>`, no role. When the badge is the only signal of a live
status (not restated in nearby text), the consumer adds `aria-label` or a
visually-hidden prefix. Decorative icon only — no `alt`.
