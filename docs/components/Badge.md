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

| `size` | label style | padding (all sides) | gap | Figma height |
|---|---|---|---|---|
| `sm` | `text/label/sm` — 13 / bold | `space/6` (6) | `space/4` (4) | ~22 |
| `md` | `text/label/md` — 14 / bold | `space/8` (8) | `space/6` (6) | ~26 |
| `lg` | `text/label/lg` — 16 / bold | `space/8` (8) | `space/6` (6) | ~28 |

Per **`tone`** (each pair is a component token → semantic `-subtle` / status text):

| `tone` | `--color-badge-<tone>-background` | `--color-badge-<tone>-text` |
|---|---|---|
| `neutral` | `background.subtle` — zinc 100 | `text.subtle` — zinc 500 |
| `brand` | `background.brand-subtle` — indigo 100 | `text.brand` — indigo 700 |
| `success` | `background.success-subtle` — green 100 | `text.success` — green 700 |
| `warning` | `background.warning-subtle` — amber 100 | `text.warning` — amber 700 |
| `danger` | `background.danger-subtle` — red 100 | `text.danger` — red 700 |

Icon colour = `currentColor` (the tone's text colour). The icon box is `1em`
square so it tracks the label size (Figma uses fixed 14/16/20px placeholders;
the real icon component will define its own sizing).

### Height note

Figma heights are emergent: `padding + cap-height` (the `text/label/*` styles
carry `leadingTrim: CAP_HEIGHT`). In CSS the label runs at `line-height: 1`, so a
browser renders the badge ~2–4px taller than the Figma frame. Acceptable — the
badge hugs its content and never sits in a fixed vertical rhythm. If exact parity
is ever needed, switch the size rules to explicit `height` + centred content.

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
