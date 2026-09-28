# TaskTile

A task on the Tasks board — a **white** tile sitting on the board's card, the
second surface layer. **Built in code first (owner, 2026-09-28); the Figma
master follows** from this spec.

Not [`TaskCard`](./TaskCard.md) — that is the older glass card with a
category tag and a rank tile, still used by `NextTask` on the dashboard.

```tsx
<TaskTile
  severity="critical"
  title="Clear customs query"
  description="Customs tariff-code mismatch holding SH-1041 at Koroszczyn."
  action={<IconButton variant="secondary" size="md" aria-label="Open" icon={<ArrowRight weight="bold" />} />}
/>

<TaskTile layout="row" position={1} severity="critical" title="Clear customs query" action={…} />
```

| prop | type | notes |
|---|---|---|
| `layout` | `'card'` (default) · `'row'` | card for the grid, row for the List view |
| `severity` | `SeverityLevel` | rendered as a `sm` `SeverityBadge` |
| `title` | `ReactNode` | one line, ellipsis |
| `description` | `ReactNode` | card only; clamped to three lines |
| `position` | `number` | row only; the rank, in a small recessed tile |
| `action` | `ReactNode` | usually a `md` secondary arrow `IconButton` |

## Anatomy — card

| part | spec |
|---|---|
| tile | fill `surface.default` (#fff), radius `radius/panel` (12), padding 16, height fills its grid cell (the board makes it 170) |
| edge | none — flat, no stroke or shadow (owner, 2026-09-28); the white fill alone separates it from the card |
| top frame | badge left, action right, both top-aligned |
| gap | 16 between the top frame and the text frame |
| text frame | fills the remaining height; title `text/heading/xs` (`color.text.default`) and description `text/body/sm` (`color.text.subtle`), 6 apart |

## Anatomy — row

One line, **10** padding, 12 between parts: rank in a neutral `IconCell`
`md` (32) · title `text/body/md`, fills and truncates · `sm`
`SeverityBadge` · action. The board puts 8 between rows.
