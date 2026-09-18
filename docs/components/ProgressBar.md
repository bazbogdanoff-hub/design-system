# ProgressBar

A horizontal progress track + fill. **L1 primitive.**

```tsx
<ProgressBar value={62} size="md" tone="brand" aria-label="Time left" />
```

| prop | values | default |
|---|---|---|
| `value` | `number` — clamped into `[0, max]` | — |
| `max` | `number` — pass the real total (e.g. `totalSeconds`) rather than pre-dividing | `100` |
| `size` | `sm` (6px) · `md` (10px) · `lg` (12px) | `md` |
| `tone` | `brand` · `success` · `warning` · `danger` | `brand` |
| `aria-label` / `aria-labelledby` | one is **required** — same mandatory-accessible-name pattern as `IconButton` | — |

## Why hand-built, not a headless-UI primitive

Considered `@radix-ui/react-progress` (the closest thing to a "default React
standard" here) before building this — this system already depends on
`@radix-ui/react-slot` for the handful of components that need real
composition logic (`asChild` polymorphism on `Button`/`Badge`/etc.). A
progress bar's accessibility surface is just the WAI-ARIA `progressbar`
role (`role="progressbar"` + `aria-valuenow`/`min`/`max`) with no focus
management and no composition to speak of, so a dependency wouldn't buy
anything here — built by hand against the same ARIA pattern instead.

## Tokens

- Track background: `color.surface.sunken` — already documented in the
  token file as "Wells, code blocks, **inset track**."
- Fill colors: the solid/button-strength tokens, not a badge's tinted
  background — `color.background.brand.default`, `.success`, `.warning`,
  `color.background.danger.default`. A progress fill needs to read clearly
  against a light track the way a button does, not sit at badge-chip
  contrast.
- Heights: `size.progressBar.sm` / `.md` / `.lg` (6/10/12px, component-tier
  tokens in `tokens/component.layout.json`) — CSS vars
  `--size-progress-bar-{sm,md,lg}`.
- Radius: `radius.full` on both track and fill (`border-radius: inherit`
  on the fill) — a pill, per the existing "pills, avatars, dots" token
  comment. Radius is bound directly to the `radius/full` variable in both
  React and Figma, so it self-adjusts to any track height with no separate
  component-radius token needed.

## 2026-09-13 resize — fitting dense contexts (e.g. a table cell)

Shrunk ~20-25% from the original 8/12/16px track scale (still `Slider`'s own
scale, unchanged) so `ProgressBar` itself can eventually be considered for
places like `TableCell`'s `progress` content type — which currently uses a
bespoke dot/line stage-tracker (`TableProgressStages`) instead, built
specifically because the original 8/12/16 `ProgressBar` read too tall for a
dense table row (see `docs/components/TableCell.md`).

Each size was cut ~20-25% and snapped to the nearest real step on this
system's `space.*`/`radius.*` primitive scale
(`0,2,4,6,8,10,12,16,20,24,32,40,48,64,80,96`) rather than left at an
arbitrary decimal:

| size | before | straight ~20-25% cut | snapped to | new |
|---|---|---|---|---|
| `sm` | 8px | 6.0-6.4px | `6` (exact) | **6px** |
| `md` | 12px | 9.0-9.6px | `9` isn't a real step; `10` is | **10px** |
| `lg` | 16px | 12.0-12.8px | `12` (exact) | **12px** |

New component-tier tokens (`tokens/component.layout.json`): `size.progressBar.
{sm,md,lg}` = `0.375rem`/`0.625rem`/`0.75rem` (6/10/12px) — a dedicated scale,
not an alias into `space.*` directly, so it can move independently of the
raw spacing primitives the same way `size.input` split off `size.control`.
No radius or thumb/marker token changes needed — the pill radius derives
from `radius.full` regardless of height, and ProgressBar has no thumb or
internal label text to rescale.

`size.*` isn't part of the token→Figma sync pipeline (only `color.*`/
`radius.*` have allow-list regexes in `tokens-to-figma.mjs` — same situation
already noted for `size.textarea`), so the Figma component set
(`ProgressBar`, `10153:16106`, 12 variants: `size`×`tone`) was resized by
hand to match: each variant's track + fill rectangle height set to
6/10/12px per its `size` value. All colour/radius bindings
(`color/surface/sunken`, `color/background/brand/default`/`.success`/
`.warning`/`color/background/danger/default`, `radius/full`) were confirmed
correct and untouched — this was a pure dimensional resize, not a colour or
behavior change. `value`/`max`/`tone`/the required `aria-label`/
`aria-labelledby` union are all unchanged.

**Open question, not decided here:** whether `TableCell`'s `progress`
content type should switch from `TableProgressStages` to this now-smaller
`ProgressBar` is a design call for the owner — this resize doesn't make
that decision, it just makes the option viable.

## Value and tone are independent signals

`value`/`max` control **only** the fill's width — a literal ratio, nothing
else. `tone` is a separate prop a consumer sets from its own logic and the
two are allowed to disagree: a bar can be 50% full and `danger` at the same
time, if what triggered danger was an absolute condition (e.g. "under 5
minutes left") rather than the ratio itself. Don't try to derive `tone`
from `value` inside this component — it doesn't have the context (a
total-window ratio and an absolute-time floor are different questions,
and only the consumer knows which applies). The `NextTask` widget (not yet
built) is the motivating case: its countdown escalates to danger on
whichever trips first, ratio or an absolute 5-minute floor, while the fill
width stays a plain, honest `remaining/total`.
