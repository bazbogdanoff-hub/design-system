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
| `radius.3xl` | 1.25 | 20 |
| `radius.4xl` | 1.5 | 24 |
| `radius.5xl` | 2 | 32 |
| `radius.full` | — | 9999px |

`3xl`/`4xl`/`5xl` added in the 1440 migration — needed once `AppShell`'s
content viewport got its own radius, bigger than any card (see
`radius.page-container` below).

### Semantic (the cascade)

Nesting reads correctly — an inner element's radius is always ≤ its container's.

| token | → | px | use |
|---|---|---|---|
| `radius.page-container` | `radius.4xl` | 24 | `AppShell`/`Page`'s own content viewport — the real ceiling now, bigger than any card |
| `radius.container` | `radius.xl` | 12 | outermost content card in a carded layout (1440 migration: was `radius.2xl`/16) |
| `radius.panel` | `radius.xl` | 12 | nested card, section, menu, popover, dropdown, sheet |
| `radius.control` | `radius.lg` | 8 | button, input, select, textarea |
| `radius.chip` | `radius.md` | 6 | badge, tag, checkbox, small toggle |
| `radius.pill` | `radius.full` | — | pill button, avatar, status dot |

`radius.container` and `radius.panel` are now both 12 — previously distinct
(16 vs 12), collapsed by the 1440 cut. Not necessarily wrong (same floor
collision pattern as the type scale), just worth knowing they're identical
today if you're deciding whether to differentiate them again later.

### Component

| token | → semantic | px |
|---|---|---|
| `radius.page` | `radius.page-container` | 24 |
| `radius.card` | `radius.container` | 12 |
| `radius.modal` | `radius.container` | 12 |
| `radius.table` | `radius.panel` | 12 |
| `radius.popover` | `radius.panel` | 12 |
| `radius.input` | `radius.control` | 8 |
| `radius.badge.sm` | `radius.chip` | 6 |
| `radius.badge.md` | `radius.control` | 8 |
| `radius.badge.lg` | `radius.control` | 8 |
| `radius.button.2sm` | `radius.chip` | 6 |
| `radius.button.sm` | `radius.chip` | 6 |
| `radius.button.md` | `radius.control` | 8 |
| `radius.button.lg` | `radius.control` | 8 |
| `radius.button.xl` | `radius.control` | 8 |
| `radius.button.2xl` | `radius.panel` | 12 |

`radius.badge` and `radius.button` are both per-**size** now — `radius.button`
used to be per-variant×size (primary and secondary had different heights at
the same `size` name, so radius followed the height), but the 1440 migration
unified Button's heights across variant, so one flat size-keyed scale
replaced `radius.button.{secondary,primary}.{sm,md,lg,xl}` entirely.
`--radius-badge-*` / `--radius-button-<size>` in CSS — no more
`--radius-button-<variant>-<size>`.

Components reference the **component** or **semantic** radius token, never the raw
scale. `$type: "dimension"` is declared once, on the `radius` group in
`primitives.layout.json` — omit it in the other two files (same rule as colour's `$type`).
