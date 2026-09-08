# ProgressBar

A horizontal progress track + fill. **L1 primitive.**

```tsx
<ProgressBar value={62} size="md" tone="brand" aria-label="Time left" />
```

| prop | values | default |
|---|---|---|
| `value` | `number` — clamped into `[0, max]` | — |
| `max` | `number` — pass the real total (e.g. `totalSeconds`) rather than pre-dividing | `100` |
| `size` | `sm` (8px) · `md` (12px) · `lg` (16px) | `md` |
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
- Heights: `space.8` / `space.12` / `space.16` — already exactly 8/12/16px,
  no new tokens needed.
- Radius: `radius.full` on both track and fill (`border-radius: inherit`
  on the fill) — a pill, per the existing "pills, avatars, dots" token
  comment.

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
