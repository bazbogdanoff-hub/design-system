# StatCard

A dashboard summary card — **L2 pattern.** A `Card` holding a headline stat, an
optional trend `badge`, and a row of `StatButton`s that drill into tables.

Composes [`Card`](./Card.md) (locked to `padding="lg"`) — never detached.

## API

```tsx
<StatCard
  label="Blocked"
  value={2}
  badge={<Badge tone="danger" size="lg" icon={<TrendUp/>}>200%</Badge>}
>
  <StatButton label="Oldest wait" value="4h" showArrow onClick={…} />
  <StatButton label="By entity"  value="2 trk" showArrow onClick={…} />
</StatCard>
```

| prop | type | notes |
|---|---|---|
| `label` | `ReactNode` | headline metric name |
| `value` | `ReactNode` | headline figure |
| `badge` | `ReactNode` — optional | trend / status, top-right; usually a `<Badge>` |
| `children` | `ReactNode` — optional | the `StatButton` row; buttons share the width evenly |

`className`, `style`, `...divProps` pass through to the `Card` root.

## Anatomy

```
Card (padding lg)
└─ div.header   (row, space-between)
│  ├─ div.content   (column)
│  │  ├─ span.label  — "Blocked"  · text/heading/sm · color/text/subtle
│  │  └─ span.value  — "2"        · text/display/md · color/text/default
│  └─ {badge}        — optional, flex:none
└─ div.stats    (row, gap space/16) — <StatButton>s, each flex:1
```

`color/text/default` for the headline value (the "main" number — one step darker
than a `StatButton` value, which is `color/text/strong`).

## Figma ↔ React

Figma **`StatCard`** set: one property **`badge`** (`false` / `true`) — a variant,
not a boolean, because the content lives inside `Card`'s slot and slot content
can't take component properties. It reads as a toggle in the panel.

The stat row is **two fixed `StatButton` instances** in Figma (the common case);
React takes **`children`** — any number. Override the Figma instances' text /
props in place; don't detach. Text layers default to `label` = "Label",
`value` = "0".

## a11y

Presentational container (a `<div>` via `Card`). The `StatButton`s inside are the
interactive elements. If the card as a whole needs a label for assistive tech,
pass `aria-label` / `role="group"` via `...divProps`.
