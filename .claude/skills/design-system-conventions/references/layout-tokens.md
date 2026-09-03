# Spacing & radius token catalog

- [Spacing](#spacing)
- [Radius](#radius)

---

## Spacing

`tokens/primitives.layout.json` → `space.*` · Figma collection **Primitives**
(`FLOAT`, rem). **No semantic or component tier** — the scale itself is the
spacing API. Components use `space.*` directly for padding, gap, and margin, the
same way a utility framework does. Named by px, valued in rem so spacing tracks
the user's browser font-size.

| token | rem | px | typical use |
|---|---|---|---|
| `space.0` | 0 | 0 | reset |
| `space.2` | 0.125 | 2 | hairline gap, icon nudge |
| `space.4` | 0.25 | 4 | tight inner gap |
| `space.6` | 0.375 | 6 | icon ↔ label |
| `space.8` | 0.5 | 8 | control inner padding, small gap |
| `space.10` | 0.625 | 10 | |
| `space.12` | 0.75 | 12 | control padding-x, list-row gap |
| `space.16` | 1 | 16 | card padding, section gap |
| `space.20` | 1.25 | 20 | |
| `space.24` | 1.5 | 24 | card padding (roomy), block gap |
| `space.32` | 2 | 32 | section spacing |
| `space.40` | 2.5 | 40 | |
| `space.48` | 3 | 48 | page gutter, major section break |
| `space.64` | 4 | 64 | |
| `space.80` | 5 | 80 | |
| `space.96` | 6 | 96 | page top/bottom padding |

4px grid, with 2 / 6 / 10 added for fine control inside dense CRM components.
Don't use values off this scale. If a layout needs one, adjust the surrounding
composition, not the token.

---

## Radius

`tokens/primitives.layout.json` → `radius.*` (primitive scale) ·
`tokens/semantic.layout.json` (roles) · `tokens/component.layout.json`
(per-component). Figma: **Primitives** collection for the scale, **Semantic** /
**Component** for the rest. All under the `radius.*` namespace — the second
segment tells you the tier (t-shirt size = primitive, role = semantic, component
name = component).

### Primitive scale

| token | rem | px |
|---|---|---|
| `radius.none` | 0 | 0 |
| `radius.xs` | 0.125 | 2 |
| `radius.sm` | 0.25 | 4 |
| `radius.md` | 0.375 | 6 |
| `radius.lg` | 0.5 | 8 |
| `radius.xl` | 0.75 | 12 |
| `radius.2xl` | 1 | 16 |
| `radius.full` | — | 9999px |

### Semantic (the cascade)

Nesting reads correctly — an inner element's radius is always ≤ its container's.

| token | → | px | use |
|---|---|---|---|
| `radius.container` | `radius.2xl` | 16 | outermost content card in the carded layout — the ceiling |
| `radius.panel` | `radius.xl` | 12 | nested card, section, menu, popover, dropdown, sheet |
| `radius.control` | `radius.lg` | 8 | button, input, select, textarea |
| `radius.chip` | `radius.md` | 6 | badge, tag, checkbox, small toggle |
| `radius.pill` | `radius.full` | — | pill button, avatar, status dot |

### Component

| token | → semantic | px |
|---|---|---|
| `radius.card` | `radius.container` | 16 |
| `radius.modal` | `radius.container` | 16 |
| `radius.table` | `radius.panel` | 12 |
| `radius.popover` | `radius.panel` | 12 |
| `radius.button` | `radius.control` | 8 |
| `radius.input` | `radius.control` | 8 |
| `radius.badge.sm` | `radius.chip` | 6 |
| `radius.badge.md` | `radius.control` | 8 |
| `radius.badge.lg` | `radius.panel` | 12 |

`radius.badge` is **per-size** (the only component radius that is): a larger
badge is taller, so it borrows the next radius role up to keep the corner
looking proportional. `--radius-badge-sm|md|lg` in CSS.

Components reference the **component** or **semantic** radius token, never the raw
scale. `$type: "dimension"` is declared once, on the `radius` group in
`primitives.layout.json` — omit it in the other two files (same rule as colour's `$type`).
