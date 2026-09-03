# StatButton

A stat that acts as a button — a metric (`label` + `value`) on a glass surface
that navigates to the sorted table for that metric. **L2 pattern.**

Used to build summary cards: a `Card` holds a headline stat plus a row of
`StatButton`s (e.g. "In transit 118" over "Moving 112" / "Idle 6").

## API

```tsx
<StatButton
  label="Moving"
  value={112}
  size="sm | lg"            // default sm
  tone="default | danger"   // default default
  showArrow                 // lg only, ignored on sm
  disabled
  onClick={() => router.push('/shipments?status=moving&sort=count')}
/>
```

| prop | values | default | Figma |
|---|---|---|---|
| `label` | `ReactNode` | — | text layer `label` |
| `value` | `ReactNode` | — | text layer `value` |
| `tone` | `default` `danger` | `default` | variant `tone` |
| `size` | `sm` `lg` | `sm` | variant `size` |
| `showArrow` | `boolean` — the ↗ "drill in" affordance | `false` | property `Show arrow` |

Renders a **`<button type="button">`**; drive navigation from `onClick`. Standard
button props (`disabled`, `onClick`, `aria-*`, …) pass through. `className` merges.

## Anatomy

```
button.stat
└─ span.content   (column: label over value)
   ├─ span.label  — "Moving"
   └─ span.value  — "112"
└─ ArrowUpRight   (lg + showArrow only, pushed right)
```

- `sm` — column, hug both. ~68px tall.
- `lg` — row, `space-between`; label/value block left, arrow right. ~73px tall.

## Appearance

| aspect | token / value |
|---|---|
| surface | `color/card/background/default` (#fcfcfc) |
| radius | `radius/control` → 8 |
| catch (rest / hover) | 1.5px white, top + left (`color/card/border`) |
| border (focus / active) | **full** 1.5px primary (`color/card/border-active` → brand 500) — replaces the catch |
| shadow (rest) | `Viginette/2xs` → `inset 2px 2px 12px #f0f0f0`, `0 1px 8px rgba(0,0,0,.20)` |
| shadow (hover) | `Viginette/2xs hover` → drop shadow deepens to `0 2px 12px rgba(0,0,0,.25)` |
| padding | `space/8` block · `space/12` inline |
| gap (lg, block↔arrow) | `space/8` |
| label | `text/body/sm` · `color/text/subtle` |
| value | `sm` `text/heading/md` · `lg` `text/heading/lg`; colour `color/text/default`, or `color/text/danger` when `tone="danger"` |
| arrow | 24px, `color/text/subtle` |

The glass shadow pair (`Viginette/2xs` / `…hover`) is the **shared glass-button
treatment** — StatButton, Button, and any glass button use it for rest/hover.
Not tokenised (effect, hand-tuned); extracted into the CSS with its Figma origin.

## States (CSS, not variants)

| state | treatment |
|---|---|
| `:hover` | shadow → `Viginette/2xs hover` |
| `:focus-visible` **and** `:active` | the white top-left catch becomes a **full 1.5px primary border** (`color/card/border-active`) — identical for both. No outline ring |
| `:disabled` | 50% opacity, `cursor: default`, no hover/active |

Figma carries only `state = default | hover` as real variants (the two with an
actual visual change); `focus` / `active` / `disabled` are code-only.

## Figma

Component set **`StatButton`** — `tone` (2) × `size` (2) × `state` (2) = 8
variants, plus `Show arrow` (bool) + `arrow` (instance-swap). Rebuilt from the
kit `Stat - button`: all colour / radius / spacing / type rebound to the new
collections; `state=hover` swaps the effect style; `Text Combination` kit
instance detached into a plain `content` frame.

## a11y

It's a real `<button>` — focus, Enter/Space, `disabled` all native. If the label
alone isn't a clear action target, pass `aria-label` (e.g. `"Moving — 112, open
table"`).
