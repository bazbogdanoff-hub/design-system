# TableCard

One table row on the `phone` tier, inside `Table cards`. **L2.** Built in
code first (owner, 2026-10-05; scannable anatomy 2026-10-06); no Figma
frame yet, this page is its spec.

```
eyebrow (code or date)               [badge] [⋮]
title, two lines at most
subtitle, one line
(icon) fact   (icon) fact                  figure
```

Every card in a table puts the same kind of thing in the same place, so the
eye runs down the badges or the figures instead of reading each card.

```tsx
<TableCard
  eyebrow="SH-1046"
  title="Wrocław → Łódź"
  subtitle="Nordlink Logistik GmbH"
  badge={<Badge tone="brand" size="sm">Delivering</Badge>}
  facts={[
    { icon: <Clock weight="bold" />, label: 'ETA', value: 'Sep 30, 2:48 PM' },
    { icon: <MapPin weight="bold" />, label: 'Next checkpoint', value: 'Koroszczyn' },
  ]}
  interactive
/>
```

| prop | what |
|---|---|
| `title` | what the row is about: a route, a person, a client. Two lines, then an ellipsis |
| `eyebrow` | the row's code ("SH-1046") or date, small, above the title. Omit it and the title takes the top line |
| `subtitle` | one line of context |
| `badge` | the row's **one** state, a `Badge` `size="sm"`, top right |
| `facts` | `{ icon, value, label, tone? }[]`: a 14 Phosphor glyph (1em of `label/md`, as Button and Badge) (`bold`) instead of a visible label; `label` is read to screen readers. `tone: 'danger'` turns the value red (late, overdue, expiring) |
| `figure` | the row's key number (money, a score, stock on hand), bottom right, tabular |
| `leading` | a selection `Checkbox`, before the eyebrow |
| `trailing` | the row's actions, after the badge |
| `fields` | the older anatomy (label over value, two to a line), for a table not yet mapped to facts |
| `status` | `danger` / `success`, the row tint `TableRow` uses |
| `selected`, `interactive` | as `TableRow`; interactive makes the whole card the target |

## Layout rules

- **Facts share one line and never wrap**, so every card in a table is the
  same height; the last fact to run out of room ends in an ellipsis. Pick
  the facts in order of importance.
- Labels only where a bare value would be ambiguous: write it into the
  value ("329 trips"), don't add a label line.
- Type: eyebrow `label/xs` + `color.text.subtle`, tabular · title
  `heading/xs` + `color.text.strong` · subtitle `body/sm` +
  `color.text.subtle` · facts `body/xs` + `color.text.default` under a 1px `color.border.subtle` line, icon
  `color.text.subtle` · figure `label/lg` + `color.text.default`, tabular.

## In Aegis

`PagedTable`'s `phoneCard(row)` maps a row into these slots; tables without
one still fall back to `phoneFields`. On phone the checkboxes show only in
select mode, which a "Select" button in the table's header turns on.
