# SeverityBadge

An **L2 pattern** — a fixed 4-level severity indicator, icon-forward. Composes
[`Badge`](./Badge.md) for its chrome (fill / radius / label style, per the token
contract). The level *is* the content: no free text, no custom icon, no `tone`.

For product-entity status (`shipment delayed`, `PO overdue`) this stays in the
**app** — the app maps its status onto a `level`. See [architecture.md](../architecture.md).

## API

```tsx
<SeverityBadge level="low|attention|warning|critical" size="sm|md|lg" format="pill|icon" />
```

| prop | values | default | Figma |
|---|---|---|---|
| `level` | `low` `attention` `warning` `critical` | — (required) | variant `level` |
| `size` | `sm` `md` `lg` | `md` | variant `size` |
| `format` | `pill` (icon + label) · `icon` (icon only) | `pill` | variant `format` |

`className`, `style`, `...spanProps` pass through. `format="icon"` sets
`role="img"` + `aria-label` = the level name automatically; `pill` has the label
as visible text and needs neither.

= **4 levels × 3 sizes × 2 formats = 24 variants** in Figma.

## Level → tone · label · icon

Severity escalates **low → attention → warning → critical**. "Warning" outranks
"attention" (something is *wrong*, not just *notable*).

| level | Badge tone | colour | label |
|---|---|---|---|
| `low` | `success` | green | "Low" |
| `attention` | `warning` | amber / yellow | "Attention" |
| `warning` | `warning-strong` | orange | "Warning" |
| `critical` | `danger` | red | "Critical" |

**The tone names describe colour, not rank** — so level `attention` maps to tone
`warning` (amber) and level `warning` maps to tone `warning-strong` (orange).
Deliberate; don't "fix" it.

**Icon: the same alert-triangle shape for every level** — only the colour
changes (= the tone's text colour, `currentColor`). Deliberately not four
different glyphs: the colour carries the severity, one shape keeps it calm and
unambiguous.

## Sizes

Icon is **prominent** — bigger than a plain Badge's `1em` — because severity has
to be scannable at a glance:

| `size` | Badge label style | icon | Figma height (pill) |
|---|---|---|---|
| `sm` | `text/label/sm` (13) | **16** | ~28 |
| `md` | `text/label/md` (14) | **20** | ~36 |
| `lg` | `text/label/lg` (16) | **24** | ~44 |

`format="icon"` is a **square** at those heights — the icon centred in a
`radius/badge/<size>` box with the tone fill, no label.

## Composition

- **pill:** a `Badge` instance (`tone` = the mapped tone, `size` = `size`), icon
  slot filled with the `SeverityIcon` for the level, label text = the level name.
- **icon:** a `Badge` instance with the icon slot filled and **no label** — Badge's
  uniform padding makes it square. Larger icon than a default badge.

Both let a change to `Badge` (padding, radius, height model, a token) flow
through. Never a detached copy.

### `Badge` change this needs

Badge's `.icon` box is currently hard-wired to `1em`. Change it to
`var(--badge-icon-size, 1em)` so SeverityBadge (and any future icon-forward
composition) can set `--badge-icon-size: 24px|20px|16px` per size. Default `1em`
keeps every existing badge identical. Done when SeverityBadge's code is written.

## SeverityIcon

**One shape** (alert-triangle) at **3 sizes — 24 / 20 / 16**. A real designed
icon, not a placeholder. Colour comes from the parent (`currentColor`), so the
icon itself is level-agnostic.

- **Figma:** a `SeverityIcon` component set, `size` (3) = 3 variants (add a
  `level` axis only if the shape ever needs to differ per level — today it
  doesn't). Vector fill bound to `color/badge/<tone>/text` in context, or left
  to inherit. Sits on the `Components` page next to `Badge`.
- **React:** `src/components/SeverityBadge/SeverityIcon.tsx` — one inline-SVG
  component taking a numeric `size`, `fill: currentColor`. Path extracted
  verbatim from the Figma build. Internal to `SeverityBadge`, not exported from
  the package root.

## a11y

- `pill` — the label is real text; nothing extra.
- `icon` — `role="img"` + `aria-label={level}`. If it also links or triggers,
  the consumer wraps it and moves the label there.
- The icon itself is always `aria-hidden` (decorative — the text or the
  `aria-label` carries meaning).
