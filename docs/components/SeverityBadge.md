# SeverityBadge

An **L2 pattern** — a fixed 4-level severity indicator. Composes
[`Badge`](./Badge.md) for the `pill` form; the `icon` form is the bare triangle
glyph for when there's no room for a chip. The level *is* the content: no free
text, no `tone`, no custom icon.

Product-entity status (`shipment delayed`, `PO overdue`) stays in the **app** —
the app maps its status onto a `level`. See [architecture.md](../architecture.md).

## API

```tsx
<SeverityBadge level="low|attention|warning|critical" size="sm|md|lg" format="pill|icon" />
```

| prop | values | default | Figma |
|---|---|---|---|
| `level` | `low` `attention` `warning` `critical` | — (required) | variant `level` |
| `size` | `sm` `md` `lg` | `md` | variant `size` |
| `format` | `pill` (coloured text chip) · `icon` (bare triangle) | `pill` | variant `format` |

`className`, `style`, `...spanProps` pass through. `format="icon"` gets
`role="img"` + `aria-label` = the level name; `pill` shows the label as text.

= **4 levels × 3 sizes × 2 formats = 24 Figma variants.**

## Level → tone · label

Severity escalates **low → attention → warning → critical**. "Warning" outranks
"attention" (something is *wrong*, not just *notable*).

| level | Badge tone | colour | label |
|---|---|---|---|
| `low` | `success` | green | "Low" |
| `attention` | `warning` | amber / yellow | "Attention" |
| `warning` | `warning-strong` | orange | "Warning" |
| `critical` | `danger` | red | "Critical" |

**The tone names describe colour, not rank** — level `attention` → tone `warning`
(amber), level `warning` → tone `warning-strong` (orange). Deliberate.

## `pill`

A `Badge` instance — `tone` = the mapped tone, `size` = `size`, children = the
level label. **No icon** — the colour + bold label carry the severity. Inherits
Badge's sizing, per-size radius, height model, tokens. Heights match Badge
exactly: sm 27 · md 32 · lg 38.

```tsx
<Badge tone={TONE[level]} size={size}>{LABEL[level]}</Badge>
```

## `icon`

Just the severity triangle — **no chip, no background, no radius**. A square box
sized to the icon, `color` = the tone's text colour, the triangle inherits it
via `currentColor`.

| `size` | icon |
|---|---|
| `sm` | 16 |
| `md` | 20 |
| `lg` | 24 |

For dense table cells / list rows where "Attention" won't fit. `role="img"` +
`aria-label={level}`.

## SeverityIcon

`src/components/SeverityBadge/SeverityIcon.tsx` — one inline-SVG component, the
filled alert-triangle (`!` punched out, `fill-rule: evenodd`). `viewBox="0 0 24
24"`, `fill: currentColor`, `size` prop (16 / 20 / 24). Path extracted verbatim
from the Figma vector. **Internal to `SeverityBadge`** — not exported from the
package root. Figma: the triangle vector lives inside each `format=icon` variant,
fill bound to `color/badge/<tone>/text`.

## a11y

- `pill` — the label is real text; nothing extra.
- `icon` — `role="img"` + `aria-label={level}` on the wrapper; the SVG is
  `aria-hidden`. If it also links or triggers, the consumer wraps it and moves
  the label there.
