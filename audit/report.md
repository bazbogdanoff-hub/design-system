# Figma audit — "figmosha des sys" (the copy)

2026-09-02 · read-only inventory via figmosha2

## The file

- **1 content page** ("Project", 79 top-level nodes). 5 empty `---` separator pages.
- **24 screens** — `Base` instances (1920×956).
- **~33 real UI component sets** on the page: `Button` (40 variants), `Badge`,
  `Input - Nova`, `Switch`, `Checkbox` (36), `Tab`, `Card - Nova`, `Filter`,
  `Progress bar`, `Icon Button - Nova`, `Severity Badge` (27), `Stat - button`,
  `File Input`, `Info message`, … Inconsistent naming — some `- Nova` suffix,
  some not; one typo (`Desicion`).
- **~2600 icon components** (Phosphor set + `Colored icons` 192-variant set) —
  vendored, out of scope.
- **1 component set has existing errors** (broken variants).

## Variable collections — 13 local + ≥2 library

| collection | vars | what it is | overlaps new |
|---|---|---|---|
| `raw tailwind colors` | 288 | full Tailwind palette, `tw-raw/` prefix | = **Primitives** `color/*` |
| `shadcn colors` | 165 | shadcn semantic layer (`general/*` = 35), 2 modes | ≈ **Semantic** |
| `theme` | 22 | `theme/neutrals/0…1000` ramp (teal-grey), aliases | feeds shadcn |
| `Colors` | 72 | `Low/*`, `Attention/*` ramps, raw — orphan attempt | — delete |
| `border radii` | 13 | `radius-none…4xl` + `out-of-scale/{2,4,12}` | = **Primitives** `radius/*` |
| `spacing` | 30 | t-shirt `3xs…6xl` | ≈ `space/*` (diff names) |
| `typography` | 66 | atomic type tokens (`heading 1/font-size`, …) | ≈ `text/*` styles |
| `Jakarta` | 66 | atomic type tokens (`Body/Body-1/*`, `Label/*`) | ≈ `text/*` styles |
| `meta` | 1 | — | — |
| **Primitives / Semantic / Component** | 389 | the new clean set | — |
| `Alias`, `slothUI Variables` (library) | ? | `severity/*`, `chart colors/*`, `primary/*`, `Green/*` | not local — need equivalents |

## What the 24 screens actually consume

**Colour** (≈6 000 bound paints):

| source | uses | notes |
|---|---|---|
| `shadcn colors/general/*` | 3 874 | the real semantic layer — `heading small`, `Stroke`, `secondary text`, `card`, `glass border`, `heading`, `Scroller`, … mixed casing |
| `theme/neutrals/*` | 886 | teal-grey neutral ramp |
| `severity/*` (library) | 578 | `critical` `attention` `warning` `low` × bg/fill/text |
| `primary/*` (library) | 224 | brand teal |
| **raw hex (no token)** | 220 | e.g. `#15adc3b2`, `#ffffff1a` |
| `chart colors/*` (library) | 72 | teal / gold / blue |
| `Green/*`, `Card`, `Additional colors`, `tw-raw/*` | ~185 | `tw-raw` barely used directly |

**Text** — almost entirely `Title/*` styles: `Title/Label-2/Medium` (346),
`Title/Label-1/Medium` (272), `Title/Label-1/SemiBold` (243), `Title/H6/SemiBold`
(74), `Title/Body-1/SemiBold` (141), `Title/H5/SemiBold` (42)… + 16 raw text nodes.

## The blocker: the foundation doesn't match the product

The new `Primitives` were built with **indigo brand + slate neutral** (placeholders
you approved). The screens are built on:

| role | screens use | new Primitives have |
|---|---|---|
| brand | **teal `#13a3b8`** (full `Primary/` ramp 50→1100) | indigo `#4f46e5` |
| neutral | **teal-grey** (`#f7fafa`→`#182123`, desaturated) | slate (blue-tinted) |
| destructive | `#d02424` + `theme/destructive/*` | Tailwind red |
| status | `critical` / `attention`(amber) / `warning`(orange) / `low`(green) | `danger` / `warning` / `success` / `info` |
| charts | `#7dc8d6` `#d3a049` `#2563eb` … | none |

Migrating the screens onto the new tokens as-is would **recolour the entire
product** from teal to indigo and warm-grey to cool-slate.

## Decisions needed before any migration

1. **Brand + neutral** — rebuild the foundation to your real teal + teal-grey
   ramps (recommended), or deliberately rebrand to indigo/slate?
2. **Status colours** — you have 4 (`critical`/`attention`/`warning`/`low`).
   The conventions have 4 (`danger`/`warning`/`success`/`info`). Map
   `attention`→? (`warning` is taken by your orange). Add a 5th, or merge?
3. **Chart colours** — add a `color/chart/*` token group to the design system?
4. **Raw hex (220 uses)** — one is a teal glass effect `#15adc3b2`; triage as
   product-override tokens vs. mistakes.
5. **UI components (~33 sets)** — rename to conventions + rebind internals in this
   pass, or a separate one after the screens?
6. **Icons (~2600)** — confirm: leave untouched.

Nothing is applied. `figma-safe-edit` waits on these answers.
